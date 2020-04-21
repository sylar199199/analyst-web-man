<template>
  <container class="content-account-manger-list-layer" title="内容账号管理">
    <el-row :gutter="20">
      <el-col :span="6">
        地区选择:
        <el-select v-model="search.region" placeholder="请选择">
          <el-option
            v-for="item in getAreaList"
            :key="item.region"
            :label="item.regionName"
            :value="item.region"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input v-model="search.idOrName" placeholder="搜索用户ID"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getContentAccountList()">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-upload class="upload-demo" action="" :http-request="handleImportList" ref="fileList">
          <el-button type="primary">导入列表</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <div class="default-table">
        <el-table :data="tableList" border stripe class="table-border" fit>
          <el-table-column label="用户头像" prop="avatar" align="center">
            <template slot-scope="scope">
              <el-avatar :src="scope.row.avatar"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="用户ID" prop="userId" align="center"></el-table-column>
          <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
          <el-table-column label="添加时间" prop="createTime" align="center">
            <template slot-scope="scope">
              {{ scope.row.createTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleDelete(scope.row.uid)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="onChangeCommentPageHandle"
    ></pagination>
  </container>
</template>

<script>
import * as api from "@/api/contentAccount";
import pagination from "@/components/pagination/index.vue";
import {mapGetters} from "vuex";
import {formatDate} from "@/utils/mUtils";
export default {
  name: "contentAccountMangerList",
  components: {
    pagination
  },
  data() {
    return {
      countryOpt: [],
      removeDialogVisible: false,
      search: {
        region: "CN",
        idOrName: ""
      },
      tableList: [],
      pagination: {
        index: 1,
        size: 20,
        total: 0
      }
    };
  },
  created() {
    this.getContentAccountList();
  },
  computed: {
    ...mapGetters(["getAreaList"])
  },
  filters: {
    formatDate
  },
  methods: {
    getContentAccountList() {
      api
        .getContentAccountList({
          idOrName: this.search.idOrName,
          index: this.pagination.index,
          region: this.search.region,
          size: this.pagination.size
        })
        .then(res => {
          this.tableList = res.data;
          this.pagination.total = res.total;
        })
        .catch(res => {
          this.$message.error("获取内容账号列表失败");
        });
    },
    handleDelete(id) {
      this.$messageBox
        .confirm("确定移除该账号?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        })
        .then(() => {
          api.removeAccount({uid: id}).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getContentAccountList();
          });
        })
        .catch(() => {});
    },
    handleImportList(event) {
      const params = new FormData();
      params.append("file", event.file);
      let region = this.search.region;
      api
        .batchImportAccounts(params, region)
        .then(res => {
          this.$message.success("导入成功~");
          this.getContentAccountList();
          this.$refs["fileList"].clearFiles();
        })
        .catch(res => {
          this.$message.error(res.message);
          this.$refs["fileList"].clearFiles();
        });
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getContentAccountList();
    }
  }
};
</script>

<style lang="less" scoped></style>
