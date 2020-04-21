<template>
  <el-dialog
    :visible="tagVisible"
    title="自定义推荐标签"
    width="700px"
    :before-close="handleClose"
    center
    append-to-body
    custom-class="default-dialog"
    class="attention-message-dialog"
  >
    <el-row class="search-layer">
      <el-col :span="21">
        <el-input size="small" v-model="keyword" placeholder="请输入币种和分析方法关键词"></el-input>
      </el-col>
      <el-col class="text-right" :span="3">
        <el-button size="small" type="default" @click="onSearchTag">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="tagsList" border stripe class="table-border" align="center">
      <el-table-column label="标签类型" prop="tagTypeName"></el-table-column>
      <el-table-column label="代码/名称" prop="tagName"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i
            class="el-icon-circle-check pointer"
            v-if="scope.row.recommend"
            @click="onDeleteRecommend(scope.row.tagId)"
          ></i>
          <i class="el-icon-circle-plus-outline pointer" v-else @click="onAddRecommend(scope.row.tagId)"></i>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="handleClose()">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as api from "@/api/user";
export default {
  name: "recommendTagsDialog",
  props: {
    tagVisible: Boolean,
    uid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      keyword: "",
      tagsList: []
    };
  },
  mounted() {
    this.getTagsList();
  },
  methods: {
    onAddRecommend(tagId) {
      let data = {
        tagIds: [tagId],
        uid: this.uid
      };
      this.addRecommendApi(data);
    },
    onDeleteRecommend(tagId) {
      let data = {
        tagIds: [tagId],
        uid: this.uid
      };
      this.deleteRecommendTagApi(data);
    },
    onSearchTag() {
      this.getTagsList();
    },
    handleClose() {
      this.$emit("update:tagVisible", false);
      this.$emit("updateListData");
    },
    getTagsList() {
      api
        .recommendTag({
          keyword: this.keyword,
          uid: this.uid
        })
        .then(res => {
          this.tagsList = res;
        });
    },
    addRecommendApi(data) {
      api.addRecommendTag(data).then(res => {
        this.$message.success("配置成功~");
        this.getTagsList();
      });
    },
    deleteRecommendTagApi(data) {
      api.deleteRecommendTag(data).then(res => {
        this.$message.success("配置成功~");
        this.getTagsList();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.attention-message-dialog {
  ::v-deep.el-dialog__body {
    padding: 30px;
  }
  .search-layer {
    margin: 0 0 15px;
  }
}
.pointer {
  cursor: pointer;
  font-size: 20px;
}
</style>
