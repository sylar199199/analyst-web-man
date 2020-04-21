<template>
  <el-dialog
    title="投诉详情"
    :visible="dialogVisible"
    width="1000px"
    :before-close="handleClose"
    center
    custom-class="default-dialog"
  >
    <span>投诉对象: {{ articleId }} - {{ title }}</span>
    <el-row>
      <div class="default-table">
        <table>
          <thead>
            <tr>
              <th>投诉者Id</th>
              <th>用户昵称</th>
              <th>投诉时间</th>
              <th>投诉标签</th>
              <th>原因描述</th>
            </tr>
          </thead>
          <tbody v-for="item in tableList" :key="item.name">
            <tr class="text-center">
              <td>{{ item.userId }}</td>
              <td>{{ item.nickname }}</td>
              <td>{{ item.createTime | formatDate }}</td>
              <td>
                <span v-for="(tag, index) in item.tagNames" :key="index">
                  {{ tag }}
                </span>
              </td>
              <td>{{ item.content }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-row>
    <pagination
      :page-total="pagination.total"
      :page-index="pagination.index"
      :page-size="pagination.size"
      @onCurrentChange="onChangeCommentPageHandle"
    ></pagination>
  </el-dialog>
</template>
<script>
import * as api from "@/api/contentManager";
import pagination from "@/components/pagination/index.vue";
import {formatDate} from "@/utils/mUtils";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    articleId: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      currentContent: {},
      tableList: [],
      pagination: {
        index: 1,
        size: 20,
        total: 0
      }
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.getComplaintList();
      }
    },
    articleId(id) {
      this.getComplaintList();
    }
  },
  components: {
    pagination
  },
  filters: {
    formatDate
  },
  methods: {
    getComplaintList() {
      let params = {
        index: this.pagination.index,
        objId: this.articleId,
        objType: 1,
        size: this.pagination.size
      };
      api.getReportedRecord(params).then(res => {
        this.tableList = res.data;
        this.pagination.total = res.total;
      });
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getComplaintList(this.currentContent);
    }
  }
};
</script>
<style lang="less" scoped></style>
