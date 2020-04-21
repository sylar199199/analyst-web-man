<template>
  <el-dialog
    title="通知详情"
    :visible="dialogVisible"
    width="500px"
    class="notice-detail-dialog-layer"
    @close="handleCloseDialog"
  >
    <el-form :model="data">
      <el-row class="notice-item">
        <h3>推送通知</h3>
        <p>{{ data.title }}</p>
      </el-row>
      <el-row class="notice-item">
        <h3>内容描述</h3>
        <p>{{ data.content }}</p>
      </el-row>
      <el-row class="notice-item">
        <h3>添加链接</h3>
        <p>{{ data.linkURL }}</p>
      </el-row>
      <img class="img" :src="data.imgURL" />
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    handleCloseDialog() {
      this.$emit("changeDialogVisible", false);
    }
  }
};
</script>
<style lang="less" scoped>
.notice-detail-dialog-layer {
  .notice-item {
    margin: 0 0 20px;

    p {
      margin-top: 8px;
    }
  }
  img {
    width: 360px;
    height: 200px;
  }
}
</style>
