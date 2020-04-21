<template>
  <container class="guide-page-manger-layer" title="引导页管理">
    <el-row class="menu" :gutter="20">
      <el-col :span="4">
        版本选择：
        <el-select v-model="filters.versionName" size="small" @change="onClickChangeVersionHandle">
          <el-option
            v-for="(item, index) in versionList"
            :key="index"
            :label="item.versionName"
            :value="item.versionName"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 图片 -->
    <el-upload
      action=""
      list-type="picture-card"
      :limit="6"
      :on-exceed="onClickExceedHandle"
      :show-file-list="false"
      :file-list="fileList"
      :http-request="fileUpload"
      v-if="imgDisabled || commonDisabled"
    >
      <el-button type="primary" class="img-upload-btn">上传引导页</el-button>
    </el-upload>
    <el-button type="primary" class="btn" v-else @click="onClickTipShowHandle">上传引导页</el-button>
    <el-row :gutter="20" class="img-wrap">
      <draggable v-model="fileList" @change="removeHandle" :options="dragOptions">
        <el-col :span="6" v-for="(item, index) in fileList" :key="index" class="img-item">
          <div class="cover-mask pointer">
            <transition-group tag="div">
              <img :src="item.sourceUrl" width="300" height="200" class="pointer" :key="index" />
              <i class="el-icon-close delete-icon" :key="item.region" @click="deletePic(item)"></i>
            </transition-group>
          </div>
        </el-col>
      </draggable>
    </el-row>
    <!-- 视频 -->
    <el-row>
      <el-upload
        action=""
        :limit="1"
        :file-list="maxCount"
        :on-exceed="onClickVideoExceedHandle"
        :http-request="onClickUploadVedioHandle"
        :show-file-list="false"
        v-if="videoDisabled || commonDisabled"
      >
        <el-button type="primary" class="btn">上传视频</el-button>
      </el-upload>
      <el-button type="primary" class="btn" v-else @click="onClickTipShowHandle">上传视频</el-button>
      <div class="video-wrap" v-if="videoData.sourceUrl">
        <video class="video-card" :src="videoData.sourceUrl" controls></video>
        <i class="el-icon-close delete-icon pointer" @click="deleteVedio"></i>
      </div>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </container>
</template>
<script>
import draggable from "vuedraggable";
import * as api from "@/api/guidePageManger";
import * as uploadApi from "@/api/uploader";
import {mapGetters} from "vuex";
export default {
  name: "technicalManger",
  components: {
    draggable
  },
  data() {
    return {
      filters: {
        versionName: "",
        region: ""
      },
      versionList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      maxCount: [],
      videoData: {},
      dragOptions: {
        animation: 120,
        scroll: true,
        group: "",
        ghostClass: "ghost-style"
      }
    };
  },
  computed: {
    ...mapGetters(["userUid"]),
    imgDisabled() {
      return this.videoData.sourceUrl === undefined;
    },
    videoDisabled() {
      return this.fileList.length === 0;
    },
    commonDisabled() {
      return this.videoData.sourceUrl === undefined && this.fileList.length === 0;
    }
  },
  created() {
    this.getGuidePage();
    this.getVersionList();
  },
  methods: {
    getGuidePage(val) {
      api
        .getSearchGuidePage({
          version: val || this.filters.versionName
        })
        .then(res => {
          if (res.data.length) {
            if (res.data[0].type === 1) {
              this.fileList = res.data;
            } else {
              this.videoData = res.data[0];
              this.maxCount = res.data;
            }
            this.filters.versionName = res.data[0].version;
          } else {
            this.fileList = [];
            this.videoData = {};
          }
        });
    },

    //获取版本信息列表
    getVersionList() {
      api.getVersionList().then(res => {
        this.versionList = res;
      });
    },

    //切换版本
    onClickChangeVersionHandle(val) {
      this.getGuidePage(val);
    },

    //删除引导页
    deletePic(item) {
      this.$messageBox
        .confirm("你确定要删除此引导页吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          api
            .deleteGuidePage({
              id: item.id,
              type: "1"
            })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getGuidePage();
            })
            .catch(err => {
              this.$message({
                message: "删除成功",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },

    // 上传图片
    fileUpload(event) {
      let file = event.file;
      let fileType = 1; //图片2，音频2，视频3，文件4
      uploadApi.upLoad
        .uploader(file, fileType, this.userUid)
        .then(res => {
          this.fileList.push({
            sourceUrl: res.url,
            id: ""
          });
          this.addPhotoGuidePage(true);
        })
        .catch(err => {});
    },

    //保存图片信息
    addPhotoGuidePage(val) {
      let arr = this.fileList.map((item, index) => {
        let ele = {
          id: item.id,
          order: index + 1,
          sourceUrl: item.sourceUrl
        };
        return ele;
      });
      let param = {
        imgList: arr,
        version: this.filters.versionName
      };
      api
        .addPhotoGuidePage(param)
        .then(res => {
          if (val) {
            this.$message({
              message: "上传成功",
              type: "success"
            });
          }
          this.getGuidePage();
        })
        .catch(err => {
          if (val) {
            this.$message({
              message: "上传失败",
              type: "error"
            });
          }
        });
    },

    //图片超出数量限制
    onClickExceedHandle(files, fileList) {
      this.$message({
        message: "最多上传6张图片",
        type: "warning"
      });
    },

    // 拖拽
    removeHandle() {
      this.addPhotoGuidePage(false);
    },

    //上传视频
    onClickUploadVedioHandle(event) {
      let file = event.file;
      let fileType = 3; //图片2，音频2，视频3，文件4
      uploadApi.upLoad
        .uploader(file, fileType, this.userUid)
        .then(res => {
          this.addVideoGuidePage(res.url);
        })
        .catch(err => {});
    },

    // 保存视频信息
    addVideoGuidePage(val) {
      let param = {
        sourceUrl: val,
        version: this.filters.versionName
      };
      api
        .addVideoGuidePage(param)
        .then(res => {
          this.$message({
            message: "上传成功",
            type: "success"
          });
          this.getGuidePage();
        })
        .catch(err => {
          this.$message({
            message: "上传失败",
            type: "error"
          });
        });
    },

    //删除视频
    deleteVedio() {
      this.$messageBox
        .confirm("你确定要删除此视频吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          api
            .deleteGuidePage({
              id: this.videoData.id,
              type: "2"
            })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getGuidePage();
            })
            .catch(err => {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },

    // 超出数量限制
    onClickVideoExceedHandle() {
      this.$message({
        message: "最多上传一个视频",
        type: "warning"
      });
    },

    onClickTipShowHandle(type) {
      this.$message({
        message: "图片和视频只能选择一种",
        type: "warning"
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables.less";
.guide-page-manger-layer {
  ::v-deep .el-upload--picture-card {
    position: absolute;
    top: 100px;
    border: none;
    background-color: transparent;
  }

  .img-upload-btn {
    margin-top: 50px;
  }

  .img-wrap {
    width: 100%;
    margin-top: 100px;

    .img-item {
      text-align: center;
      margin-top: 30px;
      position: relative;

      .cover-mask {
        z-index: 33;
        width: 300px;
        height: 200px;
        margin: 0 auto;

        .delete-icon {
          position: absolute;
          color: @global-default4;
          top: 50%;
          left: 50%;
          color: transparent;
        }
        &:hover {
          background: rgba(0, 0, 0, 0.5);

          img {
            position: relative;
            z-index: -66;
          }
          .delete-icon {
            color: white;
          }
        }
      }
    }
  }

  .video-wrap {
    position: relative;
    width: 300px;
    height: 150px;
    margin-top: 50px;
    .video-card {
      width: 300px;
      height: 150px;
    }
    .delete-icon {
      position: absolute;
      color: @global-default4;
      top: 0;
      right: 0;
      color: #ccc;
      z-index: 100;
    }
  }

  .btn {
    margin-top: 90px;
  }
}
</style>
