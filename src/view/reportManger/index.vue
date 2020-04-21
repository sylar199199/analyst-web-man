<template>
  <container class="report-manger-list-layer" title="举报管理">
    <el-row class="menu">
      <el-col :span="4">
        地区选择:
        <el-select v-model="filters.region" size="small" placeholder="请选择" @change="handleChangeRegion">
          <el-option
            v-for="item in getAreaList"
            :key="item.region"
            :label="item.regionName"
            :value="item.region"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="filters.dealtTime"
          type="datetimerange"
          size="small"
          range-separator="-"
          start-placeholder="请选择起始时间"
          end-placeholder="请选择结束时间"
        ></el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-input
          size="small"
          placeholder="用户ID/用户昵称/文章ID/评论ID/举报关键词"
          v-model.trim="filters.keyword"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button size="small" type="primary" class="search-btn" @click="getTableList()">搜索</el-button>
      </el-col>
      <el-col :span="3">
        <el-select v-model="filters.reportType" size="small" @change="handleChangeReportType">
          <el-option
            v-for="(item, index) in reportTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-select v-model="filters.dealtState" size="small" @change="handleChangeDealtState">
          <el-option
            v-for="(item, index) in dealtStateList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="menu">
      <el-table :data="tableList" border stripe class="table-border" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="举报人信息" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.userId }}</p>
            <p>{{ scope.row.nickname }}</p>
          </template>
        </el-table-column>
        <el-table-column label="举报类型" prop="reportType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reportType | reportType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="被举报内容ID" prop="objId" align="center" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.objId }}</span>
            <!-- <span>{{ scope.row.reportUserId }}</span> -->
            <i class="el-icon-user common-icon" v-if="scope.row.sourceClient === 7"></i>
          </template>
        </el-table-column>
        <el-table-column label="被举报人信息" prop="reportedNickname" align="center" width="110">
          <template slot-scope="scope">
            <p>{{ scope.row.reportUserId }}</p>
            <p>{{ scope.row.reportedNickname }}</p>
          </template>
        </el-table-column>
        <el-table-column label="被举报人状态" prop="reportedStatus" align="center" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.reportedStatus | reportedStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="举报描述" prop="content" align="center"></el-table-column>
        <el-table-column label="被举报人使用语言" prop="localeName" align="center"></el-table-column>
        <el-table-column label="举报标签" prop="tagIds" align="center">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.tagNames" :key="index">
              <span class="tag">{{ item ? item : "" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="举报时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理时间" prop="handleTime" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.handleTime">{{ scope.row.handleTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理账号" prop="operator" align="center"></el-table-column>
        <el-table-column label="处理状态" prop="processState" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              v-if="scope.row.processState === 0"
              @click="onClickDealWithHandle(scope.row, 1)"
            >
              未处理
            </el-button>
            <el-button size="small" type="default" v-else @click="onClickDealWithHandle(scope.row, 2)">
              已处理
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="lookDetailHandle(scope.row)">查看</el-button>
            <!-- 文章 -->
            <template v-if="scope.row.reportType === 1">
              <el-button
                type="text"
                v-if="scope.row.status === 2"
                @click="onSubmitArticleNoticleFormDataHandle(scope.row.objId, 1)"
              >
                上架
              </el-button>
              <el-button
                type="text"
                v-else-if="scope.row.status === 1"
                @click="onSubmitArticleNoticleFormDataHandle(scope.row.objId, 2)"
              >
                下架
              </el-button>
              <span v-else class="is-delete">已删除</span>
            </template>
            <!-- 用户 -->
            <template v-else-if="scope.row.reportType === 2">
              <el-button type="text" v-if="scope.row.reportedStatus === 1" @click="handleUserProhibeVisible(scope.row)">
                禁言
              </el-button>
              <span v-else>已禁言</span>
            </template>
            <!-- 评论 -->
            <template v-else-if="scope.row.reportType === 3">
              <el-button type="text" v-if="scope.row.status === 1" @click="onClickRemoveCommentHandle(scope.row.objId)">
                删除
              </el-button>
              <span v-if="scope.row.status === 3" class="is-delete">已删除</span>
            </template>
            <!-- 回复 -->
            <template v-else>
              <el-button type="text" v-if="scope.row.status === 1" @click="onClickRemoveReplytHandle(scope.row.objId)">
                删除
              </el-button>
              <span v-if="scope.row.status === 3" class="is-delete">已删除</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="remove-all-btn">
      <el-col>
        <el-button size="small" type="primary" @click="onClickRemoveHandle">批量处理</el-button>
      </el-col>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="paginationChangeHandle"
    ></pagination>
    <!-- 用户信息 -->
    <user-info-dialog
      :dialogVisible="userInfoDialogVisible"
      :userInfoDetail="userInfoDetail"
      @changeDialogVisible="onChangeUserInfoDalogVisibleHandle"
    ></user-info-dialog>
    <!-- 文章审核 -->
    <content-review-dialog
      :dialogVisible="contentReviewDialogVisible"
      :articleDetail="articleDetail"
      @changeTurnOffVisible="onClickTurnOffArticleHandle"
      @changeDialogVisible="onChangeContentReviewDialogVisibleHandle"
    ></content-review-dialog>
    <!-- 评论详情 -->
    <report-content-detail-dialog
      :dialogVisible="reportContentDetailDialogVisible"
      :reportDetail="reportDetail"
      @removeReport="onClickRemoveCommentHandle"
      @changeDialogVisible="onChangeCommentDalogVisibleHandle"
    ></report-content-detail-dialog>
    <!-- 回复详情 -->
    <reply-detail-dialog
      :dialogVisible="reportReplyDetailDialogVisible"
      :reportDetail="reportDetail"
      @removeReport="onClickRemoveReplytHandle"
      @changeDialogVisible="onChangeReplyDalogVisibleHandle"
    ></reply-detail-dialog>
    <!-- 用户禁言 -->
    <user-mute-dialog
      :dialogVisible="userMuteDialogVisible"
      :userMuteFormData="userMuteFormData"
      @onClickSubmitHandle="onSubmitUserMuteFormData"
      @changeDialogVisible="onChangeUserMuteDialogVisibleHandle"
    ></user-mute-dialog>
    <!-- 删除评论/下架文章/删除文章 -->
    <notice-user-dialog
      :dialogVisible="noticeUserDialogVisible"
      :title="dialogTitle"
      :noticeType="noticeType"
      :noticeFormData="noticeFormData"
      @onClickSubmitHandle="onSubmitNoticeFormDataHandle"
      @changeDialogVisible="onClickDialogVisibleHandle"
    ></notice-user-dialog>
  </container>
</template>
<script>
import userInfoDialog from "../../components/userInfoDialog";
import contentReviewDialog from "./component/contentReviewDialog";
import reportContentDetailDialog from "./component/reportContentDetailDialog";
import noticeUserDialog from "../../components/noticeUserDialog";
import userMuteDialog from "./component/userMuteDialog";
import replyDetailDialog from "./component/replyDetailDialog";
import {MessageBox, Collapse} from "element-ui";
import {dealtStatusList, reportTypeList} from "../../utils/env";
import pagination from "@/components/pagination/index.vue";
import * as api from "@/api/reportManger";
import * as contentApi from "@/api/contentManager";
import * as commentApi from "@/api/commentManger";
import {formatDate} from "@/utils/mUtils";
import {mapGetters} from "vuex";
import * as types from "@/store/types";
const reportType = {
  1: "文章",
  2: "用户",
  3: "评论",
  4: "回复"
};
const reportedReviewStatus = {
  1: "未审核",
  2: "待审核",
  3: "已审核"
};
const reportedStatus = {
  1: "正常",
  2: "禁言"
};
export default {
  name: "technicalManger",
  components: {
    userInfoDialog,
    contentReviewDialog,
    reportContentDetailDialog,
    noticeUserDialog,
    userMuteDialog,
    replyDetailDialog,
    pagination
  },
  data() {
    return {
      tableList: [],
      filters: {
        region: "CN",
        dealtTime: "",
        keyword: "",
        reportType: 0,
        dealtState: -1
      },
      reportTypeList: reportTypeList,
      dealtStateList: dealtStatusList,
      userInfoDialogVisible: false, //用户信息
      userMuteDialogVisible: false, //禁言
      contentReviewDialogVisible: false, //内容审核
      reportContentDetailDialogVisible: false, //评论详情
      reportReplyDetailDialogVisible: false, //回复详情
      noticeUserDialogVisible: false, //下架文章/删除文章/删除评论 弹窗
      dialogTitle: "", //下架文章标题/删除评论标题
      userInfoDetail: {}, //用户详情
      articleDetail: {}, //文章详情
      reportDetail: {
        imageUrl: ""
      }, //被举报的评论详情
      noticeFormData: {
        noticeContent: "",
        isNotice: false
      },
      userMuteFormData: {
        //用户禁言
        muteHour: "",
        noticeContent: "",
        isNotice: false
      },
      pagination: {
        total: 0,
        index: 1,
        size: 20
      },
      type: 2, // 参数 2评论 3删除
      objId: "",
      commentType: 1, //评论1 回复2
      noticeType: 1 // 文章1 评论2
    };
  },
  filters: {
    //举报类型
    reportType(type) {
      return reportType[type];
    },
    //被举报内容审核状态
    reportedReviewStatus(type) {
      return reportedReviewStatus[type];
    },
    //被举报人状态
    reportedStatus(type) {
      return reportedStatus[type];
    },
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD HH:mm:ss");
    }
  },
  computed: {
    ...mapGetters(["userName", "getAreaList"]),
    selectIds() {
      let arr = this.selectArr.filter(item => item.id);
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
    getTableList(type, state) {
      api
        .searchReport({
          startTime: this.filters.dealtTime ? formatDate(this.filters.dealtTime[0]) : "",
          endTime: this.filters.dealtTime ? formatDate(this.filters.dealtTime[1]) : "",
          keyword: this.filters.keyword,
          region: this.filters.region,
          processState: this.filters.dealtState,
          reportType: this.filters.reportType,
          index: this.pagination.index,
          size: this.pagination.size
        })
        .then(res => {
          this.tableList = res.data;
          this.pagination.total = res.total;
        });
    },
    // 切换地区
    handleChangeRegion(val) {
      this.filters.region = val;
      this.getTableList();
    },
    handleChangeReportType(type) {
      this.filters.reportType = type;
      this.getTableList();
    },
    handleChangeDealtState(state) {
      this.filters.dealtState = state;
      this.getTableList();
    },
    //查看详情
    lookDetailHandle(row) {
      this.objId = row.objId;
      this.noticeType = row.reportType;
      if (row.reportType === 1) {
        this.getArticleDetail(row.objId, row.status, row.nickname); //文章
      } else if (row.reportType === 2) {
        this.getUserInfoDetails(row.reportedUid); //用户
      } else if (row.reportType === 3) {
        this.getCommentDetail(row.objId, 1, row.status); //评论
      } else {
        this.getCommentDetail(row.objId, 2, row.status); //回复
      }
    },
    //用户信息
    onChangeUserInfoDalogVisibleHandle(visible) {
      this.userInfoDialogVisible = visible;
    },
    //文章审核
    onChangeContentReviewDialogVisibleHandle(visible) {
      this.contentReviewDialogVisible = visible;
    },
    //评论详情
    onChangeCommentDalogVisibleHandle(visible) {
      this.reportContentDetailDialogVisible = visible;
    },
    //回复详情
    onChangeReplyDalogVisibleHandle(visible) {
      this.reportReplyDetailDialogVisible = visible;
    },
    //下架文章/删除文章/删除评论
    onClickDialogVisibleHandle(visible) {
      this.noticeUserDialogVisible = visible;
      if (!visible) {
        //关闭弹窗时清空数据
        this.noticeFormData = {
          noticeContent: "",
          isNotice: true
        };
      }
    },
    //下架文章
    onClickTurnOffArticleHandle(val) {
      if (val === 2) {
        this.dialogTitle = "是否下架文章";
        this.type = 2;
      } else {
        this.type = 3;
        this.dialogTitle = "是否删除文章";
      }
      this.onClickDialogVisibleHandle(true);
    },
    //删除评论
    onClickRemoveCommentHandle(id) {
      this.commentType = 1;
      this.noticeType = 3;
      this.objId = id || this.objId;
      this.dialogTitle = "是否删除评论";
      this.onClickDialogVisibleHandle(true);
    },
    //删除回复
    onClickRemoveReplytHandle(id) {
      this.commentType = 2;
      this.noticeType = 4;
      this.objId = id || this.objId;
      this.dialogTitle = "是否删除回复";
      this.onClickDialogVisibleHandle(true);
    },
    //用户禁言
    onChangeUserMuteDialogVisibleHandle(visible) {
      this.userMuteDialogVisible = visible;
      if (!visible) {
        //关闭弹窗时清空数据
        this.userMuteFormData = {
          muteHour: "",
          noticeContent: "",
          isNotice: true
        };
      }
    },
    //点击禁言
    handleUserProhibeVisible(row) {
      this.userMuteFormData.uid = row.reportUserId;
      this.userMuteFormData.nickname = row.nickname;
      this.userMuteFormData.reportedUid = row.reportedUid;
      this.onChangeUserMuteDialogVisibleHandle(true);
    },
    onSubmitNoticeFormDataHandle() {
      console.log(11);
      this.noticeType === 1
        ? this.onSubmitArticleNoticleFormDataHandle(this.objId)
        : this.onSubmitCommentNoticleFormDataHandle();
    },
    //提交数据 文章的删除和下架
    onSubmitArticleNoticleFormDataHandle(id, type) {
      let param = {
        articleIdList: [id] || [this.objId],
        notice: this.noticeFormData.isNotice,
        noticeContent: this.noticeFormData.noticeContent,
        operator: "",
        type: type || this.type
      };
      contentApi
        .batchTakeOffOrDeleteArticle(param)
        .then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.onClickDialogVisibleHandle(false);
          this.onChangeContentReviewDialogVisibleHandle(false);
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    //删除评论 回复
    onSubmitCommentNoticleFormDataHandle() {
      let param = {
        objIdList: [this.objId],
        notice: this.noticeFormData.isNotice,
        content: this.noticeFormData.noticeContent,
        operator: this.userName,
        type: this.commentType
      };
      commentApi
        .deleteCommentOrReplyBatch(param)
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.onClickDialogVisibleHandle(false);
          if (this.commentType === 1) {
            this.onChangeCommentDalogVisibleHandle(false);
          } else {
            this.onChangeReplyDalogVisibleHandle(false);
          }
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    },
    //提交数据 用户禁言
    onSubmitUserMuteFormData() {
      let param = {
        forbiddenTime: this.userMuteFormData.muteHour,
        notice: this.userMuteFormData.isNotice,
        noticeContent: this.userMuteFormData.noticeContent,
        operator: this.userName,
        uid: this.userMuteFormData.reportedUid
      };
      api
        .userForbidden(param)
        .then(res => {
          this.$message({
            message: "禁言成功",
            type: "success"
          });
          this.onChangeUserMuteDialogVisibleHandle(false);
        })
        .catch(err => {
          this.$message({
            message: "禁言失败",
            type: "error"
          });
        });
    },
    //查看用户信息
    getUserInfoDetails(id) {
      api.getUserDetail({uid: id}).then(res => {
        this.userInfoDetail = res;
        console.log("用户", res);
      });
      this.onChangeUserInfoDalogVisibleHandle(true);
    },
    //查询文章详情
    getArticleDetail(id, status, nickname) {
      contentApi.getArticleDetail({articleId: id}).then(res => {
        this.articleDetail = res;
        this.articleDetail.status = status;
        this.articleDetail.nickname = nickname;
        if (res.updateTime) {
          this.articleDetail.updateTime = formatDate(res.updateTime);
        }
      });
      this.onChangeContentReviewDialogVisibleHandle(true);
    },
    //查询评论/回复详情
    getCommentDetail(id, type, status) {
      commentApi
        .getCommentOrReplyContent({
          type: type, //评论1 回复2
          commentId: id
        })
        .then(res => {
          if (res) {
            this.reportDetail = res;
          }
          this.reportDetail.status = status;
          console.log("343", this.reportDetail);
          if (type === 1) {
            this.onChangeCommentDalogVisibleHandle(true);
          } else {
            this.onChangeReplyDalogVisibleHandle(true);
          }
        });
    },
    //选择
    handleSelectionChange(arr) {
      this.selectArr = arr;
    },
    //批量移除
    onClickRemoveHandle() {
      let param = {
        objIdList: this.selectIds,
        operator: this.userName
      };
      api
        .batchMarkReport(param)
        .then(res => {
          this.$message({
            message: "处理成功",
            type: "success"
          });
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            message: "处理失败",
            type: "error"
          });
        });
    },
    // 分页
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getTableList();
    }
  }
};
</script>
<style lang="less" scoped>
.report-manger-list-layer {
  .menu {
    margin-top: 30px;

    .search-btn {
      margin: 0 15px;
    }

    .common-icon {
      font-size: 20px;
      width: 30px;
    }
    .is-delete {
      padding-left: 5px;
    }
    .tag {
      padding: 0px 5px;
      border-radius: 30px;
      background: #d9dbee;
    }
  }

  .remove-all-btn {
    margin-top: 30px;
  }
}
</style>
