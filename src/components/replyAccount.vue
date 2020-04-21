<template>
  <el-dialog
    title="选择回复账号"
    :visible="dialogVisible"
    width="700px"
    custom-class="default-dialog"
    :before-close="handleCloseReply"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input
          v-model="idOrName"
          placeholder="输入用户ID/用户昵称"
          @keyup.enter.native="getContentAccountList()"
        ></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="getContentAccountList()">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="default-table reply-account-table">
        <table>
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户昵称</th>
            </tr>
          </thead>
          <tbody v-for="item in tableList" :key="item.id" @click="handleChooseAccount(item)">
            <tr class="text-center">
              <td>{{ item.userId }}</td>
              <td>{{ item.nickname }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="onChangeCommentPageHandle"
    ></pagination>
  </el-dialog>
</template>
<script>
import * as api from "@/api/contentAccount";
import pagination from "@/components/pagination/index.vue";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    region: {
      type: String,
      default: "CN"
    }
  },
  components: {
    pagination
  },
  watch: {
    dialogVisible() {
      this.getContentAccountList();
    }
  },
  data() {
    return {
      idOrName: "",
      tableList: [],
      pagination: {
        index: 1,
        size: 10,
        total: 0
      }
    };
  },
  methods: {
    getContentAccountList() {
      api
        .getContentAccountList({
          idOrName: this.idOrName.trim(),
          index: this.pagination.index,
          size: this.pagination.size,
          region: this.region
        })
        .then(res => {
          this.tableList = res.data;
          this.pagination.total = res.total;
        })
        .catch(res => {
          this.$message.error("获取内容账号列表失败");
        });
    },
    handleCloseReply() {
      this.$emit("update:dialogVisible", false);
    },
    handleChooseAccount(item) {
      this.$emit("handleChooseAccount", item);
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getContentAccountList();
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables.less";
.reply-account-table {
  tbody tr:hover > td {
    background-color: @gray-bg-color;
  }
}
</style>
