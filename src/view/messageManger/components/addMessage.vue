<template>
  <el-dialog
    title="消息推送"
    :visible="dialogVisible"
    class="add-message-dialog-layer"
    width="1200"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rule" ref="form">
      <el-row>
        <el-col :span="10" class="left-box">
          <el-row>
            消息类型：
            <el-radio-group size="small" v-model="formData.messageType">
              <el-radio-button label="系统消息"></el-radio-button>
              <el-radio-button label="系统通知"></el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row class="message-item">
            <el-radio v-model="formData.isNowPush" label="1">立即推送</el-radio>
          </el-row>
          <el-row class="now-push-item">
            <el-col :span="7" class="fix-push">
              <el-radio v-model="formData.isNowPush" label="2">定时推送</el-radio>
            </el-col>
            <el-col :span="10">
              <el-date-picker
                size="small"
                v-model="formData.sendTime"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-col>
          </el-row>
          <el-row class="message-item">
            推送对象：
            <el-radio-group size="small" v-model="formData.pushObject">
              <el-radio-button
                v-for="(item, index) in pushObjectList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row class="message-item" v-if="formData.pushObject === '指定品种圈'">
            指定币种圈：
            <el-select
              size="small"
              v-model="formData.specifyCurrent"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-row>
          <div v-if="formData.pushObject === '指定用户'">
            <el-row class="message-item fix-user">
              <el-col :span="6">
                <p class="user-text">指定用户：</p>
              </el-col>
              <el-col :span="18">
                <el-select
                  size="small"
                  v-model="userKeyword"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="getUserInfoRemoteMethod"
                  :loading="loading"
                >
                  <el-option v-for="item in userInfoList" :key="item.uid" :value="item.uid">
                    <el-row class="user-info">
                      <el-col :span="4">
                        <el-avatar class="vertical-align-middle avatar" :src="item.avatar"></el-avatar>
                      </el-col>
                      <el-col :span="8" class="nickname text-truncate ">{{ item.nickname }}</el-col>
                      <el-col :span="9" class="id-text text-truncate ">ID：{{ item.userId }}</el-col>
                      <el-col :span="3">
                        <i class="el-icon-circle-plus-outline fr icon-size pointer" @click="handleAddUser(item)"></i>
                      </el-col>
                    </el-row>
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="message-item" v-if="tableList.length">
              <p class="user-text">已选用户：</p>
              <el-table :data="tableList" border stripe class="table-border">
                <el-table-column label="用户ID" prop="id" align="center"></el-table-column>
                <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
                <el-table-column label="用户当前系统语言" prop="region" width="140" align="center"></el-table-column>
                <el-table-column label="移除" prop="id" align="center" width="60">
                  <template slot-scope="scope">
                    <i class="el-icon-delete pointer" @click="handleRemove(scope.row)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </el-col>
        <el-col :span="14" class="right-box">
          <h3>{{ pushTitle }}</h3>
          <el-row class="article-item">
            <p class="tag-text">语言选择：</p>
            <el-radio-group size="small" v-model="formData.localeName">
              <el-radio-button
                v-for="(item, index) in getLangList"
                :key="index"
                :label="item.localeName"
                :value="item.locale"
              ></el-radio-button>
            </el-radio-group>
          </el-row>
          <!-- 推送文章 -->
          <template v-if="formData.messageType === '系统消息'">
            <el-row class="article-item">
              <el-col :span="18">
                <el-input
                  size="small"
                  clearable
                  v-model="articleId"
                  placeholder="输入文字ID，精准搜索"
                  @clear="articleInfo.id = ''"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    class="search-icon pointer"
                    @click="onClickgetArticleHandle"
                  ></el-button>
                </el-input>
                <el-card v-if="articleInfo.id">
                  <el-row>
                    <el-col :span="20">
                      <p>{{ articleInfo.title }}</p>
                    </el-col>
                    <el-col :span="4" class="text-right">
                      <i class="el-icon-circle-plus-outline icon-size pointer" @click="handleAddArticle"></i>
                    </el-col>
                  </el-row>
                </el-card>
                <el-row class="article-item article-card" v-if="formData.articleId">
                  <el-col :span="5">
                    <img class="cover-img" :src="formData.coverUrl" />
                  </el-col>
                  <el-col :span="18">
                    <h3>{{ formData.articleTitle }}</h3>
                  </el-col>
                  <el-col :span="1">
                    <i class="el-icon-circle-close pointer" @click="formData.articleId = ''"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-col :span="18">
              <el-form-item label="标题" prop="activityTitle" class="article-item">
                <el-input v-model="formData.activityTitle" placeholder="标题不超过20中文字符"></el-input>
                <div class="translate-box vertical-align-middle fr">
                  <el-button type="text" size="small" class="lang-btn" @click="onClickOriginalHandle(1)">
                    简体中文
                  </el-button>
                  <img class="translate-icon vertical-align-middle" src="@/assets/img/translate.svg" />
                  <el-button type="text" size="small" class="lang-btn" @click="onClickTranslateHandle(1)">
                    {{ formData.localeName }}
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item label="内容描述" prop="activityContent" class="article-item">
                <el-input
                  v-model="formData.activityContent"
                  type="textarea"
                  rows="3"
                  placeholder="内容至多输入100个中文字符"
                ></el-input>
                <div class="translate-box vertical-align-middle fr">
                  <el-button type="text" size="small" class="lang-btn" @click="onClickOriginalHandle(2)">
                    简体中文
                  </el-button>
                  <img class="translate-icon vertical-align-middle" src="@/assets/img/translate.svg" />
                  <el-button type="text" size="small" class="lang-btn" @click="onClickTranslateHandle(2)">
                    {{ formData.localeName }}
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item label="添加链接">
                <el-input v-model="formData.activityLinkUrl" placeholder="可输入链接"></el-input>
              </el-form-item>
              <el-form-item label="上传图片" class="img-item">
                <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="fileUpload">
                  <img v-if="formData.activityImageUrl" :src="formData.activityImageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <p>150*150</p>
                </el-upload>
              </el-form-item>
            </el-col>
          </template>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer submit-btn">
      <el-button class="btn" type="primary" @click="handleSubmitData">发送</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from "@/api/messageManger";
import {mapGetters} from "vuex";
import {pushObjectList} from "@/utils/env";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default() {
        return {};
      }
    },
    articleInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(["userUid", "getLangList"]),
    pushTitle() {
      return this.formData.messageType === "系统消息" ? "推送文章" : "推送通知";
    }
  },
  data() {
    return {
      loading: false,
      options: [],
      tableList: [],
      articleId: "",
      rule: {
        activityTitle: [
          {required: true, message: "请输入标题", trigger: "blur"},
          {min: 1, max: 20, message: "标题不超过20个字符", trigger: "blur"}
        ],
        activityContent: [
          {required: true, message: "请输入内容描述", trigger: "blur"},
          {min: 1, max: 100, message: "内容不超过100个字符", trigger: "blur"}
        ]
      },
      pushObjectList: pushObjectList,
      userKeyword: "",
      userInfoList: []
    };
  },
  methods: {
    // 查询币种标签
    remoteMethod(query) {
      console.log("query", query);
      this.options = [];
      if (query) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          api
            .searchCurrencyInfo({
              keyword: query
            })
            .then(res => {
              this.options = res;
            });
        }, 200);
      } else {
        this.options = [];
      }
    },
    // 搜索用户
    getUserInfoRemoteMethod(query) {
      console.log("query", query);
      this.options = [];
      if (query) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          api
            .getUserInfo({
              keyword: query
            })
            .then(res => {
              this.userInfoList = res;
              console.log("用户", res);
            });
        }, 200);
      } else {
        this.options = [];
      }
    },
    // 添加指定用户
    handleAddUser(item) {
      let idArr = [];
      this.tableList.forEach(element => {
        idArr.push(element.id);
      });
      if (idArr.indexOf(item.uid) === -1) {
        if (this.tableList.length < 5) {
          this.tableList.push({
            id: item.userId,
            nickname: item.nickname,
            region: item.region
          });
        } else {
          this.$message({
            type: "warning",
            message: "最多添加5个用户"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "用户已存在"
        });
      }
    },
    // 移除用户
    handleRemove(row) {
      this.tableList.splice(row, 1);
    },
    // 搜索指定文章
    onClickgetArticleHandle() {
      this.$emit("getArticle", this.articleId);
    },
    //添加文章
    handleAddArticle() {
      this.$emit("addArticle");
    },
    //上传图片
    fileUpload(event) {
      this.$emit("uploadFile", event, 1);
    },
    handleSubmitData() {
      let idArr = this.tableList.map(item => item.id);
      this.$emit("sbumitData", idArr);
    },
    //校验
    validator() {
      let flag = false;
      this.$refs["form"].validate((boolean, object) => {
        if (boolean) {
          //校验通过
          flag = true;
        } else {
          //this.$emit("errorMsg", object);
          // this.$message.error(object[Object.keys(object)[0]][0].message);
        }
      });
      return flag;
    },
    handleClose() {
      this.$refs["form"].clearValidate();
      this.$emit("changeDialogVisible", false);
    },
    //查看翻译
    onClickTranslateHandle(type) {
      this.$emit("translate", type);
    },
    //查看原文
    onClickOriginalHandle(type) {
      this.$emit("lookOriginal", type);
    }
  }
};
</script>
<style lang="less" scoped>
.add-message-dialog-layer {
  .left-box {
    .message-item {
      margin-top: 30px;

      .user-text {
        margin-bottom: 10px;
      }
    }
    .now-push-item {
      margin-top: 10px;

      .fix-push {
        line-height: 32px;
      }
    }

    .fix-user {
      padding: 0 10px;

      .user-info {
        box-sizing: border-box;
        .icon-size {
          font-size: 24px;
        }
      }
    }
  }

  .right-box {
    height: 600px;
    padding-left: 30px;

    .article-item {
      margin-top: 30px;

      .translate-box {
        .translate-icon {
          width: 25px;
        }

        .lang-btn {
          margin: 0 8px;
        }
      }

      .tag-text {
        margin-bottom: 10px;
      }

      .icon-size {
        font-size: 24px;
      }

      .search-icon {
        color: #a0aec2;
      }
    }

    .article-card {
      background: #f8f8f8;
      .cover-img {
        width: 50px;
        height: 50px;
      }
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409eff;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        border: 1px dashed #d9d9d9;
      }

      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }

      span {
        margin-top: 100px;
      }
    }
  }

  .submit-btn {
    margin: 60px 100px 30px;

    .btn {
      width: 384px;
    }
  }
}
</style>
<style lang="less">
.el-select-dropdown .el-select-dropdown__list .el-select-dropdown__item {
  height: 45px;
  line-height: 45px;
  .icon-size {
    font-size: 22px;
    line-height: 45px;
  }
  .id-text {
    padding-left: 20px;
  }
}
</style>
