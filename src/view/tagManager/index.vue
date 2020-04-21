<template>
  <container class="tag-manger-list-layer" title="标签管理">
    <el-row class="menu" :gutter="20">
      <el-col>
        <el-form>
          <el-form-item label="标签类型">
            <el-select v-model="tags.currTag" placeholder="请选择标签类型" @change="handleTagtypeChange">
              <el-option
                v-for="item in tags.tagsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input v-model="search.keyword" placeholder="币种/技术分析词汇"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getTagTypeList()">搜索</el-button>
      </el-col>
      <el-col :span="2" :push="15">
        <el-button type="primary" @click="handleCreateTag()">创建</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="default-table">
        <el-table
          :data="tableList"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          stripe
          class="table-border"
          fit
          :tree-props="{children: 'tagsList'}"
        >
          <el-table-column type="index" label="序号" width="50" :key="Math.random()"></el-table-column>
          <el-table-column
            prop="tagCategory"
            :label="tags.currTag | tableColumnHeaderName"
            width="180"
            v-if="tags.currTag !== 5"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column label="标签名称" v-if="tags.currTag === 1" :key="Math.random()">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" size="small" v-model="scope.row.tagCode"></el-input>
              <div v-else>{{ scope.row.tagCode || "" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="简体中文" :key="Math.random()">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" size="small" v-model="scope.row.localeList[0].translation"></el-input>
              <span v-else-if="scope.row.localeList">{{ scope.row.localeList[0].translation }}</span>
            </template>
          </el-table-column>
          <el-table-column label="繁体中文" :key="Math.random()">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" size="small" v-model="scope.row.localeList[1].translation"></el-input>
              <div v-else-if="scope.row.localeList">{{ scope.row.localeList[1].translation }}</div>
            </template>
          </el-table-column>
          <el-table-column label="英文" :key="Math.random()">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" size="small" v-model="scope.row.localeList[2].translation"></el-input>
              <div v-else-if="scope.row.localeList">{{ scope.row.localeList[2].translation }}</div>
            </template>
          </el-table-column>
          <el-table-column label="马来语" :key="Math.random()">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" size="small" v-model="scope.row.localeList[3].translation"></el-input>
              <div v-else-if="scope.row.localeList">{{ scope.row.localeList[3].translation }}</div>
            </template>
          </el-table-column>
          <el-table-column label="泰语" :key="Math.random()">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" size="small" v-model="scope.row.localeList[4].translation"></el-input>
              <div v-else-if="scope.row.localeList">{{ scope.row.localeList[4].translation }}</div>
            </template>
          </el-table-column>
          <el-table-column label="越南语" :key="Math.random()">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" size="small" v-model="scope.row.localeList[5].translation"></el-input>
              <div v-else-if="scope.row.localeList">{{ scope.row.localeList[5].translation }}</div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="180px" :key="Math.random()">
            <template slot-scope="scope">
              {{ scope.row.updateTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="热门" v-if="tags.currTag === 1" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.hot | hotFilter" placement="bottom">
                <icon-svg
                  icon-class="hot"
                  :class-name="scope.row.hot ? 'icon-hot' : 'icon-size'"
                  @click="handleHot(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" :key="Math.random()" width="230">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isEdit" type="primary" size="small" @click="handleOpenEdit(scope.row)">
                编辑
              </el-button>
              <el-button v-else type="primary" size="small" @click="handleEdit(scope.row, scope.$index)">
                确认
              </el-button>
              <el-button
                v-if="!scope.row.tagCategory && !scope.row.isEdit"
                type="primary"
                size="small"
                @click="handleDelete(scope.row.id)"
              >
                移除
              </el-button>
              <el-button v-if="scope.row.isEdit" type="primary" size="small" @click="handleCancel(scope.row)">
                取消
              </el-button>
              <el-button v-if="tags.currTag === 5" type="primary" size="small" @click="handleView(scope.row)">
                {{ scope.row.visible === 1 ? "显示" : "未显示" }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-dialog
      :title="tags.currTag | dialogTitle"
      :visible.sync="dialogVisible"
      width="35%"
      center
      custom-class="default-dialog"
    >
      <el-form label-width="100px" :model="createTag" ref="createForm">
        <el-form-item label="标签类目" prop="tagCategoryId" v-if="tags.currTag !== 5">
          <el-select v-model="createTag.tagCategoryId" placeholder="请选择标签类目">
            <el-option
              v-for="item in tagTypeAndCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              placeholder="请选择类目"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代码名称" prop="tagCode" v-if="tags.currTag === 1">
          <el-input v-model="createTag.tagCode" placeholder="请输入代码名"></el-input>
        </el-form-item>
        <el-form-item label="标签名" prop="tagName">
          <div class="tag-input" v-for="item in createTag.localeList" :key="item.locale">
            <el-input class="tag-input" v-model="item.translation"></el-input>
            {{ item.label }}
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddTag()">保 存</el-button>
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
import * as api from "@/api/tagType";
import pagination from "@/components/pagination/index.vue";
import {formatDate} from "@/utils/mUtils";
import {mapGetters} from "vuex";
import {translateLanageList} from "@/utils/env";

export default {
  name: "accountMangerList",
  components: {
    pagination
  },
  data() {
    return {
      tags: {
        tagsList: [
          {
            label: "币种标签",
            value: 1
          },
          {
            label: "技术分析标签",
            value: 2
          },
          {
            label: "举报标签",
            value: 5
          }
        ],
        currTag: 1
      },
      tagTypeList: [],
      tagTypeAndCategory: [],
      dialogVisible: false,
      search: {
        locale: "",
        keyword: "",
        tagType: null
      },
      tableList: [],
      currentEditId: 0,
      createTag: {
        tagTypeId: null,
        tagCode: "",
        tagCategoryId: null,
        localeList: [
          {locale: "zh_CN", translation: "", label: "简体中文"},
          {locale: "zh_TW", translation: "", label: "繁体中文"},
          {locale: "en_US", translation: "", label: "英文"},
          {locale: "ms_MY", translation: "", label: "马来语"},
          {locale: "th_TH", translation: "", label: "泰语"},
          {locale: "vi_VN", translation: "", label: "越南语"}
        ]
      },
      pagination: {
        index: 1,
        size: 20,
        total: 0
      },
      globalEditItem: {} // 页面全局正在编辑的数据
    };
  },
  created() {
    this.search.locale = this.currentLanguage;
    this.getTagTypeList();
    // this.getTagTypesList();
  },
  filters: {
    formatDate,
    hotFilter(val) {
      return val ? "取消热门" : "设为热门";
    },
    tableColumnHeaderName(val) {
      return val === 1 ? "品种类目" : val === 2 ? "分析方法类目" : "";
    },
    dialogTitle(val) {
      return val === 1 ? "创建交易品种" : val === 2 ? "创建分析方法" : val === 5 ? "创建举报标签" : "";
    }
  },
  computed: {
    ...mapGetters(["currentLanguage", "getLangList"]),
    //通过类型返回对应的类目
    tagCategoryList() {
      let tagCategoryList = [];
      if (this.createTag.tagTypeId) {
        this.tagTypeAndCategory.forEach(item => {
          if (item.id === this.createTag.tagTypeId) {
            tagCategoryList = item.tagsList;
          }
        });
      }
      return tagCategoryList;
    }
  },
  methods: {
    // 设置显示/未显示
    handleView(item) {
      if (this.globalEditItem.isEdit && this.globalEditItem.id !== item.id) {
        this.$message.warning("请先保存当前编辑项");
        return;
      }
      let {id, visible} = item;
      api
        .setTagVisible({
          id,
          visible: visible === 1 ? 0 : 1
        })
        .then(() => {})
        .catch(err => {
          this.$message.success("设置成功");
          this.getTagTypeList();
        });
    },
    // 设置是否热门
    handleHot(item) {
      let {id, hot} = item;
      api
        .setHot({
          id,
          hot: hot === 0 ? 1 : 0
        })
        .then(() => {})
        .catch(res => {
          this.$message.success(hot === 1 ? "取消热门成功" : "设置热门成功");
          this.getTagTypeList();
        });
    },
    // 取消操作
    handleCancel(item) {
      this.$set(item, "isEdit", false);
      this.globalEditItem = item;
      this.getTagTypeList();
    },
    // 切换标签类型
    handleTagtypeChange(val) {
      this.getTagTypeList();
    },
    getTagTypeList() {
      let params = {};
      params = Object.assign({}, this.search);
      params.index = this.pagination.index;
      params.size = this.pagination.size;
      params.tagType = this.tags.currTag;
      if (!params.tagType) {
        params.tagType = 0;
      }
      api
        .getTagTypeList(params)
        .then(res => {
          this.tableList = res;
          this.pagination.total = res.total;
        })
        .catch(res => {});
    },
    //获取标签列表
    getTagTypesList() {
      api
        .getTagTypesList()
        .then(res => {
          this.tagTypeList = res.data;
        })
        .catch(res => {});
    },
    handleCreateTag() {
      this.dialogVisible = true;
      this.createTag.tagCategoryId = null;
      if (this.tags.currTag === 5) return;
      api
        .getTagType({
          locale: this.search.locale,
          type: this.tags.currTag
        })
        .then(res => {
          this.tagTypeAndCategory = res;
        })
        .catch(() => {});
    },
    //创建标签
    handleAddTag() {
      this.createTag.localeList = this.createTag.localeList.map(item => {
        delete item.label;
        return item;
      });
      this.createTag.tagCategoryId = this.tags.currTag == 5 ? 20 : this.createTag.tagCategoryId;
      let params = {
        ...this.createTag,
        tagTypeId: this.tags.currTag
      };
      api
        .addTag(params)
        .then(res => {
          this.$message.success("创建标签成功~");
          this.dialogVisible = false;
          this.getTagTypeList();
          this.$refs["createForm"].resetFields();
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    //编辑
    handleOpenEdit(item) {
      if (this.globalEditItem.isEdit && this.globalEditItem.id != item.id) {
        this.$message.warning("请先保存当前编辑项");
        return;
      }
      this.$set(item, "isEdit", true);
      this.globalEditItem = item;
    },
    handleEdit(item, index) {
      let {id, tagCode = "", localeList} = item;
      api
        .editTag({
          id,
          tagCode,
          localeList
        })
        .then(res => {
          this.$message.success("编辑成功~");
          this.$set(item, "isEdit", false);
          this.globalEditItem = item;
        })
        .catch(res => {
          this.$message.error("编辑失败~");
        });
    },
    //删除
    handleDelete(id) {
      if (this.globalEditItem.isEdit && this.globalEditItem.id !== id) {
        this.$message.warning("请先保存当前编辑项");
        return;
      }

      this.$confirm("确认移除此类目？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(res => {
          api
            .removeTag({id: id.toString()})
            .then(res => {
              this.$message.success("移除成功~");
              this.getTagTypeList();
            })
            .catch(res => {
              this.$message.error(res.message);
            });
        })
        .catch(() => {});
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getTagTypeList();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";
.menu {
  margin: 0 0 20px;
  ::v-deep.search-input {
    width: 70%;
    margin: 0 10px 0 0;
  }
}
.icon-size {
  font-size: 30px;
  cursor: pointer;
}
.icon-hot {
  font-size: 30px;
  background-color: #ffb6c1;
  border-radius: 50%;
  cursor: pointer;
}
.tag-input {
  margin-bottom: 5px;
}
</style>
