<template>
  <container class="download-manger-list-layer" title="应用下载管理">
    <el-row :gutter="20">
      <el-col :span="3">
        <el-select v-model="search.clientType" placeholder="请选择">
          <el-option label="IOS" :value="1"></el-option>
          <el-option label="Android" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getDownloadList()">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="handleEdit('add')">上传</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="searchWordTableList">
        <el-table :data="tableList" border stripe class="table-border" fit>
          <el-table-column label="版本号" prop="version" align="center" width="80px"></el-table-column>
          <el-table-column label="版本名" prop="versionName" align="center" width="110px"></el-table-column>
          <el-table-column label="文件下载地址" prop="fileUrl" align="center" width="600px"></el-table-column>
          <el-table-column label="更新详情" prop="updateDetail" align="center"></el-table-column>
          <el-table-column label="更新类型" prop="nickname" align="center">
            <template slot-scope="scope">
              {{ scope.row.updateType === 1 ? "普通更新" : "强制更新" }}
            </template>
          </el-table-column>
          <el-table-column label="操作时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.updateTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="发布时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.versionUpdateTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-button type="primary" size="small" @click="handleEdit('edit', scope.row)">修改</el-button>
                </el-col>
                <el-col :span="6" class="common-margin">
                  <el-button type="primary" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      center
      custom-class="default-dialog"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px" :model="versionInfo" ref="versionInfo" :rules="rules">
        <el-form-item label="应用类型">
          <el-input :value="search.clientType === 1 ? 'IOS' : 'Android'" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <span v-if="isEdit">{{ versionInfo.version }}</span>
          <el-input v-else v-model="versionInfo.version" type="number"></el-input>
        </el-form-item>
        <el-form-item label="版本名" prop="versionName">
          <span v-if="isEdit">{{ versionInfo.versionName }}</span>
          <el-input v-else v-model="versionInfo.versionName"></el-input>
        </el-form-item>
        <el-form-item label="源文件" v-if="!isEdit" prop="fileUrl">
          <el-upload class="upload-demo" action="" :limit="1" :http-request="handleHttpRequest" ref="fileUpload">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="更新详情" prop="updateDetail">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="字符1000字以内，允许为空"
            maxlength="1000"
            v-model="versionInfo.updateDetail"
          ></el-input>
        </el-form-item>
        <el-form-item label="更新时间" prop="versionUpdateTime">
          <el-date-picker
            v-model="versionInfo.versionUpdateTime"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
            :disabled="isDisabled"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="更新类型" prop="updateType">
          <span v-if="isEdit">{{ versionInfo.updateType === 1 ? "普通更新" : "强制更新" }}</span>
          <el-select v-else v-model="versionInfo.updateType" placeholder="请选择">
            <el-option label="强制更新" :value="1"></el-option>
            <el-option label="普通更新" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleComfirm()">保 存</el-button>
      </span>
    </el-dialog>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="onChangeCommentPageHandle"
    ></pagination>
  </container>
</template>

<script>
import * as api from "@/api/download";
import {mapGetters} from "vuex";
import pagination from "@/components/pagination/index.vue";
import {formatDate} from "@/utils/mUtils";
import {upLoad} from "@/api/uploader";
export default {
  name: "searchWordMangerList",
  components: {
    pagination
  },
  data() {
    return {
      dialogVisible: false,
      search: {
        clientType: 1
      },
      tableList: [],
      versionInfo: {},
      fileList: [],
      isEdit: false,
      title: "",
      rules: {
        version: {required: true, message: "请输入版本号", trigger: "blur"},
        versionName: {required: true, message: "请输入版本名", trigger: "blur"},
        fileUrl: {required: true, message: "请上传文件", trigger: "blur"},
        updateDetail: {required: true, message: "请输入更新详情", trigger: "blur"},
        versionUpdateTime: {required: true, message: "请选择发布时间", trigger: "blur"},
        updateType: {required: true, message: "请选择更新类型", trigger: "blur"}
      },
      pagination: {
        index: 1,
        size: 12,
        total: 0
      }
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        if (this.$refs.fileUpload) {
          this.$refs.fileUpload.clearFiles();
        }
        this.versionInfo = {};
      }
    }
  },
  filters: {
    formatDate
  },
  created() {
    this.getDownloadList();
  },
  computed: {
    ...mapGetters(["userName", "userUid"]),
    isDisabled() {
      if (this.versionInfo) {
        if (this.versionInfo.versionUpdateTime < Number(new Date())) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  methods: {
    getDownloadList(index = 1) {
      this.pagination.index = index;
      this.search.index = this.pagination.index;
      this.search.size = this.pagination.size;
      api.getDownloadList(this.search).then(res => {
        this.tableList = res.data;
        this.pagination.total = res.total;
      });
    },
    handleHttpRequest(data) {
      let file = data.file;
      const isLt100M = file.size / 1024 / 1024 <= 100;
      if (!isLt100M) {
        this.$message.error("上传文件大小不能超过 100MB!");
        return;
      }
      let fileType = 4; //1是图片，2是音频，3是视频，4是文件
      upLoad
        .uploader(file, fileType, this.userUid)
        .then(res => {
          this.versionInfo.fileUrl = res.url;
        })
        .catch(res => {
          this.$message.error("上传失败");
        });
    },
    handleEdit(state, data = {}) {
      if (state === "add") {
        this.isEdit = false;
        this.title = "创建编辑";
      } else {
        this.isEdit = true;
        this.title = "修改详情";
      }
      this.dialogVisible = true;
      this.versionInfo = data;
    },
    handleDelete(id) {
      this.$messageBox
        .confirm("是否删除当前版本?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        })
        .then(() => {
          api.deleteAppVersion({id: id}).then(res => {
            this.$message.success("删除成功");
            this.getDownloadList();
          });
        })
        .catch(() => {});
    },
    handleComfirm() {
      this.$refs["versionInfo"].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            api
              .updateAppVersion({
                id: this.versionInfo.id,
                updateDetail: this.versionInfo.updateDetail,
                versionUpdateTime: this.versionInfo.versionUpdateTime,
                updator: this.userName
              })
              .then(res => {
                this.$message.success("修改成功~");
                this.dialogVisible = false;
                this.getDownloadList();
                this.isEdit = false;
              });
          } else {
            let params = {
              clientType: this.search.clientType,
              creator: this.userName,
              index: this.pagination.index,
              region: this.search.region,
              size: this.pagination.size
            };
            params = Object.assign(params, this.versionInfo);
            api.addAppVersion(params).then(res => {
              this.$message.success("创建成功~");
              this.dialogVisible = false;
              this.getDownloadList();
            });
          }
          this.isEdit = false;
        }
      });
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getDownloadList(this.pagination.index);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";
.download-manger-list-layer {
  .searchWordTableList {
    margin-top: 30px;
    width: 100%;
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid @gray-bg-color;
      thead {
        tr {
          background-color: @gray-bg-color;
          width: 216px;
          height: 50px;
          color: #5f666f;
          th {
            border: 1px solid @gray-bg-color;
          }
        }
      }
      tbody {
        td {
          width: 216px;
          height: 50px;
          border: 1px solid @gray-bg-color;
        }
      }
    }
  }
  .common-margin {
    margin-left: 10px;
  }
}
</style>
