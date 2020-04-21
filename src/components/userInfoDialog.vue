<template>
  <el-dialog
    :visible="dialogVisible"
    class="user-info-dialog"
    :close-on-click-modal="false"
    width="950px"
    @close="onClickCloseHandle"
  >
    <el-row class="user-info-wrap">
      <el-col :span="9">
        <div class="item-info">
          <span>用户ID</span>
          <p>{{ userInfoDetail.userId }}</p>
        </div>
        <div class="item-info">
          <span>用户昵称</span>
          <p>{{ userInfoDetail.nickname }}</p>
        </div>
        <div class="item-info">
          <span>账号所在榜单地区</span>
          <p>{{ userInfoDetail.rankRegion }}</p>
        </div>
        <div class="item-info">
          <span>个人简介</span>
          <p>{{ userInfoDetail.personalProfile }}</p>
        </div>
      </el-col>
      <el-col :span="7">
        <user-info-honor :user-info-detail="userInfoDetail"></user-info-honor>
      </el-col>
      <el-col :span="8">
        <user-info-avatar :user-info-detail="userInfoDetail"></user-info-avatar>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClickCloseHandle">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import userInfoAvatar from "@/components/user/userInfoAvatar";
import userInfoHonor from "@/components/user/userInfoHonor";
const awardType = {
  1: "日榜",
  2: "周榜",
  3: "月榜",
  4: "总榜冠军"
};
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    userInfoDetail: Object
  },
  components: {
    userInfoAvatar,
    userInfoHonor
  },
  filters: {
    awardType(type) {
      return awardType[type];
    }
  },
  methods: {
    onClickCloseHandle() {
      this.$emit("changeDialogVisible", false);
    }
  }
};
</script>
<style lang="less" scoped>
.user-info-dialog {
  .user-info-wrap {
    .item-info {
      margin-top: 30px;
      &:first-child {
        margin-top: 0px;
      }
      &:last-child p {
        height: 100px;
      }

      p {
        padding: 8px 3px;
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
