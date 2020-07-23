<!--
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-05-23 13:43:31
 * @FilePath: \alien-docsg:\CaryFile\project\project-resources\demandSystemVue\src\pages\manuscript\component\uploadfil.vue
--> 
<template>
    <div>
        <input
            ref="myUploadFile"
            type="file"
            style="display: none"
            :multiple="multiple? 'multiple' : ''"
            @change="handleFileChange"/>
        <div style="text-align:right;font-size: 12px;color: #bbb">{{progerss}}</div>
    </div>
</template>

<script>
import {
  apiUploadManuscript as apiUpload
} from '@/api/api.manuscript.js'
export default {
  components: {},
  props: {
    multiple: Boolean
  },
  data() {
    return {
      tempCallback: null,
      progerss: '',
      progerssNum: 0,
      progressSuccess: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handleFileChange(event) {
      let files = event.target.files
      for (const file of files) {
        let formData = new FormData()
        formData.append('file', file)
        let progress = setInterval(() => {
            this.progerss = '正在上传' + this.progerssNum + '%'
            this.progerssNum++
            if (this.progressSuccess) {
                clearInterval(progress)
                this.progerss = ''
                this.progerssNum = 0
                this.progressSuccess = false
                this.$message({ message: '上传成功',  type: 'success' })
            }
        },1000)
        apiUpload(formData).then(res => {
          this.progressSuccess = true
          this.tempCallback && this.tempCallback(res)
        }).catch(err => {
          this.$message({ message: '上传失败',  type: 'error' })
        })
      }
    },
    upload(call) {
      this.tempCallback = call
      this.$refs['myUploadFile'].click()
    },
    localUpload(file) {
      return new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append('file', file)
        apiUpload(formData).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message({ message: '上传失败',  type: 'error' })
          reject(err)
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
