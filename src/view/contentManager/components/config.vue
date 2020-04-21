<template>
  <el-dialog
    title="配置文章热度"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="handleClose"
    center
    custom-class="default-dialog"
    append-to-body
  >
    <el-form ref="form" :model="params" label-width="120px">
      <el-form-item label="文章ID">
        <span>{{ content.id }}</span>
      </el-form-item>
      <el-form-item label="文章标题">
        <span>{{ content.title }}</span>
      </el-form-item>
      <el-form-item label="用户昵称">
        <span>{{ content.nickname }}</span>
      </el-form-item>
      <el-form-item label="用户ID">
        <span>{{ content.uid }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="文章浏览数">
            <span>{{ content.viewCount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="虚假浏览数">
            <span>{{ content.additionalView }}+</span>
            <el-input v-model="params.viewCount" placeholder="请输入内容" size="small" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="文章点赞数">
            <span>{{ content.likeCount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="虚假点赞数">
            <span>{{ content.additionalLike }}+</span>
            <el-input v-model="params.likeCount" placeholder="请输入内容" size="small" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="当前荣誉值">
            <span>{{ content.honorValue }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="虚假荣誉值">
            <span>{{ content.additionalLike }}+</span>
            <el-input v-model="input" placeholder="请输入内容" size="small" type="number" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      params: {},
      input: ""
    };
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="less" scoped></style>
