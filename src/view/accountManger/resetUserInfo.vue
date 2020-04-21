<template>
  <el-dialog
    title="重置用户信息"
    :visible="dialogVisible"
    width="900px"
    :before-close="handleClose"
    center
    :close-on-click-modal="false"
    append-to-body
    custom-class="default-dialog"
  >
    <div>
      <ul>
        <li>
          <el-row>
            <el-col :span="12">
              <el-col :span="4">
                <span>用户昵称</span>
              </el-col>
              <el-input size="small" disabled :value="userInfo.nickname" class="common-width"></el-input>
              <el-checkbox v-model="resetInfo.nickname"></el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-col :span="4">
                <span>用户ID</span>
              </el-col>
              <el-input size="small" disabled :value="userInfo.userId" class="common-width"></el-input>
              <el-checkbox v-model="resetInfo.userId"></el-checkbox>
            </el-col>
          </el-row>
        </li>
        <li>
          <el-col :span="2">
            <span>用户头像</span>
          </el-col>
          <el-avatar :size="50" :src="userInfo.avatar" class="vertical-align-middle"></el-avatar>
          <el-checkbox v-model="resetInfo.avatar"></el-checkbox>
        </li>
        <li>
          <el-row>
            <el-col :span="2">
              <span>认证:</span>
            </el-col>
            <el-col class="other-width">
              <div v-for="(item, index) in userInfo.authentication" :key="index" class=" gray-bg">
                <el-input size="small" disabled :value="item.authenticateName" class="mini-margin"></el-input>
                <el-checkbox :checked="item.isChecked" @change="changeCheckedItem(item)"></el-checkbox>
              </div>
            </el-col>
          </el-row>
        </li>
        <li>
          <el-col :span="2">
            <span>背景图</span>
          </el-col>
          <img :src="userInfo.bgImg" class="other-width" />
          <el-checkbox v-model="resetInfo.bgImage"></el-checkbox>
        </li>
        <li>
          <el-col :span="2">
            <span>个人简介</span>
          </el-col>
          <el-input
            size="small"
            type="textarea"
            :rows="6"
            disabled
            :value="userInfo.personalProfile"
            class="other-width"
          ></el-input>
          <el-checkbox v-model="resetInfo.personalProfile"></el-checkbox>
        </li>
        <li>
          <el-row>
            <el-form>
              <notice-templete
                :notice.sync="resetInfo.notice"
                :noticeContent.sync="resetInfo.noticeContent"
                :locale.sync="resetInfo.locale"
              ></notice-templete>
            </el-form>
          </el-row>
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="handleConfrim()">重置信息</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from "@/api/user";
import noticeTemplete from "@/components/noticeTemplete";
import {mapGetters} from "vuex";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    uid: {
      Type: Number,
      default: 0
    },
    userInfo: {}
  },
  components: {
    noticeTemplete
  },
  data() {
    return {
      resetInfo: {
        locale: "",
        avatar: false,
        bgImage: false,
        authenticationList: [],
        nickname: false,
        notice: false,
        noticeContent: "",
        personalProfile: false,
        userId: false
      }
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.resetInfo = {
          avatar: false,
          bgImage: false,
          authenticationList: [],
          nickname: false,
          notice: false,
          noticeContent: "",
          personalProfile: false,
          userId: false
        };
      }
    }
  },
  computed: {
    ...mapGetters(["name"]),
    authenticationIds() {
      let authenticationIds = [];
      this.userInfo.authentication.forEach(item => {
        if (item.isChecked) {
          authenticationIds.push(item.id);
        }
      });
      return authenticationIds;
    }
  },
  methods: {
    changeCheckedItem(item) {
      item.isChecked = !item.isChecked;
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleConfrim() {
      this.resetInfo.authenticationList = this.authenticationIds;
      debugger;
      this.resetInfo.uid = this.userInfo.uid;
      api
        .resetUserInfo(this.resetInfo)
        .then(res => {
          this.$message.success("重置成功~");
          this.$emit("changeDialogVisible");
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    }
  }
};
</script>
<style lang="less" scoped>
ul {
  padding: 0 20px;
  li {
    margin: 0 0 20px;
  }
}
.common-width {
  width: 300px;
}
.other-width {
  width: 80%;
}
</style>
