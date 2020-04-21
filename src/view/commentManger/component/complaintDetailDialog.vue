<template>
  <el-dialog
    title="投诉详情"
    :visible="dialogVisible"
    class="complaint-detail-dialog"
    width="950px"
    @close="onClickCloseHandle"
    :close-on-click-modal="false"
  >
    <el-row>
      <el-col :span="2">
        <span>评论内容：</span>
      </el-col>
      <el-col :span="10">
        <div class="cmment-content-detail">
          <p v-html="form.commentConent"></p>
          <img class="comment-img" :src="form.imageUrl" />
        </div>
      </el-col>
    </el-row>
    <el-row class="table-list">
      <el-table :data="tableList" border stripe class="table-border">
        <el-table-column label="举报者ID" align="center" prop="userId"></el-table-column>
        <el-table-column label="举报者昵称" align="center" prop="nickname"></el-table-column>
        <el-table-column label="举报时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投诉标签" align="center" prop="tagNames">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.tagNames" :key="index">
              <span class="tag">{{ item }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="原因描述" align="center" prop="content"></el-table-column>
      </el-table>
    </el-row>
    <pagination
      :page-total="commentPagination.total"
      :page-index="commentPagination.index"
      :page-size="commentPagination.size"
      @onCurrentChange="paginationChangeHandle"
    ></pagination>
  </el-dialog>
</template>
<script>
import pagination from "@/components/pagination/index.vue";
import {formatDate} from "@/utils/mUtils";
export default {
  components: {
    pagination
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    commentPagination: Object,
    form: {
      type: Object,
      default() {
        return {};
      }
    },
    tableList: Array
  },
  filters: {
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD HH:mm:ss");
    }
  },
  methods: {
    onClickCloseHandle() {
      this.$emit("changeDialogVisible", false);
    },
    // 分页
    paginationChangeHandle(page) {
      this.$emit("onClickChangePageHandle", page);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables.less";
.complaint-detail-dialog {
  .cmment-content-detail {
    width: 380px;
    background-color: @input-bg-color;
    img {
      width: 100%;
    }
  }

  .table-list {
    margin-top: 30px;

    .tag {
      padding: 10px;
      border-radius: 50%;
      background: #d9dbee;
    }
  }
}
</style>
