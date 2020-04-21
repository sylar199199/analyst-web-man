<template>
  <div>
    <el-dialog
      title="被举报回复内容详情"
      :visible="dialogVisible"
      class="report-content-detail-dialog"
      width="550px"
      @close="onClickCloseHandle"
      :close-on-click-modal="false"
    >
      <el-row>
        <p>一级评论ID：{{ reportDetail.id }}</p>
      </el-row>
      <el-row class="item-report">
        <el-col :span="4">
          <span>回复内容：</span>
        </el-col>
        <el-col :span="15">
          <div class="report-content">
            <span>{{ reportDetail.content ? reportDetail.content : "" }}</span>
            <img :src="reportDetail.imageUrl" />
          </div>
        </el-col>
      </el-row>
      <el-row class="item-report">
        <el-col :span="4" v-if="reportDetail.status === 1">
          <span>处理操作：</span>
        </el-col>
        <el-col :span="4">
          <el-button
            size="small"
            type="primary"
            @click="onClickRemoveReportHandle(true)"
            v-if="reportDetail.status === 1"
          >
            删除此回复
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ""
    },
    reportDetail: Object
  },
  data() {
    return {
      removeReportDialogVisible: false
    };
  },
  methods: {
    onClickCloseHandle() {
      this.$emit("changeDialogVisible", false);
    },
    onClickRemoveReportHandle() {
      this.$emit("removeReport", false);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables.less";
.report-content-detail-dialog {
  .item-report {
    margin-top: 50px;
  }
  .report-content {
    width: 100%;
    background: @input-bg-color;
  }
}
</style>
