<template>
  <div>
    <el-form-item label="通知用户">
      <el-switch
        v-model="formNotice"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="changeNotice"
      ></el-switch>
    </el-form-item>
    <el-form-item label="通知语言">
      <el-select v-model="formLocale" placeholder="请选择" @chang="changeLocale">
        <el-option
          v-for="item in getLangList"
          :key="item.locale"
          :label="item.localeName"
          :value="item.locale"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="通知模板">
      <el-button type="primary" size="small">选择</el-button>
      <el-input
        type="noticeContent"
        :rows="2"
        @input="changeNoticeContent"
        placeholder="请输入内容"
        v-model="formNoticeContent"
        v-if="noticeContent"
      ></el-input>
    </el-form-item>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
export default {
  props: {
    notice: {
      type: Boolean,
      default: false
    },
    locale: {
      type: String,
      default: "zh_CN"
    },
    noticeContent: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      formLocale: this.locale,
      formNotice: this.notice,
      formNoticeContent: this.noticeContent
    };
  },
  computed: {
    ...mapGetters(["getLangList"])
  },
  methods: {
    changeNotice() {
      this.$emit("update:notice", this.formnotice);
    },
    changeLocale() {
      this.$emit("update:locale", this.formLocale);
    },
    changeNoticeContent() {
      this.$emit("update:noticeContent", this.formNoticeContent);
    }
  }
};
</script>
<style lang="less" scoped></style>
