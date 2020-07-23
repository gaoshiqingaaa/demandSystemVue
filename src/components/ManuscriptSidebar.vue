<template>
  <div class="manuscript-sidebar"
       v-show="sidebar_show">
    <div style="padding:10px;">
<!--      <input type="file" id="file" name="file" multiple @change="test">-->
      <el-button type="success" class="uploadButton" v-on:click="uploadPic('complete')"><i class="el-icon-upload2"></i>上传 完整稿</el-button><br>
      <el-button type="primary" class="uploadButton" v-on:click="uploadPic('draft')"><i class="el-icon-upload"></i>上传 草稿件</el-button>
      <input id="draft" ref="fileDraft" type="file" @change="getFile" style="display:none">
      <input id="complete" ref="fileComplete" type="file" @change="getFile" style="display:none">
    </div>
    <div class="sideBar">
      <div class="classTag">
        <span>完整稿</span>
      </div>
      <ul>
        <li v-on:click="setSelectedManuscriptType('complete',index)" v-for="(item,index) in manuscriptList.complete" v-bind:class="[isActive('complete',index) ? 'activeClass' : '']" >第{{index+1}}稿</li>
      </ul>
    </div>
    <div class="sideBar">
      <div class="classTag" style="background-color: #409eff;">
        <span>草稿件</span>
      </div>
      <ul>
        <li v-on:click="setSelectedManuscriptType('draft',index)" v-for="(item,index) in manuscriptList.draft " v-bind:class="[isActive('draft',index) ? 'activeClass' : '']">第{{index+1}}稿</li>
      </ul>
    </div>
  </div>

</template>

<script>
  import { apiUploadManuscript,submitManuscript,apiGetManuscriptList,apiGetOpinionsList,apigetDemandInfo } from "@/api/api.manuscript.js"
export default {
  name: 'ManuscriptSidebar',
  data () {
    return {
      draftLength:0,
      completeLength:0,
      manuscriptList:[],

      // 上传文件使用参数
      fileArr: [],
      sidebar_show: false,
      sideList: [],
      demand: {
        id: null
      },
      currentTimes: 0,
      ManuscriptSidebar:null,
      nowSelected:{
        type:'',
        index:0
      }
    }
  },
  computed: {
  },
  filters: {
    // 阿拉伯数字转为大写
    toLowerNum: function (num) {
      let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
      let unit = ['', '十', '百', '千', '万']
      num = parseInt(num)
      let getWan = (temp) => {
        let strArr = temp.toString().split('').reverse()
        let newNum = ''
        for (var i = 0; i < strArr.length; i++) {
          newNum = (i == 0 && strArr[i] == 0 ? '' : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? '' : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum
        }
        return newNum
      }
      let overWan = Math.floor(num / 10000)
      let noWan = num % 10000
      if (noWan.toString().length < 4) noWan = '0' + noWan
      return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
    }
  },
  created () {
    var self = this
    self.sidebar_show = false
    this.init()
  },
  methods: {
    isActive(type,index){
      if(this.nowSelected.type == type && this.nowSelected.index == index){
        return true;
      }
      return false;
    },

    setSidebar(data){
      console.log('setSidebar',data)
      this.manuscriptList = data
    },
    setSelectedManuscriptType(data,id){
      this.nowSelected.type = data;
      this.nowSelected.index = id;
      let type = {
        type:data,
        id:id
      };
      this.$emit('setSelectedManuscriptType',type)
    },
    setManuscriptSidebar(data){
      this.ManuscriptSidebar = data;
    },
    addPic(data){
      this.$emit('addManuscript',data)
    },
    getFile(event){
      this.addPic({
        url:this.getObjectURL(event.target.files[0]),
        attachmentType:event.target.id,
        vue_uid:this._uid
      })
    },
    getObjectURL(file){
      var url = null ;
      if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
      } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
      } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
      }
      return url ;
    },
    uploadPic(type){
      if(type == 'draft'){
        this.$refs.fileDraft.dispatchEvent(new MouseEvent('click'))
      }
      if(type == 'complete'){
        this.$refs.fileComplete.dispatchEvent(new MouseEvent('click'))
      }
    },
    clearForm () {
      this.$emit('clearForm')
    },
    previewFile (index) {
      const self = this
      self.$emit('showFileList', {
        'fileList': this.sideList[index]['manuscript'],
        'uploadFormData': this.sideList[index]
      })
    },
    emitToForm () {
      const self = this
      self.$emit('showUploadFileList', {
        'fileArr': self.fileArr,
        'currentTimes': self.currentTimes
      })
    },
    beforeUpload (file) {
      const isLt25M = file.size / 1024 / 1024 < 25
      if (!isLt25M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt25M
    },
    // 文件上传过程中的函数(在这里获取进度条的进度)
    uploadFileProcess (event, file, fileList) {
      this.fileArr = fileList
      this.fileArr.forEach(item => {
        if (item.percentage == 100) {
        } else {
          item.progressFlag = true
          item.progressPercent = Math.abs(item.percentage.toFixed(0))
        }
      })
    },
    // 下载文件(基于文件列表的数据进行操作)
    downloadFile (item, index) {
      window.open(item.download_url)
    },
    // 删除文件(基于文件列表的数据进行操作)
    removeFile (item, index) {
      const self = this
      self.fileArr.splice(index, 1)
    },
    handleFileSuccess (res, file, fileList) {
      const self = this
      self.fileArr = fileList
      self.fileArr.forEach((item, index) => {
        item.progressFlag = false
        if (item.response.success === true) {
          item.successFlag = true
          item.id = item.response.data.id
          item.download_url = item.response.data.download_url
          self.emitToForm()
        } else {
          item.successFlag = false
        }
      })
    },

    async getManuscriptListData(demandID){
      let result = await apiGetManuscriptList(demandID);
      result.complete.push({
        imageList:[]
      })
      result.draft.push({imageList:[]})
      this.manuscriptList = result
    },

    init () {
      console.log('init',this.$route.query.demand_id)
      this.getManuscriptListData(this.$route.query.demand_id)
      // const self = this
      // // 初始化稿件数据
      // self.demand.id = self.$route.query.demand_id
      // if (self.demand.id) {
      //   self.axios.get('/api/api/v1/manuscript/manuscript/' + '?demand=' + self.demand.id + '&order=-id&imit=100')
      //     .then(function (response) {
      //       if (response.data.results) {
      //         self.sideList = response.data.results
      //         self.currentTimes = response.data.count + 1
      //       }
      //     })
      //     .catch(function (error) {
      //     })
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
$color_1: #00cbca;
$color_2: #fff;
$background_color_1: #fff;
$background_color_3: #00cbca;
.activeClass{
  color: red;
}
.uploadButton{
  padding: 10px !important;
  width: 100%;
  margin-bottom: 10px;
}

.classTag{
  text-align: center;
  width: 100%;
  background-color: #66c23a;
  color: #fff;
  padding: 2px;
}
.sideBar{
  text-align:center;
}
/* 交稿页面 左侧导航 */
.manuscript-sidebar {
  width: 8%;
  /*padding: 10px;*/
  background-color: #fff;
  height: 100%;
  margin-right: 10px;
  float: left;
  ul {
    margin: unset;
    padding: unset;
    li {
      padding-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eeeeee;
      cursor: pointer;
      &:last-child {
        border-bottom: 0;
      }
      .manuscript-wrapper {
        .times {
          display: inline-block;
          span {
            color: #00cbca;
            display: block;
            /* width: 55px; */
            height: 20px;
            border: 1px solid #00cbca;
            line-height: 20px;
            text-align: center;
            top: 10px;
            left: 0px;
            padding: 0px 10px;
          }
        }

        .manuscript-preview {
          height: 70px;
          width: 100px;
        }

        .manuscript-preview,
        .manuscript-upload {
          height: 100px;
          width: 130px;
          margin: 6px auto;
          position: relative;
          border: 1px solid #eee;

          img {
            height: 100px;
            width: 130px;
          }

          .num {
            width: 16px;
            height: 16px;
            background-color: $background_color_3;
            display: block;
            text-align: center;
            color: $color_2;
            border-radius: 50%;
            line-height: 16px;
            position: absolute;
            left: -6px;
            top: -3px;
          }

          // 上传组件样式
          .upload-file {
            position: relative;
            .el-upload__tip {
              font-size: 12px;
              color: #999999;
              margin: 20px 7px;
            }
            .el-upload__text {
              border: 1px solid $theme-color;
              height: 32px;
              line-height: 32px;
              color: $theme-color;
            }
          }
        }
        .upload-btn {
          background-image: url("../assets/images/manuscript_upload.png");
        }
      }
    }
  }
}
</style>
