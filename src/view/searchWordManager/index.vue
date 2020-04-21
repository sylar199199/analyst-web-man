<template>
  <container class="search-word-manger-list-layer" title="搜索词管理">
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
      <el-col :span="5">
        <el-input v-model.trim="search.word" placeholder="搜索词名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.order" placeholder="请选择">
          <el-option label="搜索次数正序" :value="1"></el-option>
          <el-option label="搜索次数倒序" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        显示:
        <el-select v-model="search.displayStatus" placeholder="全部">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="前端显示" :value="1"></el-option>
          <el-option label="前端不显示" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        热搜词:
        <el-select v-model="search.hotStatus" placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="getSearchWordList()" size="small">搜索</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="dialogVisible = true" size="small">创建</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="default-table">
        <el-table :data="tableList" border stripe class="table-border" fit @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <el-table-column label="序号" prop="id" align="center"></el-table-column>
          <el-table-column label="搜索词" prop="word" align="center"></el-table-column>
          <el-table-column label="搜索次数" prop="searchCount" align="center"></el-table-column>
          <el-table-column label="前端搜索显示状态" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleDisplay(scope.row)">
                {{ scope.row.displayStatus === 1 ? "显示" : "不显示" }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="是否为热搜词" align="center">
            <template slot-scope="scope">
              {{ scope.row.hotStatus === 1 ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-col :span="12">
                <template v-if="scope.row.hotStatus === 2">
                  <el-tooltip class="item" effect="dark" content="设置为热搜词" placement="bottom">
                    <icon-svg icon-class="hot" class-name="icon-size" @click="handleHot(1, scope.row)" />
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-tooltip class="item" effect="dark" content="取消热搜词" placement="bottom">
                    <icon-svg
                      icon-class="hot"
                      class-name="icon-hot"
                      v-if="scope.row.hotStatus === 1"
                      @click="handleHot(2, scope.row)"
                    />
                  </el-tooltip>
                </template>
              </el-col>
              <el-col :span="12">
                <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                  <icon-svg icon-class="delete" class-name="icon-size" @click="deleteSearchWord(scope.row.id)" />
                </el-tooltip>
              </el-col>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-dialog title="创建" :visible.sync="dialogVisible" width="30%" center custom-class="default-dialog">
      <el-form label-width="100px" :model="createSearchWord" ref="createSearchWord">
        <el-form-item label="搜索词名字" prop="word">
          <el-input v-model="createSearchWord.word"></el-input>
        </el-form-item>
        <el-form-item label="前端显示" prop="dispalyStatus">
          <el-select v-model="createSearchWord.dispalyStatus" placeholder="请选择显示状态">
            <el-option label="显示" :value="1"></el-option>
            <el-option label="不显示" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">保 存</el-button>
      </span>
    </el-dialog>
    <el-row class="margin-top">
      <el-button type="primary" @click="handleDisplay()">批量处理不显示</el-button>
    </el-row>
    <el-row>
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
import * as api from "@/api/searchWord";
import {mapGetters} from "vuex";
import pagination from "@/components/pagination/index.vue";
export default {
  name: "searchWordMangerList",
  components: {
    pagination
  },
  data() {
    return {
      countryOpt: [],
      dialogVisible: false,
      search: {
        region: "CN",
        word: "",
        order: 2,
        displayStatus: 0,
        hotStatus: 0
      },
      currentChecktList: [],
      tableList: [],
      createSearchWord: {
        dispalyStatus: null,
        word: ""
      },
      pagination: {
        index: 1,
        size: 12,
        total: 0
      }
    };
  },
  created() {
    this.getSearchWordList();
  },
  computed: {
    ...mapGetters(["getAreaList"])
  },
  methods: {
    handleSelectionChange(val) {
      this.currentChecktList = val;
    },
    getSearchWordList(index = 1) {
      this.pagination.index = index;
      this.search.index = this.pagination.index;
      this.search.size = this.pagination.size;
      api.getSearchWordList(this.search).then(res => {
        this.tableList = res.data;
        console.log(this.tableList);
        this.pagination.total = res.total;
      });
    },
    handleHot(state, row) {
      if (row.displayStatus === 2) {
        this.$message.error("不显示不能设置为热搜");
        return;
      }
      api
        .hotSearchWord({
          hotStatus: state,
          id: row.id
        })
        .then(res => {
          this.$message.success("操作成功~");
          this.getSearchWordList();
        });
    },
    //删除
    deleteSearchWord(id) {
      this.$messageBox
        .confirm("你确定要删除吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          api.deleteSearchWord({id}).then(res => {
            this.$message.success("删除成功~");
            this.getSearchWordList();
          });
        })
        .catch(() => {});
    },
    //确认
    handleConfirm() {
      this.createSearchWord.region = this.search.region;
      api
        .addSearchWord(this.createSearchWord)
        .then(res => {
          this.$message.success("添加成功~");
          this.dialogVisible = false;
          this.getSearchWordList();
          this.$refs["createSearchWord"].resetFields();
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    handleDisplay(item) {
      let parmas = {
        displayStatus: 0,
        ids: []
      };
      if (item) {
        item.displayStatus === 1 ? (parmas.displayStatus = 2) : (parmas.displayStatus = 1);
        parmas.ids.push(item.id);
      } else {
        parmas.displayStatus = 2;
        parmas.ids = this.currentChecktList.map(item => {
          return item.id;
        });
      }
      api
        .displaySearchWord(parmas)
        .then(res => {
          this.$message.success("操作成功~");
          this.getSearchWordList();
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getSearchWordList(this.pagination.index);
    }
  }
};
</script>

<style lang="less" scoped>
.icon-size {
  font-size: 30px;
}
.icon-hot {
  font-size: 30px;
  background-color: #ffb6c1;
  border-radius: 50%;
}
</style>
