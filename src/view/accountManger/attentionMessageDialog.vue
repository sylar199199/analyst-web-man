<template>
  <el-dialog
    :visible="dialogVisible"
    custom-class="default-dialog"
    class="attention-message-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    width="700px"
    title="后台关注管理"
    @close="onClickCloseHandle"
  >
    <el-row class="search-layer">
      <el-col :span="21">
        <el-input size="small" v-model="params.condition" placeholder="输入用户ID/用户昵称"></el-input>
      </el-col>
      <el-col class="text-right" :span="3">
        <el-button size="small" type="default" @click="onSearch()">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="attentionMessageList" border stripe class="table-border" align="center">
      <el-table-column label="用户ID" prop="userId"></el-table-column>
      <el-table-column label="用户昵称" prop="nickname"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onAttentionUserHandle(scope.row)">
            {{ scope.row.following ? "关注中" : "选择" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-total="params.total"
      :page-index="params.index"
      :page-size="params.size"
      @onCurrentChange="onChangePaginationHandle"
    ></pagination>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClickCloseHandle">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as api from "@/api/user";
import pagination from "@/components/pagination/index.vue";

export default {
  name: "attentionMessageDialog",
  props: {
    dialogVisible: {},
    uid: {
      Type: Number,
      default: 0
    }
  },
  data() {
    return {
      params: {
        condition: "",
        total: 0,
        index: 1,
        size: 10
      },
      attentionMessageList: []
    };
  },
  components: {
    pagination
  },
  mounted() {
    this.getContentList();
  },
  watch: {
    uid(val) {
      this.getContentList();
    }
  },
  methods: {
    onSearch() {
      this.params.index = 1;
      this.getContentList();
    },
    getContentList() {
      let params = Object.assign(this.params, {uid: this.uid});
      api.findSimpleUserInfo(params).then(res => {
        this.attentionMessageList = res.data;
        this.params.total = res.total;
      });
    },
    onAttentionUserHandle(item) {
      api
        .userFollow({
          operateType: item.following ? 0 : 1,
          originUid: item.uid,
          targetUid: this.uid
        })
        .then(res => {
          this.getContentList();
        });
    },
    onClickCloseHandle() {
      this.$emit("changeDialogVisible", false);
    },
    onChangePaginationHandle(index) {
      this.params.condition = "";
      this.params.index = index;
      this.getContentList();
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
</style>
