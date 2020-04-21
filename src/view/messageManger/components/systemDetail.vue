<template>
  <el-dialog
    title="文章详情页"
    :visible="dialogVisible"
    class="system-dialog-layer"
    width="700px"
    @close="handleCloseDialog"
  >
    <p>文章标题：{{ data.title }}</p>
    <el-row class="item-info">
      <el-col :span="12">
        作者：
      </el-col>
      <el-col :span="12">
        <span class="fr">发布时间：{{ data.postTime }}</span>
      </el-col>
    </el-row>
    <div class="content scroll-bar">
      <div class="content-detail" v-html="data.content"></div>
      <div class="tag">
        <span v-for="item in data.tecTags" :key="item.id">{{ item.name }}</span>
      </div>
      <p class="link-item pointer" v-if="data.relatedArticleList && data.relatedArticleList.length">
        <i class="el-icon-paperclip link-icon"></i>
        <span>相关观点</span>
      </p>
      <el-row class="article-comment" v-for="item in data.relatedArticleList" :key="item.id">
        <el-col :span="3">
          <img class="img" :src="item.coverUrl" />
        </el-col>
        <el-col :span="18">
          <p>{{ item.title }}</p>
          <p class="author-info">
            <span>{{ item.nickname }}</span>
            <span>{{ item.currencyLabel }}</span>
            <span>
              <i class="el-icon-chat-dot-square"></i>
              <span>9</span>
            </span>
            <span>{{ item.createTime }}</span>
          </p>
        </el-col>
      </el-row>
    </div>
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
@import "~@/style/variables";
.system-dialog-layer {
  .item-info {
    padding: 30px 25px 20px 0;
  }
  .content {
    width: 620px;
    height: 600px;
    padding: 20px;
    border: 1px solid #cccccc;
    overflow-y: auto;

    .tag {
      margin: 30px 0;
      span {
        padding: 5px;
        border: 1px solid #cccccc;
        border-radius: 30px;
      }
    }

    .link-item {
      margin: 30px 0;
      color: @global-success;

      .link-icon {
        font-size: 22px;
      }
    }

    .article-comment {
      img {
        width: 50px;
        height: 50px;
      }

      .author-info {
        margin-top: 8px;
        span {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
