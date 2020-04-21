<template>
  <el-button type="primary" size="small" @click="handleChoose()" :disabled="isChoosed">
    {{ isChoosed ? "已选择" : "选择" }}
  </el-button>
</template>
<script>
export default {
  props: {
    currentItem: {},
    chooseItems: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    isChoosed() {
      let isChoosed = false;
      this.chooseItems.forEach(item => {
        if (item.id === this.currentItem.id) {
          isChoosed = true;
        }
      });
      return isChoosed;
    }
  },
  methods: {
    handleChoose() {
      this.$emit("handleChooseButton", this.currentItem);
    }
  }
};
</script>
<style lang="less" scoped></style>
