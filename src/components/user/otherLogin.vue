<template>
  <el-row class="userThirds-layer">
    <el-col :span="6" v-for="(item, index) in userThirds" :key="index" class="font-size">
      <icon-svg icon-class="qq" v-if="item.platType === 1" />
      <icon-svg icon-class="wechat" v-if="item.platType === 2" />
      <icon-svg icon-class="weibo" v-if="item.platType === 3" />
      <icon-svg icon-class="facebook" v-if="item.platType === 4" />
      <icon-svg icon-class="line" v-if="item.platType === 5" />
      <icon-svg icon-class="google" v-if="item.platType === 6" />
      <icon-svg icon-class="huiliao" v-if="item.platType === 7" />
      <icon-svg icon-class="twitter" v-if="item.platType === 8" />
      <icon-svg icon-class="telegram" v-if="item.platType === 9" />
      <icon-svg icon-class="Linkedin" v-if="item.platType === 10" />
      <icon-svg icon-class="whatsapp" v-if="item.platType === 11" />
      <icon-svg icon-class="apple" v-if="item.platType === 12" />
      <p class="font-size-mini">已绑定</p>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "otherLogin",
  props: {
    userThirds: {}
  }
};
</script>

<style scoped>
.userThirds-layer {
  padding-left: 20px;
}
.font-size {
  font-size: 24px;
}
.font-size-mini {
  font-size: 12px;
}
</style>
