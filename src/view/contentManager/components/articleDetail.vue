<template>
  <el-dialog
    title="文章详情页"
    :visible="dialogVisible"
    width="1000px"
    :before-close="handleClose"
    center
    custom-class="default-dialog"
  >
    <span>文章标题:{{ title }}</span>
    <el-row>
      <el-col :span="12">
        <span>作者: {{ nickname }}</span>
      </el-col>
      <el-col :span="12" class="text-right">
        <span>发布时间: {{ postTime | formatDate }}</span>
      </el-col>
    </el-row>
    <div>
      文章正文
      <div class="content" @click="previewImage">
        <el-input type="textarea" :rows="6" placeholder="请输入内容" v-html="articleDetail.content"></el-input>
        <div class="related-title"><p class="el-icon-paperclip">相关文章</p></div>
        <div class="related-point" v-for="item in relatedArticleList" :key="item.id">
          <el-row>
            <el-col :span="2">
              <div class="related-img">
                <img :src="item.coverUrl" alt="" width="100%" height="100%" />
              </div>
            </el-col>
            <el-col :span="8">
              <el-row>
                <p class="actical-title">
                  <span>{{ item.title }}</span>
                </p>
              </el-row>
              <el-row class="detail-row">
                <span class="nick-name">{{ item.nickname }}</span>
                <span class="date-style">关于</span>
                <span class="nick-name">{{ item.currencyLabel }}</span>
                <span class="date-style">{{ item.updateTime | formatDate }}</span>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div>
      更新观点
      <div class="content">
        <div
          v-for="(item, index) in articleDetail.tradingOpinionList"
          :key="item.id"
          class="margin-top"
          @click="previewImage"
        >
          <el-input v-html="item.content" placeholder="请输入内容" class="table-border" style="width:100%"></el-input>
          <el-popover popper-class="popover-style" placement="right" trigger="click">
            <div>
              <el-button type="primary" @click="handleViews(item, 'pass', index)" v-if="item.auditStatus !== 3">
                通过
              </el-button>
            </div>
            <div>
              <el-button class="margin-top" type="primary" @click="handleViews(item, 'delete', index)">
                删除
              </el-button>
            </div>
            <el-button type="primary" class="margin-top " slot="reference" :disabled="item.opinionStatus === 3">
              {{ item.auditOrDelete | viewsDealStatus }}
            </el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <el-row class="normal-margin">
      <el-col :span="1">
        <i class="el-icon-s-check text-ll"></i>
      </el-col>
      <el-col :span="3">
        <el-popover popper-class="popover-style" placement="right" trigger="hover">
          <div v-if="articleDetail.auditStatus !== 3 || articleDetail.articleStatus === 2">
            <el-button type="primary" @click="handleArticle('pass')">通过</el-button>
          </div>
          <div class="margin-top" v-if="articleDetail.auditStatus !== 2 && articleDetail.articleStatus !== 2">
            <el-button type="primary" @click="handleArticle('takeOff')">下架</el-button>
          </div>
          <div class="margin-top">
            <el-button type="primary" @click="handleArticle('delete')">删除文章</el-button>
          </div>
          <el-button type="primary" slot="reference" :disabled="articleDetail.articleStatus === 3">
            {{ articleAudit | articleDealStatus }}
          </el-button>
        </el-popover>
      </el-col>
    </el-row>
    <el-row>
      审核备注:
      <el-input v-model="reviewNotes" placeholder="请输入内容（中文只能输入100个）"></el-input>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="handleConfirm()">确 定</el-button>
    </span>
    <take-off :dialogVisible.sync="takeOffDialog" :takeOffType="handleStatus" @handleTakeOff="handleTakeOff"></take-off>
    <div :style="plusImg" @click="plusImg.display = 'none'">
      <p>点击图片关闭放大预览</p>
      <img :src="plusImgUrl" width="100%" height="100%" />
    </div>
  </el-dialog>
</template>
<script>
import takeOff from "./takeOff";
import * as api from "@/api/contentManager";
import {formatDate} from "@/utils/mUtils";
import {viewsAuditType, viewPointStatus} from "@/utils/env";
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
    }
  },
  data() {
    return {
      plusImgUrl: "",
      plusImg: {display: "none"},
      auditStates: false,
      takeOffDialog: false,
      reviewNotes: "",
      handleStatus: 0,
      articleDetail: {},
      relatedArticleList: [],
      articleStatus: 1,
      articleAudit: 0
    };
  },
  components: {
    takeOff
  },
  watch: {
    dialogVisible(val) {
      this.getArticleDetail();
      if (!val) {
        this.resetData();
      }
    },
    reviewNotes(val, oldVal) {
      let cnArr = val.match(/[\u4E00-\u9FA5]/g);
      if (cnArr && cnArr.length > 100) {
        this.$message({
          type: "warning",
          message: "中文只能输入100个"
        });
        this.reviewNotes = oldVal;
      }
    }
  },
  filters: {
    formatDate,
    dealtStateFilter(val) {
      let dealLabel = "";
      viewsAuditType.find(item => {
        if (item.value === val) {
          dealLabel = item.label;
        }
      });
      return dealLabel;
    },
    articleDealStatus(val) {
      let articleDealLabels = ["待审核", "未审核", "下架", "删除", "通过", "已审核"];
      return articleDealLabels[val];
    },
    viewsDealStatus(val) {
      let viewsDealLabels = ["未审核", "通过", "已审核", "删除"];
      return viewsDealLabels[val];
    }
  },
  computed: {
    ...mapGetters(["userName"]),
    changeViewsItem() {
      return this.articleDetail.tradingOpinionList.filter(item => {
        if (item.auditOrDelete) {
          return true;
        }
      });
    }
  },
  methods: {
    getArticleDetail() {
      api
        .getArticleDetail({articleId: this.articleId})
        .then(res => {
          this.articleDetail = res;
          this.relatedArticleList = res.relatedArticleList;
          this.articleDetail.tradingOpinionList = res.tradingOpinionList.map(item => {
            item.auditOrDelete = this.handleViewsAudit(item);
            item.content = `<p>${viewPointStatus[item.subType] || ""}</p>${item.content}`;
            return item;
          });
          this.articleAudit = this.handleArticleAudit();
        })
        .catch(res => {});
    },
    //修改文章状态
    handleArticle(state) {
      if (state === "pass") {
        //通过
        this.articleAudit = 4;
      } else if (state === "takeOff") {
        //下架
        this.articleAudit = 2;
      } else if (state === "delete") {
        //删除
        this.$messageBox
          .confirm("确定删除文章?", "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true
          })
          .then(() => {
            this.articleAudit = 3;
          })
          .catch(() => {});
      }
    },
    //修改观点状态
    handleViews(item, state, index) {
      if (state === "pass") {
        this.articleDetail.tradingOpinionList[index].auditOrDelete = 1;
        this.$set(this.articleDetail.tradingOpinionList, index, this.articleDetail.tradingOpinionList[index]);
      } else if (state === "delete") {
        this.$messageBox
          .confirm("确定删除观点?", "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true
          })
          .then(() => {
            this.articleDetail.tradingOpinionList[index].auditOrDelete = 3;
            this.$set(this.articleDetail.tradingOpinionList, index, this.articleDetail.tradingOpinionList[index]);
          })
          .catch(() => {});
      }
    },
    handleTakeOff(formInfo) {
      let params = {
        articleId: this.articleDetail.id,
        articleStatus: this.articleAudit,
        auditNote: this.reviewNotes,
        notice: formInfo.isNotice,
        noticeContent: formInfo.content,
        operator: this.userName,
        opinionList: []
      };
      if (this.changeViewsItem) {
        this.changeViewsItem.forEach(item => {
          params.opinionList.push({opinionId: item.id, opinionStatus: item.auditOrDelete});
        });
      }
      api
        .auditArticle(params)
        .then(res => {
          this.$message.success("审核成功~");
          this.getArticleDetail();
          this.takeOffDialog = false;
          // this.$emit("update:dialogVisible", false);
          this.$emit("handleArticleDetail");
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    //判断最初的文章状态
    handleArticleAudit() {
      let articleAudit = -1;
      if (this.articleDetail.articleStatus === 3) {
        articleAudit = 3; //删除
      } else {
        if (this.articleDetail.articleStatus === 2) {
          articleAudit = 2; //下架
        } else {
          if (this.articleDetail.auditStatus === 1) {
            articleAudit = 1; //未审核
          } else if (this.articleDetail.auditStatus === 3) {
            articleAudit = 5; //已审核
          } else if (this.articleDetail.auditStatus === 2) {
            articleAudit = 0; //待审核
          }
        }
      }
      return articleAudit;
    },
    //判断最初的观点状态
    handleViewsAudit(item) {
      let ViewsAudit = -1;
      if (item.opinionStatus === 3) {
        ViewsAudit = 3; //删除
      } else {
        if (item.auditStatus === 1) {
          ViewsAudit = 0; //未审核
        } else if (item.auditStatus === 3) {
          ViewsAudit = 2; //已审核
        }
      }
      return ViewsAudit;
    },
    // 点击放大图片
    previewImage(e) {
      if (e.target.nodeName === "IMG") {
        this.plusImgUrl = e.target.currentSrc;
        this.plusImg = {
          position: "absolute",
          top: "50%",
          left: "50%",
          display: "block",
          width: e.target.width * 2 + "px",
          height: e.target.height * 2 + "px",
          marginLeft: -e.target.width + "px",
          marginTop: -e.target.height + "px"
        };
      }
    },
    resetData() {
      this.reviewNotes = "";
      this.handleStatus = 0;
      this.articleDetail = {};
      this.articleStatus = 1;
      this.articleAudit = 0;
    },
    handleConfirm(item) {
      this.takeOffDialog = true;
      this.handleStatus = 3;
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables.less";
.popover-style {
  min-width: 100px;
  ::v-deep.el-popover {
    min-width: 100px;
  }
}
.content {
  height: 400px;
  overflow: auto;
  border: 1px solid @global-muted;
}
.related-title {
  font-weight: 600;
  font-size: 20px;
  color: #3bcc6d;
}
.related-point {
  margin-top: 5px;
  .related-img {
    width: 50px;
    height: 50px;
  }
  .actical-title {
    font-weight: 600;
    font-size: 14px;
    color: #00b7ee;
  }
  .detail-row {
    margin-top: 10px;
    .date-style {
      font-size: 12px;
      color: #8c939d;
    }
  }
}
</style>
