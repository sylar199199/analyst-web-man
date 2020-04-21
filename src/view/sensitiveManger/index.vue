<template>
  <container class="sensitive-manger-list-layer" title="敏感词管理">
    <el-row class="menu" :gutter="20">
      <el-col :span="4">
        <el-input size="small" placeholder="输入敏感词" v-model="keyword" clearable @clear="getTableList"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button class="menu-btn" size="small" type="primary" @click="getTableList">搜索</el-button>
      </el-col>
    </el-row>
    <el-row class="content" :gutter="40">
      <el-col :span="14">
        <el-table :data="tableList" border stripe class="table-border" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="敏感词" prop="word" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.word" v-if="scope.row.isEdit"></el-input>
              <span v-else>{{ scope.row.word }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="createTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" v-if="!scope.row.isEdit" @click="scope.row.isEdit = true">
                编辑
              </el-button>
              <el-button type="default" size="small" v-else @click="onClickEditHandle(scope.row)">确认</el-button>
              <el-button type="primary" size="small" @click="onClickRemoveHandle(scope.row.id, 1)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">
        <el-upload
          action
          :show-file-list="false"
          :auto-upload="false"
          :multiple="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          accept=".xlsx, .xls"
        >
          <el-button size="small" type="primary">导入</el-button>
        </el-upload>
      </el-col>
      <el-col :span="1">
        <el-button size="small" type="primary" @click="addTag">创建</el-button>
      </el-col>
    </el-row>
    <el-row class="remove-all-btn">
      <el-col>
        <el-button size="small" type="primary" @click="onClickBatchRemoveHandle">批量移除</el-button>
      </el-col>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="paginationChangeHandle"
    ></pagination>
  </container>
</template>
<script>
import {Select} from "element-ui";
import pagination from "@/components/pagination/index.vue";
import * as api from "@/api/sensitiveManger";
import {formatDate} from "@/utils/mUtils";
export default {
  name: "technicalManger",
  components: {
    pagination
  },
  data() {
    return {
      keyword: "",
      tableList: [],
      pagination: {
        total: 0,
        index: 1,
        size: 20
      },
      fileList: [],
      idsArr: []
    };
  },
  filters: {
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD hh:mm:ss");
    }
  },
  computed: {
    selectIds() {
      let arr = this.idsArr.filter(item => item.id);
      let ids = [];
      ids = arr.map(item => {
        return item.id;
      });
      return ids;
    }
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      api
        .getSensitiveList({
          word: this.keyword,
          index: this.pagination.index,
          size: this.pagination.size
        })
        .then(res => {
          this.tableList = res.data;
          this.tableList.forEach(item => {
            this.$set(item, "isEdit", false);
          });
          this.pagination.total = res.total;
        });
    },
    //移除
    onClickRemoveHandle(ids, type) {
      console.log("ids", ids);
      this.$confirm("确认移除吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          api
            .deleteSensitiveWord({
              ids: type === 1 ? ids : ids.toString()
            })
            .then(res => {
              this.$message({
                message: "移除成功",
                type: "success"
              });
              this.getTableList();
            });
        })
        .catch(() => {});
    },
    //新增
    addTag() {
      this.$prompt("添加敏感词", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(({value}) => {
          let param = {word: value};
          api
            .addSensitiveWord(param)
            .then(res => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getTableList();
            })
            .catch(err => {
              this.$message({
                message: "添加失败",
                type: "success"
              });
            });
        })
        .catch(() => {});
    },
    //编辑
    onClickEditHandle(row) {
      let param = {
        id: row.id,
        word: row.word
      };
      api
        .updateSensitiveWord(param)
        .then(res => {
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.tableList.forEach(item => {
            if (item.id === row.id) {
              item.isEdit = false;
            }
          });
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            message: "编辑失败",
            type: "error"
          });
        });
    },

    handleFileChange(file, fileList) {
      this.fileList = [file];
      this.handleImport();
    },

    // 批量导入
    handleImport() {
      let form = new FormData();
      for (let value of this.fileList) {
        form.append("file", value.raw);
      }
      api
        .batchImportSensitiveWord(form)
        .then(res => {
          this.$message({
            message: "导入成功",
            type: "success"
          });
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            message: "导入失败",
            type: "error"
          });
        });
    },
    //批量移除
    handleSelectionChange(arr) {
      this.idsArr = arr;
    },
    //批量移除
    onClickBatchRemoveHandle() {
      this.onClickRemoveHandle(this.selectIds, 2);
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
.sensitive-manger-list-layer {
  .menu {
    .menu-btn {
      margin-left: 20px;
    }
  }

  .content {
    margin-top: 30px;
  }

  .remove-all-btn {
    margin-top: 30px;
  }
}
</style>
