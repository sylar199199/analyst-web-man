<template>
  <container class="content-manager-list-layer" title="内容管理">
    <el-form>
      <el-row :gutter="20">
        <el-col :span="5">
          语言选择:
          <el-select v-model="search.locale" placeholder="请选择">
            <el-option
              v-for="item in getLangList"
              :key="item.locale"
              :label="item.localeName"
              :value="item.locale"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-date-picker
            v-model="datePickerTime"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :picker-options="pickerOptions"
            :default-time="['', '23:59:59']"
          />
        </el-col>
        <el-col :span="4">
          <el-input v-model="search.keyword" placeholder="用户ID/用户昵称/文章ID/关键词" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-cascader
            :options="currencyLabel"
            :props="props"
            clearable
            v-model="search.currencyIds"
            collapse-tags
            placeholder="选择币种标签"
          ></el-cascader>
        </el-col>
        <el-col :span="3">
          <el-cascader
            :options="technicalTags"
            :props="props"
            clearable
            v-model="search.tecIds"
            collapse-tags
            placeholder="选择技术分析标签"
          ></el-cascader>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="getContentList()">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="normal-margin">
        <el-col :span="5">
          <el-form-item label="文章类型:">
            <el-select v-model="search.postType">
              <el-option
                v-for="item in articleType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="排序:">
            <el-select v-model="search.order">
              <el-option
                v-for="item in contentSort"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="推荐状态:">
            <el-select v-model="search.recommend">
              <el-option
                v-for="item in recommendList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="文章状态:">
            <el-select v-model="search.articleStatus" placeholder="选择文章状态">
              <el-option
                v-for="item in articleStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="审核状态:">
            <el-select v-model="search.auditStatus" placeholder="选择文章审核状态">
              <el-option
                v-for="item in dealtStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <div class="default-table">
        <el-table
          :data="tableList"
          border
          stripe
          class="table-border"
          align="center"
          @selection-change="onTableSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="文章ID" prop="id" width="120px"></el-table-column>
          <el-table-column label="交易品种" width="120px" prop="currencyLabel"></el-table-column>
          <el-table-column label="周期" prop="cycleId" width="120px">
            <template slot-scope="scope">
              {{ scope.row.cycleId | cycleIdFilter }}
            </template>
          </el-table-column>
          <el-table-column label="分析方法" prop="nickname" width="120px">
            <template slot-scope="scope">
              <span v-for="(tec, idx) in scope.row.tecTags" :key="tec.id">
                {{ tec.name }}{{ idx === scope.row.tecTags.length - 1 ? "" : "," }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="文章类型" prop="postType" width="150px">
            <template slot-scope="scope">
              {{ scope.row.postType === 1 ? "交易观点文章" : "教学分析文章" }}
              {{ scope.row.strategyId ? ":" : "" }}
              {{ scope.row.strategyId | strategyFilter }}
            </template>
          </el-table-column>
          <el-table-column label="用户信息" prop="nickname" width="120px">
            <template slot-scope="scope">
              {{ scope.row.nickname + scope.row.userId }}
              <p v-show="scope.row.sourceClient === 7" style="text-align: right"><i class="el-icon-user"></i></p>
            </template>
          </el-table-column>
          <el-table-column label="用户当前系统语言" prop="userLocale" width="140px">
            <template slot-scope="scope">
              {{ scope.row.userLocale | languageFilter }}
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title" width="200px"></el-table-column>
          <el-table-column label="分享量" prop="shareCount" width="120px"></el-table-column>
          <el-table-column label="浏览量" prop="viewCount	" width="120px"></el-table-column>
          <el-table-column label="点赞量" prop="likeCount" width="120px"></el-table-column>
          <el-table-column label="收藏量" prop="collectCount" width="120px"></el-table-column>
          <el-table-column label="最新发布时间" width="170px">
            <template slot-scope="scope">
              {{ scope.row.updateTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="文章状态" width="120px">
            <template slot-scope="scope">
              {{ scope.row.articleStatus | articleStatus }}
            </template>
          </el-table-column>
          <el-table-column label="敏感词判定" prop="nickname" width="120px">
            <template slot-scope="scope">
              {{ scope.row.sensitiveAudit === 1 ? "疑似违规" : "正常" }}
            </template>
          </el-table-column>
          <el-table-column label="正文审核状态" prop="nickname" width="120px">
            <template slot-scope="scope">
              {{ scope.row.auditStatus | opinionStatus }}
            </template>
          </el-table-column>
          <el-table-column label="观点审核状态" prop="nickname" width="120px">
            <template slot-scope="scope">
              {{ scope.row.opinionStatus | opinionStatus }}
            </template>
          </el-table-column>
          <el-table-column label="处理时间" prop="nickname" width="170px">
            <template slot-scope="scope">
              {{ scope.row.handleTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="处理账号" prop="operator" width="110px"></el-table-column>
          <el-table-column label="投诉量" prop="reportedCount"></el-table-column>
          <el-table-column label="推荐状态" prop="nickname" width="120px">
            <template slot-scope="scope">
              {{ scope.row.recommendStatus === 1 ? "不推荐" : "已推荐" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="nickname" width="250px" fixed="right">
            <template slot-scope="scope">
              <el-row type="flex" justify="center">
                <el-col>
                  <el-tooltip content="查看详情" placement="bottom">
                    <i class="el-icon-view" @click="handleOperation(scope.row, 1)"></i>
                  </el-tooltip>
                </el-col>
                <el-col>
                  <el-tooltip content="投诉详情" placement="bottom">
                    <i class="el-icon-edit" @click="handleOperation(scope.row, 2)"></i>
                  </el-tooltip>
                </el-col>
                <el-col>
                  <el-tooltip content="查看评论" placement="bottom">
                    <i class="el-icon-chat-line-square" @click="handleOperation(scope.row, 3)"></i>
                  </el-tooltip>
                </el-col>
                <el-col>
                  <el-tooltip content="回复" placement="bottom">
                    <i class="el-icon-edit-outline" @click="handleOperation(scope.row, 4)"></i>
                  </el-tooltip>
                </el-col>
                <el-col>
                  <el-tooltip content="配置" placement="bottom">
                    <i class="el-icon-document" @click="handleOperation(scope.row, 5)"></i>
                  </el-tooltip>
                </el-col>
                <!-- <el-col>
                  <el-tooltip content="下架" placement="bottom">
                    <i v-if="scope.row.articleStatus === 1" class="el-icon-bottom" @click="takeOff(1, scope.row)"></i>
                  </el-tooltip>
                  <el-tooltip content="上架" placement="bottom">
                    <i v-if="scope.row.articleStatus === 2" class="el-icon-top" @click="takeOff(1, scope.row)"></i>
                  </el-tooltip>
                </el-col> -->
                <el-col>
                  <select
                    v-model="scope.row.recommendStatus"
                    @change="handleRecommend(scope.row.recommendStatus, scope.row.id)"
                  >
                    <option :value="0">更多</option>
                    <option :value="1">取消推荐</option>
                    <option :value="2">推荐此文</option>
                  </select>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <complaint
      :dialogVisible.sync="complaintDialog"
      :articleId="currentItemContent.id"
      :title="currentItemContent.title"
    ></complaint>
    <reply-article
      v-if="replyDialog"
      :dialogVisible.sync="replyDialog"
      @handleAddReply="handleAddReply"
      :replyType="1"
    ></reply-article>
    <view-comment
      :dialogVisible.sync="commentDialog"
      :articleId="currentItemContent.id"
      :title="currentItemContent.title"
      :nickname="currentItemContent.nickname"
      :postTime="currentItemContent.postTime"
      :uid="currentItemContent.uid"
    ></view-comment>
    <take-off :dialogVisible.sync="takeOffDialog" :takeOffType="takeOffType" @handleTakeOff="handleTakeOff"></take-off>
    <article-detail
      :dialogVisible.sync="articleDetailDialog"
      :articleId="currentItemContent.id"
      :title="currentItemContent.title"
      :nickname="currentItemContent.nickname"
      :postTime="currentItemContent.postTime"
      @handleArticleDetail="handleArticleDetail"
    ></article-detail>
    <config :dialogVisible="configDialog" @handleClose="handleConfig" :content="currentItemContent"></config>
    <el-row>
      <el-button type="primary" class="deal-batchs" @click="handleRecommend(2)" :disabled="batchBtnDisabled">
        批量推荐
      </el-button>
      <el-button type="primary" class="deal-batchs" @click="handleRecommend(1)" :disabled="batchBtnDisabled">
        批量取消推荐
      </el-button>
      <!-- <el-button type="primary" class="deal-batchs" @click="takeOff(2)">批量下架</el-button> -->
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
import * as api from "@/api/contentManager";
import * as tagAPI from "@/api/tagType";
import {mapGetters} from "vuex";
import pagination from "@/components/pagination/index.vue";
import {
  dealtStateList,
  articleStateList,
  articleType,
  contentSort,
  recommendList,
  viewsAuditType,
  pickerOptions,
  languageArr,
  cycleTime,
  strategyTags
} from "@/utils/env";
import complaint from "./components/complaint";
import replyArticle from "./components/replyArticle";
import viewComment from "./components/viewComment";
import takeOff from "./components/takeOff";
import articleDetail from "./components/articleDetail";
import config from "./components/config";
import {formatDate} from "@/utils/mUtils";
export default {
  name: "contentMangerList",
  components: {
    pagination,
    complaint,
    replyArticle,
    viewComment,
    takeOff,
    articleDetail,
    config
  },
  data() {
    return {
      datePickerTime: "",
      pickerOptions,
      currencyId: 0,
      tecId: 0,
      takeOffType: 0,
      currencyLabel: null,
      technicalTags: null,
      articleDetailDialog: false,
      complaintDialog: false,
      commentDialog: false,
      replyDialog: false,
      takeOffDialog: false,
      configDialog: false,
      checkedIds: [],
      search: {
        articleStatus: 0,
        auditStatus: null,
        currencyIds: [],
        endTime: "",
        keyword: "",
        locale: "",
        order: 5,
        postType: 0,
        recommend: 0,
        startTime: "",
        tecIds: []
      },
      currentItemContent: {},
      tableList: [],
      contentSort: contentSort,
      recommendList: recommendList,
      articleStateList: articleStateList,
      dealtStateList: dealtStateList,
      articleType: articleType,
      noticeCallback: {},
      props: {
        value: "id",
        label: "name",
        children: "tagsList",
        multiple: true,
        emitPath: false
      },
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      selectedArr: [], // 表格选中项数据
      batchBtnDisabled: true
    };
  },
  async created() {
    this.search.locale = this.currentLanguage;
    await this.getContentList();
    await tagAPI.getClassOptionalTagsByTypeId({classTagId: 1}).then(res => {
      this.currencyLabel = res;
      this.currencyId = res[0].id;
    });
    tagAPI.getClassOptionalTagsByTypeId({classTagId: 2}).then(res => {
      this.technicalTags = res;
      this.tecId = res[0].id;
    });
  },
  filters: {
    formatDate,
    opinionStatus(val) {
      let targetObj = dealtStateList.find(item => item.value === val);
      return targetObj ? targetObj.label : "";
    },
    articleStatus(val) {
      let targetObj = articleStateList.find(item => item.value === val);
      return targetObj ? targetObj.label : "";
    },
    languageFilter(val) {
      let target = languageArr.find(item => item.value === val);
      return target ? target.text : "";
    },
    cycleIdFilter(val) {
      return cycleTime[val] ? cycleTime[val].label : "";
    },
    strategyFilter(val) {
      return strategyTags[val] ? strategyTags[val].label : "";
    }
  },
  watch: {
    datePickerTime(val) {
      let [startTime, endTime] = ["", ""];
      if (val) {
        [startTime, endTime] = val;
      }
      this.search = {
        ...this.search,
        startTime,
        endTime
      };
    }
  },
  computed: {
    ...mapGetters(["getLangList", "currentLanguage", "name"]),
    tagsList() {
      let tagsList = [];
      if (this.currencyLabel) {
        this.currencyLabel.find(item => {
          if (item.id === this.currencyId) {
            tagsList = item.tagsList;
          }
        });
      }
      return tagsList;
    },
    tecTagList() {
      let tecTagList = [];
      if (this.technicalTags) {
        this.technicalTags.find(item => {
          if (item.id === this.tecId) {
            tecTagList = item.tagsList;
          }
        });
      }
      return tecTagList;
    }
  },
  methods: {
    // 复选框状态发生变化
    onTableSelectionChange(selection) {
      this.selectedArr = selection;
      this.batchBtnDisabled = this.selectedArr.length === 0;
    },
    getContentList() {
      this.search.index = this.pagination.index;
      this.search.size = this.pagination.size;
      this.search.keyword = this.search.keyword.trim();
      api.getContentList(this.search).then(res => {
        this.tableList = res.data.map(item => {
          return item;
        });
        this.pagination.total = res.total;
      });
    },
    //1是查看详情，2是投诉详情，3是查看评论，4是回复
    handleOperation(data, state) {
      this.currentItemContent = data;
      switch (state) {
        case 1:
          this.articleDetailDialog = true;
          break;
        case 2:
          this.complaintDialog = true;
          break;
        case 3:
          this.commentDialog = true;
          break;
        case 4:
          this.replyDialog = true;
          break;
        case 5:
          this.configDialog = true;
      }
    },
    //回复
    handleAddReply(fromInfo) {
      let params = {
        articleId: this.currentItemContent.id,
        content: fromInfo.content,
        imageType: 1,
        imageUrl: fromInfo.imageUrl,
        uid: fromInfo.fromUid
      };
      api
        .addComment(params)
        .then(res => {
          this.$message.success("回复成功~");
          this.getContentList();
          this.replyDialog = false;
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    //上架下架
    takeOff(val, item = {}) {
      this.takeOffDialog = true;
      if (val === 1) {
        this.currentItemContent = item;
        this.takeOffType = 1;
      } else {
        this.takeOffType = 2;
      }
    },
    handleTakeOff(formInfo) {
      let params = {
        articleIdList: [],
        notice: formInfo.isNotice,
        noticeContent: formInfo.content,
        operator: this.userName,
        type: 0
      };
      //单个有上下架
      this.currentItemContent.articleStatus === 1 ? (params.type = 2) : (params.type = 1);
      //单个下架文章还是批量
      if (this.takeOffType === 1) {
        params.articleIdList.push(this.currentItemContent.id);
      } else {
        params.articleIdList = this.currentCheckedItem.map(item => {
          return item.id;
        });
        params.type = 2;
      }
      api
        .batchTakeOffOrDeleteArticle(params)
        .then(res => {
          params.type === 1 ? this.$message.success("上架成功~") : this.$message.success("下架成功~");
          this.getContentList();
          this.takeOffDialog = false;
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    //处理文章详情
    handleArticleDetail() {
      this.articleDetailDialog = false;
      this.getContentList();
    },
    //配置
    handleConfig() {
      this.configDialog = false;
    },
    //1是批量取消，2是批量推荐
    handleRecommend(state, id) {
      if (state == 0) return;
      if (state === 1) {
        this.$confirm("确认取消推荐?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.onCommonRecommend(state, id);
          })
          .catch(() => {});
      } else {
        this.onCommonRecommend(state, id);
      }
    },
    onCommonRecommend(state, id) {
      let params = {
        articleIdList: [],
        type: 0,
        operator: ""
      };
      params.type = state;
      params.operator = this.userName;
      if (id) {
        params.articleIdList.push(id);
      } else if (this.selectedArr.length === 0) {
        this.$message({
          message: "请勾选文章!",
          type: "warning"
        });
        return;
      } else {
        params.articleIdList = this.selectedArr.map(item => {
          return item.id;
        });
      }

      api
        .setRecommendArticle(params)
        .then(res => {
          this.$message.success("操作成功~");
          this.getContentList();
        })
        .catch(res => {
          this.$message.error(res.message);
          this.getContentList();
        });
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getContentList();
    }
  }
};
</script>

<style lang="less" scoped>
.content-manager-list-layer {
  .deal-batchs {
    position: relative;
    top: 30px;
  }
}
</style>
