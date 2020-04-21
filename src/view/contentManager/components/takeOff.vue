<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="600px"
    :before-close="handleClose"
    center
    append-to-body
    custom-class="default-dialog"
  >
    <span>系统通知</span>
    <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="formInfo.content" maxlength="200"></el-input>
    <el-switch v-model="formInfo.isNotice" inactive-text="通知用户"></el-switch>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="handleConfrim()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    takeOffType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formInfo: {
        content: "",
        isNotice: false
      }
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.formInfo = {
          isNotice: false,
          content: ""
        };
      }
    }
  },
  computed: {
    title() {
      let title = "";
      switch (this.takeOffType) {
        case 1:
          title = "是否下架文章";
          break;
        case 2:
          title = "是否下架所有文章";
          break;
        case 3:
          title = "是否通知用户";
          break;
      }
      return title;
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleConfrim() {
      this.$emit("handleTakeOff", this.formInfo);
    }
  }
};
</script>
<style lang="less" scoped></style>
