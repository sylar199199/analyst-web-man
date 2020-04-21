<template>
  <container class="account-manger-list-layer" title="用户管理">
    <el-row class="menu">
      <el-col :span="24">
        地区:
        <el-select :value="region" @change="onAreaChange">
          <el-option
            v-for="item in getAreaList"
            :key="item.region"
            :label="item.regionName"
            :value="item.region"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="menu">
      <el-col :span="6">
        <div class="block">
          <el-date-picker
            v-model="datePickerTime"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :default-time="['24:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            @change="onChangeContentHandle"
          ></el-date-picker>
        </div>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="params.nameOrId"
          class="search-input"
          placeholder="用户ID/用户昵称"
          @keyup.native.enter="onChangeContentHandle"
        ></el-input>
      </el-col>
      <el-col :span="4">
        是否禁言:
        <el-select v-model="params.forbidden" @change="onChangeContentHandle">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
          <el-option label="禁言" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        是否推荐:
        <el-select v-model="params.recommend" @change="onChangeContentHandle">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="已推荐" :value="1"></el-option>
          <el-option label="未推荐" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-button size="small" type="default" @click="onChangeContentHandle">搜索</el-button>
    </el-row>
    <el-table :data="userList" border stripe class="table-border" align="center">
      <el-table-column label="用户ID" width="100px" prop="userId"></el-table-column>
      <el-table-column label="用户昵称" prop="nickname" width="120px"></el-table-column>
      <el-table-column label="头像" width="70px">
        <template slot-scope="scope">
          <el-avatar class="el-avatar-default head-pic fl" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="最近登录使用语言" width="140px" prop="localeName" />
      <el-table-column label="注册时间" width="160px">
        <template slot-scope="scope">
          {{ scope.row.registerTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column width="80px" label="注册来源">
        <template slot-scope="scope">
          {{ scope.row.sourceClient | clientStatusText }}
        </template>
      </el-table-column>
      <el-table-column width="260px" label="推荐得币种与技术分析标签">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag v-for="item in scope.row.tagsRec || []" :key="item.id" size="medium">
              {{ item.labelName }}
            </el-tag>
            <!-- <el-tag v-if="scope.row.mainCurrency && scope.row.mainCurrency !== 'null'" size="medium">
              {{ scope.row.mainCurrency }}
            </el-tag>
            <el-tag v-if="scope.row.mainTechnology && scope.row.mainTechnology !== 'null'" size="medium">
              {{ scope.row.mainTechnology }}
            </el-tag> -->
            <el-button
              @click.native="onHandleAddTags(scope.row.uid)"
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              plain
            ></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="80px" label="推荐状态">
        <template slot-scope="scope">
          {{ scope.row.recommendStatus === 1 ? "已推荐" : "未推荐" }}
        </template>
      </el-table-column>
      <el-table-column label="禁言状态">
        <template slot-scope="scope">
          <template v-if="scope.row.forbidden">
            <p>禁言处理账号：{{ scope.row.operator }}</p>
            <p>禁言处理时间：{{ scope.row.operateTime | formatDate }}</p>
            <p>禁言中：{{ scope.row.forbiddenTime | forbiddenTime }}</p>
          </template>
          <template v-else>
            正常
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onShowUserInfoDialog(scope.row.uid)">
            用户资料
          </el-button>
          <el-button type="primary" size="mini" @click="onShowConfigDialog(scope.row.uid)">
            配置
          </el-button>
          <el-button type="primary" size="mini" @click="onShowResetUserInfoDialog(scope.row)">
            重置用户资料
          </el-button>
          <el-button type="primary" size="mini" @click="getSimpleUserInfo(scope.row.uid)">
            关注管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-total="params.total"
      :page-index="params.index"
      :page-size="params.size"
      @onCurrentChange="onChangePaginationHandle"
    ></pagination>
    <!--用户资料灯箱-->
    <user-info-dialog
      :dialogVisible="userInfoDialogVisible"
      :userInfoDetail="userInfoDetail"
      @changeDialogVisible="onChangeUserInfoDialogVisibleHandle"
    ></user-info-dialog>
    <!--用户关注管理灯箱-->
    <attention-message-dialog
      v-if="attentionMessageDialogVisible"
      :dialogVisible="attentionMessageDialogVisible"
      :uid="currentUid"
      @changeDialogVisible="onChangeAttentionMessageDialogVisibleHandle"
    ></attention-message-dialog>
    <!-- 配置 -->
    <config-dialog
      :dialogVisible.sync="configDialog"
      @changeDialogVisible="onChangeConfigDialog"
      :uid="currentUid"
    ></config-dialog>
    <!-- 重置用户资料 -->
    <reset-user-info
      :dialogVisible.sync="resetUserInfoDialog"
      @changeDialogVisible="onChangeResetUserInfoDialog"
      :uid="currentUid"
      :userInfo="currentUserInfo"
    ></reset-user-info>
    <!-- 用户推荐标签 -->
    <recommendTagDialog
      v-if="tagsVisible"
      :tagVisible.sync="tagsVisible"
      :uid="currentUid"
      @updateListData="onUpdateListDate"
    ></recommendTagDialog>
  </container>
</template>

<script>
import * as api from "@/api/user";
import pagination from "@/components/pagination/index.vue";
import userInfoDialog from "./userInfoDialog";
import attentionMessageDialog from "./attentionMessageDialog";
import {formatDate} from "@/utils/mUtils";
import {clientStatusText, pickerOptions} from "@/utils/env";
import configDialog from "./configDialog";
import resetUserInfo from "./resetUserInfo";
import recommendTagDialog from "./recommendTagDialog";
import {mapGetters} from "vuex";
import * as types from "@/store/types";
export default {
  name: "accountMangerList",
  components: {
    pagination,
    userInfoDialog,
    attentionMessageDialog,
    configDialog,
    resetUserInfo,
    recommendTagDialog
  },
  data() {
    return {
      params: {
        registerStartTime: "",
        registerEndTime: "",
        forbidden: 0,
        recommend: 0,
        total: 0,
        index: 1,
        size: 10,
        region: ""
      },
      configDialog: false,
      resetUserInfoDialog: false,
      datePickerTime: "",
      userInfoDialogVisible: false,
      attentionMessageDialogVisible: false,
      pickerOptions,
      userList: [],
      userInfoDetail: {},
      simpleUserDetail: [],
      simplePagination: {
        size: 10,
        index: 1,
        total: 0
      },
      currentUid: 0,
      currentUserInfo: {},
      areaList: [],
      tagsVisible: false
    };
  },
  computed: {
    ...mapGetters(["getAreaList", "currentRegion"]),
    region() {
      if (this.currentRegion === this.oldRegionVal) return this.currentRegion;
      else return this.params.region;
      // return this.currentRegion || this.params.region;
    }
  },
  mounted() {
    this.getContentList();
    //this.getUserInfoDetail(1);
  },
  watch: {
    datePickerTime(val) {
      if (val) {
        this.params.registerEndTime = val[1];
        this.params.registerStartTime = val[0];
      } else {
        this.params.registerEndTime = "";
        this.params.registerStartTime = "";
      }
    },
    currentRegion(val, oldVal) {
      if (val && val == oldVal) {
        this.params.region = "";
      }
      this.oldRegionVal = oldVal;
    }
  },
  filters: {
    formatDate,
    clientStatusText(val) {
      return clientStatusText[val];
    },
    forbiddenTime(val) {
      return `${Math.floor(val / 60)}小时 ${val % 60}分钟`;
    }
  },
  methods: {
    onUpdateListDate() {
      this.getContentList();
    },
    // 添加推荐标签
    onHandleAddTags(uid) {
      this.currentUid = uid;
      this.tagsVisible = true;
    },
    onAreaChange(val) {
      this.params.region = val;
      this.onChangeContentHandle();
    },
    getContentList() {
      api.findUserList(this.params).then(res => {
        this.userList = res.data;
        this.params.total = res.total;
      });
    },
    getUserInfoDetail(uid) {
      api.findUserDetail({uid}).then(res => {
        this.userInfoDetail = res;
        this.userInfoDialogVisible = true;
      });
    },
    getSimpleUserInfo(uid) {
      this.currentUid = uid;
      this.attentionMessageDialogVisible = true;
    },
    onShowUserInfoDialog(uid) {
      this.getUserInfoDetail(uid);
    },
    onShowConfigDialog(uid) {
      this.currentUid = uid;
      this.configDialog = true;
    },
    onChangeConfigDialog() {
      this.configDialog = false;
      this.getContentList();
    },
    onShowResetUserInfoDialog(row) {
      this.currentUserInfo = {};
      api
        .findUserAuthentications({uid: row.uid})
        .then(res => {
          this.currentUid = row.uid;
          this.currentUserInfo = row;
          this.currentUserInfo.authentication = res.map(item => {
            item.isChecked = false;
            return item;
          });
          this.resetUserInfoDialog = true;
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    onChangeResetUserInfoDialog() {
      this.resetUserInfoDialog = false;
    },
    onChangeContentHandle() {
      this.params.index = 1;
      this.params.nameOrId && (this.params.nameOrId = this.params.nameOrId.trim());
      this.getContentList();
    },
    onChangePaginationHandle(page) {
      this.params.index = page;
      this.getContentList();
    },
    onChangeUserInfoDialogVisibleHandle(visible) {
      this.userInfoDialogVisible = visible;
    },
    onChangeAttentionMessageDialogVisibleHandle(visible) {
      this.attentionMessageDialogVisible = visible;
    }
  }
};
</script>

<style lang="less" scoped>
.account-manger-list-layer {
  .menu {
    margin: 0 0 20px;
    ::v-deep.search-input {
      width: 70%;
      margin: 0 10px 0 0;
    }
  }
}
.el-button--mini {
  padding: 6px 15px;
}
</style>
