<template>
  <container class="feedback-manger-list-layer" title="反馈管理">
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
        <el-date-picker
          v-model="datePickerTime"
          size="small"
          type="datetimerange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions"
        />
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.userIdOrName" placeholder="用户ID/用户昵称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.dealStatus">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="已处理" :value="2"></el-option>
          <el-option label="未处理" :value="1"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getfeedbakList()">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="default-table">
        <el-table :data="tableList" border stripe class="table-border" fit @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" align="center" :selectable="handleSelectable"></el-table-column>
          <el-table-column label="反馈用户" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }} {{ scope.row.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户联系方式" prop="id" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.phoneNumber }}</p>
              <p>{{ scope.row.email }}</p>
            </template>
          </el-table-column>
          <el-table-column label="用户当前系统语言" prop="localeName" align="center">
            <template slot-scope="scope">
              {{ scope.row.localeName }}
            </template>
          </el-table-column>
          <el-table-column label="反馈时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.feedBackTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="反馈内容" prop="content" align="center"></el-table-column>
          <el-table-column label="处理时间" align="center" :formatter="onFormatterData">
            <!-- <template slot-scope="scope">
              {{ scope.row.operateTime | formatDate }}
            </template> -->
          </el-table-column>
          <el-table-column label="处理账号" prop="operator" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-col :span="12">
                <el-button
                  type="primary"
                  size="mini"
                  @click="dealFeedBack(pagination.index, scope.row.id)"
                  :disabled="scope.row.dealStatus === 2"
                >
                  {{ scope.row.dealStatus === 1 ? "未处理" : "已处理" }}
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="mini" @click="handleEdit(scope.row.uid)">通知</el-button>
              </el-col>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-dialog
      title="反馈消息回复"
      :visible.sync="dialogVisible"
      width="30%"
      center
      close-on-click-modal
      custom-class="default-dialog"
    >
      <el-form label-width="100px">
        <el-form-item label="系统消息">
          <el-input
            type="textarea"
            :rows="5"
            :maxlength="limitEnterNumber"
            v-model="noticeContent"
            placeholder="自定义内容，中文字符100以内，英文和其他字符200"
          ></el-input>
        </el-form-item>
        <notice-templete
          :notice.sync="noticeData.notice"
          :noticeContent.sync="noticeData.noticeContent"
          :locale.sync="noticeData.locale"
        ></notice-templete>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </span>
    </el-dialog>
    <el-row>
      <el-button type="primary" class="deal-batchs" @click="dealFeedBack(pagination.index)">批量处理</el-button>
      <pagination
        :page-total="pagination.total"
        :page-index="pagination.index"
        :page-size="pagination.size"
        @onCurrentChange="onChangeCommentPageHandle"
      ></pagination>
    </el-row>
  </container>
</template>
<script>
import * as api from "@/api/feedbackmanager";
import {mapGetters} from "vuex";
import pagination from "@/components/pagination/index.vue";
import noticeTemplete from "@/components/noticeTemplete";
import {formatDate} from "@/utils/mUtils";
import {pickerOptions} from "@/utils/env";
export default {
  name: "feedbackMangerList",
  components: {
    pagination,
    noticeTemplete
  },
  data() {
    return {
      datePickerTime: "",
      pickerOptions,
      dialogVisible: false,
      search: {
        region: "CN",
        userIdOrName: "",
        feedBackTimeStart: null,
        feedBackTimeEnd: null,
        dealStatus: 0
      },
      tableList: [],
      noticeContent: "",
      uid: 0,
      currentCheckedList: [],
      pagination: {
        index: 1,
        size: 20,
        total: 0
      },
      noticeData: {
        notice: false,
        noticeContent: "",
        locale: ""
      },
      limitEnterNumber: 200
    };
  },
  watch: {
    datePickerTime(val) {
      let [feedBackTimeStart, feedBackTimeEnd] = ["", ""];
      if (val) {
        [feedBackTimeStart, feedBackTimeEnd] = val;
      }
      this.search = {
        ...this.search,
        feedBackTimeEnd,
        feedBackTimeStart
      };
    },
    noticeContent(val, oldVal) {
      let Len = val.replace(/[\u4e00-\u9fa5]/g, "aa").length;
      if (Len > 200) {
        this.limitEnterNumber = Len;
        this.noticeContent = oldVal;
      }
    }
  },
  created() {
    this.getfeedbakList();
  },
  computed: {
    ...mapGetters(["getAreaList", "userName"]),
    region: state => state.currentRegion
  },
  filters: {
    formatDate
  },
  methods: {
    onFormatterData(row) {
      return row.dealStatus == 1 ? "" : formatDate(row.operateTime);
    },
    handleSelectable(row, index) {
      return row.dealStatus === 1 ? true : false;
    },
    handleSelectionChange(list) {
      this.currentCheckedList = list;
    },
    getfeedbakList(page) {
      this.pagination.index = page ? page : 1;
      this.search.index = this.pagination.index;
      this.search.size = this.pagination.size;
      this.search.userIdOrName && (this.search.userIdOrName = this.search.userIdOrName.trim());
      api.getFeedbackList(this.search).then(res => {
        this.tableList = res.data.map(item => {
          item.isChecked = false;
          return item;
        });
        this.pagination.total = res.total;
      });
    },
    handleConfirm() {
      let params = {
        content: this.noticeContent,
        uid: this.uid
      };
      api
        .sendFeedBackNotice(params)
        .then(res => {
          this.$message.success("回复成功~");
          this.dialogVisible = false;
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    dealFeedBack(page, id) {
      let params = {
        ids: [],
        operator: ""
      };
      params.operator = this.userName;
      if (id) {
        params.ids.push(id);
      } else {
        params.ids = this.currentCheckedList.map(item => {
          return item.id;
        });
      }
      api
        .dealFeedBack(params)
        .then(res => {
          this.$message.success("处理成功~");
          this.getfeedbakList(page);
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    handleEdit(id) {
      this.dialogVisible = true;
      this.uid = id;
    },
    onAllItemCheckedHandle() {
      let isAllChecked = this.isAllChecked; //判断是否全部选择来取消选择
      this.tableList.forEach(item => {
        item.isChecked = !isAllChecked;
      });
    },
    chengeItemChecked(item) {
      item.isChecked = !item.isChecked;
    },
    onChangeCommentPageHandle(page) {
      this.getfeedbakList(page);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";
.feedback-manger-list-layer {
  .deal-batchs {
    position: absolute;
    top: 30px;
  }
}
</style>
