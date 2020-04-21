<template>
  <container class="qualification-audit-manger-list-layer" title="认证资格审核管理">
    <el-row :gutter="20">
      <el-col :span="5">
        地区选择:
        <el-select v-model="search.region" placeholder="请选择">
          <el-option
            v-for="item in getAreaList"
            :key="item.region"
            :label="item.regionName"
            :value="item.region"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-date-picker v-model="search.applyStartTime" type="datetime" placeholder="请选择起始时间"></el-date-picker>
        <span>－</span>
        <el-date-picker v-model="search.applyEndTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.auditStatus">
          <el-option
            v-for="item in dealtStateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.applyType">
          <el-option
            v-for="item in applyTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getApplicationList()">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="default-table">
        <table>
          <thead>
            <tr>
              <th>用户信息</th>
              <th>申请类型</th>
              <th>申请时间</th>
              <th>申请资料</th>
              <th>资料图片</th>
              <th>处理账号</th>
              <th>处理时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-for="item in tableList" :key="item.name">
            <tr class="text-center">
              <td>{{ item.userId }} {{ item.nickname }}</td>
              <td>{{ item.applyType === 1 ? "学历认证" : "证书申请" }}</td>
              <td>{{ item.applyTime | formatDate }}</td>
              <td v-if="item.applyType === 1">
                <p>学历: {{ item.authenticationDataModel.education }}</p>
                <p>学校: {{ item.authenticationDataModel.school }}</p>
                <p>专业: {{ item.authenticationDataModel.major }}</p>
              </td>
              <td v-else>
                <p>证书名称: {{ item.authenticationDataModel.authenticationName }}</p>
                <p>证书获取时间: {{ item.authenticationDataModel.authenticationDate }}</p>
              </td>
              <td>
                <img :src="item.authenticateImg1" />
                <img :src="item.authenticateImg2" />
                <img :src="item.authenticateImg3" />
              </td>
              <td>{{ item.operator }}</td>
              <td>{{ item.operateTime | formatDate }}</td>
              <td>
                <el-row type="flex" justify="center">
                  <el-col>
                    <el-popover placement="bottom" width="100">
                      <div style="text-align: center;">
                        <el-row :style="{margin: '10px'}">
                          <el-button size="mini" type="primary" @click="handleAudit(item, 'byPass')">
                            通过
                          </el-button>
                        </el-row>
                        <el-row>
                          <el-button type="primary" size="mini" @click="handleAudit(item, 'reject')">驳回</el-button>
                        </el-row>
                      </div>
                      <el-button slot="reference" type="primary" size="small" :disabled="item.dealStatus !== 1">
                        {{ item.dealStatus === 1 ? "未审核" : item.dealType === 2 ? "审核通过" : "驳回" }}
                      </el-button>
                    </el-popover>
                  </el-col>
                </el-row>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" center>
      <el-form label-width="100px" :model="auditInfo" ref="auditInfo">
        <template v-if="isPass">
          <el-form-item label="用户昵称" prop="nickname">
            {{ auditInfo.nickname }}
          </el-form-item>
          <el-form-item label="用户ID" prop="uid">
            {{ auditInfo.uid }}
          </el-form-item>
          <el-form-item label="认证类型" prop="authenticationType">
            <el-select v-model="auditInfo.authenticationType">
              <el-option label="全部" :value="0"></el-option>
              <el-option label="学历认证" :value="1"></el-option>
              <el-option label="证书认证" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="认证描述" prop="authenticationName">
            <el-input v-model="auditInfo.authenticationName"></el-input>
          </el-form-item>
          <el-form-item label="" prop="noticeContent">
            <el-input
              type="textarea"
              v-model="auditInfo.noticeContent"
              placeholder="中文字符100以内，英文和其他字符200"
            ></el-input>
            <el-switch v-model="auditInfo.notice" active-text="通知用户"></el-switch>
          </el-form-item>
        </template>
        <template v-else>
          <el-input
            type="textarea"
            :rows="6"
            placeholder="自定义通知，中文字符100以内，英文和其他字符200"
            maxlength="200"
            v-model="auditInfo.noticeContent"
          ></el-input>
          <el-switch v-model="auditInfo.notice" active-text="通知用户"></el-switch>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAuditApply()">确 定</el-button>
      </span>
    </el-dialog>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="onChangeCommentPageHandle"
    ></pagination>
  </container>
</template>

<script>
import * as qulificationAuditAPI from "@/api/qualificationAudit";
import pagination from "@/components/pagination/index.vue";
import {formatDate} from "@/utils/mUtils";
import {mapGetters} from "vuex";
import {dealtStateList, applyTypeList} from "@/utils/env";
export default {
  name: "qualificationMangerList",
  components: {
    pagination
  },
  data() {
    return {
      dealtStateList: dealtStateList,
      applyTypeList: applyTypeList,
      dialogVisible: false,
      isPass: true,
      dialogTitle: "授予认证",
      search: {
        region: "CN",
        applyStartTime: null,
        applyEndTime: null,
        applyType: 0,
        auditStatus: 0
      },
      tableList: [],
      auditInfo: {
        authenticationId: 0,
        authenticationName: "",
        authenticationType: 1,
        dealType: 1,
        id: 0,
        notice: false,
        noticeContent: "",
        region: "CN",
        uid: 0,
        verifier: "",
        nickname: ""
      },
      fileList: [],
      isEdit: false,
      pagination: {
        index: 1,
        size: 20,
        total: 0
      }
    };
  },
  filters: {
    formatDate
  },
  created() {
    this.getApplicationList();
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.$refs["auditInfo"].resetFields();
      }
    }
  },
  computed: {
    ...mapGetters(["getAreaList", "userName"])
  },
  methods: {
    getApplicationList() {
      this.search.index = this.pagination.index;
      this.search.size = this.pagination.size;
      if (this.search.applyStartTime) {
        this.search.applyStartTime = new Date(this.search.applyStartTime).getTime();
      }
      if (this.search.applyEndTime) {
        this.search.applyEndTime = new Date(this.search.applyEndTime).getTime();
      }
      qulificationAuditAPI.getApplicationList(this.search).then(res => {
        this.tableList = res.data;
        this.pagination.total = res.total;
      });
    },
    handleAudit(data, status) {
      this.auditInfo.nickname = data.nickname;
      this.auditInfo.uid = data.uid;
      this.auditInfo.id = data.id;
      this.auditInfo.verifier = this.userName;
      if (status === "byPass") {
        this.auditInfo.dealType = 2; //审核通过;
        this.dialogTitle = "授予认证";
      } else {
        this.isPass = false;
        this.auditInfo.dealType = 3; //驳回
        this.dialogTitle = "驳回通知";
      }
      this.dialogVisible = true;
    },
    handleAuditApply() {
      qulificationAuditAPI
        .putApplicationAudit(this.auditInfo)
        .then(res => {
          this.dialogVisible = false;
          this.getApplicationList();
        })
        .catch(res => {
          this.$message.error("操作失败");
        });
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getApplicationList();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";
.qualification-audit-manger-list-layer {
  .qualificationTableList {
    margin-top: 30px;
    width: 100%;
    .margin-normal {
      margin: 10px;
    }
  }
}
</style>
