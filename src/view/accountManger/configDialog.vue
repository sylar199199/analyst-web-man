<template>
  <el-dialog
    title="配置"
    :visible="dialogVisible"
    width="700px"
    :before-close="handleClose"
    center
    :close-on-click-modal="false"
    append-to-body
    custom-class="default-dialog"
  >
    <el-form label-width="100px" :model="formInfo">
      <el-form-item label="全局禁言时间">
        <el-input
          v-model="formInfo.forbiddenTime"
          class="common-width"
          type="tel"
          maxlength="3"
          @keyup.native="proving"
        ></el-input>
        <span>小时</span>
      </el-form-item>
      <el-form-item label="认证">
        <el-input v-model="formInfo.authenticationName" class="common-width"></el-input>
        <el-button type="primary" @click="chooseQualification()" size="small">选择</el-button>
      </el-form-item>
      <el-form-item label="推荐用户">
        <el-select v-model="formInfo.recommend" placeholder="全部">
          <el-option label="推荐" :value="1"></el-option>
          <el-option label="不推荐" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <notice-templete
        :notice.sync="formInfo.notice"
        :noticeContent.sync="formInfo.noticeContent"
        :locale.sync="formInfo.locale"
      ></notice-templete>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="handleConfrim()">确 定</el-button>
    </span>
    <qualification-dialog
      :dialogVisible.sync="qualificationDialog"
      :uid="uid"
      @changeDialogVisible="onChangeQualification"
    ></qualification-dialog>
  </el-dialog>
</template>
<script>
import qualificationDialog from "./qualificationDialog";
import noticeTemplete from "@/components/noticeTemplete";
import * as api from "@/api/user";
import {mapGetters} from "vuex";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    uid: {
      Type: Number,
      default: 0
    }
  },
  components: {
    qualificationDialog,
    noticeTemplete
  },
  data() {
    return {
      formInfo: {
        forbiddenTime: "",
        notice: false,
        authenticationId: -1,
        authenticationType: 0,
        authenticationName: "",
        noticeContent: "",
        operator: "",
        recommend: 1
      },
      qualificationDialog: false
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.formInfo = {
          isNotice: false,
          noticeContent: "",
          forbiddenTime: ""
        };
      }
    }
  },
  computed: {
    ...mapGetters(["userName"])
  },
  methods: {
    proving() {
      this.formInfo.forbiddenTime = this.formInfo.forbiddenTime.replace(/[^.\d]/g, "");
      this.formInfo.forbiddenTime = this.formInfo.forbiddenTime.replace(".", "");
    },
    chooseQualification() {
      this.qualificationDialog = true;
    },
    onChangeQualification(data) {
      this.qualificationDialog = false;
      this.formInfo.authenticationId = data.id;
      this.formInfo.authenticationName = data.authenticateName;
      this.formInfo.authenticationType = data.authenticateType;
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleConfrim() {
      let params = {
        authenticationId: this.formInfo.authenticationId,
        authenticationType: this.formInfo.authenticationType,
        forbiddenTime: this.formInfo.forbiddenTime,
        notice: this.formInfo.notice,
        noticeContent: this.formInfo.noticeContent,
        operator: this.userName,
        recommend: this.formInfo.recommend,
        uid: this.uid
      };
      api
        .userConfig(params)
        .then(res => {
          this.$message.success("配置成功~");
          this.$emit("changeDialogVisible");
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.common-width {
  width: 200px;
}
</style>
