<template>
  <el-dialog
    :visible="dialogVisible"
    custom-class="default-dialog"
    class="user-info-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    width="1000px"
    @close="onClickCloseHandle"
  >
    <el-row class="user-info-wrap">
      <el-col :span="6">
        <ul>
          <li>
            <p>用户ID</p>
            <p><el-input size="small" disabled :value="userInfoDetail.uid"></el-input></p>
          </li>
          <li>
            <span>用户昵称</span>
            <p><el-input size="small" disabled :value="userInfoDetail.nickname"></el-input></p>
          </li>
          <li>
            <span>手机号</span>
            <p><el-input size="small" disabled :value="userInfoDetail.phoneNumber"></el-input></p>
          </li>
          <li>
            <span>邮箱地址</span>
            <p><el-input size="small" disabled :value="userInfoDetail.email"></el-input></p>
          </li>
          <li>
            <span>性别</span>
            <p><el-input size="small" disabled :value="userSexText"></el-input></p>
          </li>
          <li>
            <span>账号所在榜单地区</span>
            <p><el-input size="small" disabled :value="userInfoDetail.region"></el-input></p>
          </li>
          <li>
            <span>用户类型</span>
            <p><el-input size="small" disabled :value="userTypeText"></el-input></p>
          </li>
          <li>
            <p>地点</p>
            <p><el-input size="small" disabled :value="userRegion"></el-input></p>
          </li>
          <li>
            <span>注册来源</span>
            <p><el-input size="small" disabled :value="userSourceClient"></el-input></p>
          </li>
        </ul>
      </el-col>
      <el-col :span="5">
        <ul>
          <li>
            <span>获赞数</span>
            <p><el-input size="small" disabled :value="userInfoDetail.realLikeCount"></el-input></p>
          </li>
          <li>
            <span>关注数</span>
            <p><el-input size="small" disabled :value="userInfoDetail.followCount"></el-input></p>
          </li>
          <li>
            <span>粉丝数</span>
            <p><el-input size="small" disabled :value="userInfoDetail.fansCount"></el-input></p>
          </li>
          <li>
            <span>浏览数</span>
            <p><el-input size="small" disabled :value="userInfoDetail.realViewCount"></el-input></p>
          </li>
          <li>
            <span>点评数</span>
            <p><el-input size="small" disabled :value="userInfoDetail.commentCountOther"></el-input></p>
          </li>
          <li>
            <span>点赞数-（点赞他人）</span>
            <p><el-input size="small" disabled :value="userInfoDetail.likeOtherCount"></el-input></p>
          </li>
          <li>
            <span>分享数</span>
            <p><el-input size="small" disabled :value="userInfoDetail.shareCount"></el-input></p>
          </li>
          <li>
            <span>评论数</span>
            <p><el-input size="small" disabled :value="userInfoDetail.commentCount"></el-input></p>
          </li>
          <li>
            <span>文章数</span>
            <p><el-input size="small" disabled :value="userInfoDetail.articleCount"></el-input></p>
          </li>
          <li>
            <span>荣誉值</span>
            <p><el-input size="small" disabled :value="userInfoDetail.honorValue"></el-input></p>
          </li>
        </ul>
      </el-col>
      <el-col class="person-info" :span="7">
        <div class="user-introduction">
          <span>个人简介</span>
          <p>
            <el-input
              size="small"
              type="textarea"
              resize="none"
              disabled
              :value="userInfoDetail.personalProfile || ''"
            ></el-input>
          </p>
        </div>
        <div class="transaction-related">
          <p>常用交易品种</p>
          <p>
            <span v-for="item in userInfoDetail.mostUseCurrency" :key="item.uids">
              <el-tag size="mini">{{ item.name }}</el-tag>
            </span>
          </p>
          <p>常用分析方法</p>
          <p>
            <span v-for="item in userInfoDetail.mostUseTags" :key="item.uids">
              <el-tag size="mini">{{ item.name }}</el-tag>
            </span>
          </p>
        </div>
        <el-row>
          <el-col class="person-information">
            <p>个人资料</p>
            <ul>
              <li>学历：{{ userInfoDetail.education | education }}</li>
              <li>职业：{{ userInfoDetail.career }}</li>
              <li>交易时间：{{ userInfoDetail.transactionTime | transactionTime }}</li>
              <li>生日：{{ userInfoDetail.birthday | formatDate("YYYY-MM-DD") }}</li>
              <li>
                链接:
                <a :href="personalUrl" target="_blank">{{ userInfoDetail.personalUrl }}</a>
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <user-info-avatar :user-info-detail="userInfoDetail"></user-info-avatar>
        <other-login :user-thirds="userInfoDetail.userThirds"></other-login>
        <user-info-honor :user-info-detail="userInfoDetail"></user-info-honor>
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
import otherLogin from "@/components/user/otherLogin";
import {sexText, userTypeText, clientStatusText, educationText, transactionTimeText} from "@/utils/env";
import {mapGetters} from "vuex";
import {formatDate} from "@/utils/mUtils";
export default {
  name: "userInfoDialog",
  props: {
    dialogVisible: {},
    userInfoDetail: {}
  },
  components: {
    userInfoAvatar,
    userInfoHonor,
    otherLogin
  },
  computed: {
    ...mapGetters(["getAreaList"]),
    userSexText() {
      if (this.userInfoDetail.sex) {
        return this.userInfoDetail.sex !== 3 ? sexText[this.userInfoDetail.sex] : this.userInfoDetail.customSex;
      }
      return "";
    },
    userTypeText() {
      if (this.userInfoDetail.userType) {
        return userTypeText[this.userInfoDetail.userType];
      }
      return "";
    },
    userRegion() {
      if (this.userInfoDetail.region) {
        return this.getAreaList.find(item => item.region === this.userInfoDetail.region).regionName;
      }
      return "";
    },
    userSourceClient() {
      if (this.userInfoDetail.sourceClient) {
        return clientStatusText[this.userInfoDetail.sourceClient];
      }
      return "";
    },
    personalUrl() {
      return `//${this.userInfoDetail.personalUrl}`;
    }
  },
  filters: {
    sexText,
    userTypeText,
    formatDate,
    education(val) {
      return educationText[val] || "";
    },
    transactionTime(val) {
      return transactionTimeText[val] || "";
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
  .el-dialog__body {
    padding: 15px;
  }
  ul {
    padding: 0 10px;
    li {
      margin: 0 0 10px;
      p {
        margin: 5px 0 0;
      }
    }
  }
  .person-info {
    .person-information {
      margin-top: 30px;
      ul {
        padding: 10px 20px;
        background-color: #f5f7fa;
      }
    }
    .user-introduction {
      margin: 0 0 20px;
    }
  }
  .transaction-related {
    padding: 10px 20px;
    background-color: #f5f7fa;
  }
}
</style>
