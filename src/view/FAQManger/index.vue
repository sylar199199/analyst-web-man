<template>
  <container class="faq-manger-list-layer" title="FAQ管理">
    <el-row>
      <el-col :span="3">
        <el-select v-model="filters.rankTime" size="small" @change="handleChangeRankTime">
          <el-option
            v-for="(item, index) in faqRankTimeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input v-model="filters.keyword" size="small" placeholder="请输入关键字"></el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="small" class="nav-btn" @click="getKeywordContent">搜索</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="small" class="nav-btn" @click="createFAQ">创建</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableList"
      border
      class="table-border table-list tabel-list-hight-row"
      :tree-props="{children: tableList.children}"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      :row-class-name="tableRowClassName"
      :highlight-current-row="true"
    >
      <el-table-column label="问题模块" prop="title" align="center" width=""></el-table-column>
      <el-table-column label="操作" align="center" width="480">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="onClickLookDetailHandle(scope.row)">查看</el-button>
          <el-button type="primary" size="small" @click="onClickEditHandle(scope.row)">编辑</el-button>
          <el-button type="success" size="small" @click="onClickAddHandle(scope.row)">添加</el-button>
          <el-button type="danger" size="small" @click="onClickRemoveHandle(scope.row)">删除</el-button>
          <el-tooltip class="item" effect="dark" content="设为热门" placement="bottom" v-if="scope.row.hot === 2">
            <icon-svg
              class="common-icon pointer"
              icon-class="hot"
              class-name="icon-size"
              @click="onClickSetHotHandle(scope.row.questionKey, 1)"
            ></icon-svg>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="取消热门" placement="bottom" v-else>
            <icon-svg
              class="common-icon"
              icon-class="hot"
              class-name="icon-hot pointer"
              v-if="scope.row.hot === 1"
              @click="onClickSetHotHandle(scope.row.questionKey, 2)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="问题点击次数" prop="clickCount" align="center" width="120"></el-table-column>
      <el-table-column label="更新时间" prop="createTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="onChangeCommentPageHandle"
    ></pagination>
    <!-- 创建 -->
    <el-dialog
      :title="formData.dialogTitle"
      :visible.sync="dialogVisible"
      width="900"
      class="dialog-layer"
      @close="clearData"
    >
      <el-radio-group v-model="formData.localeName" @change="onClickChangeLocaleNameHandle">
        <el-radio-button
          v-for="(item, index) in getLangList"
          :key="index"
          :label="item.localeName"
          :value="item.locale"
        ></el-radio-button>
      </el-radio-group>
      <!-- 创建 -->
      <el-row class="item" v-if="type === 3">
        <el-col :span="2">问题模块：</el-col>
        <el-col :span="4">
          <el-input size="small" v-model="formData.questionModel"></el-input>
        </el-col>
        <el-col :span="2" :offset="1">简体中文</el-col>
      </el-row>
      <!-- 查看 -->
      <el-row class="item" v-else-if="type === 4">
        <el-col :span="2">问题模块：</el-col>
        <el-col :span="22">
          <span v-for="(item, index) in fatherName" :key="index">
            &nbsp;{{ item }}&nbsp;
            <span v-if="index !== fatherName.length - 1">></span>
          </span>
        </el-col>
      </el-row>
      <el-row class="item" v-else>
        <el-col :span="2">
          <span>问题模块：</span>
        </el-col>
        <el-col :span="22">
          <span v-for="(item, index) in fatherName" :key="index">&nbsp;{{ item }}&nbsp;></span>
          <el-input v-model="formData.questionModel" class="input-bar" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row class="editor-item">
        <div v-if="type === 4" class="item">
          <div class="content-detail scroll-bar" v-html="questionContent"></div>
        </div>
        <div class="editor" v-else>
          <p class="item">内容描述：</p>
          <neditor v-model="questionContent" :config="neditorConfig" style="height: 300px; padding: 20px;"></neditor>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="conClickSaveTechnicalHandle">确 定</el-button>
      </span>
    </el-dialog>
  </container>
</template>
<script>
import {faqRankTimeList} from "@/utils/env";
import * as userApi from "@/api/userAgreementManger";
import * as api from "@/api/faqManger";
import {formatDate} from "@/utils/mUtils";
import {mapGetters} from "vuex";
import {neditorConfig} from "@/utils/env";
import pagination from "@/components/pagination/index.vue";
let arr = [];
let fatherArr = [];
let removeKeyArr = [];
let classArray = [];
export default {
  components: {
    pagination,
    neditor: () => import("@/components/neditor/neditor")
  },
  data() {
    return {
      faqRankTimeList: faqRankTimeList,
      filters: {
        rankTime: 1
      },
      tableList: [],
      expands: [],
      fatherArr: [],
      dialogVisible: false,
      formData: {
        questionModel: "",
        locale: "zh_CN",
        localeName: "",
        questionKey: "",
        dialogTitle: ""
      },
      type: 1, //添加1 编辑2 创建3 查看4
      fatherName: [],
      keywordArr: [],
      pagination: {
        index: 1,
        size: 20,
        total: 0
      },
      questionDetailList: [],
      questionContent: "",
      editQuestionList: [], //编辑时的临时数据
      neditorConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 300,
        initialFrameWidth: 900,
        zIndex: 9999
      }
    };
  },
  filters: {
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD hh:mm:ss");
    }
  },
  computed: {
    ...mapGetters(["getLangList", "userName"]),
    parentkey() {
      return this.type === 3 ? 0 : this.formData.questionKey;
    },
    currentLocaleItem() {
      return this.getLangList.filter(item => {
        if (item.locale === this.formData.locale) {
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
    }
  },
  watch: {
    questionContent() {
      this.editQuestionList = this.questionDetailList;
      let localeArr = this.editQuestionList.map(item => item.locale);
      this.editQuestionList.forEach(item => {
        if (localeArr.indexOf(this.getLocale[0].locale) === -1) {
          this.editQuestionList.push({
            locale: this.getLocale[0].locale,
            content: this.questionContent,
            title: this.formData.questionModel
          });
        } else {
          if (item.locale === this.getLocale[0].locale) {
            item.content = this.questionContent;
          }
        }
      });
      this.editQuestionList = [...this.editQuestionList];
    }
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      api
        .findFAQList({
          locale: "zh_CN",
          order: this.filters.rankTime
        })
        .then(res => {
          this.tableList = res;
          // console.log("表格数据", res);
          this.pagination.total = res.total;
        });
    },
    handleChangeRankTime(val) {
      this.filters.rankTime = val;
      this.getTableList();
    },
    // 创建
    createFAQ() {
      this.formData.dialogTitle = "创建FAQ";
      this.formData.localeName = "简体中文";
      this.type = 3;
      this.dialogVisible = true;
    },
    // 添加
    onClickAddHandle(row) {
      this.type = 1;
      this.formData.dialogTitle = "添加FAQ";
      this.formData.parentKey = row.parentKey;
      this.formData.questionKey = row.questionKey;
      this.formData.locale = row.locale;
      this.formData.localeName = this.currentLocaleItem[0].localeName;
      this.fatherName = [];
      let titleArr = this.familyTreeTitle(this.tableList, row.questionKey);
      for (let i = 0; i < titleArr.length; i++) {
        this.fatherName.unshift(titleArr[i]);
      }
      // this.fatherName.pop();
      setTimeout(() => {
        this.dialogVisible = true;
      }, 500);
    },
    // 编辑
    onClickEditHandle(row) {
      this.type = 2;
      this.formData.dialogTitle = "编辑FAQ";
      this.formData.parentKey = row.parentKey;
      this.formData.questionKey = row.questionKey;
      this.questionContent = row.content;
      this.formData.questionModel = row.title;
      this.formData.locale = row.locale;
      this.formData.localeName = this.currentLocaleItem[0].localeName;
      this.fatherName = [];
      let titleArr = this.familyTreeTitle(this.tableList, row.questionKey);
      for (let i = 0; i < titleArr.length; i++) {
        this.fatherName.unshift(titleArr[i]);
      }
      this.fatherName.pop();
      this.getQuestionDetail(row);
    },
    // 查看详情
    onClickLookDetailHandle(row) {
      this.type = 4;
      this.formData.dialogTitle = "查看详情";
      this.formData.localeName = "简体中文";
      this.questionContent = row.content;
      this.fatherName = [];
      let titleArr = this.familyTreeTitle(this.tableList, row.questionKey);
      for (let i = 0; i < titleArr.length; i++) {
        this.fatherName.unshift(titleArr[i]);
      }
      this.getQuestionDetail(row);
    },
    // 保存数据
    conClickSaveTechnicalHandle() {
      console.log("editQuestionList", this.editQuestionList);
      let param = {
        contents: this.editQuestionList,
        operator: this.userName,
        parentKey: this.parentkey,
        questionKey: this.type === 2 ? this.formData.questionKey : ""
      };
      api
        .saveFAQ(param)
        .then(res => {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.getTableList();
          this.dialogVisible = false;
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    },
    // 设为热门
    onClickSetHotHandle(questionKey, type) {
      let param = {
        hotStatus: type, //1热门 2不是热门
        questionKey: questionKey
      };
      api.hotFAQ(param).then(res => {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.getTableList();
      });
    },
    clearData() {
      this.formData = {
        questionModel: ""
      };
      this.questionContent = "";
    },
    // 删除
    onClickRemoveHandle(row) {
      let arrkey = [];
      if (row.children.length === 0) {
        arrkey[0] = row.questionKey;
      } else {
        arrkey = this.getChildTreeKey(row.children);
        arrkey.unshift(row.questionKey);
      }
      this.$confirm("删除会导致所属的子集问题也一并被删除", "确定删除此问题吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        api
          .deleteFAQ({
            questionKeyList: arrkey.toString()
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            removeKeyArr.length = 0;
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

    // 切换语言
    onClickChangeLocaleNameHandle(val) {
      this.formData.localeName = val;
      let item = this.questionDetailList.filter(item => {
        return item.locale === this.getLocale[0].locale;
      });
      if (item.length) {
        this.questionContent = item[0].content;
      } else {
        this.questionContent = "";
      }
    },
    // 查询详情
    getQuestionDetail(row) {
      api
        .findFAQDetail({
          questionKey: row.questionKey
        })
        .then(res => {
          this.questionDetailList = res;
          this.dialogVisible = true;
        });
    },

    // 递归获得每个子节点的key
    getChildTreeKey(data) {
      for (let i = 0; i < data.length; i++) {
        removeKeyArr.push(data[i].questionKey);
        if (data[i].children.length > 0) {
          this.getChildTreeKey(data[i].children);
        }
      }
      return removeKeyArr;
    },

    // 每一行指定一个key
    getRowKeys(row) {
      return row.questionKey;
    },

    // 查找一个节点的所有父节点的title
    familyTreeTitle(data, questionKey) {
      var temp = [];
      var forFn = function(arr, questionKey) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];
          if (item.questionKey === questionKey) {
            temp.push(item.title);
            forFn(data, item.parentKey);
            break;
          } else {
            if (item.children) {
              forFn(item.children, questionKey);
            }
          }
        }
      };
      forFn(data, questionKey);
      return temp;
    },
    // 查找一个节点的所有父节点的questionKey
    familyTree(data, questionKey) {
      var temp = [];
      var forFn = function(arr, questionKey) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];
          if (item.questionKey === questionKey) {
            temp.push(item);
            forFn(data, item.parentKey);
            break;
          } else {
            if (item.children) {
              forFn(item.children, questionKey);
            }
          }
        }
      };
      forFn(data, questionKey);
      return temp;
    },

    // 获取所有包含关键字节点的parentKey
    getTreeKey(data, type) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].title.indexOf(this.filters.keyword) !== -1) {
          if (type === 1) {
            arr.push(data[i].parentKey);
          } else {
            arr.push(data[i].questionKey);
          }
        }
        if (data[i].children.length > 0) {
          this.getTreeKey(data[i].children);
        }
      }
      return arr;
    },

    // 模糊搜索查询 展开包含关键字的所有项
    getKeywordContent() {
      this.expands.length = 0;
      let array = this.getTreeKey(this.tableList, 1); //包含关键字的所有项的parentKey
      let parenyArray = [];
      let parentKeyArr = [];
      this.keywordArr.length = 0;
      this.keywordArr = this.getTreeKey(this.tableList, 2);
      for (let i = 0; i < array.length; i++) {
        this.familyTree(this.tableList, array[i]).forEach(item => {
          //查询所有子节点的所有父节点的questionKey
          parenyArray.push(item);
        });
      }
      parenyArray.forEach(item => {
        parentKeyArr.push(item.questionKey);
      });
      this.expands = parentKeyArr.map(String); //数字数组转字符串数组
    },
    // 添加样式
    tableRowClassName({row, rowIndex}) {
      if (this.keywordArr.indexOf(row.questionKey) !== -1) {
        return "success-row";
      } else {
        return "";
      }
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getSearchWordList();
    }
  }
};
</script>
<style lang="less" scoped>
.faq-manger-list-layer {
  .nav-btn {
    margin-left: 30px;
  }
  .table-list {
    margin-top: 30px;

    .icon-size {
      font-size: 30px;
    }
    .icon-hot {
      font-size: 30px;
      background-color: #ff4040;
      border-radius: 50%;
    }
    .common-icon {
      margin-left: 10px;
    }
  }

  .dialog-layer {
    .item {
      margin-top: 30px;

      .input-bar {
        display: inline;
      }

      ::v-deep.el-input__inner {
        width: 200px;
      }
    }

    .editor-item {
      margin-top: 10px;

      .content-detail {
        width: 900px;
        height: 400px;
        padding: 20px;
        border: 1px solid #cccccc;
        overflow-y: auto;
      }
    }
  }
}
</style>
<style lang="less">
.tabel-list-hight-row {
  .success-row {
    background-color: #dff0d8;
  }
}
</style>
