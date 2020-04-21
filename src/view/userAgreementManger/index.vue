<template>
  <container class="user-agreement-manger-layer" title="用户协议管理">
    <el-table :data="tableList" border stripe class="table-border">
      <el-table-column label="类型" prop="type" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | prototypeType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="editPrototypeHandle(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="900">
      <el-radio-group v-model="localeName" @change="handleChangeLocaleName">
        <el-radio-button
          v-for="(item, index) in getLangList"
          :key="index"
          :label="item.localeName"
          :value="item.locale"
        ></el-radio-button>
      </el-radio-group>
      <div class="editor">
        <neditor v-model="agreeContent" :config="neditorConfig" style="height: 300px;"></neditor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onClickSubmitFormData">确 定</el-button>
      </span>
    </el-dialog>
  </container>
</template>

<script>
import {neditorConfig} from "@/utils/env";
import * as api from "@/api/userAgreementManger";
import {mapGetters} from "vuex";
import {formatDate} from "@/utils/mUtils";
const prototypeType = {
  1: "用户协议",
  2: "隐私协议",
  3: "榜单规则"
};
export default {
  name: "userAgreementManger",
  components: {
    neditor: () => import("@/components/neditor/neditor")
  },
  data() {
    return {
      // neditorConfig,
      agreeContent: "",
      localeName: "简体中文",
      tableList: [],
      dialogVisible: false,
      prototypeType: 1,
      locale: "",
      neditorConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 300,
        initialFrameWidth: 900,
        zIndex: 9999
      }
    };
  },
  computed: {
    ...mapGetters(["userName", "getLangList"]),
    dialogTitle() {
      let title = "";
      switch (this.prototypeType) {
        case 1:
          title = "用户协议编辑页";
          break;
        case 2:
          title = "隐私协议编辑页";
          break;
        case 3:
          title = "榜单规则编辑页";
          break;
        default:
          break;
      }
      return title;
    },
    currentLocaleItem() {
      return this.getLangList.filter(item => {
        if (item.localeName === this.localeName) {
          return item;
        }
      });
    },
    agreeContentLength() {
      return this.agreeContent.length < 30000;
    }
  },
  filters: {
    prototypeType(type) {
      return prototypeType[type];
    },
    formatDate(val) {
      return formatDate(val, "YY-MM-DD hh:mm:ss");
    }
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    // 查询列表数据
    getTableList() {
      api.findUpdateTimeList().then(res => {
        this.tableList = res;
        console.log("表格数据", res);
      });
    },
    // 查询用户协议/隐私协议
    getProtocolContent() {
      api
        .findAgreement({
          type: this.prototypeType,
          locale: this.currentLocaleItem[0].locale
        })
        .then(res => {
          this.agreeContent = res.content;
          this.getLangList.forEach(item => {
            if (item.locale === res.locale) {
              this.locale = item.localeName;
            }
          });
        });
      this.dialogVisible = true;
    },
    handleChangeLocaleName(val) {
      this.localeName = val;
      this.getProtocolContent();
    },
    editPrototypeHandle(row) {
      this.prototypeType = row.type;
      this.getProtocolContent();
    },
    //保存用户协议
    onClickSubmitFormData() {
      if (this.agreeContentLength) {
        let param = {
          content: this.agreeContent,
          operator: this.userName,
          locale: this.currentLocaleItem[0].locale
        };
        let type = "";
        switch (this.prototypeType) {
          case 1:
            type = api.saveAgreement(param);
            break;
          case 2:
            type = api.savePrivacyPolicy(param);
            break;
          case 3:
            type = api.saveRankingRule(param);
            break;
          default:
            break;
        }
        type
          .then(res => {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.getProtocolContent();
            this.dialogVisible = false;
          })
          .catch(err => {
            this.$message({
              message: "保存失败",
              type: "error"
            });
          });
      } else {
        this.$message.warning("最多输入30000个字符");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.user-agreement-manger-layer {
  .editor {
    margin-top: 30px;
  }
}
</style>
