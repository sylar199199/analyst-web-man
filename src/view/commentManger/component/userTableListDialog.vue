<template>
  <el-dialog
    title="回复评论"
    :visible="dialogVisible"
    class="user-table-list-dialog"
    width="750px"
    @close="onClickCloseHandle"
    :close-on-click-modal="false"
  >
    <el-row>
      <el-col :span="12">
        <el-input size="small" placeholder="输入用户ID/用户昵称" v-model="keyword"></el-input>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-button size="small" type="primary" @click="getUserInfo">搜索</el-button>
      </el-col>
    </el-row>
    <el-row class="table-list">
      <el-table :data="tablelist" border stripe class="table-border" @row-click="chooseUser">
        <el-table-column label="用户ID" prop="userId" align="center"></el-table-column>
        <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
      </el-table>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="paginationChangeHandle"
    ></pagination>
  </el-dialog>
</template>
<script>
import pagination from "@/components/pagination/index.vue";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tablelist: Array,
    pagination: Object
  },
  components: {pagination},
  data() {
    return {
      keyword: ""
    };
  },
  methods: {
    onClickCloseHandle() {
      this.$emit("changeDialogVisible", false);
    },
    //选择用户
    chooseUser(row) {
      this.$emit("chooseUser", row);
      this.onClickCloseHandle();
    },
    //搜索
    getUserInfo() {
      this.$emit("getUserInfo", this.keyword);
    },
    // 分页
    paginationChangeHandle(page) {
      this.$emit("getUserTableList", page);
    }
  }
};
</script>
<style lang="less" scoped>
.user-table-list-dialog {
  .table-list {
    margin-top: 30px;
  }
}
</style>
