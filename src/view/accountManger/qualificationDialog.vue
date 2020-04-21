<template>
  <el-dialog
    :visible="dialogVisible"
    custom-class="default-dialog"
    class="attention-message-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    width="700px"
    @close="onClickCloseHandle"
    center
    append-to-body
  >
    <el-row class="search-layer">
      <el-col :span="21">
        <el-input size="small" v-model="params.condition" placeholder="认证名称/认证ID"></el-input>
      </el-col>
      <el-col class="text-right" :span="3">
        <el-button size="small" type="default" @click="getContentList">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableList" border stripe class="table-border" align="center">
      <el-table-column label="认证ID" prop="id"></el-table-column>
      <el-table-column label="认证名称" prop="authenticateName"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="scope.row.have" @click="onChooseHandle(scope.row)">
            {{ scope.row.have ? "已选择" : "选择" }}
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClickCloseHandle()">取 消</el-button>
      <el-button type="primary" @click="onClickCloseHandle()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from "@/api/user";
import pagination from "@/components/pagination/index.vue";
import {mapGetters} from "vuex";
export default {
  name: "qualificationDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
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
      tableList: []
    };
  },
  components: {
    pagination
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getContentList();
      }
    }
  },
  computed: {
    ...mapGetters(["currentRegion"])
  },
  methods: {
    getContentList() {
      let params = Object.assign(this.params, {uid: this.uid});
      params = Object.assign(this.params, {region: this.currentRegion});
      api.findAuthenticationInfo(this.params).then(res => {
        this.tableList = res.data.map(item => {
          item.flag = false;
          return item;
        });
        this.params.total = res.total;
      });
    },
    onChooseHandle(data) {
      this.$emit("changeDialogVisible", data);
    },
    onClickCloseHandle() {
      this.$emit("update:dialogVisible", false);
    },
    onChangePaginationHandle(index) {
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

.el-dialog__footer {
  text-align: left;
}
</style>
