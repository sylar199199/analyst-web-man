<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
      center
      custom-class="default-dialog"
      close-on-click-modal
      append-to-body
    >
      <el-form :model="formInfo" label-width="80px">
        <el-form-item label="发布账号">
          <i
            v-if="formInfo.fromUid === 0"
            class="el-icon-circle-plus-outline font-size-ll"
            @click="handleSelectAccount()"
          ></i>
          <span v-else @click="handleSelectAccount()">{{ formInfo.nickname }}</span>
        </el-form-item>
        <el-form-item label="评论语言">
          <el-select v-model="targetLanage" placeholder="请选择评论语言" @change="handleChangeLanguage">
            <el-option
              v-for="item in getTranslateLangList"
              :key="item.locale"
              :value="item.locale"
              :label="item.localeName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-row>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="formInfo.content"
              maxlength="240"
              @blur="handleChangeLanguage"
            ></el-input>
          </el-row>
          <el-row class="normal-margin">
            <el-upload
              :class="{'hide-upload': hideUpload}"
              action=""
              ref="fileUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :http-request="handleHttpRequest"
              :on-success="uploadSuccess"
              :before-upload="handleBeforeUpload"
              :limit="limitCount"
              :on-change="handleOnChange"
              :on-remove="handleOnRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="pictureDialog" append-to-body>
              <img width="100%" :src="formInfo.imageUrl" alt="" />
            </el-dialog>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleAddReply()">确 定</el-button>
      </span>
    </el-dialog>
    <reply-account :dialogVisible.sync="selectAccountDialog" @handleChooseAccount="handleChooseAccount"></reply-account>
  </div>
</template>

<script>
import * as api from "@/api/contentAccount";
import * as commonApi from "@/api/common";
import {upLoad} from "@/api/uploader";
import {mapGetters} from "vuex";
import replyAccount from "@/components/replyAccount";
import {debounce} from "@/utils/mUtils";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    replyType: {
      type: Number,
      default: 0
    }
  },
  components: {
    replyAccount
  },
  data() {
    return {
      idOrName: "",
      selectAccountDialog: false,
      tableList: [],
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      formInfo: {
        fromUid: 0,
        nickname: "",
        content: "",
        imageUrl: ""
      },
      pictureDialog: false,
      hideUpload: false,
      limitCount: 1,
      targetLanage: "zh_CN"
    };
  },
  filters: {
    a(val) {
      console.log(val);
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        if (this.$refs.fileUpload) {
          this.$refs.fileUpload.clearFiles();
        }
        this.formInfo = {
          fromUid: 0,
          nickname: "",
          content: "",
          imageUrl: ""
        };
      }
    }
  },
  computed: {
    ...mapGetters(["userUid", "getLangList", "getTranslateLangList"]),
    title() {
      let title = "";
      switch (this.replyType) {
        case 1:
          title = "评论此回复";
          break;
        case 2:
          title = "回复评论";
          break;
      }
      return title;
    }
  },
  methods: {
    handleChangeLanguage(val) {
      if (this.formInfo.content.trim().length === 0) return;
      let param = {
        target: this.targetLanage,
        text: this.formInfo.content
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
    getContentAccountList() {
      api
        .getContentAccountList({
          idOrName: this.idOrName,
          index: this.pagination.index,
          size: this.pagination.size
        })
        .then(res => {
          this.tableList = res.data;
          this.pagination.total = res.total;
        })
        .catch(res => {
          this.$message.error("获取内容账号列表失败");
        });
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleOnChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handleOnRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handleBeforeUpload(file) {
      let vertifyImgType = /^image\/(jpeg|png|jpg|gif)$/.test(file.type);
      const isLt10M = file.size / 1024 / 1024 <= 10;
      const isLt100M = file.size / 1024 / 1024 <= 100;
      if (vertifyImgType && !isLt10M) {
        this.$message.error("上传图片大小不能超过 10M");
        return false;
      }
      if (!isLt100M) {
        this.$message.error("上传文件大小不能超过 100MB!");
        return false;
      }
    },
    handleHttpRequest(data) {
      let file = data.file;
      let fileType = 1; //1是图片，2是音频，3是视频，4是文件
      upLoad
        .uploader(file, fileType, this.userUid)
        .then(res => {
          this.formInfo.imageUrl = res.url;
        })
        .catch(res => {
          this.$message.error("上传失败");
        });
    },
    handlePictureCardPreview() {
      this.pictureDialog = true;
    },
    uploadSuccess(response, file, fileList) {
      this.$refs.fileUpload.clearFiles(); // 清空文件列表
    },
    handleSelectAccount() {
      this.selectAccountDialog = true;
      this.getContentAccountList();
    },
    handleChooseAccount(item) {
      this.selectAccountDialog = false;
      this.formInfo.fromUid = item.uid;
      this.formInfo.nickname = item.nickname;
    },
    handleAddReply() {
      this.$emit("handleAddReply", this.formInfo);
    },
    handleCloseReply() {
      this.selectAccountDialog = false;
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getContentAccountList();
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .hide-upload .el-upload--picture-card {
  display: none;
}
</style>
