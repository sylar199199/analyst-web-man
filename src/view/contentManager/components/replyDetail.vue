<template>
  <el-dialog
    title="查看回复"
    :visible="dialogVisible"
    width="1000px"
    :before-close="handleClose"
    center
    custom-class="default-dialog"
    append-to-body
  >
    <el-row :gutter="20" class="margin-top">
      <el-col :span="6">
        <el-input v-model="searchInfo.keyword" placeholder="用户ID/用户昵称" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="searchInfo.order">
          <el-option v-for="item in replyContent" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="getReplyOfComment()">搜索</el-button>
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
              <th>回复的内容</th>
              <th>回复的点赞数</th>
              <th>被回复信息</th>
              <th>回复的时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-for="item in tableList" :key="item.name">
            <tr class="text-center">
              <td>
                <input type="checkbox" :checked="item.isChecked" @change="chengeItemChecked(item)" />
              </td>
              <td>{{ item.toNickname + item.toUserId }}</td>
              <td>{{ item.content }}</td>
              <td>{{ item.likeCount }}</td>
              <td>
                {{ item.toNickname + item.toUserId }}
              </td>
              <td>{{ item.createTime | formatDate }}</td>
              <td>
                <el-row type="flex" justify="center">
                  <el-col :span="8">
                    <el-button type="primary" size="small" @click="handleDelete(item.id)">删除</el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" size="small" @click="hendleReplyComment(item)">回复</el-button>
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
    <reply-article :dialogVisible.sync="replyDialog" :replyType="1" @handleAddReply="handleAddReply"></reply-article>
  </el-dialog>
</template>
<script>
import {replyContent} from "@/utils/env";
import pagination from "@/components/pagination/index.vue";
import * as api from "@/api/contentManager";
import replyArticle from "./replyArticle";
import * as comAPI from "@/api/commentManger";
import {formatDate} from "@/utils/mUtils";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    replyItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      tableList: [],
      replyContent: replyContent,
      replyDialog: false,
      currentContent: {},
      currentComment: {}, //当前选中的回复
      searchInfo: {
        keyword: "",
        order: 4
      },
      pagination: {
        index: 1,
        size: 20,
        total: 0
      }
    };
  },
  components: {
    pagination,
    replyArticle
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
    }
  },
  methods: {
    getReplyOfComment(data) {
      this.currentContent = data;
      this.searchInfo.commentId = data ? data.commentId : this.replyItem.commentId;
      this.searchInfo.index = this.pagination.index;
      this.searchInfo.size = this.pagination.size;
      this.searchInfo.keyword = this.searchInfo.keyword.trim();
      api.getReplyOfComment(this.searchInfo).then(res => {
        this.tableList = res.data.map(item => {
          item.isChecked = false;
          return item;
        });
        this.pagination.total = res.total;
      });
    },
    hendleReplyComment(data) {
      this.currentComment = data;
      this.replyDialog = true;
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleAddReply(fromInfo) {
      let params = {
        commentId: this.currentComment.id,
        content: fromInfo.content,
        firstReplyId: this.currentContent.commentId,
        fromUid: fromInfo.fromUid,
        imageType: 1,
        imageUrl: fromInfo.imageUrl,
        parentId: this.currentContent.commentId,
        replyType: 2,
        toUid: this.currentContent.fromUid
      };
      api
        .addReply(params)
        .then(res => {
          this.$message.success("回复成功~");
          this.getCommentList(this.currentContent);
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
        type: 2,
        objIdList: []
      };
      this.$confirm("确认删除回复？", {
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
              return item.id;
            });
          }
          comAPI
            .deleteCommentOrReplyBatch(params)
            .then(res => {
              this.$message.success("成功删除");
              this.getReplyOfComment(this.currentContent);
            })
            .catch(res => {
              this.$message.error(res.message);
            });
        })
        .catch(() => {});
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
      this.getCommentList(this.currentContent);
    }
  }
};
</script>
<style lang="less" scoped></style>
