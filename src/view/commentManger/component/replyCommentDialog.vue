<template>
  <div>
    <el-dialog
      title="回复一级评论"
      :visible="dialogVisible"
      class="reply-comment-dialog"
      width="750px"
      @close="onClickCloseHandle"
      :close-on-click-modal="false"
    >
      <el-form :model="replyCommentFormData" label-width="110px" label-position="'left" :rules="rule" ref="form">
        <el-form-item label="发布账号：" prop="account">
          <el-col :span="8">
            <el-input
              size="small"
              v-model="replyCommentFormData.account"
              readonly
              suffix-icon="el-icon-search"
              @click.native="onChangeUserTableListDialogVisibleHandle(true)"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="评论语言：" prop="commentLocale">
          <el-select v-model="replyCommentFormData.commentLocale">
            <el-option
              v-for="(item, index) in getLangList"
              :key="index"
              :label="item.localeName"
              :value="item.locale"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回复内容：" prop="replyContent">
          <el-input
            type="textarea"
            rows="8"
            class="replay-content"
            v-model="replyCommentFormData.replyContent"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            ref="fileUpload"
            :http-request="fileUpload"
          >
            <img v-if="replyCommentFormData.imageUrl" :src="replyCommentFormData.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClickCloseHandle">取 消</el-button>
        <el-button type="primary" @click="onClickSubmitHandle">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查询用户列表 -->
    <user-table-list-dialog
      :dialogVisible="userTableListDialogVisible"
      :tablelist="tablelist"
      :pagination="pagination"
      @getUserTableList="onClickChangeUserListHandle"
      @getUserInfo="getUserInfo"
      @chooseUser="chooseUser"
      @changeDialogVisible="onChangeUserTableListDialogVisibleHandle"
    ></user-table-list-dialog>
  </div>
</template>
<script>
import userTableListDialog from "./userTableListDialog";
import * as api from "@/api/contentAccount";
import {mapGetters} from "vuex";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    replyCommentFormData: Object
  },
  components: {userTableListDialog},
  data() {
    return {
      userTableListDialogVisible: false,
      tablelist: [],
      pagination: {
        index: 1,
        total: 0,
        size: 20
      },
      rule: {
        account: {required: true, message: "请选择发布账号", trigger: "change"},
        replyContent: [
          {required: true, message: "请输入回复内容", trigger: "blur"},
          {min: 1, max: 480, message: "最多输入480个字符", trigger: "blur"}
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["getLangList"])
  },
  methods: {
    onClickCloseHandle() {
      this.$refs["form"].resetFields();
      this.$emit("changeDialogVisible", false);
    },
    onClickSubmitHandle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("onClickSubmitHandle");
        }
      });
    },
    //查询用户列表
    onClickGetUserTableListHandle(keyword) {
      api
        .getContentAccountList({
          index: this.pagination.index,
          nameOrId: keyword,
          size: this.pagination.size
        })
        .then(res => {
          this.tablelist = res.data;
          this.pagination.total = res.total;
        });
    },
    onChangeUserTableListDialogVisibleHandle(visible) {
      this.onClickGetUserTableListHandle();
      this.userTableListDialogVisible = visible;
    },
    //选择用户
    chooseUser(row) {
      this.$emit("onClickChooseUserHandle", row);
    },
    //上传图片
    fileUpload(file) {
      this.$emit("fileUpload", file);
    },
    //查询用户信息
    getUserInfo(val) {
      this.onClickGetUserTableListHandle(val);
    },
    //改变用户列表分页
    onClickChangeUserListHandle(page) {
      this.pagination.index = page;
      this.onClickGetUserTableListHandle();
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables.less";
.reply-comment-dialog {
  .circle-plus-icon {
    font-size: 25px;
    color: @global-primary;
  }
  .replay-content {
    width: 400px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border-radius: 6px;
    border: 1px solid @global-muted3;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
