<template>
  <container class="sensitive-manger-list-layer" title="评论管理">
    <el-row class="menu">
      <el-col :span="4">
        语言选择：
        <el-select v-model="filters.localeName" size="small" @change="handleChangeLocaleName">
          <el-option
            v-for="(item, index) in getLangList"
            :key="index"
            :label="item.localeName"
            :value="item.locale"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input
          size="small"
          placeholder="用户ID/用户昵称/评论ID/文章ID/内容关键词"
          v-model.trim="filters.keyword"
        ></el-input>
      </el-col>
      <el-col :span="1">
        <el-button class="menu-item" size="small" type="primary" @click="getTableList()">搜索</el-button>
      </el-col>
      <el-col :span="4" class="menu-item">
        文章状态：
        <el-select v-model="filters.articleState" size="small" @change="handleChangeArticleState">
          <el-option
            v-for="(item, index) in commentArticleStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" class="menu-item">
        一级评论状态：
        <el-select v-model="filters.status" size="small" @change="handleChangeArticleState">
          <el-option
            v-for="(item, index) in firstLevelCommentstatus"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="1" class="time-order">
        <el-select v-model="filters.timeRank" size="small" @change="handleChangeTimeRank">
          <el-option
            v-for="(item, index) in timeRankList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="filters.sensitiveAuditStatus" size="small" @change="handleChangeTimeRank">
          <el-option
            v-for="(item, index) in sensitiveAuditList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div class="block">
          <el-date-picker
            size="small"
            v-model="datePickerTime"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="起始时间"
            end-placeholder="结束结束"
            value-format="timestamp"
            :default-time="['24:00:00', '23:59:59']"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row class="content">
      <el-table :data="tableList" border stripe class="table-border" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed></el-table-column>
        <el-table-column label="文章ID" prop="id" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.article.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="币种标签" prop="currencyLabel" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.article.currencyLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="周期" prop="updateTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.article.cycleId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章类型" prop="postType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.article.postType | postType }}</span>
            <span v-if="scope.row.article.postType === 1">：{{ scope.row.article.strategyId | strageType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="技术分析标签" prop="tecTags" align="center" width="120">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.article.tecTags" :key="index" class="tag-name">
              <p class="tag">{{ item.name }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" prop="nickname" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.article.userId }}</p>
            <p>{{ scope.row.article.nickname }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.article.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章状态" prop="articleStatus" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.article.articleStatus | articleStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评论用户信息" prop="nickname" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.userId }}</p>
            <p>{{ scope.row.nickname }}</p>
          </template>
        </el-table-column>
        <el-table-column label="评论者当前系统语言" prop="localeName" align="center"></el-table-column>
        <el-table-column label="评论ID" prop="commentId" align="center"></el-table-column>
        <el-table-column label="一级评论内容" prop="content" align="center">
          <template slot-scope="scope">
            {{ scope.row.content }}
            <p style="text-align: right" @click="handleChangeLanguage(scope.row.content)">
              <i class="el-icon-user"></i>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="一级评论发布时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="一级评论状态" prop="createTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="一级评论点赞数" prop="likeCount" align="center"></el-table-column>
        <el-table-column label="一级评论举报数" prop="reportedCount" align="center"></el-table-column>
        <el-table-column label="回复数" prop="secondCommentCount" align="center"></el-table-column>
        <el-table-column label="处理时间" prop="handleTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.handleTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理账号" prop="operator" align="center"></el-table-column>
        <el-table-column label="敏感词判定" prop="sensitiveAudit" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sensitiveAudit | sensitiveType }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="审核状态" prop="handleStatus" align="center" width="120">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover"
              :visible-arrow="false"
              class="popover-tip"
              v-if="scope.row.handleStatus === 1"
            >
              <el-button size="small" type="primary" @click="onClickAgreeCommentHandle(scope.row)">通过</el-button>
              <el-button size="small" type="primary" @click="onClickdeleteCommentHandle(scope.row)">删除</el-button>
              <el-button type="primary" size="small" slot="reference">
                未审核
              </el-button>
            </el-popover>
            <el-button type="default" size="small" v-else-if="scope.row.handleStatus === 4">已通过</el-button>
            <el-button type="default" size="small" v-else>已删除</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <!-- <i
              class="el-icon-view common-icon pointer"
              size="medium"
              @click="onClickLookCommentDetailHandle(scope.row)"
            ></i> -->
            <el-button type="text" @click="onClickLookCommentDetailHandle(scope.row)">查看</el-button>
            <el-button type="text" @click="onClickdeleteCommentHandle(scope.row)">删除</el-button>
            <el-button type="text" @click="onClickReplyCommentHandle(scope.row)">回复(3)</el-button>
            <!-- <i class="el-icon-chat-dot-square common-icon pointer" @click="onClickReplyCommentHandle(scope.row)"></i> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="remove-all-btn">
      <el-col>
        <el-button size="small" type="primary" @click="onClickRemoveHandle">批量删除</el-button>
      </el-col>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="paginationChangeHandle"
    ></pagination>
    <!-- 投诉详情 -->
    <complaint-detail-dialog
      :dialogVisible="complaintDetailDialogVisible"
      :form="commentConentForm"
      :tableList="commentTableList"
      :commentPagination="commentPagination"
      @onClickChangePageHandle="onClickChangePageHandle"
      @changeDialogVisible="onChangeComplaintDetailDialogVisibleHandle"
    ></complaint-detail-dialog>
    <!-- 回复评论 -->
    <reply-comment-dialog
      :dialogVisible="replyCommentDialogVisible"
      :replyCommentFormData="replyCommentFormData"
      @fileUpload="fileUpload"
      @onClickChooseUserHandle="onClickChooseUserHandle"
      @onClickSubmitHandle="onClickSubmitReplyCommentFormDataHandle"
      @changeDialogVisible="onChangeReplyCommentDialogVisibleHandle"
    ></reply-comment-dialog>
    <!-- 通知 -->
    <notice-user-dialog
      :dialogVisible="noticeUserDialogVisible"
      :title="dialogTitle"
      :noticeFormData="noticeFormData"
      @onClickSubmitHandle="onSubmitNoticeFormDataHandle"
      @changeDialogVisible="onClickDialogVisibleHandle"
    ></notice-user-dialog>
  </container>
</template>
<script>
import {
  commentArticleStatusList,
  commentType,
  timeRankList,
  sensitiveAuditList,
  firstLevelCommentstatus,
  pickerOptions
} from "../../utils/env";
import pagination from "@/components/pagination/index.vue";
import * as commonApi from "@/api/common";
import complaintDetailDialog from "./component/complaintDetailDialog";
import replyCommentDialog from "./component/replyCommentDialog";
import * as api from "@/api/commentManger";
import * as tagApi from "@/api/tagType";
import * as uploadApi from "@/api/uploader";
import * as contentApi from "@/api/contentManager";
import noticeUserDialog from "../../components/noticeUserDialog";
import {mapGetters} from "vuex";
import {formatDate} from "@/utils/mUtils";
const articleStatus = {
  1: "已发布",
  2: "已下架",
  3: "已删除"
};
const postType = {
  1: "交易观点文章",
  2: "教学分析文章"
};
const sensitiveType = {
  1: "疑似违规",
  2: "正常"
};
const strageType = {
  1: "做多",
  2: "做空",
  3: "中立"
};
export default {
  name: "technicalManger",
  components: {
    pagination,
    complaintDetailDialog,
    replyCommentDialog,
    noticeUserDialog
  },
  data() {
    return {
      datePickerTime: "",
      filters: {
        sensitiveAuditStatus: 1,
        status: 0,
        keyword: "",
        articleState: 0,
        timeRank: 1,
        dealStatus: 0,
        localeName: "zh_CN",
        startTime: "",
        endTime: ""
      },
      pickerOptions,
      sensitiveAuditList: sensitiveAuditList,
      firstLevelCommentstatus: firstLevelCommentstatus,
      tableList: [],
      commentArticleStatusList: commentArticleStatusList,
      timeRankList: timeRankList,
      commentStateList: commentType,
      pagination: {
        total: 0,
        index: 1,
        size: 10
      },
      complaintDetailDialogVisible: false,
      replyCommentFormData: {
        account: "",
        imageUrl: "",
        commentLocale: "zh_CN",
        replyContent: ""
      },
      replyCommentDialogVisible: false,
      noticeUserDialogVisible: false,
      dialogTitle: "",
      noticeFormData: {
        noticeContent: "",
        isNotice: false
      },
      dealtMsg: {},
      commentConentForm: {
        //投诉详情内容
        commentConent: "",
        imageUrl: ""
      },
      commentTableList: [],
      commentPagination: {
        index: 1,
        size: 10,
        total: 0
      },
      replyMsg: {},
      selectArr: [],
      complainCommentId: "" //投诉详情的id
    };
  },
  filters: {
    articleStatus(type) {
      return articleStatus[type];
    },
    postType(type) {
      return postType[type];
    },
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD HH:mm:ss");
    },
    sensitiveType(type) {
      return sensitiveType[type];
    },
    strageType(type) {
      return strageType[type];
    }
  },
  created() {
    this.getTableList();
  },
  computed: {
    ...mapGetters(["userUid", "userName", "getLangList"]),
    selectIds() {
      let arr = this.selectArr.filter(item => item.commentId);
      let ids = [];
      ids = arr.map(item => {
        return item.commentId;
      });
      return ids;
    }
  },
  watch: {
    datePickerTime(val) {
      if (val) {
        this.filters.endTime = val[1];
        this.filters.startTime = val[0];
      } else {
        this.filters.endTime = "";
        this.filters.startTime = "";
      }
    }
  },
  methods: {
    getTableList() {
      api
        .getCommentList({
          articleStatus: this.filters.articleState, //文章状态 0全部 1已发布 2已下架 3已删除
          keyword: this.filters.keyword,
          order: this.filters.timeRank, //排序规则 1时间排序 2时间正序
          locale: this.filters.localeName,
          index: this.pagination.index,
          size: this.pagination.size,
          status: this.filters.status,
          sensitiveAuditStatus: this.filters.sensitiveAuditStatus,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime
        })
        .then(res => {
          console.log("列表数据", res);
          this.tableList = res.data;
          this.pagination.total = res.total;
        });
    },
    handleChangeLocaleName(val) {
      this.filters.localeName = val;
      this.getTableList(val);
    },
    handleChangeArticleState(val) {
      this.filters.articleState = val;
      this.getTableList();
    },
    handleChangeDealStatus(val) {
      this.filters.dealStatus = val;
      this.getTableList();
    },
    handleChangeTimeRank(val) {
      this.filters.timeRank = val;
      this.getTableList();
    },
    onClickDialogVisibleHandle(visible) {
      this.noticeUserDialogVisible = visible;
      if (!visible) {
        //关闭弹窗时清空数据
        this.noticeFormData = {
          noticeContent: "",
          isNotice: false
        };
      }
    },
    // 翻译一级评论
    handleChangeLanguage(val) {
      let param = {
        text: val
      };
      commonApi
        .googleTranslate(param)
        .then(res => {
          this.formInfo.content = res.translatedText;
        })
        .catch(err => {
          this.$message.error("翻译失败");
        });
    },
    //删除
    onClickdeleteCommentHandle(row) {
      console.log("行", row);
      this.noticeType = 1;
      this.dialogTitle = "是否删除评论";
      this.dealtMsg = {
        objId: row.commentId,
        result: 2
      };
      this.onClickDialogVisibleHandle(true);
    },
    //通过
    // onClickAgreeCommentHandle(row) {
    //   this.dialogTitle = "是否通过评论";
    //   this.dealtMsg = {
    //     objId: row.id,
    //     result: 1
    //   };
    //   this.onClickDialogVisibleHandle(true);
    // },
    onSubmitNoticeFormDataHandle() {
      this.noticeType === 1 ? this.handleRemoveAll() : this.onClickDealtHandle();
    },
    onClickDealtHandle() {
      let param = {
        content: this.noticeFormData.noticeContent,
        notice: this.noticeFormData.isNotice,
        objId: this.dealtMsg.objId,
        operator: this.userName,
        result: this.dealtMsg.result,
        type: 1 //评论1 回复2
      };
      api
        .auditCommentOrReply(param)
        .then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getTableList();
          this.onClickDialogVisibleHandle(false);
        })
        .catch(err => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    // 分页
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getTableList(this.pagination.index);
    },
    onChangeComplaintDetailDialogVisibleHandle(visible) {
      this.complaintDetailDialogVisible = visible;
    },
    //回复评论
    onClickReplyCommentHandle(row) {
      this.replyMsg = {
        toUid: row.uid,
        commentId: row.commentId
      };
      this.replyCommentDialogVisible = true;
    },
    onClickChooseUserHandle(row) {
      this.replyCommentFormData.account = row.nickname;
      this.replyCommentFormData.accountId = row.uid;
    },
    onChangeReplyCommentDialogVisibleHandle(visible) {
      this.replyCommentDialogVisible = visible;
      if (!visible) {
        for (let key in this.replyCommentFormData) {
          this.replyCommentFormData[key] = "";
        }
      }
    },
    //查看详情
    onClickLookCommentDetailHandle(row) {
      console.log(row);
      this.complaintDetailDialogVisible = true;
      this.getCommentDetailTableList(row.commentId);
      this.getCommentContent(row.commentId);
    },
    //查看详情 获取评论/回复内容
    getCommentContent(commentId) {
      api
        .getCommentOrReplyContent({
          commentId: commentId,
          type: 1 //评论1 回复2
        })
        .then(res => {
          this.commentConentForm.commentConent = res.content;
          this.commentConentForm.imageUrl = res.imageUrl;
        });
    },
    //详情表格数据
    getCommentDetailTableList(commentId) {
      console.log("commentId", commentId);
      this.complainCommentId = commentId;
      contentApi
        .getReportedRecord({
          objId: commentId,
          objType: "3",
          index: this.commentPagination.index,
          size: this.commentPagination.size
        })
        .then(res => {
          this.commentTableList = res.data;
          console.log("90", res.data);
          this.commentPagination.total = res.total;
        });
    },
    //详情表格数据分页
    onClickChangePageHandle(page) {
      this.commentPagination.index = page;
      this.getCommentDetailTableList(this.complainCommentId);
    },
    //上传图片
    fileUpload(event) {
      let file = event.file;
      let fileType = 1; //图片2，音频2，视频3，文件4
      uploadApi.upLoad
        .uploader(file, fileType, this.userUid)
        .then(res => {
          this.replyCommentFormData.imageUrl = res.url;
        })
        .catch(err => {
          this.$message({
            message: "上传失败",
            type: "error"
          });
        });
    },
    //提交回复评论数据
    onClickSubmitReplyCommentFormDataHandle() {
      let reply = {
        commentId: this.replyMsg.commentId,
        content: this.replyCommentFormData.replyContent,
        fromUid: this.replyCommentFormData.accountId, //回复人id
        replyType: 1, //回复主体类型
        imageUrl: this.replyCommentFormData.imageUrl,
        toUid: this.replyMsg.toUid //被回复人id
      };
      contentApi
        .addReply(reply)
        .then(res => {
          this.$message({
            message: "回复成功",
            type: "success"
          });
          this.onChangeReplyCommentDialogVisibleHandle(false);
        })
        .catch(err => {
          this.$message({
            message: "回复失败",
            type: "error"
          });
        });
    },
    //选择
    handleSelectionChange(arr) {
      this.selectArr = arr;
    },
    onClickRemoveHandle() {
      this.onClickDialogVisibleHandle(true);
      this.noticeType = 1;
      this.dialogTitle = "是否删除所有评论";
    },
    handleRemoveAll() {
      console.log("objId", this.dealtMsg.objId);
      console.log("selectIds", this.selectIds);
      let param = {
        content: this.noticeFormData.noticeContent,
        notice: this.noticeFormData.isNotice,
        objIdList: [this.dealtMsg.objId] || this.selectIds,
        operator: this.userName,
        type: 1
      };
      api
        .deleteCommentOrReplyBatch(param)
        .then(res => {
          this.$message({
            message: "处理成功",
            type: "success"
          });
          this.getTableList();
          this.onClickDialogVisibleHandle(false);
        })
        .catch(err => {
          this.$message({
            message: "处理失败",
            type: "error"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.sensitive-manger-list-layer {
  .menu {
    .menu-item {
      margin-left: 20px;
    }
  }

  .content {
    margin-top: 30px;

    .tag {
      border-radius: 30px;
      background: #d9dbee;
      padding: 3px 6px;
      margin-top: 5px;
    }

    .common-icon {
      font-size: 20px;
      width: 30px;
    }
  }

  .remove-all-btn {
    margin-top: 30px;
  }
}
.el-row {
  margin-top: 10px;
}
.time-order {
  margin-left: 75px;
}
</style>
