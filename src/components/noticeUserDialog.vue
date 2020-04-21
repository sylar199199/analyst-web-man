<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    class="remove-report-dialog"
    width="450px"
    @close="onClickCloseHandle"
    :close-on-click-modal="false"
  >
    <el-form :model="noticeFormData" label-width="90" :rules="rules" ref="formRef">
      <el-form-item label="系统通知" prop="noticeContent">
        <el-col :span="17">
          <el-input type="textarea" rows="6" v-model="noticeFormData.noticeContent"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="4">
          <span>通知用户</span>
        </el-col>
        <el-col :span="5">
          <switch-icon :data="noticeFormData"></switch-icon>
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
import switchIcon from "../components/switchIcon";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    noticeFormData: Object
  },
  components: {switchIcon},
  data() {
    return {
      rules: {
        noticeContent: {min: 0, max: 100, message: "最多输入100个字符", blur: "trigger"}
      }
    };
  },
  methods: {
    onClickCloseHandle() {
      this.$emit("changeDialogVisible", false);
    },
    // 提交数据
    onClickConfirmHandle() {
      this.$refs["formRef"].validate(valid => {
        if (valid) {
          this.$emit("onClickSubmitHandle");
        }
      });
    }
  }
};
</script>
