<template>
  <container class="message-manger-list-layer" title="消息推送">
    <el-row>
      <el-col :span="5">
        语言选择：
        <el-select size="small" v-model="filters.locale" @change="handleChangeLocale">
          <el-option
            v-for="(item, index) in getLangList"
            :key="index"
            :label="item.localeName"
            :value="item.locale"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          size="small"
          v-model="filters.messageTime"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-select size="small" v-model="filters.dealtStatus" @change="handleChangeDealtStatus">
          <el-option
            v-for="(item, index) in messageStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="small" @click="getTableList">搜索</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="small" @click="addMessageHandle">创建</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableList" border stripe class="table-border table-layer">
      <el-table-column label="消息类型" prop="type" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | messageType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息标题" prop="title" align="center"></el-table-column>
      <el-table-column label="推送对象" prop="pushObj" align="center"></el-table-column>
      <el-table-column label="状态" prop="pushStatus" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pushStatus | sendType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送时间" prop="sendTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sendTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理账号" prop="handleAccount" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <i class="el-icon-view common-icon pointer" @click="onClickLookDetailHandel(scope.row)"></i>
          <template v-if="scope.row.type === 13">
            <i class="el-icon-edit-outline common-icon pointer" @click="onClickEditNoticeHandel(scope.row)"></i>
            <i class="el-icon-delete common-icon pointer" @click="onClickDeleteHandel(scope.row)"></i>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="paginationChangeHandle"
    ></pagination>
    <add-message-dialog
      :dialogVisible="addMessageDialogVisible"
      :formData="addFormData"
      :articleInfo="articleInfo"
      ref="formRef"
      @uploadFile="fileUpload"
      @getArticle="onClickgetArticleHandle"
      @addArticle="handleAddArticle"
      @translate="onClickLookTranslateHandle"
      @lookOriginal="onClickOriginalHandle"
      @sbumitData="onClickSubmitDataHandle"
      @changeDialogVisible="onClickAddMessageDialogVisibleHandle"
    ></add-message-dialog>
    <system-detail-dialog
      :dialogVisible="systemDialogVisible"
      :data="systemForm"
      @changeDialogVisible="onClickSystemDialogVisibleHandle"
    ></system-detail-dialog>
    <notice-detail-dialog
      :dialogVisible="noticeDialogVisible"
      @changeDialogVisible="onClickNoticeDialogVisibleHandle"
      :data="noticeForm"
    ></notice-detail-dialog>
    <edit-notice-dialog
      :dialogVisible="editNoticeDialogVisible"
      @changeDialogVisible="onClickEditNoticeDialogVisibleHandle"
      @submitData="onClickSubmitEditDataHandle"
      @fileUpload="fileUpload"
      :data="editNoticeForm"
    ></edit-notice-dialog>
  </container>
</template>
<script>
import {messageStatusList, translateLanageList} from "@/utils/env";
import {mapGetters} from "vuex";
import addMessageDialog from "./components/addMessage";
import systemDetailDialog from "./components/systemDetail";
import noticeDetailDialog from "./components/noticeDetail";
import editNoticeDialog from "./components/editNotice";
import * as api from "@/api/messageManger";
import {formatDate} from "@/utils/mUtils";
import * as uploadApi from "@/api/uploader";
import * as contentApi from "@/api/contentManager";
import * as commonApi from "@/api/common";
import pagination from "@/components/pagination/index.vue";
const messageType = {
  11: "系统消息", //推广文章
  13: "系统通知" //推送通知
};
const sendType = {
  1: "未发送",
  2: "已发送"
};
export default {
  components: {addMessageDialog, systemDetailDialog, noticeDetailDialog, editNoticeDialog, pagination},
  data() {
    return {
      filters: {
        messageTime: "",
        locale: "zh_CN",
        dealtStatus: 0
      },
      tableList: [],
      messageStatusList: messageStatusList,
      addMessageDialogVisible: false,
      addFormData: {
        messageType: "系统消息",
        isNowPush: "1",
        specifyCurrent: "", //指定品种圈
        pushObject: "所有人",
        localeName: "简体中文",
        sendTime: "", //系统通知
        activityTitle: "", //系统通知
        activityContent: "", //系统通知
        activityLinkUrl: "", //系统通知
        activityImageUrl: "", //系统通知
        articleTitle: "", //系统消息
        articleId: "", //系统消息
        coverUrl: "" //系统消息
      },
      systemDialogVisible: false,
      noticeDialogVisible: false,
      editNoticeDialogVisible: false,
      noticeForm: {},
      pagination: {
        total: 0,
        index: 1,
        size: 20
      },
      articleInfo: {}, //文章信息
      systemForm: {},
      editNoticeForm: {
        title: "",
        content: "",
        linkURL: "",
        imgURL: ""
      },
      originalTitle: "", //原文标题
      originalContent: "", //原文内容
      isTitleTranslate: false,
      isContentTranslate: false
    };
  },
  computed: {
    ...mapGetters(["getLangList", "userName", "userUid"]),
    addType() {
      return this.addFormData.messageType === "系统消息" ? 11 : 13;
    },
    addTitle() {
      return this.addFormData.messageType === "系统消息"
        ? this.addFormData.articleTitle
        : this.addFormData.activityTitle;
    },
    currentLocaleItem() {
      return this.getLangList.filter(item => {
        if (item.localeName === this.addFormData.localeName) {
          return item;
        }
      });
    },
    targetUid() {
      if (this.addFormData.pushObject === "所有人") {
        return 0;
      } else {
        return -1;
      }
    },
    targetLanage() {
      let value = "";
      translateLanageList.forEach(item => {
        if (item.name === this.addFormData.localeName) {
          value = item.value;
        }
      });
      return value;
    },
    // 原文内容（标题）
    translateTitleText() {
      return this.isTitleTranslate ? this.originalTitle : this.addFormData.activityTitle;
    },
    // 原文内容（内容描述）
    translateContentText() {
      return this.isContentTranslate ? this.originalContent : this.addFormData.activityContent;
    }
  },
  filters: {
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD hh:mm:ss");
    },
    messageType(val) {
      return messageType[val];
    },
    sendType(val) {
      return sendType[val];
    }
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      api
        .searchSystemNotifies({
          pushStatus: this.filters.dealtStatus,
          startTime: this.filters.messageTime ? formatDate(this.filters.messageTime[0]) : "",
          endTime: this.filters.messageTime ? formatDate(this.filters.messageTime[1]) : "",
          locale: this.filters.locale,
          index: this.pagination.index,
          size: this.pagination.size
        })
        .then(res => {
          this.tableList = res.data;
          this.pagination.total = res.total;
        });
    },
    // 切换语言
    handleChangeLocale(val) {
      this.filters.locale = val;
      this.getTableList();
    },
    // 切换发送状态
    handleChangeDealtStatus(val) {
      this.filters.dealtStatus = val;
      this.getTableList();
    },
    onClickLookDetailHandel(row) {
      if (row.type === 13) {
        this.getNoticeDetailHandle(row);
        this.onClickNoticeDialogVisibleHandle(true);
      } else {
        this.getSystemMessageDetail(row);
      }
    },
    addMessageHandle() {
      this.onClickAddMessageDialogVisibleHandle(true);
    },
    //创建
    onClickSubmitDataHandle(idArr) {
      if (this.$refs.formRef.validator()) {
        let notice = {
          content: this.addFormData.activityContent,
          id: "",
          imgURL: this.addFormData.activityImageUrl,
          linkURL: this.addFormData.activityLinkUrl, //跳转链接url
          locale: this.currentLocaleItem[0].locale,
          objId: this.addFormData.articleId,
          operator: this.userName,
          region: "", //消息接收者地区
          sendTime: this.addFormData.sendTime ? formatDate(this.addFormData.sendTime) : null, //定时推送时间
          sendUid: this.userUid, //消息发送者id
          tagIdList: [this.addFormData.specifyCurrent], //品种圈id列表
          targetUid: this.targetUid, ////消息接收者id，所有人传0，一对多但不是所有者传-1
          targetUidList: idArr, //接受者id数组
          title: this.addTitle,
          type: this.addType // 推广文章11 推广活动13
        };
        api
          .pushSystemNotice(notice)
          .then(res => {
            this.$message({
              type: "success",
              message: "推送成功"
            });
            this.onClickAddMessageDialogVisibleHandle(false);
            this.getTableList();
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "推送失败"
            });
          });
      }
    },
    // 搜索指定文章
    onClickgetArticleHandle(val) {
      api
        .getArticleInfo({
          articleId: val
        })
        .then(res => {
          if (res.id) {
            this.articleInfo = {
              videoUrl: res.videoUrl,
              title: res.title,
              id: res.id
            };
          }
        });
    },
    //添加文章
    handleAddArticle() {
      this.addFormData.articleTitle = this.articleInfo.title;
      this.addFormData.coverUrl = this.articleInfo.videoUrl;
      this.addFormData.articleId = this.articleInfo.id;
    },
    //上传图片
    fileUpload(event, type) {
      let file = event.file;
      let fileType = 1; //图片1，音频2，视频3，文件4
      uploadApi.upLoad
        .uploader(file, fileType, this.userUid)
        .then(res => {
          type === 1 ? (this.addFormData.activityImageUrl = res.url) : (this.editNoticeForm.imgURL = res.url);
        })
        .catch(err => {
          this.$message({
            message: "上传失败",
            type: "error"
          });
        });
    },
    // 获取系统通知详情
    getNoticeDetailHandle(row) {
      api
        .getSystemNotifyInfo({
          id: row.id
        })
        .then(res => {
          this.noticeForm = res;
          this.onClickNoticeDialogVisibleHandle(true);
        });
    },
    // 查询系统消息详情
    getSystemMessageDetail(row) {
      contentApi
        .getArticleDetail({
          articleId: row.contentId
        })
        .then(res => {
          this.systemForm = res;
          this.onClickSystemDialogVisibleHandle(true);
        });
    },
    // 编辑
    onClickSubmitEditDataHandle() {
      let editParam = {
        content: this.editNoticeForm.content,
        id: this.editNoticeForm.id,
        imgURL: this.editNoticeForm.imgURL,
        title: this.editNoticeForm.title,
        linkURL: this.editNoticeForm.linkURL
      };
      api
        .editSystemNotify(editParam)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.onClickEditNoticeDialogVisibleHandle(false);
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "修改失败"
          });
        });
    },
    onClickAddMessageDialogVisibleHandle(visible) {
      this.addMessageDialogVisible = visible;
      if (!visible) {
        this.addFormData = {
          messageType: "系统消息",
          isNowPush: "1",
          specifyCurrent: "", //指定品种圈
          pushObject: "所有人",
          localeName: "简体中文",
          sendTime: "", //系统通知
          activityTitle: "", //系统通知
          activityContent: "", //系统通知
          activityLinkUrl: "", //系统通知
          activityImageUrl: "", //系统通知
          articleTitle: "", //系统消息
          articleId: "", //系统消息
          coverUrl: "" //系统消息
        };
      }
    },
    onClickSystemDialogVisibleHandle(visible) {
      this.systemDialogVisible = visible;
    },
    onClickNoticeDialogVisibleHandle(visible) {
      this.noticeDialogVisible = visible;
    },
    onClickEditNoticeDialogVisibleHandle(visible) {
      this.editNoticeDialogVisible = visible;
    },
    onClickEditNoticeHandel(row) {
      api
        .getSystemNotifyInfo({
          id: row.id
        })
        .then(res => {
          this.editNoticeForm = res;
          this.onClickEditNoticeDialogVisibleHandle(true);
        });
    },
    // 删除推送
    onClickDeleteHandel(row) {
      this.$confirm("是否确定删除改推送？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        api
          .delSystemNotify({
            notifyId: row.id,
            pushId: row.pushId
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
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
    // 查看翻译
    onClickLookTranslateHandle(type) {
      let param = {
        source: "zh-CN",
        target: this.targetLanage,
        text: type === 1 ? this.translateTitleText : this.translateContentText
      };
      commonApi
        .googleTranslate(param)
        .then(res => {
          if (type === 1) {
            this.addFormData.activityTitle = res.translatedText;
            if (!this.isTitleTranslate) {
              this.originalTitle = this.addFormData.activityTitle;
              this.isTitleTranslate = true;
            }
          } else {
            this.addFormData.activityContent = res.translatedText;
            if (!this.isContentTranslate) {
              this.originalContent = this.addFormData.activityContent;
              this.isContentTranslate = true;
            }
          }
        })
        .catch(err => {
          this.$message.error("翻译失败");
        });
    },
    // 查看原文
    onClickOriginalHandle(type) {
      if (type == 1) {
        if (this.isTitleTranslate) {
          this.addFormData.activityTitle = this.originalTitle;
        }
      } else {
        if (this.isContentTranslate) {
          this.addFormData.activityContent = this.originalContent;
        }
      }
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
.message-manger-list-layer {
  .table-layer {
    margin-top: 30px;

    .common-icon {
      font-size: 20px;
    }
  }
}
</style>
