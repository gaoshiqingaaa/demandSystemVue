<template>
  <div class="demand-container">
    <div>
      <el-table :data="tableData" style="width: 100%" class="demand-table" @row-dblclick="demandDetail" stripe
        empty-text="暂无数据" :header-cell-style="headerCssStyle" :row-style="tableRowStyle" :cell-style="tableCellStyle">
        <el-table-column prop="created_at" label=" 需求　时间" sortable width="62px" :formatter="formatterDate">
        </el-table-column>
        <el-table-column prop="dg_time" label="交稿　时间" sortable width="62px" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="scheduling_time" label="排期　时间" width="62px" sortable :formatter="formatterDate">
          <template slot-scope="scope">
            <div class="pqsj-color" @click="showSetSchedulingTime(scope.row)">
              {{ formatterDate(null, null, scope.row.scheduling_time) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="demand_user" label="需求人" width="60px" :formatter="formatterDemandUser"></el-table-column>
        <el-table-column prop="demand_flow" label="流程" width="40px" align="center" :formatter="formatterDemandFlow">
        </el-table-column>
        <el-table-column prop="demand_type" label="项目类型" width="70px" :formatter="formatterDemandType">
        </el-table-column>
        <el-table-column prop="name" label="项目名称" align="center">
          <template slot-scope="scope">
            <div @click="demandDetail(scope.row)">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="number" width="75px" label="编号" align="center">
          <template slot-scope="scope">
            <div @click="demandToSginEdit(scope.row)">
              {{ scope.row.number }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="执行人" width="60px">
          <template slot-scope="scope">
            <div @click="showExecutorDialog(scope.row)">
              {{ scope.row.executor | filtersExecutor(scope.row.sec_executor) }}
            </div>
          </template>
          <template slot-scope="scope">
            <div @click="showExecutorDialog(scope.row)">
              <span v-if="
                  scope.row.executor == null &&
                    scope.row.sec_executor.length == 0
                ">-</span>
              <span v-if="scope.row.executor">{{
                scope.row.executor.nickname || scope.row.executor.username
              }}</span>
              <template v-if="scope.row.sec_executor">
                <span style="color: #999" v-for="item in scope.row.sec_executor"
                  :key="item.nickname">/{{ item.nickname || item.username }}</span>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="last_manuscript_time" label="提交　时间" width="62px" align="center"
          :formatter="formatterDate"></el-table-column>

        <el-table-column prop="status" label="项目状态" width="70px" :formatter="formatterStatus"></el-table-column>
        <el-table-column v-if="getStatusComput" prop="score" label="评分" width="60px" :formatter="formatterScore">
        </el-table-column>
      </el-table>

      <el-pagination background layout="prev, pager, next" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize" :total="totalItems"></el-pagination>
    </div>
    <el-dialog title="选择执行人" :visible.sync="showExecutorVisible" width="450px" center @close="closeExecutorDialog">
      <div>
        <el-table :data="executorList" style="width: 100%" height="350px" border align="center" :show-header="false"
          :key="Math.random()">
          <el-table-column prop="date" label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.headimgurl" style="width: 30px;border-radius: 30px;vertical-align: middle;" />
              <span>{{ scope.row.nickname || scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="100px" label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.executive">主执行人</el-tag>
              <el-tag v-if="scope.row.sec_executive">辅执行人</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="80px">
            <template slot-scope="scope">
              <el-button type="danger" plain v-on:click="removeExecutive(scope.row)"
                v-if="scope.row.executive || scope.row.sec_executive">移除</el-button>
              <el-button type="primary" plain v-on:click="addExecutive(scope.row)" v-else>添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitExecutor">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置排期时间" :visible.sync="displayDialogSetSchedulingTime" width="20%">
      <el-date-picker v-model="schedulingTime" width="30%" type="datetime" placeholder="请选择排期时间"></el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="displayDialogSetSchedulingTime = false">取 消</el-button>
        <el-button type="primary" @click="setSchedulingTime">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExecutorList,
  getDemandList,
  getStatusList,
  setSchedulingTime,
  assignExecutor
} from "@/api/api.demand.js";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      doSearchLoading: true,
      fullScreenLoading: true,
      showExecutorVisible: false,
      executorList: [],
      executorChecked: [],
      executorForm: {
        executor: null,
        sec_executor: [],
        demand_id: null
      },
      statusList: [],
      displayDialogSetSchedulingTime: false,

      schedulingTime: null,
      selectedID: null
    };
  },

  filters: {
    timeFilter(val) {
      // return this.$moment(val).format('MM/DD dd HH:mm')
    },

    filtersExecutor(executor, sec_executor) {
      var executorArr = [];
      if (executor) {
        executorArr.push(executor.username);
      }

      if (Array.isArray(sec_executor) && sec_executor.length > 0) {
        sec_executor.forEach(function (item, index) {
          executorArr.push(item.username);
        });
      }

      return executorArr.length > 0 ? executorArr.join("/") : "-";
    }
  },
  computed: {
    getStatusComput() {
      let stat = this.$route.query.status;
      if (stat == 9) return true;
      return false;
    }
  },
  mounted: function () {
    if (!this.$store.getters.setIsLogin) {
      this.$router.push({
        name: "login"
      });
      return;
    }
    this.doSearch();
    this.init();
  },
  watch: {
    $route: "doSearch"
  },

  methods: {
    checkHasExecutive(executor) {
      let hasExecutive = false;
      executor.forEach((v, k) => {
        if (v.executive && v.executive == true) {
          hasExecutive = true;
        }
      });

      return hasExecutive;
    },

    addExecutive(row) {
      let mainExecutive = this.checkHasExecutive(this.executorList);
      this.executorList.forEach((v, k) => {
        if (v.id == row.id) {
          if (mainExecutive) {
            this.$set(this.executorList[k], "sec_executive", true);
          } else {
            this.$set(this.executorList[k], "executive", true);
          }
        }
      })
    },

    removeExecutive(row) {
      this.executorList.forEach((v, k) => {
        if (v.id == row.id) {
          this.$set(this.executorList[k], "executive", false);
          this.$set(this.executorList[k], "sec_executive", false);
        }
      });
    },

    setSchedulingTime(row) {
      console.log("setSchedulingTime", this.selectedID, this.schedulingTime);
      setSchedulingTime({
        id: this.selectedID,
        schedulingTime: this.schedulingTime
      }).then(response => {
        if (response.data.error_code == undefined) {
          this.$alert("修改完成");
          this.displayDialogSetSchedulingTime = false;
          this.doSearch();
        } else {
          this.$alert("修改失败:" + response.data.error_msg);
          return;
        }
      });
    },
    showSetSchedulingTime(row) {
      this.selectedID = row.id;
      if (this.selectedID == null) {
        return;
      }
      this.displayDialogSetSchedulingTime = !this
        .displayDialogSetSchedulingTime;
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.doSearch();
    },

    demandDetail(row) {
      console.log(row.id);
      let routeUrl = this.$router.resolve({
        name: "config_demand",
        query: {
          id: row.id,
          act: "edit"
        }
      });
      window.open(routeUrl .href, '_blank');
    },

    demandToSginEdit(row) {
      let routeUrl = this.$router.resolve({
        name: "manuscript",
        query: { demand_id: row.id }
      })
      window.open(routeUrl .href, '_blank');
    },

    closeExecutorDialog() {
      const _this = this;
      _this.showExecutorVisible = false;
      _this.executorForm.executor = "";
      _this.executorForm.sec_executor = [];
      _this.executorForm.demand_id = null;
    },

    async showExecutorDialog(row) {
      const _this = this;
      await this.getExecutorList();
      this.showExecutorVisible = true;
      this.executorForm.demand_id = row.id;
      if (row.executor) {
        this.executorChecked.push(row.executor.id);
        this.executorForm.executor = row.executor.id;
      }
      // todo
      if (row.executor !== null) {
        this.executorList.forEach((v, k) => {
          if (v.id == row.executor.id) {
            this.$set(this.executorList[k], "executive", true);
          }
        });
      }

      console.log(row.sec_executor);
      row.sec_executor.forEach((v, k) => {
        this.executorList.forEach((v1, k1) => {
          if (v.id == v1.id) {
            this.$set(this.executorList[k1], "sec_executive", true);
          }
        });
      });
    },

    executorChangeEvent(isChecked, val) {
      const _this = this;
      // 如果为选中
      if (isChecked) {
        if (
          _this.executorForm.executor == null ||
          _this.executorForm.executor == ""
        ) {
          _this.executorForm.executor = val;
        } else {
          if (_this.executorForm.sec_executor.indexOf(val) == -1) {
            _this.executorForm.sec_executor.push(val);
          }
        }
      } else {
        // 如果为取消选中
        // 先判断是否为主
        if (_this.executorForm.executor == val) {
          _this.executorForm.executor = null;
          if (_this.executorForm.sec_executor.length > 0) {
            _this.executorForm.executor = _this.executorForm.sec_executor[0];
            _this.$delete(_this.executorForm.sec_executor, 0);
          }
        } else {
          _this.$delete(
            _this.executorForm.sec_executor,
            _this.executorForm.sec_executor.indexOf(val)
          );
          // }
        }
      }
    },

    onSubmitExecutor() {
      let executorInfo = {
        executive: [],
        sec_executive: []
      };
      this.executorList.forEach((v, k) => {
        console.log(v);
        if (v.executive === true) {
          executorInfo.executive.push(v.id);
        }

        if (v.sec_executive === true) {
          executorInfo.sec_executive.push(v.id);
        }
      });

      assignExecutor(this.executorForm.demand_id, executorInfo).then(
        response => {
          if (response.error_code === 0) {
            this.$alert("更新执行人成功");
            this.doSearch();
            this.showExecutorVisible = false;
          } else {
            this.$alert("更新执行人失败:" + response.error_msg);
            this.showExecutorVisible = false;
          }
        }
      );
    },

    init() {
      const _this = this;
    },

    getExecutorList: async function () {
      let result = await getExecutorList();

      if (result) {
        this.executorList = result.results;
      } else {
        this.executorList = result.msg;
      }
    },

    async doSearch() {
      let statusList = await getStatusList();
      console.log("getStatusList", statusList);
      this.statusList = statusList.data;
      let params = {
        limit: 14,
        offset: (this.currentPage - 1) * 14,
        status: this.$route.query.status,
        demand_company: this.$route.query.demand_company,
        order: "-created_at"
      };
      if (this.$route.query.status == undefined) {
        params.status = "1,2,3,4,5,6,7";
      }

      getDemandList(params).then(response => {
        if (response) {
          this.tableData = [];
          this.currentPage = this.currentPage;
          this.totalItems = response.count;
          if (response.results) {
            response.results.forEach(v => {
              this.tableData.push(v);
            });
          }
        }

        this.doSearchLoading = false;
        this.fullScreenLoading = false;
      });
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////

    headerCssStyle() {
      return "background:#e8e8e8;color:#000;";
    },

    tableRowStyle({row, rowIndex}) {
      return "background-color: e8e8e8; height:50px;";
    },

    tableCellStyle() {
      return "padding: unset;padding-top: 10px;padding-bottom: 10px;padding-left: 1px;";
    },
    /**
     * 格式化项目状态
     * @param data
     * @returns {string}
     */
    formatterStatus(data) {
      let statusName = "";
      if (this.statusList) {
        this.statusList.forEach(value => {
          if (value.id == data.status) {
            statusName = value.status;
          }
        });
        return statusName;
      }
    },
    /**
     * 格式化项目状态
     * @param data
     * @returns {string}
     */
    formatterScore(data) {
      let statusName = "";
      let selectSummaryList = {
        1: "优秀",
        2: "合格",
        3: "凑合"
      };
      if (!data.score || !selectSummaryList[data.score]) return "-";
      return selectSummaryList[data.score];
    },

    formatterDemandCode() {},

    formatterDemandUser(row, column) {
      if (row.demand_user) {
        return row.demand_user.nickname;
      }
      return "-";
    },

    formatterDemandFlow(row, column) {
      return row.demand_flow.name;
    },

    formatterDemandType(row, column) {
      return row.demand_type ? row.demand_type.name : "-";
    },

    formatterDate(row, column, value) {
      if (value == null) {
        return "-";
      }
      return this.$moment(value).format("MM/DD dd HH:00");
    }
  }
};
</script>
<style lang="scss">
  @import '@/styles/list-style.scss';
</style>
