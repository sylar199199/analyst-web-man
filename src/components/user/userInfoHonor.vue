<template>
  <div class="user-info-honor-layer">
    <div class="item-vertify">
      <span>认证信息</span>
      <div v-for="(item, index) in userInfoDetail.userAuthentications" :key="index" class="content-wrap">
        <div class="item-name">
          <img src="@/assets/img/huidou.svg" class="icon vertical-align-middle" />
          <span class="vertify-name">{{ item.authenticateName }}</span>
          <p>{{ item.authenticateType | authenticateTypeText }}</p>
        </div>
      </div>
    </div>
    <div class="item-vertify">
      <span>获得徽章</span>
      <div v-if="userInfoDetail.userBadges && userInfoDetail.userBadges.length">
        <div v-for="(item, index) in userInfoDetail.userBadges" :key="index" class="content-wrap">
          <p class="item-name">
            <span class="vertify-name">{{ item.badgeName }}</span>
            <span class="vertify-name">({{ item.obtainTime | formatDate }})</span>
          </p>
        </div>
      </div>
      <div v-else>
        无
      </div>
    </div>
    <div class="item-vertify">
      <span>当前获得奖杯数</span>
      <div v-if="userInfoDetail.userTrophyTotals && userInfoDetail.userTrophyTotals.length">
        <div v-for="(item, index) in userInfoDetail.userTrophyTotals" :key="index" class="rank-item">
          <!-- <span>{{ item.trophyType | awardType }}</span> -->
          <span>{{ item.trophyType | trophy }}</span>
          <span class="count">{{ item.count }}</span>
        </div>
      </div>
      <div v-else>
        无
      </div>
    </div>
  </div>
</template>

<script>
import {authenticateTypeText, trophyTypeText} from "@/utils/env";
import {formatDate} from "@/utils/mUtils";
export default {
  name: "userInfoHonor",
  props: {
    userInfoDetail: {}
  },
  filters: {
    authenticateTypeText(val) {
      return authenticateTypeText[val];
    },
    trophy(val) {
      return trophyTypeText[val];
    },
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD");
    }
  }
};
</script>

<style lang="less" scoped>
.user-info-honor-layer {
  .item-vertify {
    margin-top: 20px;
    padding-left: 40px;
    line-height: 23px;
    &:first-child {
      margin-top: 0px;
    }
    &:last-child p {
      height: 100px;
    }
    p {
      color: #a9a9a9;
      padding: 5px 3px;
    }
    .content-wrap {
      .item-name {
        line-height: 30px;
        .modal-icon {
          font-size: 22px;
          color: orange;
        }
        .icon {
          width: 25px;
          height: 25px;
        }
      }
    }
    .rank-item {
      color: #a9a9a9;
      padding-top: 5px;
      .count {
        margin-left: 70px;
      }
      .total-count {
        margin-left: 43px;
      }
    }
  }
}
</style>
