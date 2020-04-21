<template>
  <div class="user-info-avatar-layer">
    <div class="item-avatar">
      <span>头像</span>
      <div class="icon">
        <el-avatar :size="50" :src="userInfoDetail.avatar"></el-avatar>
      </div>
      <el-image class="bg-image" :src="userInfoDetail.bgImg" fit="fit" v-if="userInfoDetail.bgImg"></el-image>
      <div class="bg-image bg" v-else></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userInfoAvatar",
  props: {
    userInfoDetail: {}
  }
};
</script>

<style lang="less" scoped>
.user-info-avatar-layer {
  .item-avatar {
    padding-left: 20px;
    color: #a9a9a9;

    .icon {
      margin: 15px 0 25px 0;
    }

    .bg-image {
      width: 220px;
      height: 120px;
    }
    .bg {
      background: #f5f7fa;
    }
  }
}
</style>
