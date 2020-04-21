<template>
  <el-dialog
    title="查看一级评论"
    :visible="dialogVisible"
    width="1000px"
    :before-close="handleClose"
    center
    custom-class="default-dialog"
  >
    <p>文章ID: {{ articleId }}</p>
    <p>文章标题: {{ title }}</p>
    <p>作者: {{ nickname }}</p>
    <p>发布时间: {{ postTime | formatDate }}</p>
    <el-row :gutter="20" class="margin-top">
      <el-col :span="6">
        <el-input v-model="searchInfo.keyword" placeholder="用户ID/用户昵称" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="searchInfo.order">
          <el-option v-for="item in contentSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="getCommentList()">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="default-table">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" :checked="isAllChecked" @click="onAllItemCheckedHandle()" />
              </th>
              <th>用户信息</th>
              <th>评论内容</th>
              <th>评论点赞数</th>
              <th>回复</th>
              <th>评论时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-for="item in tableList" :key="item.name">
            <tr class="text-center">
              <td>
                <input type="checkbox" :checked="item.isChecked" @change="chengeItemChecked(item)" />
              </td>
              <td>{{ item.userId || "" }} {{ item.nickname }}</td>
              <td>
                {{ item.content }}
                <img class="commentsImg" v-if="item.imageUrl" :src="item.imageUrl" />
              </td>
              <td>{{ item.likeCount }}</td>
              <td>
                <p>{{ item.secondCommentCount }}</p>
                <p v-if="item.secondCommentCount" @click="handleReplyDetail(item)" class="pointer">查看</p>
              </td>
              <td>{{ item.createTime | formatDate }}</td>
              <td>
                <el-row type="flex" justify="center">
                  <el-col :span="8">
                    <el-button type="primary" size="small" @click="handleDelete(item.commentId)">删除</el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" size="small" @click="handleReply(item)">回复</el-button>
                  </el-col>
                </el-row>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-row>
    <el-row>
      <el-button type="primary" class="normal-margin" @click="handleDelete()">批量删除</el-button>
      <pagination
        :page-total="pagination.total"
        :page-index="pagination.index"
        :page-size="pagination.size"
        @onCurrentChange="onChangeCommentPageHandle"
      ></pagination>
    </el-row>
    <reply-article
      :dialogVisible.sync="replyArticleDialog"
      @handleAddReply="handleAddReply"
      ref="replyArticleDialog"
    ></reply-article>
    <reply-detail
      :dialogVisible.sync="replyDetailDialog"
      ref="replyDetailDialog"
      :replyType="2"
      :replyItem.sync="replyItem"
    ></reply-detail>
  </el-dialog>
</template>
<script>
import {replyContent} from "@/utils/env";
import pagination from "@/components/pagination/index.vue";
import * as api from "@/api/contentManager";
import * as comAPI from "@/api/commentManger";
import {formatDate} from "@/utils/mUtils";
import replyArticle from "./replyArticle";
import replyDetail from "./replyDetail";
import {mapGetters} from "vuex";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    articleId: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    nickname: {
      type: String,
      default: ""
    },
    postTime: {
      type: Number,
      default: 0
    },
    uid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentComment: {},
      tableList: [],
      replyArticleDialog: false,
      replyDetailDialog: false,
      contentSort: replyContent,
      searchInfo: {
        keyword: "",
        order: 4
      },
      pagination: {
        index: 1,
        size: 20,
        total: 0
      },
      replyItem: {}
    };
  },
  components: {
    pagination,
    replyArticle,
    replyDetail
  },
  watch: {
    articleId(id) {
      this.getCommentList();
    }
  },
  filters: {
    formatDate
  },
  computed: {
    isAllChecked() {
      if (this.tableList) {
        return this.tableList.every(item => {
          return item.isChecked;
        });
      } else {
        return false;
      }
    },

    currentCheckedItem() {
      return this.tableList.filter(item => {
        if (item.isChecked) {
          return true;
        }
      });
    },
    ...mapGetters(["userName"])
  },
  methods: {
    getCommentList() {
      this.searchInfo.articleId = this.articleId;
      this.searchInfo.index = this.pagination.index;
      this.searchInfo.size = this.pagination.size;
      this.searchInfo.keyword = this.searchInfo.keyword.trim();
      api.getCommentList(this.searchInfo).then(res => {
        this.tableList = res.data.map(item => {
          item.isChecked = false;
          return item;
        });

        this.pagination.total = res.total;
      });
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    //处理当前回复
    handleReply(item) {
      this.currentComment = item;
      this.replyArticleDialog = true;
    },
    handleAddReply(fromInfo) {
      let params = {
        commentId: this.currentComment.commentId,
        content: fromInfo.content,
        firstReplyId: "",
        fromUid: fromInfo.fromUid,
        imageType: 1,
        imageUrl: fromInfo.imageUrl,
        parentId: "",
        replyType: 1,
        toUid: this.uid
      };
      api
        .addReply(params)
        .then(res => {
          this.$message.success("回复成功~");
          this.getCommentList();
          this.replyArticleDialog = false;
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    handleDelete(id) {
      let params = {
        notice: false,
        content: "",
        operator: this.userName,
        type: 1,
        objIdList: []
      };

      this.$confirm("确认删除评论？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(res => {
          if (id) {
            params.objIdList.push(id);
          } else {
            params.objIdList = this.currentCheckedItem.map(item => {
              return item.commentId;
            });
          }
          comAPI.deleteCommentOrReplyBatch(params).then(res => {
            this.$message.success("成功删除");
            this.getCommentList();
          });
        })
        .catch(() => {});
    },
    handleReplyDetail(data) {
      this.replyDetailDialog = true;
      this.replyItem = data;
      this.$refs.replyDetailDialog.getReplyOfComment(data);
    },
    onAllItemCheckedHandle() {
      let isAllChecked = this.isAllChecked; //判断是否全部选择来取消选择
      this.tableList.forEach(item => {
        item.isChecked = !isAllChecked;
      });
    },
    chengeItemChecked(item) {
      item.isChecked = !item.isChecked;
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getCommentList();
    }
  }
};
</script>
<style lang="less" scoped>
.commentsImg {
  max-width: 100%;
}
input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
</style>
