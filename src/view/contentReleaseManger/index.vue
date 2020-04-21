<template>
  <container class="content-release-manger-layer" title="内容发布管理">
    <el-row>
      <el-col :span="5">
        地区选择:
        <el-select v-model="region" placeholder="请选择">
          <el-option
            v-for="item in getAreaList"
            :key="item.region"
            :label="item.regionName"
            :value="item.region"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :disabled="btnDisabled" @click="releaseArticle()">发布</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <p>文章标题</p>
        <p>
          <el-input v-model="formInfo.title" @keyup.native="setIssueBtnStatus"></el-input>
        </p>
        <div>
          <neditor v-model="formInfo.content" :config="neditorConfig"></neditor>
        </div>
      </el-col>
      <el-col :span="12">
        <el-form label-width="200px" :model="formInfo">
          <el-form-item label="选择发布的地区账号">
            <i
              v-if="formInfo.uid === 0"
              class="el-icon-circle-plus-outline font-size-ll"
              @click="handleOpenSelectAccount()"
            ></i>
            <span v-else @click="handleOpenSelectAccount()">{{ formInfo.nickname }}</span>
          </el-form-item>
          <el-form-item label="文章类型">
            <el-select v-model="formInfo.postType" placeholder="请选择" @change="handlePostTypeChange">
              <el-option
                v-for="item in articleType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="观点策略标签">
            <el-select
              v-model="formInfo.strategyLabel"
              placeholder="请选择"
              @change="setIssueBtnStatus"
              :disabled="isStrategyDisabled"
            >
              <el-option
                v-for="item in strategyTags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发文币种标签">
            <el-cascader
              :options="currencyLabel"
              :props="propsCurency"
              clearable
              v-model="formInfo.currencyLabel"
              placeholder="选择币种标签"
              :show-all-levels="false"
              @change="setIssueBtnStatus"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="周期">
            <el-select v-model="formInfo.cycleLabel" placeholder="请选择周期" @change="setIssueBtnStatus">
              <el-option
                v-for="item in cycleTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="技术分析标签" @change="setIssueBtnStatus">
            <el-cascader
              :options="technicalTags"
              :props="props"
              clearable
              v-model="formInfo.tecTag"
              placeholder="选择技术分析标签"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="相关文章">
            <i class="el-icon-circle-plus-outline font-size-ll" @click="handleOpenRelatedArticles()"></i>
            <div class="table-border round common-width gray-bg">
              <div v-for="(item, index) in articleLabels" :key="index">
                <span class="margin">{{ item }}</span>
                <el-tooltip content="删除" placement="bottom">
                  <span class="el-icon-close" @click="deleteArticle(index)"></span>
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <reply-account
      :dialogVisible.sync="selectAccountDialog"
      @handleChooseAccount="handleChooseAccount"
      :region="region"
    ></reply-account>
    <related-articles
      :dialogVisible.sync="relatedArticle"
      :chooseItems="chooseItems"
      :fromUid="formInfo.uid"
      @handleRelatedArticles="handleRelatedArticles"
    ></related-articles>
  </container>
</template>

<script>
import {neditorConfig, articleType, strategyTags, cycleTime} from "@/utils/env";
import {mapGetters} from "vuex";
import * as tagAPI from "@/api/tagType";
import * as api from "@/api/contentRelease";
import replyAccount from "@/components/replyAccount";
import relatedArticles from "./relatedArticles";
import {limitInputCodeLen} from "@/utils/mUtils";
export default {
  name: "contentReleaseManger",
  components: {
    neditor: () => import("@/components/neditor/neditor"),
    replyAccount,
    relatedArticles
  },
  data() {
    return {
      neditorConfig,
      articleType,
      strategyTags,
      cycleTime,
      selectAccountDialog: false,
      relatedArticle: false,
      region: "CN",
      currencyLabel: [],
      technicalTags: [],
      props: {
        value: "id",
        label: "name",
        children: "tagsList",
        multiple: true,
        emitPath: false
      },
      propsCurency: {
        value: "id",
        label: "name",
        children: "tagsList",
        emitPath: false
      },
      formInfo: {
        uid: 0,
        postType: 1,
        strategyLabel: 1,
        // currencyIds: [],
        currencyLabel: null,
        cycleLabel: null,
        tecTag: [],
        articleLocale: "zh_CN",
        coverUrl: "",
        videoUrl: "",
        title: "",
        content: ""
      },
      chooseItems: [],
      btnDisabled: true,
      isStrategyDisabled: false
    };
  },
  async created() {
    this.currencyLabel = await tagAPI.getClassOptionalTagsByTypeId({type: 1});
    this.currencyId = this.currencyLabel[0].id;
    this.technicalTags = await tagAPI.getClassOptionalTagsByTypeId({type: 2});
    this.tecId = this.technicalTags[0].id;
  },
  computed: {
    ...mapGetters(["getAreaList"]),
    articleLabels() {
      let articleLabels = [];
      this.chooseItems.forEach(item => {
        articleLabels.push(item.title);
      });
      return articleLabels;
    },
    relatedArticleIds() {
      let articleIds = [];
      this.chooseItems.forEach(item => {
        articleIds.push(item.id);
      });
      return articleIds;
    }
  },
  watch: {
    "formInfo.title": function(val, oldVal) {
      let {bol, len} = limitInputCodeLen(val, 60);
      if (bol) {
        this.$message.warning(`文章标题最多输入${len}个字符`);
        this.formInfo.title = oldVal;
        return;
      }
    },
    "formInfo.content": function(val) {
      this.setIssueBtnStatus();
    }
  },
  methods: {
    handlePostTypeChange(val) {
      this.isStrategyDisabled = val == 2 ? true : false;
    },
    setIssueBtnStatus() {
      let vertifyFormInfoKeys = ["uid", "title", "content", "currencyLabel", "cycleLabel", "strategyLabel"];
      if (this.formInfo.postType === 2)
        vertifyFormInfoKeys.splice(vertifyFormInfoKeys.findIndex(item => item === "strategyLabel"), 1);
      else vertifyFormInfoKeys.push("strategyLabel");
      let flag = false;
      vertifyFormInfoKeys.forEach(key => {
        if (!this.formInfo[key] || this.formInfo[key].length === 0) flag = true;
      });
      this.btnDisabled = flag;
    },
    handleOpenSelectAccount() {
      this.selectAccountDialog = true;
    },
    handleChooseAccount(item) {
      this.formInfo.uid = item.uid;
      this.formInfo.nickname = item.nickname;
      this.selectAccountDialog = false;
      this.setIssueBtnStatus();
    },
    handleOpenRelatedArticles() {
      if (this.formInfo.uid !== 0) {
        this.relatedArticle = true;
      } else {
        this.$message.error("先选择回复账号");
      }
    },
    handleRelatedArticles(item) {
      this.chooseItems = item;
      this.relatedArticle = false;
    },
    releaseArticle() {
      let params = {};
      params = Object.assign(params, this.formInfo);
      params.relatedArticleIds = this.relatedArticleIds;
      api
        .publishArticle(params)
        .then(res => {
          this.$message.success("发布成功~");
          this.resetInfo();
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    deleteArticle(index) {
      this.chooseItems.splice(index, 1);
    },
    resetInfo() {
      this.formInfo = {
        uid: 0,
        postType: 0,
        strategyLabel: 1,
        currencyIds: [],
        cycleLabel: null,
        tecTag: [],
        articleLocale: "zh_CN",
        coverUrl: "",
        videoUrl: "",
        title: "",
        content: ""
      };
      this.chooseItems = [];
    }
  }
};
</script>

<style lang="less" scoped>
.content-release-manger-layer {
  p {
    margin: 0 0 15px;
  }
  .common-width {
    width: 400px;
    height: 200px;
    overflow: auto;
  }
  .margin {
    margin-left: 10px;
  }
}
</style>
