<template>
  <el-dialog
    title="用户禁言"
    :visible="dialogVisible"
    class="user-mute-dialog"
    width="450px"
    @close="onClickCloseHandle"
  >
    <el-form :model="userMuteFormData" :rules="rules" ref="ruleForm" label-width="90">
      <p>用户昵称：{{ userMuteFormData.nickname }}</p>
      <p class="form-item">用户ID：{{ userMuteFormData.uid }}</p>
      <el-form-item label="禁言时间" prop="muteHour" class="system-notice">
        <el-col :span="8">
          <el-input size="small" v-model="userMuteFormData.muteHour"></el-input>
        </el-col>
        <el-col :span="4" :offset="1">
          <span>小时</span>
        </el-col>
      </el-form-item>
      <el-form-item label="系统通知" prop="noticeContent" class="system-notice">
        <el-col :span="17">
          <el-input type="textarea" rows="6" v-model="userMuteFormData.noticeContent"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="7" class="fr notice-icon">
          <span>通知用户</span>
          <switch-icon :data="userMuteFormData"></switch-icon>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClickCloseHandle">取 消</el-button>
      <el-button type="primary" @click="onClickConfirmHandle">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import switchIcon from "../../../components/switchIcon";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    userMuteFormData: Object
  },
  components: {switchIcon},
  data() {
    return {
      rules: {muteHour: {required: true, message: "请输入禁言时间", trigger: "blue"}}
    };
  },

  methods: {
    onClickCloseHandle() {
      this.$emit("changeDialogVisible", false);
    },
    // 提交数据
    onClickConfirmHandle() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit("onClickSubmitHandle");
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.user-mute-dialog {
  .form-item {
    margin-top: 10px;
  }
  .system-notice {
    margin-top: 30px;
  }
  .notice-icon {
    margin-right: 40px;

    span {
      margin-right: 15px;
    }
  }
}
</style>
