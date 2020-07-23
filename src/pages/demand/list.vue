<template>
  <div class="demand-container">
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="demand-table" stripe
        v-loading="tableLoading"
        @sort-change="handleSortChange"
        @filter-change="fnFilterChangeInit"
        empty-text="暂无数据" :header-cell-style="headerCssStyle" :row-style="tableRowStyle" :cell-style="tableCellStyle">
        <!-- <el-table-column prop="created_at" label=" 需求　时间" sortable width="62px" :formatter="formatterDate">
        </el-table-column>
        <el-table-column prop="dg_time" label="交稿　时间" sortable width="62px" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="scheduling_time" label="排期　时间" width="62px" sortable :formatter="formatterDate">
          <template slot-scope="scope">
            <div class="pqsj-color" @click="showSetSchedulingTime(scope.row)">
              {{ formatterDate(null, null, scope.row.scheduling_time) }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="created_at" label=" 需求　时间" sortable width="62px" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="dg_time" label="交稿　时间" sortable width="62px">
          <template slot-scope="scope">
            <div @click="showSetDgTime(scope.row)">
              {{ formatterDate(null, null, scope.row.dg_time) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="scheduling_time" label="排期　时间" width="62px" sortable>
          <template slot-scope="scope">
            <div class="pqsj-color" @click="showSetSchedulingTime(scope.row)">
              {{ formatterDate(null, null, scope.row.scheduling_time) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="demand_user" column-key="demand_user" label="需求　人" width="60px"
          :filters="filterListTable"
          :filter-method="filterDemandUserHandler"
          filter-placement="top"
          :formatter="formatterDemandUser"></el-table-column>
        <el-table-column
          prop="demand_flow"
          column-key="demand_flow"
          label="流　程"
          width="50px"
          align="center"
          :formatter="formatterDemandFlow"
          filter-placement="bottom"
          :filters="filterDemandFlow"
          :filter-method="filterDemandFlowHandler">
        </el-table-column>
        <el-table-column
          prop="demand_type_name"
          column-key="demand_type_name"
          label="项目　类型" width="63px"
          :filters="typeList"
          :filter-method="filterDemandTypeHandler"
          filter-placement="top"
          :formatter="formatterDemandType">
          <template slot-scope="{ row }">
             <div style="line-height: 30px" @click="showTypeDialog(row)">
              {{ formatterType(row) || '—' }}
              <!-- {{ scope.row.demand_type_name == '' ? '-' : scope.row.demand_type_name.name }} -->
            </div>
          </template>
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
        <el-table-column label="执行　人" 
          width="60px"
          column-key="executor"
          :filters="filterExecutorTable"
          :filter-method="filterExecutorHandler"
          filter-placement="top"
          :formatter="formatterExecutor">
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
        <el-table-column prop="last_manuscript_time" label="提交　时间" width="62px" align="center" sortable :formatter="formatterDate"></el-table-column>
        <el-table-column
          prop="status"
          label="项目　状态"
          column-key="status"
          width="63px"
          :filters="getStatusListFilter"
          :filter-method="filterDemandStatusHandler"
          filter-placement="top"
          :formatter="formatterStatus">
          <!-- <template slot="header" slot-scope="{ column, $index}">
            <c-sortable
              :column="column"
              :list="statusList"
              propVal="status"></c-sortable>
          </template> -->
          <template slot-scope="{ row }">
             <div style="line-height: 30px" @click="showStatusDialog(row)">
              {{ formatterStatus(row) || '—' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="actual_duration" label="实际　耗时" width="62px" align="center" sortable></el-table-column>
        <!-- <el-table-column prop="status" label="项目状态" width="70px" :formatter="formatterStatus"></el-table-column> -->
        <el-table-column v-if="getStatusComput" prop="score" label="评分" width="60px" :formatter="formatterScore">
          <template slot-scope="{ row }">
             <div style="line-height: 30px" @click="showScoresDialog(row)">
              {{ formatterScore(row) || '—' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="actual_duration" label="备注" width="110px" align="center">
          <template slot-scope="{ row }">
            <div class="list-remarks cc-pad-6" @click="showRemarksDialog(row)">
              <div v-if="row.demand_remarks.length > 0" class="time">{{ row.demand_remarks[0].content || '' }}</div>
              <div class="content" v-else>{{ row.remarks || '点击填写' }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="prev, pager, next, slot" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="currentPage"
        :page-size="pageSize" :total="totalItems">
        <span style="margin-left: 20px;line-height: 34px;font-size: 13px;font-weight: normal;color: #606266;">共{{ Math.ceil(totalItems/14) }}页</span>
        </el-pagination>
    </div>
    <!-- 弹窗 设置执行人 -->
    <el-dialog
      title="选择执行人"
      :visible.sync="showExecutorVisible"
      width="450px" center
      :destroy-on-close="true"
      @close="closeExecutorDialog" >
      <div style="width: 100%">
        <el-table :data="executorList"
          style="width: 100%"
          align="center"
          height="300px"
          :show-header="false">
          <el-table-column prop="date" label="选择" width="50px">
            <template slot-scope="{row}">
              <el-checkbox :value="row.executive || row.sec_executive"
                @change="handleExecutorCheckboxClick($event, row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="头像">
            <template slot-scope="scope">
              <img :src="scope.row.headimgurl" style="width: 30px;border-radius: 30px;vertical-align: middle;" />
              <span>{{ scope.row.nickname || scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="50px" label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.executive">主</el-tag>
              <el-tag type="info" v-if="scope.row.sec_executive">辅</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 100%;"
          type="primary" @click="onSubmitExecutor">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="设置排期时间"
      :visible.sync="displayDialogSetSchedulingTime"
      :destroy-on-close="true"
      width="260px">
      <el-date-picker v-model="schedulingTime" width="30%" type="datetime" placeholder="请选择排期时间"></el-date-picker>
      <div v-if='showTips' style="margin: 10px 0 0;color: red;font-size: 12px;">所选时间不能早于需求时间,晚于交稿时间</div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 100%;"
          type="primary"
          @click="setSchedulingTime">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="设置交稿时间"
      :visible.sync="displayDialogSetDgTime"
      :destroy-on-close="true"
      width="260px">
      <el-date-picker v-model="dgTime" width="30%" type="datetime" placeholder="设置交稿时间"></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 100%;"
          type="primary"
          @click="setDgTime">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 设置项目状态 -->
    <el-dialog
      title="选择项目状态"
      :visible.sync="showStatusVisible"
      width="260px" center
      :destroy-on-close="true"
      @close="showScoreVisible = false" >
      <div style="width: 100%; min-height: 200px">
        <el-radio-group v-model="radioStatusValue">
          <div class="c-list-score" v-for="item in statusList" :key="item.id">
            <el-radio :label="item.id">{{ item.status }}</el-radio>
          </div>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 100%;"
          type="primary" @click="handleSubimtStatus" :loading="submitLoading">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 设置项目类型 -->
    <el-dialog
      title="选择项目类型"
      :visible.sync="showTypeVisible"
      width="260px" center
      :destroy-on-close="true"
      @close="showScoreVisible = false" >
      <div style="width: 100%; min-height: 200px">
        <el-radio-group v-model="radioTypeValue">
          <div class="c-list-score" v-for="item in typeList" :key="item.value">
            <el-radio :label="item.value">{{ item.text }}</el-radio>
          </div>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 100%;"
          type="primary" @click="handleSubimtType" :loading="submitLoading">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择评分"
      :visible.sync="showScoreVisible"
      :destroy-on-close="true"
      width="260px" center
      @close="showScoreVisible = false" >
      <div style="width: 100%; height: 200px">
        <el-radio-group v-model="radioScoreValue">
          <div class="c-list-score" v-for="item in scoreList" :key="item.id">
            <el-radio :label="item.id">{{ item.text }}</el-radio>
          </div>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 100%;"
          type="primary"
          @click="handleSubimtScore" :loading="submitLoading">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 添加备注 -->
    <el-dialog
      title="添加备注"
      :visible.sync="showRemarksVisible"
      width="450px" center
      :destroy-on-close="true"
      @close="showRemarksVisible = false" >
      <div style="width: 100%; min-height: 200px">
        <el-scrollbar
          ref="scrollbarRemarks"
          tag="div"
          :view-style="{ height: '360px' }"
          :noresize="false">
          <div class="cc-pad-r-10">
            <div class="cc-mar-b-26 rmak-input">
              <div class="cc-tc-t3 cc-mar-b-6">{{ getUserInfo.nickname ? getUserInfo.nickname : getUserInfo.username  }} {{ getCurrentTime }}</div>
              <el-input type="textarea" :rows="3" placeholder="请填写备注"
                v-model="remarksObj.content">
              </el-input>
            </div>
            <div>
              <div class="cc-mar-b-26 rmak-list"
                v-for="item in allRemarksList" :key="item.id">
                <div class="cc-mar-b-6 cc-tc-t3">{{ item | fmtRemarkValue }}</div>
                <el-input type="textarea" :rows="2" readonly placeholder="请填写备注"
                  :value="item.data.content">
                </el-input>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 100%;"
          type="primary" @click="handleSubimtRemarks" :loading="submitLoading">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getExecutorList,
  getDemandList,
  getStatusList,
  setSchedulingTime,
  assignExecutor,
  getRemarkList,
  createRemark,
  createOrUpdateDemand,
  apiGetDemandType,
  getCountList
} from "@/api/api.demand.js";
import { setDemandScore } from '@/api/api.manuscript.js'
import { getPartyBList } from "@/api/api.user.js";
import CSortable from '@/components/CSortable'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  components: { CSortable },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 14,
      totalItems: 0,
      doSearchLoading: true,
      fullScreenLoading: true,
      showExecutorVisible: false,

      showScoreVisible: false,
      showStatusVisible: false,
      showTypeVisible: false,
      showRemarksVisible: false,
      radioScoreValue: null,
      radioStatusValue: null,
      radioTypeValue: null,
      remarksObj: {
        content: ''
      },
      allRemarksList: [],
      submitLoading: false,
      executorList: [],
      executorChecked: [],
      executorForm: {
        executor: null,
        sec_executor: [],
        demand_id: null
      },
      statusList: [],
      typeList: [],
      filterListTable: [],
      filterExecutorTable: [],
      filterDemandFlow: [],
      displayDialogSetSchedulingTime: false,
      displayDialogSetDgTime: false,
      schedulingTime: null,
      dgTime: null,
      selectedID: null,
      scoreList: [
        { id: '', text: '-' },
        { id: 1, text: '优秀' },
        { id: 2, text: '合格' },
        { id: 3, text: '凑合' },
      ],
      filterData: {
            demand_user: [],
            demand_flow: [],
            demand_type_name: [],
            executor: [],
            status: []
        },
        order: '-dg_time',
        showTips: false,
        commonRow: {},
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
    },
    fmtRemarkValue(item) {
      let { data, user } = item
      let username = user.nickname ? user.nickname : user.username
      let time = moment(data.created_at).format('YYYY.MM.DD')
      return username + ' ' + time
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getIsListSelf']),
    getStatusComput() {
      let stat = this.$route.query.status;
      if (stat == 9) return true;
      return false;
    },
    getCurrentTime() {
      return moment(new Date()).format('YYYY.MM.DD')
    },
    getStatusListFilter() {
      return this.statusList.map(e => {
        return { text: e.status, value: e.id }
      })
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
    $route: "doSearch",
    getIsListSelf: 'doSearch'
  },

  methods: {
    // 保存评分提交
    handleSubimtScore(row) {
      if (!this.t_currentRow) return
      let id = this.t_currentRow.id
      let obj = { demandId: id, score: this.radioScoreValue }
      this.submitLoading = true
      setDemandScore(obj).then(res => {
        this.submitLoading = false
        this.$set(this.t_currentRow, 'score', this.radioScoreValue)
        setTimeout(() => { this.showScoreVisible = false }, 300)
      }).catch(err => {
        this.submitLoading = false
      })
    },
    // 设置状态
    showScoresDialog(row) {
      console.log('sss')
      this.t_currentRow = row
      this.showScoreVisible = true
      this.radioScoreValue = row.score
    },

    // 提交状态
    handleSubimtStatus(row) {
      if (!this.t_currentRow) return
      let id = this.t_currentRow.id
      let t_row = JSON.parse(JSON.stringify(this.t_currentRow))
      t_row.status = this.radioStatusValue
      t_row.demand_user = t_row.demand_user.id
      // t_row.reviewer_user = t_row.reviewer_user.id
      t_row.demand_flow = t_row.demand_flow.id
      t_row.demand_company = t_row.demand_company && t_row.demand_company.id
      this.submitLoading = true
      console.log('this.radioStatusValue', this.radioStatusValue)
      console.log('row', t_row)
      createOrUpdateDemand('PUT', t_row, id).then(res => {
        this.submitLoading = false
        this.$set(this.t_currentRow, 'status', this.radioStatusValue)
        setTimeout(() => { this.showStatusVisible = false }, 300)
      }).catch(err => {
        this.submitLoading = false
      })
    },
    // 提交类型
    handleSubimtType(row) {
      console.log(this.t_currentRow)
      if (!this.t_currentRow) return
      let id = this.t_currentRow.id
      let t_row = JSON.parse(JSON.stringify(this.t_currentRow))
      t_row.demand_type_name = this.radioTypeValue
      // this.typeList.forEach((key, value) => {
      //   if (key.text == this.radioTypeValue) {
      //       t_row.demand_type_name = key.value
      //   }
      // })
      t_row.demand_user = t_row.demand_user.id
      // t_row.reviewer_user = t_row.reviewer_user.id
      t_row.demand_flow = t_row.demand_flow.id
      t_row.demand_company = t_row.demand_company && t_row.demand_company.id
      this.submitLoading = true
      console.log('this.radioStatusValue', this.radioStatusValue)
      console.log('row', t_row)
      createOrUpdateDemand('PUT', t_row, id).then(res => {
        this.submitLoading = false
        this.$set(this.t_currentRow, 'demand_type_name', this.radioTypeValue)
        this.getCountList();
        setTimeout(() => { this.showTypeVisible = false }, 300)
      }).catch(err => {
        this.submitLoading = false
      })
    },
    // 设置状态
    showStatusDialog(row) {
      console.log('sss')
      this.t_currentRow = row
      this.showStatusVisible = true
      this.radioStatusValue = row.status
    },
    // 设置类型
    showTypeDialog(row) {
      console.log('sss')
      this.t_currentRow = row
      this.showTypeVisible = true
      if (row.demand_type_name == null) {
        this.radioTypeValue = ''
      } else {
        this.radioTypeValue = row.demand_type_name
      }
    },

    // 添加备注
    showRemarksDialog(row) {
      console.log('sss', row)
      this.t_currentRow = row
      this.showRemarksVisible = true
      // this.radioStatusValue = row.status
      getRemarkList({ demandID: row.id }).then(res => {
        this.allRemarksList = res
        this.$nextTick(this.$refs['scrollbarRemarks'].update)
        console.log('res', res)
      })
    },

    // 提交备注
    handleSubimtRemarks() {
      if (!this.t_currentRow) return
      let { id } = this.t_currentRow
      let param = Object.assign({ demandId: id }, this.remarksObj)
      this.submitLoading = true
      createRemark(param).then(res => {
        this.submitLoading = false
        setTimeout(() => { this.showRemarksVisible = false }, 300)
        this.remarksObj.content = ''
      }).catch(err => {
        this.submitLoading = false
        setTimeout(() => { this.showRemarksVisible = false }, 300)
      })
    },
    // 选择执行人点击一行的方法
    handleExecutorCheckboxClick(v, row) {
      if (v) {
        let mainExecutive = this.checkHasExecutive(this.executorList);
        if (mainExecutive) {
          this.$set(row, "sec_executive", true);
        } else {
          this.$set(row, "executive", true);
        }
      } else {
        this.$set(row, "executive", false);
        this.$set(row, "sec_executive", false);
      }
    },
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
      const createTime = this.$moment(this.commonRow.created_at).unix();
      const dgTime = this.$moment(this.commonRow.dg_time).unix();
      const currentPickerTime = this.$moment(this.schedulingTime).unix();
      if (createTime > currentPickerTime || dgTime < currentPickerTime) {
          this.showTips = true
      } else {
        this.showTips = false
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
      }
    },
    setDgTime(row) {
      console.log(this.t_currentRow)
      if (!this.t_currentRow) return
      let id = this.t_currentRow.id
      let t_row = JSON.parse(JSON.stringify(this.t_currentRow))
      t_row.dg_time = this.dgTime
      t_row.demand_user = t_row.demand_user.id
      // t_row.reviewer_user = t_row.reviewer_user.id
      t_row.demand_flow = t_row.demand_flow.id
      t_row.demand_company = t_row.demand_company && t_row.demand_company.id
      this.submitLoading = true
      console.log('this.radioStatusValue', this.radioStatusValue)
      console.log('row', t_row)
      createOrUpdateDemand('PUT', t_row, id).then(res => {
        this.submitLoading = false
        // this.$set(this.t_currentRow, 'demand_type_name.id', this.radioTypeValue)
        setTimeout(() => { this.displayDialogSetDgTime = false;this.doSearch(); }, 300)
      }).catch(err => {
        this.submitLoading = false
      })
    },
    showSetSchedulingTime(row) {
      this.commonRow = row
      this.selectedID = row.id;
      if (this.selectedID == null) {
        return;
      }
        this.displayDialogSetSchedulingTime = !this
        .displayDialogSetSchedulingTime;
    },
    showSetDgTime(row) {
        this.t_currentRow = row
        this.selectedID = row.id;
        if (this.selectedID == null) {
            return;
        }
        this.displayDialogSetDgTime = !this.displayDialogSetDgTime;
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
      // apiGetDemandType().then(response => {
      //   if (response && response.results) {
      //     console.log('type', response.results)
      //     this.typeList = response.results.map(e => {
      //       return { text: e.name, value: e.name }
      //     })
      //     console.log(this.typeList)
      //   }
      // })
      this.getCountList();
      getExecutorList().then(res => {
        let { results } = res
        if(results) {
          console.log('userlist', results)
          this.filterListTable = results.map(e => {
            return { text: e.nickname ? e.nickname : e.username, value: e.id }
          })
        }
      })
      getPartyBList().then(res => {
        let { userList } = res
        if(userList) {
          this.filterExecutorTable = userList.map(e => {
            return { text: e.nickname ? e.nickname : e.username, value: e.id }
          })
        }
      })
    },

    getExecutorList: async function () {
      // let result = await getExecutorList();
      let result = await getPartyBList();
      console.log('res---', result)
      if (result) {
        this.executorList = result.userList;
      } else {
        this.executorList = result.msg;
      }
    },
    // 获取分类统计数据
    getCountList() {
      getCountList()
        .then(res => {
          if (res && res.data) {
            let {status, demand_company} = this.$route.query;
            demand_company = demand_company || 0
            if (status == 8) {
              this.typeList = res.data.shelved_count.company_list.filter(item => item.id == demand_company)[0].demand_type_list || []
              this.filterDemandFlow = res.data.shelved_count.company_list.filter(item => item.id == demand_company)[0].demand_flow_list || []
            } else if(status == 9) {
              this.typeList = res.data.completed_count.company_list.filter(item => item.id == demand_company)[0].demand_type_list || []
              this.filterDemandFlow = res.data.completed_count.company_list.filter(item => item.id == demand_company)[0].demand_flow_list || []
            } else {
              this.typeList = res.data.to_be_completed_count.company_list.filter(item => item.id == demand_company)[0].demand_type_list || []
              this.filterDemandFlow = res.data.to_be_completed_count.company_list.filter(item => item.id == demand_company)[0].demand_flow_list || []
            }
            this.typeList = this.typeList.map(item => {
              return { text: `${item.name}(${item.count || 0})`, value: item.name }
            })
            this.filterDemandFlow = this.filterDemandFlow.map(item => {
              return { text: `${item.name}(${item.count || 0})`, value: item.name }
            })
          } 
        })
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
        order: this.order,
        filter: this.filterData
      };
      if (this.$route.query.status == undefined) {
        params.status = "1,2,3,4,5,6,7";
      }
      params.owner = this.getIsListSelf ? 1 : 0
      this.tableLoading = true
      getDemandList(params).then(response => {
        if (response) {
          this.currentPage = this.currentPage
          this.totalItems = response.count
          this.tableData = response.results
        }
        this.doSearchLoading = false
        this.fullScreenLoading = false
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
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
     * 格式化项目类型
     * @param data
     * @returns {string}
     */
    formatterType(data) {
        return data.demand_type_name || '-'
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

    formatterExecutor(row, column) {
      if (row.demand_user) {
        return row.demand_user.nickname;
      }
      return "-";
    },

    formatterDemandFlow(row, column) {
      return row.demand_flow.name;
    },

    formatterDemandType(row, column) {
      return row.demand_type_name || "-";
    },

    formatterDate(row, column, value) {
      if (value == null) {
        return "-";
      }
      return this.$moment(value).format("MM/DD dd HH:mm:ss");
    },

    // table filter

    filterDemandFlowHandler(value, row, column) {
    //   console.log(column['property'])
    //   const property = column['property']
    //   return row[property].name === value
        return true
    },
    filterDemandStatusHandler(value, row, column) {
    //   const property = column['property']
    //   return row[property] === value
        return true
    },
    filterDemandTypeHandler(value, row, column) {
    //     console.log(22222)
    //   const property = column['property']
    //   return row[property].id === value
        return true
    },
    filterDemandUserHandler(value, row, column) {
    //   const property = column['property']
    //   return row[property].id === value
        return true
    },
    filterExecutorHandler(value, row, column) {
    //   const property = column['property']
    //   return row[property].id === value
        return true
    },

    // 表格排序
    handleSortChange(column, prop, order) {
        let index;
        if (column.order == 'descending') {
            index = "-"
        } else if (column.order == 'ascending') {
            index = ''
        }
        if (column.order == 'descending' || column.order == 'ascending') {
            if (column.prop == 'created_at') {
                this.order  = index + 'created_at'
            } else if(column.prop == 'dg_time') {
                this.order  = index + 'dg_time'
            } else if(column.prop == 'scheduling_time') {
                this.order  = index + 'scheduling_time'
            } else if(column.prop == 'last_manuscript_time') {
                this.order  = index + 'scheduling_time'
            } else if(column.prop == 'actual_duration') {
                this.order  = index + 'actual_duration'
            } 
        } else {
            this.order  = '-created_at'
        }
        this.currentPage = 1;
        this.doSearch()
    },
    fnFilterChangeInit(filter) {
        if (filter['demand_user']) {
            this.filterData.demand_user = filter['demand_user'] || ''
        }
        if (filter['demand_flow']) {
            this.filterData.demand_flow = filter['demand_flow'] || ''
        }
        if (filter['demand_type_name']) {
            this.filterData.demand_type_name = filter['demand_type_name'] || ''
        }
        if (filter['executor']) {
            this.filterData.executor = filter['executor'] || ''
        }
        if (filter['status']) {
            this.filterData.status = filter['status'] || ''
        }
        this.doSearch()
    }
    
  }
};
</script>
<style lang="scss">
  @import '@/styles/list-style.scss';
</style>
