<!--
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-05-19 14:33:16
 * @FilePath: \alien-docsg:\CaryFile\project\project-resources\demandSystemVue\src\pages\manuscript\component\left-more.vue
--> 
<template>
  <div class="more-controler">
    <div class="header">
      <div class="title">更多操作</div>
      <div><i :class="isshow ? 'el-icon-arrow-up': 'el-icon-arrow-down'" class="c-icon" @click="handleIsShow"></i></div>
    </div>
    <div v-show="isshow">
      <!-- <slot/> -->
      <div class="more-comtent">
        <div class="c-btns">
          <el-link class="c-btn" icon="el-icon-download" @click="handleDownload">下载</el-link>
          <el-link class="c-btn" icon="el-icon-upload" @click="handleReUpload">重传</el-link>
        </div>
        <div style="font-size: 20px;color: red">{{uploadStatus}}</div>
        <div class="line"/>
        <div class="txt">稿件记录</div>
        <div class="list">
          <div class="cc-dl" v-for="(item, index) in getList" :key="index">
            <div class="text"
              :class="{ 'active': getIsActive === item }"
              @click="handleItemClick(item)">第{{ index + 1 }}版</div>
            <div><el-link class="c-btn" icon="el-icon-delete" @click="handleVersionDel(item)"/></div>
          </div>
        </div>
      </div>
    </div>
    <upload-file ref="myUploadFile" />
  </div>
</template>

<script>
import {
  delManuscript
} from '@/api/api.manuscript.js'
import UploadFile from './uploadfil'
export default {
  components: {
    UploadFile
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isshow: false,
      uploadStatus: ''
    }
  },
  computed: {
    getItem() {
      return this.item
    },
    getList() {
      if (this.item) return this.item.versionList
      return []
    },
    getIsActive() {
      let vid = this.getItem.t_currClickVersion
      return vid
    }
  },
  created() {
    this.isshow = this.open
  },
  mounted() {
    this.handleItemClick(this.item.versionList[this.item.versionList.length-1])
  },
  methods: {
    downloadFile(url) {
      window.open(url);
    },
    handleIsShow() {
      this.isshow = !this.isshow
      this.$eventBus.$emit('cc_scrollbar_update')
    },
    handleDownload() {
      let item = this.getItem
      let url = item.t_currClickVersion && item.t_currClickVersion.url
      this.downloadFile(url)
      this.$emit('download')
    },
    handleReUpload() {
      this.$emit('reupload')
      // 第一版 覆盖
      // this.$refs['myUploadFile'].upload((res) => {
      //   let data = res.data
      //   this.$set(item, 'url', data.download_url)
      // })
      // 第二版 增加多个
      let item = this.getItem
      this.$refs['myUploadFile'].upload((res) => {
        let data = res.data
        let obj = {
          versionId: 0,
          ossId: data.id,
          url: data.download_url
        }
        item.versionList.push(obj)
        this.$set(item, 't_currClickVersion', obj)
      })
    },
    handleItemClick(item) {
      let obj = this.getItem
      this.$set(obj, 't_currClickVersion', item)
      this.$emit('item', item)
    },

    handleVersionDel(item) {
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // todo 调用接口
        this.$emit('versiondel', item)
        let id = item.versionId
        if (id == 0) {
          this._delVersion(item)
          this.$message({ message: '删除成功',  type: 'success' })
          return
        }
        delManuscript({ versionId: item.versionId }).then(res => {
          this.$message({ message: '删除成功',  type: 'success' })
          this._delVersion(item)
        })
      }).catch(() => {})
    },

    _delVersion(item) {
      let pitem = this.getItem.versionList
      let index = pitem.findIndex(e => e === item)
      pitem.splice(index, 1)
      if (pitem.length >= 1) {
        this.handleItemClick(pitem[0])
      }else {
        this.handleItemClick({ designDescription: '' })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.item-control {
  margin-top: -2px;
  .more-comtent {
    padding: 10px;
    border: #EEEEEE solid 1px;
    .c-btns {
      display: flex;
      justify-content: space-between;
      .c-btn {
        color: #00CBCA;
        font-size: 12px;
      }
    }
    .line {
      margin: 8px 0;
      height: 1px;
      background-color: #eee;
    }
    .txt {
      color: #999;
      font-family: 'PingFangSC-Regular';
      font-size: 12px;
    }
    .list {
      margin-top: 10px;
      .cc-dl {
        margin-top: 8px;
      }
      .text {
        cursor: pointer;
      }
      .active {
        color: #00CBCA;
      }
    }

  }
}
.header {
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  background-color: #F2F2F2;
  border: #EEEEEE solid 1px;
  .title {
    color: #666;
  }
  .c-icon {
    font-weight: bold;
    color: #00CBCA;
    cursor: pointer;
  }
}
</style>
