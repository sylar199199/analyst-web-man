<template>
  <container class="help-center-list-layer" title="换榜审核管理">
    <el-row class="menu">
      <el-col :span="4">
        地区选择:
        <el-select v-model="filters.region" size="small" placeholder="请选择" @change="handleChangeRegion">
          <el-option
            v-for="item in getAreaList"
            :key="item.region"
            :label="item.regionName"
            :value="item.region"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="filters.certifyTime"
          type="datetimerange"
          size="small"
          range-separator="-"
          start-placeholder="请选择起始时间"
          end-placeholder="请选择结束时间"
        ></el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-select v-model="filters.state" size="small" @change="handleChangeState">
          <el-option
            v-for="(item, index) in stateList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button size="small" type="primary" @click="getTableList()">搜索</el-button>
      </el-col>
    </el-row>
    <el-row class="menu">
      <el-table :data="tableList" border stripe class="table-border" @row-click="lookUserInfoDetail">
        <el-table-column label="用户信息" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.userId }}</p>
            <p>{{ scope.row.nickname }}</p>
          </template>
        </el-table-column>
        <el-table-column label="用户注册时间" prop="registerTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.registerTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原榜单地区" prop="sourceRegion" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sourceRegion | regionList }}</span>
          </template>
        </el-table-column>
        <el-table-column label="首次提交申请时间" prop="applyTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.applyTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提交申请次数" prop="applyCount" align="center"></el-table-column>
        <el-table-column label="申请换榜原因" prop="reason" align="center"></el-table-column>
        <el-table-column label="申请进入的榜单地区" prop="targetRegion" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.targetRegion | regionList }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理时间" prop="operateTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.operateTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理账号" prop="operator" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.auditStatus === 1">
              <el-button size="small" type="success" @click.stop="onClickAgreeHandle(scope.row)">通过</el-button>
              <el-button size="small" type="danger" @click.stop="onClickTurnDownHandle(scope.row)">驳回</el-button>
            </template>
            <template v-if="scope.row.auditStatus === 2">
              <el-button size="small" type="success" disabled>已通过</el-button>
            </template>
            <template v-if="scope.row.auditStatus === 3">
              <el-button size="small" type="danger" disabled>已驳回</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="paginationChangeHandle"
    ></pagination>
    <!-- 用户信息 -->
    <user-info-dialog
      :dialogVisible="userInfoDialogVisible"
      :detailType="1"
      :userInfoDetail="userInfoDetail"
      @changeDialogVisible="onChangeDialogVisibleHandle"
    ></user-info-dialog>
    <!-- 通过/驳回 -->
    <notice-user-dialog
      :dialogVisible="noticeUserDialogVisible"
      :title="dialogTitle"
      :noticeFormData="noticeFormData"
      @onClickSubmitHandle="onSubmitNoticeFormDataHandle"
      @changeDialogVisible="onClickDialogVisibleHandle"
    ></notice-user-dialog>
  </container>
</template>
<script>
import * as api from "@/api/helpCenter";
import * as commonApi from "@/api/common";
import * as userApi from "@/api/reportManger";
import pagination from "@/components/pagination/index.vue";
import {formatDate} from "@/utils/mUtils";
import userInfoDialog from "../../components/userInfoDialog";
import noticeUserDialog from "../../components/noticeUserDialog";
import {dealtStateList, regionList} from "@/utils/env";
import {mapGetters} from "vuex";
import * as types from "@/store/types";
export default {
  name: "helpCenter",
  components: {
    pagination,
    userInfoDialog,
    noticeUserDialog
  },
  data() {
    return {
      tableList: [],
      filters: {
        region: "CN",
        certifyTime: "",
        state: 0
      },
      stateList: dealtStateList,
      noticeUserDialogVisible: false,
      userInfoDialogVisible: false, //用户信息
      noticeFormData: {
        noticeContent: "",
        isNotice: false
      },
      pagination: {
        total: 0,
        index: 1,
        size: 20
      },
      userInfoDetail: {}, //用户信息
      dialogTitle: "", //驳回/通过
      userMsg: {}
    };
  },
  filters: {
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD HH:mm:ss");
    },
    regionList(region) {
      return regionList[region];
    }
  },
  computed: {
    ...mapGetters(["userName", "getAreaList", "currentLanguage"])
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList(val) {
      let param = {
        region: this.filters.region,
        applyTimeEnd: this.filters.certifyTime ? formatDate(this.filters.certifyTime[1]) : "",
        applyTimeStart: this.filters.certifyTime ? formatDate(this.filters.certifyTime[0]) : "",
        auditStatus: val || this.filters.state,
        index: this.pagination.index,
        size: this.pagination.size
      };
      api.getRankRegionList(param).then(res => {
        this.tableList = res.data.map(item => {
          item.visible = false;
          return item;
        });
        console.log("表格数据", this.tableList);
        this.pagination.total = res.total;
      });
    },
    // 切换地区
    handleChangeRegion(val) {
      console.log(val);
      this.filters.region = val;
      this.getTableList();
    },
    //切换状态
    handleChangeState(val) {
      this.getTableList(val);
    },
    // 查看详情
    lookUserInfoDetail(row) {
      userApi.getUserDetail({uid: row.uid}).then(res => {
        this.userInfoDetail = res;
      });
      this.userInfoDialogVisible = true;
    },
    //查看用户信息
    onChangeDialogVisibleHandle(visible) {
      this.userInfoDialogVisible = visible;
    },
    //通知/驳回
    onClickDialogVisibleHandle(visible) {
      this.noticeUserDialogVisible = visible;
      if (!visible) {
        this.noticeFormData = {
          noticeContent: "",
          isNotice: false
        };
      }
    },
    //通过
    onClickAgreeHandle(row) {
      console.log("通过", row);
      this.dialogTitle = "是否确定通过换榜申请";
      this.userMsg = {dealType: 2, id: row.id, uid: row.uid, targetRegion: row.targetRegion};
      this.onClickDialogVisibleHandle(true);
    },
    //驳回
    onClickTurnDownHandle(row) {
      this.dialogTitle = "是否确定通过驳回申请";
      this.userMsg = {dealType: 3, id: row.id};
      this.onClickDialogVisibleHandle(true);
    },
    //提交数据 通知/驳回
    onSubmitNoticeFormDataHandle() {
      let param = {
        dealType: this.userMsg.dealType, //全部0 审核通过2 驳回3
        id: this.userMsg.id,
        notice: this.noticeFormData.isNotice,
        noticeContent: this.noticeFormData.noticeContent,
        operator: this.userName,
        targetRegion: this.userMsg.targetRegion, // 换榜目标地区
        uid: this.userMsg.uid
      };
      api
        .dealRankRegion(param)
        .then(res => {
          this.$message({
            message: "换榜申请处理成功",
            type: "success"
          });
          this.onClickDialogVisibleHandle(false);
          this.getTableList();
        })
        .catch(err => {
          this.$message({
            message: "换榜申请处理失败",
            type: "error"
          });
        });
    },
    // 分页
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getTableList();
    }
  }
};
</script>
<style lang="less" scoped>
.help-center-list-layer {
  .menu {
    margin-top: 30px;
    span {
      margin-right: 20px;
    }

    .popover-tip {
      margin-left: 27px;
    }
  }

  .input-bar {
    margin-bottom: 20px;
  }

  .notice {
    margin-right: 20px;
  }
}
</style>
