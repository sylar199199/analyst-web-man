<template>
  <el-dialog
    title="编辑详情页"
    :visible="dialogVisible"
    width="500px"
    class="notice-detail-dialog-layer"
    :close-on-click-modal="false"
    @close="handleCloseDialog"
  >
    <el-form :model="data" :rules="rule">
      <el-form-item label="标题" prop="title">
        <el-input v-model="data.title"></el-input>
      </el-form-item>
      <el-form-item label="内容描述" prop="content">
        <el-input v-model="data.content"></el-input>
      </el-form-item>
      <el-form-item label="添加链接">
        <el-input v-model="data.linkURL"></el-input>
      </el-form-item>
      <el-form-item label="" class="img-item">
        <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="fileUpload">
          <img v-if="data.imgURL" :src="data.imgURL" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <p>150*150</p>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">取 消</el-button>
      <el-button type="primary" @click="handleSubmitEditData">保存并关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import messages from "../../../lang/cn";
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
    return {
      rule: {
        title: [
          {required: true, message: "请输入标题", trigger: "blur"},
          {min: 1, max: 20, message: "标题不超过20个字符", trigger: "blur"}
        ],
        content: [
          {required: true, message: "请输入内容描述", trigger: "blur"},
          {min: 1, max: 100, message: "标题不超过100个字符", trigger: "blur"}
        ]
      }
    };
  },
  methods: {
    handleCloseDialog() {
      this.$emit("changeDialogVisible", false);
    },
    handleSubmitEditData() {
      this.$emit("submitData");
    },
    fileUpload(event) {
      this.$emit("fileUpload", event, 2);
    }
  }
};
</script>
<style lang="less" scoped>
.notice-detail-dialog-layer {
  .notice-item {
    margin: 0 0 20px;

    p {
      margin-top: 8px;
    }
  }
  img {
    width: 360px;
    height: 200px;
  }
}
</style>
