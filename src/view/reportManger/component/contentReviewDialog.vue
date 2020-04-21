<template>
  <el-dialog
    title="内容审核"
    :visible="dialogVisible"
    class="content-review-dialog"
    width="950px"
    @close="onClickCloseHandle"
    :close-on-click-modal="false"
  >
    <el-row :gutter="40">
      <el-col :span="16">
        <div class="item-info">
          <p>文章标题：{{ articleDetail.title }}</p>
          <p>作者：{{ articleDetail.nickname }}</p>
          <p class="fr">发布时间：{{ articleDetail.updateTime }}</p>
        </div>
        <div class="main-content" v-html="articleDetail.content"></div>
      </el-col>
      <el-col :span="7" :offset="1">
        <div class="operate-btn">
          <span>审核状态：{{ articleDetail.auditStatus | articleStatus }}</span>
          <div class="btn">
            <el-button
              type="primary"
              class="turn-off"
              @click="onClickArticleHandle(2)"
              v-if="articleDetail.status === 1"
            >
              下架该文章
            </el-button>
            <el-button type="primary" @click="onClickArticleHandle(3)" v-if="articleDetail.status !== 3">
              删除该文章
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
const articleStatus = {
  1: "未审核",
  2: "待审核",
  3: "已审核"
};
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    articleDetail: Object
  },
  filters: {
    articleStatus(type) {
      return articleStatus[type];
    }
  },
  methods: {
    onClickCloseHandle() {
      this.$emit("changeDialogVisible", false);
    },
    onClickArticleHandle(val) {
      this.$emit("changeTurnOffVisible", val);
    }
  }
};
</script>
<style lang="less" scoped>
.content-review-dialog {
  .item-info {
    line-height: 30px;
  }
  .main-content {
    width: 100%;
    position: relative;
    border: 1px solid #cccccc;
    height: 350px;
    overflow-y: auto;
    padding: 15px;
  }
  .operate-btn {
    margin-top: 60px;
    .btn {
      margin-top: 30px;
      .turn-off {
        margin-right: 30px;
      }
    }
  }
}
</style>
