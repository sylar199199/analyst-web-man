<template>
  <container class="technical-manger-layer" title="技术分析说明管理">
    <el-button class="btn" size="small" type="primary" @click="createAnalyticalMethods">创建</el-button>
    <el-table
      :data="tableList"
      border
      stripe
      class="table-border"
      row-key="technicalKey"
      :tree-props="{children: tableList.children}"
    >
      <el-table-column label="分析方法" prop="title" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="operateTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editHandle(scope.row)">编辑</el-button>
          <el-button type="success" size="small" @click="addHandle(scope.row)">添加</el-button>
          <el-button type="danger" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="900" @close="clearData">
      <el-radio-group v-model="formData.localeName" @change="onClickChangeLocaleNameHandle">
        <el-radio-button
          v-for="(item, index) in getLangList"
          :key="index"
          :label="item.localeName"
          :value="item.locale"
        ></el-radio-button>
      </el-radio-group>
      <el-row class="methods-input">
        <el-col>
          <el-form :model="formData" :rules="rules" ref="formData" label-width="150px" class="formdata-Style">
            <el-form-item label="分析方法:" prop="analyticalMethod" v-if="type === 3">
              <el-input v-model="formData.analyticalMethod" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="添加分析方法:" prop="analyticalMethod" v-else class="analytical-style">
              <span v-for="(item, index) in fatherName" :key="index">&nbsp;{{ item }}&nbsp;></span>
              <el-input v-model="formData.analyticalMethod" style="width: 200px"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- <el-row class="methods-input" v-if="type === 3">
        <el-col :span="2">分析方法：</el-col>
        <el-col :span="5">
          <el-input size="small" v-model="formData.analyticalMethod"></el-input>
        </el-col>
      </el-row>
      <el-row class="methods-input" v-else>
        <el-col :span="3">添加分析方法：</el-col>
        <el-col :span="21">
          <span v-for="(item, index) in fatherName" :key="index">&nbsp;{{ item }}&nbsp;></span>
          <el-input size="small" class="input-bar" v-model="formData.analyticalMethod"></el-input>
        </el-col>
      </el-row>-->
      <p>内容详情：</p>
      <div class="editor">
        <neditor v-model="technicalContent" :config="neditorConfig" style="height: 300px;"></neditor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="conClickSaveTechnicalHandle" :disabled="saveAble">确 定</el-button>
      </span>
    </el-dialog>
  </container>
</template>

<script>
import {neditorConfig, ranges} from "@/utils/env";
import * as api from "@/api/userAgreementManger";
import {mapGetters} from "vuex";
import {formatDate} from "@/utils/mUtils";
import messages from "../../lang/tw";
let arr = [];
export default {
  name: "technicalManger",
  components: {
    neditor: () => import("@/components/neditor/neditor")
  },
  data() {
    return {
      dialogVisible: false,
      tableList: [],
      formData: {
        analyticalMethod: "",
        locale: "zh_CN",
        localeName: ""
      },
      localeName: "",
      type: 1, //添加1 编辑2 创建3
      paramData: {},
      currentLocale: "",
      fatherName: [],
      technicalList: [], //详情
      technicalContent: "",
      editTechniticalList: [], //编辑时的临时数据
      neditorConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 300,
        initialFrameWidth: 900,
        zIndex: 9999
      },
      rules: {
        analyticalMethod: [
          {
            required: true,
            message: "分析方法名称不能为空",
            trigger: "blur"
          },
          {
            trigger: "blur",
            validator: function(rule, value, callback) {
              const reg = /^.{0,50}$/;
              if (reg.test(value)) {
                callback();
              } else {
                return callback(new Error("分析方法名称不能超过50位"));
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["userName", "getLangList"]),
    dialogTitle() {
      return this.type === 1 ? "添加分析方法" : this.type === 2 ? "编辑分析方法内容" : "创建分析方法";
    },
    parentkey() {
      return this.type === 3 ? 0 : this.paramData.technicalKey;
    },
    currentLocaleItem() {
      return this.getLangList.filter(item => {
        if (item.locale === this.currentLocale) {
          return item;
        }
      });
    },
    getLocale() {
      return this.getLangList.filter(item => {
        if (item.localeName === this.formData.localeName) {
          return item.locale;
        }
      });
    },
    analyticalMethod() {
      return this.formData.analyticalMethod;
    },
    saveAble() {
      if (this.formData.analyticalMethod) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    technicalContent() {
      if (this.technicalList.length) {
        let localeArr = this.editTechniticalList.map(item => item.locale);
        this.editTechniticalList.forEach(item => {
          if (localeArr.indexOf(this.getLocale[0].locale) === -1) {
            this.editTechniticalList.push({
              locale: this.getLocale[0].locale,
              content: this.technicalContent,
              title: this.formData.analyticalMethod
            });
          } else {
            if (item.locale === this.getLocale[0].locale) {
              item.content = this.technicalContent;
            }
          }
        });
      } else {
        this.editTechniticalList.push({
          locale: this.getLocale[0].locale,
          content: this.technicalContent,
          title: this.formData.analyticalMethod
        });
      }
      this.editTechniticalList = [...this.editTechniticalList];
    }
  },
  filters: {
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD hh:mm:ss");
    }
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      api
        .findTechnicalList({
          locale: "zh_CN"
        })
        .then(res => {
          this.tableList = res;
        });
    },
    // 添加
    addHandle(row) {
      this.type = 1;
      this.currentLocale = row.locale;
      this.paramData = {
        parentKey: row.parentKey,
        locale: row.locale,
        technicalKey: row.technicalKey,
        localeName: this.currentLocaleItem[0].localeName
      };
      this.formData = {
        localeName: this.currentLocaleItem[0].localeName,
        locale: row.locale
      };
      let titleArr = this.familyTreeTitle(this.tableList, row.technicalKey);
      this.fatherName = [];
      for (let i = 0; i < titleArr.length; i++) {
        this.fatherName.unshift(titleArr[i]);
      }
      setTimeout(() => {
        this.dialogVisible = true;
      }, 200);
    },
    // 编辑
    editHandle(row) {
      this.type = 2;
      this.currentLocale = row.locale;
      this.formData = {
        analyticalMethod: row.title,
        locale: row.locale,
        localeName: this.currentLocaleItem[0].localeName
      };
      console.log("ces1", this.formData.localeName);
      this.technicalContent = row.content;
      this.paramData = {
        technicalKey: row.technicalKey,
        parentKey: row.parentKey
      };
      let titleArr = this.familyTreeTitle(this.tableList, row.technicalKey);
      this.fatherName = [];
      for (let i = 0; i < titleArr.length; i++) {
        this.fatherName.unshift(titleArr[i]);
      }
      this.fatherName.pop();
      this.getTechniticalDetail(row);
      setTimeout(() => {
        this.dialogVisible = true;
      }, 200);
    },
    // 创建
    createAnalyticalMethods() {
      this.formData.localeName = "简体中文";
      this.type = 3;
      this.dialogVisible = true;
    },
    // 递归获得每个子节点的key
    getTreeKey(data) {
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].technicalKey);
        if (data[i].children.length > 0) {
          this.getTreeKey(data[i].children);
        }
      }
      return arr;
    },
    // 删除
    deleteHandle(row) {
      const h = this.$createElement;
      this.$msgbox({
        title: "确认删除此栏吗",
        message: h("p", null, [h("span", {style: "color: #FF3636"}, "其下所属的类别也将被删除 ")]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      }).then(() => {
        // 删除
        let arrkey = [];
        if (row.children.length === 0) {
          arrkey[0] = row.technicalKey;
        } else {
          arrkey = this.getTreeKey(row.children);
          arrkey.unshift(row.technicalKey);
        }
        api
          .deleteTechnical({
            technicalKeyList: arrkey.toString()
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            arr.length = 0;
            this.getTableList();
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          });
      });
    },
    //保存
    conClickSaveTechnicalHandle() {
      let newEditTechniticalList = this.editTechniticalList.map(item => {
        item.title = item.title.replace(ranges, "");
        return item;
      });
      let param = {
        contents: newEditTechniticalList,
        operator: this.userName,
        parentKey: this.parentkey,
        technicalKey: this.type === 2 ? this.paramData.technicalKey : ""
      };
      api
        .saveTechnicalSpecification(param)
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.dialogVisible = false;
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            message: "保存失败",
            type: "error"
          });
        });
    },
    // 查询详情
    getTechniticalDetail(row) {
      api
        .findTechnicalDetail({
          technicalKeyList: row.technicalKey
        })
        .then(res => {
          this.technicalList = res;
          this.dialogVisible = true;
          this.editTechniticalList = this.technicalList;
        });
    },
    // 切换语言
    onClickChangeLocaleNameHandle(val) {
      this.formData.localeName = val;
      let item = this.technicalList.filter(item => {
        return item.locale === this.getLocale[0].locale;
      });
      if (item.length) {
        this.technicalContent = item[0].content;
      } else {
        this.technicalContent = "";
      }
    },
    clearData() {
      this.formData = {
        analyticalMethod: "",
        localeName: ""
      };
      this.technicalContent = "";
    },
    // 查找一个节点的所有父节点的title
    familyTreeTitle(data, technicalKey) {
      var temp = [];
      var forFn = function(arr, technicalKey) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];
          if (item.technicalKey === technicalKey) {
            temp.push(item.title);
            forFn(data, item.parentKey);
            break;
          } else {
            if (item.children) {
              forFn(item.children, technicalKey);
            }
          }
        }
      };
      forFn(data, technicalKey);
      return temp;
    }
  }
};
</script>

<style lang="less" scoped>
.technical-manger-layer {
  .btn {
    margin-bottom: 20px;
  }
  .methods-input {
    margin: 20px 0;
    .formdata-Style {
      margin-left: -60px;
    }
    .methods {
      margin-bottom: 20px;
    }

    .input-bar {
      display: inline;
    }

    ::v-deep.el-input__inner {
      width: 200px;
    }
  }

  .editor {
    margin-top: 10px;
  }
}
</style>
