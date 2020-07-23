<!--
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-05-19 13:14:22
 * @FilePath: \alien-docsg:\CaryFile\project\project-resources\demandSystemVue\src\pages\manuscript\sgin-edit.vue
--> 
<template>
  <div :style="{'height': sginEditHeight + 'px' }" class="sgin-edit-contriner">
    <div class="edit-contriner">
      <div class="left">
        <div class="left-card ">
          <div class="left-btn-upload" @click="handleManuListUpload">+上传稿件</div>
        </div>
        <el-scrollbar
          ref="scrollbarLeft"
          tag="div"
          :view-style="{ height: (sginEditHeight - 74) + 'px' }"
          :noresize="false">
          <div
            v-for="(item, index) in getmanucriptList"
            :key="String(index) + item.manuscriptId">
            <div class="left-control">
              <div class="title">稿件-{{ index + 1 }}</div>
              <div>
                <el-switch v-model="item.isPublic" active-color="#00CBCA" inactive-color="#cccccc"/>
                <span class="gray" :class="{'mu-color': item.isPublic}"> 内</span>
              </div>
            </div>
            <div class="left-card left-item">
              <div class="item-img" :class="{ 'img-active': item === leftCurrentItem }"
                @click="handleLeftListClick(item, index)">
                <div class="success"></div>
                <span class="close" @click.stop="handleLeftListDelClick(item, index)">x</span>
                <el-image
                  v-if="isSouceFileAnimage(item.t_currClickVersion && item.t_currClickVersion.url)" 
                  class="cc-left-th-image"
                  :src="item.t_currClickVersion && item.t_currClickVersion.url" fit="contain"/>
                <div v-else class="not-img cc-vh-container">
                  <div style="width: 100%;">
                    <i style="font-size: 38px; color: #999" class="el-icon-document"></i>
                    <div style="margin-top: 10px">{{ getFilePathName(item.t_currClickVersion && item.t_currClickVersion.url) || '' }}</div>
                  </div>
                </div>
              </div>
              <div class="item-control">
                <left-more :item="item"/>
              </div>
            </div>
          </div>
          <div>
            <div class="left-control">
              <div class="title">稿件-{{ getmanucriptList.length + 1 || 1 }}</div>
              <div>
                <el-switch v-model="value1" active-color="#00CBCA" inactive-color="#ff4949"/> 内
              </div>
            </div>
            <div class="left-card left-item">
              <div class="item-img">
                <el-upload
                  class="left-upload-demo"
                  drag
                  :show-file-list="false"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :before-upload="handleBeforeUpload">
                  <i class="el-icon-upload c-sginedit-icon-upload"></i>
                  <div class="el-upload__text mu-color">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <div style="text-align:right;font-size: 12px;color: #bbb">{{progressNum}}</div>
                <div class="not-img cc-vh-container">
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="middle">
        <div class="content">
          <div class="cc-vh-container">
            <div class="main-content" :style="{ 'height': sginMainHeight + 'px' }">
              <div class="c-main-img">
                <el-image
                  v-if="isSouceFileAnimage(getCurrentSourcePath)"
                  class="cc-main-image"
                  :src="getCurrentSourcePath" fit="contain">
                  <div slot="error" style="height: 100%" class="c-el-image-error">
                    <div><img class="file-empty" src="@/assets/svg/file-empty.svg" alt=""></div>
                    <div class="text-empty">当前暂无稿件</div>
                  </div>
                </el-image>
                <div v-else style="height: 100%" class="c-el-image-error">
                  <div><img class="file-empty" src="@/assets/svg/file-empty.svg" alt=""></div>
                  <div class="text-empty">{{ getFilePathName(getCurrentSourcePath) || '当前暂无稿件' }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="cc-vh-container empty">
            <div class="main-content">
              <div><img class="file-empty" src="@/assets/svg/file-empty.svg" alt=""></div>
              <div class="text-empty">当前暂无稿件</div>
            </div>
          </div> -->
        </div>
      </div>
      <div class="right">
        <el-scrollbar
          ref="scrollbarRight"
          tag="div"
          :view-style="{ height: (sginEditHeight) + 'px' }"
          :noresize="true">
          <div style="overflow: hidden;">
            <div class="cc-card">
              <el-form ref="form" label-width="90px" label-position="left">
                <el-form-item label="设计说明">
                  <el-input autosize type="textarea" v-model="leftCurrentItem.designDescription" size="small"></el-input>
                </el-form-item>
              </el-form>
              <div>修改意见</div>
              <div style="height: 10px"/>
              <div class="right-content">
                <div class="new-add">
                  <el-row>
                    <el-col :span="10">
                      <el-input
                        v-show="!getRightCurrentIimage"
                        v-model="mainAssetPath" 
                        class="c-paste-input"
                        readonly
                        placeholder="粘贴图片在这里"
                        @blur="IsRightInputFocus = false"
                        @focus="handlePasteFocusChange"/>
                        <el-image
                          v-show="getRightCurrentIimage"
                          class="right-img"
                          :src="getRightCurrentIimage" fit="contain"/>
                      <!-- <img v-else class="right-img" :src="getRightCurrentIimage" alt=""> -->
                    </el-col>
                    <el-col :span="14">
                      <el-input
                        v-model="rightProposalObj.Opinion"
                        type="textarea"
                        :rows="6"
                        placeholder="请输入内容"/>
                    </el-col>
                  </el-row>
                  <div class="rig-control">
                    <div class="title">
                      <el-link
                        :underline="false"
                        class="c-btn"
                        icon="el-icon-upload" @click="handleReUploadFile">重传</el-link>
                      <!-- <el-link
                        :underline="false"
                        class="c-btn"
                        icon="el-icon-delete-solid" @click="handleReUploadFile">删除</el-link> -->
                    </div>
                    <!-- <div><i class="el-icon-arrow-up c-icon"></i></div> -->
                  </div>
                  <div style="height: 10px"/>
                  <el-button style="padding: 10px !important" 
                    :disabled="getIsCreateOption"
                    @click="handleCreateOption">提交意见</el-button>
                </div>
                <div style="height: 10px"/>
                <el-collapse :value="getOpenCommentList" accordion @change="updateScrollbar">
                  <el-collapse-item
                    v-for="(item, index) in commentList"
                    :key="item.id"
                    :name="item.id">
                    <template slot="title">
                      <span class="mu-color">意见{{ index + 1 }}</span>
                      <span>　{{getUserNme}}　|　</span>
                      <span>{{ item.created_at | fmtSFM }}</span>
                      <div style="margin: 0 8px 0 auto;">
                        <el-checkbox 
                          class="cc-strik-state"
                          v-model="item.strikethrough"
                          @change="striketroughChange($event, item)">{{ item.strikethrough ? '已改':'未改' }}</el-checkbox>
                      </div>
                    </template>
                    <div>
                      <el-row>
                        <el-col :span="10">
                          <el-image
                            class="right-img"
                            :src="item.url" fit="contain"/>
                          <!-- <img class="right-img" src="@/assets/images/test.png" alt=""> -->
                        </el-col>
                        <el-col :span="14">
                          <div>
                            <el-input type="textarea" autosize v-if="item.strikethrough" v-model="item.Opinion" placeholder="请输入内容"></el-input>
                            <el-input type="textarea" autosize v-else v-model="item.Opinion" placeholder="请输入内容"></el-input>
                          </div>
                          <!-- <el-input v-model="item.Opinion"
                            type="textarea" :rows="6" readonly/> -->
                        </el-col>
                      </el-row>
                      <div class="rig-control">
                        <div class="title">
                          <el-link
                            :underline="false"
                            class="c-btn"
                            icon="el-icon-upload" @click="handleOpinionReUpload(item)">重传</el-link>
                          <el-link
                            :underline="false"
                            class="c-btn"
                            icon="el-icon-delete" @click="handleOpinionDel(item)">删除</el-link>
                        </div>
                        <el-button @click="saveThisArea(item,index)" style="height: 24px;padding: 6px 15px;">保存</el-button>
                        <!-- <div>
                          <el-checkbox 
                            class="cc-strik-state"
                            v-model="item.strikethrough"
                            @change="striketroughChange($event, item)">{{ item.strikethrough ? '已改':'未改' }}</el-checkbox>
                        </div> -->
                      </div>
                      <div style="height: 10px"/>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div class="cc-linebg"></div>
            <div class="cc-card">
              <template v-if="isGetShowSummaryList">
                <el-form ref="form" label-width="90px" label-position="left">
                  <el-form-item label="评分">
                    <el-select style="width: 100%" v-model="selectSummary" placeholder="请选择" size="small" @change="handleSummaryChange">
                      <el-option v-for="item in selectSummaryList" :key="item.id"
                        :label="item.text"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="isGetShowSummaryList" label="项目总结">
                    <el-input
                      v-model="inputSummaryText"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入内容"/>
                  </el-form-item>
                  <el-form-item v-if="isGetShowSummaryList">
                    <el-button style="padding: 10px !important" 
                      :disabled="!getInputSummaryTextEmpty"
                      @click="handleCreateSummary">添加总结</el-button>
                  </el-form-item>
                </el-form>
                <div>
                  <el-collapse :value="summaryList.map(e => e.id)">
                    <el-collapse-item v-for="item in summaryList" :key="item.id" :name="item.id">
                      <template slot="title">
                        <div style="flex: 1;" class="cc-dl">
                          <div>
                            {{ item.userName | fmtUserName }} | {{ item.created_at || '' }}
                          </div>
                          <div style="margin: 0 8px 0 auto;" @click.stop="handleSummaryDel(item)">
                            <i class="el-icon-delete"></i>
                          </div>
                        </div>
                      </template>
                      <div class="summary-bor">{{ item.summary || '' }}</div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </template>
              <el-form ref="form" label-width="90px" label-position="left">
                <el-form-item label="原文件链接">
                  <el-input
                    v-model="leftCurrentItem.sourceFile"
                    type="textarea"
                    :rows="3" size="small"></el-input>
                </el-form-item>
                <el-form-item label="耗时明细">
                  <el-popover
                    style="padding: 0"
                    placement="bottom-start"
                    width="276"
                    trigger="click"
                    popper-class="cc-dropDown-time"
                    @show="dropDownVisibleChange = true"
                    @hide="dropDownVisibleChange = false">
                    <el-scrollbar
                      ref="scrollbar"
                      tag="div"
                      :view-style="{ height: '200px' }"
                      :noresize="false">
                      <ul class="c-timeline">
                        <li v-for="item in getTimeLineList" :key="item.id">
                          <span>{{ item.startTime | fmtDT }} - {{ item.endTime | fmtDT }} {{ item | fmtHS }}</span> {{ item.type_str || '' }}
                        </li>
                      </ul>
                    </el-scrollbar>
                    <div slot="reference" class="cc-panle">
                      <div class="title">
                        共 {{ getTimeLineTimeCount }} <span :style="{'color': timeLineStatus.color || '#666'}">{{ timeLineStatus.tag || '' }}</span>
                      </div>
                      <div>
                        <i class="c-icon" :class="[dropDownVisibleChange ? 'el-icon-arrow-up':'el-icon-arrow-down']"></i>
                      </div>
                    </div>
                  </el-popover>
                </el-form-item>
                <el-form-item label="修改次数">
                  <div class="gray">{{ getDemandEditCount }}次</div>
                </el-form-item>
                <el-form-item class="share_link" label="需求人">
                  <div class="">{{ getNickName }}</div>
                </el-form-item>
                <el-form-item class="share_link" label="项目名称">
                  <div class="">{{ getDemandName }}</div>
                </el-form-item>
                <el-form-item class="share_link" label="稿件链接">
                  <div class="">{{ getShareUrl }}</div>
                </el-form-item>
                <el-form-item label="">
                  <el-button
                    data-clipboard-action="copy"
                    :data-clipboard-text="'需求人 ' + getNickName + '\n' + '项目名称 ' + getDemandName + '\n' + '稿件链接 ' + getShareUrl"
                    class="btn btn-theme btn-copy"
                    ref="copy_button">复制</el-button>
                </el-form-item>
                <el-form-item label="">
                  <div class="btn-submit" @click="handleManuSubmit">提交</div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <upload-file ref="myUploadFile" />
    <image-viewer v-if="showViewer" :on-close="this.showViewer = false" :url-list="previewSrcList"/>
  </div>
</template>

<script>
import LeftMore from './component/left-more'
import UploadFile from './component/uploadfil'
import {
  getManuscriptsList,
  getOpinionList,
  apiUploadManuscript as apiUpload,
  submitManuscript,
  createOpinion,
  updateOpinion,
  deleteOpinion,
  delManuscriptALL,
  apigetDemandInfo,
  getTimeLineStatus,
  getSummary,
  setDemandScore,
  createSummary,
  delSummary,
  apiGetDemandDetail
} from '@/api/api.manuscript.js'
import ImageViewer from 'element-ui/packages/image/src/image-viewer'
import { throttle, getPasteData, isTypeAnImage, getFilePathName } from './utils'
import { mapState, mapGetters } from 'vuex'
import Clipboard from 'clipboard'
import moment from 'moment'// 导入文件
export default {
  components: {
    LeftMore,
    UploadFile,
    ImageViewer
  },
  filters: {
    fmtDT(val) {
      return moment(val).format('MM.DD HH:mm')
    },
    fmtSFM(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    },
    fmtUserName(val) {
      let name = val
      if (!name) return ''
      if (name.length > 7) {
        name = name.substring(0, 7) + '...'
      }
      return name
    },
    fmtHS(val) {
      let st = moment(val.startTime)
      let et = moment(val.endTime)
      let ct = et.diff(st, 'minute')
      let h = Math.floor(ct / 60)
      let m = ct % 60
      let hh = h < 10 ? '0'+ h : h
      let mm = m < 10 ? '0'+ m : m
      return `${hh}h${mm}`
    }
  },
  data() {
    return {
      temp_pageTitle: '',
      getFilePathName: getFilePathName,
      sginEditHeight: 969,
      sginMainHeight: 969,
      userInfo: null,
      mainAssetPath: '',
      showViewer: false,
      previewSrcList: [],
      leftListActiveIndex: '0',
      dropDownVisibleChange: false,
      value: '',
      value1: true,
      input: '',
      activeNames: '',
      manuscriptList: [],
      commentList: [],
      demandid: 4,
      leftCurrentItem: {
        designDescription: ''
      },
      IsRightInputFocus: false,
      rightProposalObj: {
        manuscriptId: '',
        Opinion: '',
        ossId: '',
        url: ''
      },
      demandInfo: null,
      timeLineStatus: {},
      summaryInfo: null,
      selectSummary: null,
      selectSummaryList: [
        { id: '', text: '-' },
        { id: 1, text: '优秀' },
        { id: 2, text: '合格' },
        { id: 3, text: '凑合' },
      ],
      inputSummaryText: '',
      summaryList: [],
      activeSummary: '1',
      aa: {},
      getData: {},
      getNickName: '',
      progressNum: ''
    }
  },
  watch: {
    getManusList() {
      this.initList()
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getManusList', 'getTimeLineList']),
    getmanucriptList() {
      return this.manuscriptList
    },
    getLeftFileSuffix() {
      let filepath = this.leftCurrentItem.sourceFile
      if (!filepath) return false
      let index = filePath.lastIndexOf(".");
      if(index === -1) return false 
      let ext = filePath.substr(index + 1)
      return isTypeAnImage(ext)
    },  
    getCurrentSourcePath() {
      return this.leftCurrentItem
        && this.leftCurrentItem.t_currClickVersion
        && this.leftCurrentItem.t_currClickVersion.url
    },
    isGetShowSummaryList() {
      if (!this.demandInfo) return false
      return this.demandInfo.status == 9
    },
    getRightCurrentIimage() {
      if (this.rightProposalObj && this.rightProposalObj.url) {
        return this.rightProposalObj.url
      }
      return
    },
    getIsCreateOption() {
      if ((this.leftCurrentItem && this.leftCurrentItem.id)) return false
      if (this.rightProposalObj && (this.rightProposalObj.ossId || this.rightProposalObj.Opinion)) return false
      return true
    },
    getTimeLineTimeCount() {
      let seconds = this.getTimeLineList.map(e => {
        let st = moment(e.startTime)
        let et = moment(e.endTime)
        return et.diff(st, 'minute')
      }).reduce((total, curval) => total + curval, 0)
      let h = Math.floor(seconds / 60)
      let m = seconds % 60
      let hh = h < 10 ? '0'+ h : h
      let mm = m < 10 ? '0'+ m : m
      return `${hh}h${mm}`
    },
    getShareUrl() {
      let urlHash = window.location.hash
      urlHash = urlHash.replace("#/manuscript", "#/share/manuscript");
      return window.location.protocol + "//" +
        window.location.hostname + ":" + window.location.port + "/" + urlHash
    },
    getDemandEditCount() {
      if(this.demandInfo && this.demandInfo.manuscriptList) {
        return this.demandInfo.manuscriptList.length
      } else {
        return 0
      }
      return 0
    },
    getDemandName() {
      if(this.demandInfo) {
        return this.demandInfo.name || ''
      }
      return ''
    },
    getUserNme(){
      console.log( 'user', this.getUserInfo)
      let name = this.getUserInfo && this.getUserInfo.nickname
      if (name && name.length > 7) {
        name = name.substring(0, 7) + '...'
      }
      return name
    },
    getOpenCommentList() {
      return this.commentList.map(e => {
        if(e.strikethrough == false){
          return e.id
        }
      })
    },
    getInputSummaryTextEmpty(){
      return !!this.inputSummaryText
    }
  },
  created() {
    this.temp_pageTitle = document.title
    let width = document.documentElement.clientWidth
    let height = document.documentElement.clientHeight - 70
    this.sginEditHeight = height
    this.sginMainHeight = height - 30
    this.initPasteListener()
    this.$eventBus.$on('cc_scrollbar_update', this.updateScrollbar)
    window.onresize = throttle(this.updateScrollbar, 300)
    this.demandid = this.$route.query.demand_id || '11'
    this.initCreateData()
    // getManuscriptsList({ demandId: this.$route.query.demand_id }).then(res => {
    //     this.handleLeftListClick(res.manuscriptList[0], res.manuscriptList[0].versionList.length-1)
    //     // this.isSouceFileAnimage(res.manuscriptList[0].versionList[res.manuscriptList[0].versionList.length-1].url)
    //     // this.leftCurrentItem.manuscriptId
    // })
    apiGetDemandDetail(this.$route.query.demand_id).then(res => {
        this.getData = res
        this.getNickName = res.reviewer_user.nickname
    })
  },
  mounted() {
    this.initClipboard()
    this.userInfo = this.$store.getters.getUserInfo
    // this.initList()
    this.$store.dispatch('getManuEditList', this.demandid).then(res => {
      this.updateScrollbar()
    })
    // let _this = this
    setTimeout(() => {
        $('.el-scrollbar__view div:first-child .item-img').click()
    }, 300)
  },
  destroyed(){
    document.title = this.temp_pageTitle
  },
  methods: {
    initCreateData() {
      apigetDemandInfo(this.demandid).then(res => {
        this.demandInfo = res
        document.title = res.name
        this.selectSummary = res.score
        console.log('demanInfoe', res)
        this.initSummary()
      })
      getTimeLineStatus({ demandId: this.demandid }).then(res => {
        this.timeLineStatus = res
        console.log('timeLineStatus', res)
      })
      
    },
    initSummary() {
      if (this.isGetShowSummaryList) {
        getSummary({ demandId: this.demandid }).then(res => {
          this.summaryList = res
          this.updateScrollbar()
        })
      }
    },
    initList() {
      // 调用真是的接口
      this.manuscriptList = this.getManusList
    },
    initListOpinionList() {
      let manuscriptId = this.leftCurrentItem.manuscriptId
      if (manuscriptId == 0) return
      getOpinionList({ manuscriptId }).then(res => {
        console.log('getOpinionList', res)
        this.commentList = res
        this.updateScrollbar()
      })
    },
    // 稿件删除
    handleLeftListDelClick(item, index) {
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let id = item.manuscriptId
        if (id == 0) {
          this.$store.commit('setManuItemDel', item)
          this.$message({ message: '删除成功', type: 'success' })
          this.leftCurrentItem = {
            designDescription: ''
          }
          return
        }
        delManuscriptALL({ manuscriptId: item.manuscriptId }).then(res => {
          this.$store.commit('setManuItemDel', item)
          this.$message({ message: '删除成功', type: 'success' })
          this.leftCurrentItem = {
            designDescription: ''
          }
        })
      }).catch(() => {})
    },
    // 稿件点击
    handleLeftListClick(item, index) {
      this.leftListActiveIndex = index
      this.leftCurrentItem = item
      this.commentList = []
      // oplist 
      this.initListOpinionList()
      this.rightProposalObj = {
        manuscriptId: '',
        Opinion: '',
        ossId: '',
        url: ''
      }
    },
    // 获得焦点
    handlePasteFocusChange() {
      this.IsRightInputFocus = true
    },
    // 保存方法
    handleManuSubmit() {
    //   if (this.isGetShowSummaryList) {
    //     this.$message({ message: '已完稿状态不能提交',  type: 'error' })
    //     return
    //   }
      this.$confirm('您确定要提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // todo 调用接口
        let obj = {
          demandId: this.demandid,
          manuscriptList: this.getmanucriptList
        }
        submitManuscript(obj).then(res => {
          this.$message({ message: '提交成功',  type: 'success' })
          this.$confirm('保存成功，留在当前页面继续编辑或返回列表?', '提示', {
              confirmButtonText: '返回列表',
              cancelButtonText: '继续编辑'
          }).then(() => {
            this.$router.push({ name: 'index' })
          }).catch(() => {})
        }).catch(err => {
          this.$message({ message: '提交失败',  type: 'error' })
        })
      }).catch(() => {})
    },
    // 添加左侧的项目
    _addManItem(data) {
      let obj = {
        manuscriptId: 0,
        sourceFile: '',
        designDescription: '',
        isPublic: false,
        versionList: [],
        t_sourceFile: data.download_url,
        t_sourceFileid: data.id
      }
      let verobj = {
        versionId: 0,
        ossId: data.id,
        url: data.download_url
      }
      obj['t_currClickVersion'] = verobj
      obj.versionList.push(verobj)
      this.$store.commit('setManuItem', obj)
    },
    // 左侧 主要的上传图片
    handleManuListUpload() {
      if (this.isGetShowSummaryList) {
        this.$message({ message: '已完稿状态不能提交',  type: 'error' })
        return
      }
      this.$refs['myUploadFile'].upload((res) => {
        this._addManItem(res.data)
      })
    },
    // 拖动上传文件
    handleBeforeUpload(file) {
      if (this.isGetShowSummaryList) {
        this.$message({ message: '已完稿状态不能提交',  type: 'error' })
        return
      }
      let progress = setInterval(() => {
            this.progressNum = '正在上传' + window.localStorage.getItem('commonFileProgress')
            if (window.localStorage.getItem('commonFileProgress') == '100%') {
                clearInterval(progress)
                this.progressNum = ''
                this.$message({ message: '上传成功',  type: 'success' })
                window.localStorage.setItem('commonFileProgress', '')
            }
        },1000)
      this.$refs['myUploadFile'].localUpload(file).then(res => {
        this._addManItem(res.data)
      })
      return false
    },
    // option 重新上传图片
    handleReUploadFile() {
      if (!(this.leftCurrentItem && this.leftCurrentItem.manuscriptId != 0)) {
        this.$message({ message: '当前状态不可添加意见',  type: 'warning' })
        return
      }
      this.$refs['myUploadFile'].upload((res) => {
        let data = res.data
        this.rightProposalObj['ossId'] = data.id
        this.rightProposalObj['url'] = data.download_url
      })
    },
    // 打开图片预览
    checkViewer() {
      this.previewSrcList = []
      this.showViewer = true
    },
    ///////////////////////////////////////////////////////////////
    // right
    // 继续添加按钮
    handleCreateOption() {
      if (this.isGetShowSummaryList) {
        this.$message({ message: '已完稿状态不能提交',  type: 'error' })
        return
      }
      let obj = this.rightProposalObj
      obj.manuscriptId = this.leftCurrentItem.manuscriptId
      createOpinion(obj).then(res => {
        this.rightProposalObj['manuscriptId'] = ''
        this.rightProposalObj['Opinion'] = ''
        this.rightProposalObj['ossId'] = ''
        this.rightProposalObj['url'] = ''
        this.$message({ message: '添加意见成功',  type: 'success' })
        this.initListOpinionList()
      })
    },
    // 已改 未改 状态更换
    striketroughChange(event, item) {
      let obj = item
      obj['opinionId'] = obj['id']
      obj['strikethrough'] = !!obj['strikethrough']
      updateOpinion(obj).then(res => {
        this.$message({ message: '更新成功',  type: 'success' })
      })
    },
    // 意见图片重新上传
    handleOpinionReUpload(item) {
      this.$refs['myUploadFile'].upload((res) => {
        let data = res.data
        let obj = item
        obj['opinionId'] = obj['id']
        obj['url'] = data.download_url
        updateOpinion(obj).then(res => {
          this.$message({ message: '更新成功',  type: 'success' })
        })
      })
    },
    // 意见列表删除
    handleOpinionDel(item) {
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deleteOpinion({ opinionId: item.id }).then(res => {
          this.$message({ message: '删除成功',  type: 'success' })
          let index = this.commentList.findIndex(e => e === item)
          this.commentList && this.commentList.splice(index, 1)
        })
      }).catch(() => {})
    },

    // 评分
    handleSummaryChange(val) {
      let obj = { demandId: this.demandid, score: val }
      setDemandScore(obj).then(res => {
        this.$message({ message: '评分完成',  type: 'success' })
      })
    },
    // 添加总结
    handleCreateSummary() {
      let par = this.inputSummaryText
      let obj = { demandId: this.demandid, summary: par }
      createSummary(obj).then(res => {
        this.initSummary()
        this.inputSummaryText = ''
        this.$message({ message: '添加成功',  type: 'success' })
      })
    },
    handleSummaryDel(item) {
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delSummary({ summaryId: item.id }).then(res => {
          this.$message({ message: '删除成功',  type: 'success' })
          this.initSummary()
        })
      }).catch(() => {})
    },
    // 一下辅助型功能 /////////////////////////////////////////////////////////////
    // 初始化粘贴
    initPasteListener() {
      let self = this
      document.addEventListener('paste', getPasteData(paste => {
        if (!this.IsRightInputFocus) {
          this.$message({ message: '点击修改意见处,粘贴图片',  type: 'warning' })
          return
        }
        if (!(this.leftCurrentItem && this.leftCurrentItem.manuscriptId != 0)) {
          this.$message({ message: '当前状态不可添加意见',  type: 'warning' })
          return
        }
        if (!(this.leftCurrentItem && this.leftCurrentItem.manuscriptId)) {
          this.$message({ message: '请先选择一个稿件',  type: 'warning' })
          return
        }
        let formData = new FormData()
        formData.append("file", paste.file)
        apiUpload(formData).then(file => {
          let { data } = file
          this.rightProposalObj['ossId'] = data.id
          this.rightProposalObj['url'] = data.download_url
        })
      }))
    },
    // 初始化复制
    initClipboard() {
      const _this = this
      const clipboard = new Clipboard('.btn-copy')
      let calll = (e) => {
        _this.$message({ message: '复制成功', type: 'success' })
      }
      let calle = (e) => {
        _this.$message({ message: '复制失败，请再次尝试', type: 'error' })
      } 
      clipboard.on('success', throttle(calll, 1000))
      clipboard.on('error', throttle(calle, 1000))
    },
    // 获取资源名
    isSouceFileAnimage(path) {
      if (!path) return false
      let index = path && path.lastIndexOf(".");
      if(index === -1) return false 
      let ext = path.substr(index + 1)
      return isTypeAnImage(ext)
    },
    // 刷新滚动
    updateScrollbar() {
      console.log('cc_scrollbar_update')
      this.$nextTick(() => {
        this.$refs['scrollbarLeft'] && this.$refs['scrollbarLeft'].update()
        this.$refs['scrollbarRight'] && this.$refs['scrollbarRight'].update()
        let width = document.documentElement.clientWidth
        let height = document.documentElement.clientHeight - 70
        this.sginEditHeight = height
        this.sginMainHeight = height - 30
      })
    },
    saveThisArea(item,index) {
        getManuscriptsList({ demandId: this.$route.query.demand_id }).then(res => {
            createOpinion({
                Opinion: item.Opinion,
                manuscriptId: res.manuscriptList[0].manuscriptId,
                ossId: res.manuscriptList[0].versionList[index].ossId,
                url:res.manuscriptList[0].versionList[index].url
            }).then(res => {
                this.$message({  message: res.data, type: "success" })
            })
        })
    }
  }
}
</script>

<style lang='scss' scoped>
@import "./styles/sgin-edit.scss";
/deep/ .myupload {
  .el-upload {
    display: block;
  }
}
</style>
