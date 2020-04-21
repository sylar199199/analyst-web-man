<template>
  <el-dialog
    :visible="dialogVisible"
    width="700px"
    custom-class="default-dialog"
    :before-close="handleClose"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input v-model="idOrTitle" placeholder="输入文章ID/文章标题"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="getContentList()">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="default-table">
        <table>
          <thead>
            <tr>
              <th>文章ID</th>
              <th>文章类型</th>
              <th>文章标题</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-for="item in tableList" :key="item.id">
            <tr class="text-center">
              <td>{{ item.id }}</td>
              <td>{{ item.postType | articleTypeFilter }}</td>
              <td>{{ item.title }}</td>
              <td>
                <choose-button
                  :currentItem="item"
                  :chooseItems="currentChooseItems"
                  @handleChooseButton="handleChooseButton"
                ></choose-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-row>
    <el-row>
      <pagination
        :page-total="pagination.total"
        :page-index="pagination.index"
        :page-size="pagination.size"
        @onCurrentChange="onChangeCommentPageHandle"
      ></pagination>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="handleConfrim()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from "@/api/contentRelease";
import {articleType} from "@/utils/env";
import pagination from "@/components/pagination/index.vue";
import chooseButton from "./chooseButton";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    chooseItems: {
      type: Array,
      default() {
        return [];
      }
    },
    fromUid: {
      type: Number,
      default: 0
    }
  },
  components: {
    pagination,
    chooseButton
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getContentList();
      }
    }
  },
  filters: {
    articleTypeFilter(type) {
      return articleType[type].label;
    }
  },
  data() {
    return {
      idOrTitle: "",
      tableList: [],
      currentChooseItems: [],
      pagination: {
        index: 1,
        size: 10,
        total: 0
      }
    };
  },
  methods: {
    getContentList() {
      let params = {
        idOrTitle: this.idOrTitle,
        index: this.pagination.index,
        size: this.pagination.size,
        uid: this.fromUid
      };
      api
        .getUserArticleList(params)
        .then(res => {
          this.tableList = res.data;
          this.pagination.total = res.total;
          this.currentChooseItems = this.currentChooseItems.concat(this.chooseItems);
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    handleChooseButton(item) {
      this.currentChooseItems.push(item);
    },
    handleConfrim() {
      this.$emit("handleRelatedArticles", this.currentChooseItems);
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getContentAccountList();
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    }
  }
};
</script>
<style lang="less" scoped></style>
