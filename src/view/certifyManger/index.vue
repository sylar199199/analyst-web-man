<template>
  <container class="certify-manger-list-layer" title="认证管理">
    <el-row class="menu" :gutter="20">
      <el-col :span="3">
        <el-select size="small" v-model.trim="filters.vertifyType" @change="handleChangeVertifyType">
          <el-option
            v-for="(item, index) in vertifyNameList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="filters.certifyTime"
          type="datetimerange"
          size="small"
          range-separator="-"
          start-placeholder="请选择起始时间"
          end-placeholder="请选择结束时间"
          clearable
          :picker-options="pickerOptions"
          :default-time="['24:00:00', '23:59:59']"
          @clear="getTableList"
        ></el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-input
          size="small"
          placeholder="认证ID/认证名称"
          v-model="filters.keyword"
          clearable
          @clear="getTableList"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-button size="small" type="primary" @click="getKeywordList">搜索</el-button>
        <el-button size="small" type="primary" @click="addTag">创建</el-button>
      </el-col>
    </el-row>
    <el-row class="menu">
      <el-table :data="tableList" border stripe class="table-border">
        <el-table-column label="认证ID" prop="id" align="center"></el-table-column>
        <el-table-column label="认证类型" prop="authenticateType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.authenticateType | authenticateType }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="item.label" align="center" v-for="(item, index) in langList" :key="index">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEdit">
              {{ scope.row.authenticateNames[index].authenticateName }}
            </span>
            <el-input v-model="scope.row.authenticateNames[index].authenticateName" v-else></el-input>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.authenticateType === 2">
              <el-button type="primary" size="small" v-if="!scope.row.isEdit" @click="scope.row.isEdit = true">
                编辑
              </el-button>
              <el-button type="default" size="small" v-else @click="onClickEditHandle(scope.row)">确认</el-button>
            </template>
            <template v-if="scope.row.authenticateType === 1">
              <el-button type="primary" size="small" disabled>
                编辑
              </el-button>
            </template>
            <el-button type="primary" size="small" @click="onSubmitNoticeFormDataHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="paginationChangeHandle"
    ></pagination>
    <!-- 创建认证 -->
    <el-dialog title="创建认证" :visible.sync="addDialogVisible" width="800px" @close="handleClearData">
      <el-form :model="vertifyFormData" label-width="95px" label-position="'left" ref="formRef">
        <el-form-item label="认证类型：">
          <span>官方认证</span>
        </el-form-item>
        <el-form-item :label="index === 0 ? item.label : ''" v-for="(item, index) in langList" :key="index">
          <el-col :span="15">
            <el-input
              v-model="item.authenticateName"
              placeholder="允许输入40个字符"
              maxlength="40"
              show-word-limit
            ></el-input>
          </el-col>
          <el-col :span="8" :offset="1">
            <span>{{ index === 0 ? "简体中文" : item.label }}</span>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onClickAddVertifyHandle">确 定</el-button>
      </span>
    </el-dialog>
  </container>
</template>
<script>
import pagination from "@/components/pagination/index.vue";
import * as api from "@/api/certifyManger";
import {formatDate} from "@/utils/mUtils";
import messages from "../../lang/cn";
import {pickerOptions} from "@/utils/env";
import {langList, vertifyNameList} from "@/utils/env";
const authenticateType = {
  0: "全部",
  1: "领域专家",
  2: "签约分析师（官方认证）"
};
export default {
  name: "technicalManger",
  components: {
    pagination
  },
  data() {
    return {
      tableList: [],
      filters: {
        certifyTime: "",
        keyword: "",
        vertifyType: 0
      },
      vertifyFormData: {},
      addDialogVisible: false,
      pagination: {
        total: 0,
        index: 1,
        size: 20
      },
      langList: langList,
      vertifyNameList: vertifyNameList,
      pickerOptions
    };
  },
  filters: {
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD hh:mm:ss");
    },
    authenticateType(type) {
      return authenticateType[type];
    }
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList(val) {
      api
        .getCertifyList({
          authenticateType: this.filters.vertifyType,
          updateTimeStart: this.filters.certifyTime ? formatDate(this.filters.certifyTime[0]) : "",
          updateTimeEnd: this.filters.certifyTime ? formatDate(this.filters.certifyTime[1]) : "",
          nameOrId: this.filters.keyword,
          index: this.pagination.index,
          size: this.pagination.size
        })
        .then(res => {
          this.tableList = res.data.map(item => {
            item.isEdit = false;
            return item;
          });
          this.pagination.total = res.total;
          console.log("表格数据", res);
        });
    },
    // 模糊搜索
    getKeywordList() {
      this.pagination.index = 1;
      this.getTableList();
    },
    handleChangeVertifyType(val) {
      this.filters.vertifyType = val;
      this.getTableList();
    },
    addTag() {
      this.addDialogVisible = true;
    },
    //修改验证信息
    onClickEditHandle(row) {
      let param = {
        names: row.authenticateNames,
        authenticateType: row.authenticateType,
        id: row.id
      };
      api
        .updateAuthentication(param)
        .then(res => {
          this.$message({
            message: "认证信息编辑成功",
            type: "success"
          });
          this.tableList.forEach(item => {
            if (item.id === row.id) {
              item.isEdit = false;
            }
          });
        })
        .catch(err => {
          this.$message({
            message: "认证信息编辑失败",
            type: "error"
          });
        });
    },
    //移除认证
    onSubmitNoticeFormDataHandle(row) {
      api
        .deleteAuthentication({
          id: row.id
        })
        .then(res => {
          this.$message({
            message: "删除认证信息成功",
            type: "success"
          });
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            message: "删除认证信息失败",
            type: "error"
          });
        });
    },
    //创建认证
    onClickAddVertifyHandle() {
      let flag = this.langList.every(item => {
        return item.authenticateName;
      });
      if (flag) {
        let param = {
          names: this.langList,
          authenticateType: 2
        };
        api
          .addAuthentication(param)
          .then(res => {
            this.$message({
              message: "新增认证信息成功",
              type: "success"
            });
            this.addDialogVisible = false;
            this.getTableList();
          })
          .catch(err => {
            this.$message({
              message: "新增认证信息失败",
              type: "success"
            });
          });
      } else {
        this.$message({
          type: "error",
          message: "请填写信息完整"
        });
      }
    },
    handleClearData() {
      this.langList.forEach(item => {
        item.authenticateName = "";
      });
    },
    // 分页
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getTableList(this.pagination.index);
    }
  }
};
</script>
<style lang="less" scoped>
.certify-manger-list-layer {
  .menu {
    margin-top: 30px;
    span {
      margin-right: 20px;
    }
  }

  .input-bar {
    margin-bottom: 20px;
  }

  .notice {
    margin-right: 20px;
  }

  ::v-deep.el-input .el-input__count {
    color: #c0c4cc;
  }
}
</style>
