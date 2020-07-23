<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-upload class="upload-demo" drag :action="action"
          :before-upload="beforeUpload" :on-success="handleFileSuccess" :on-progress="uploadFileProcess"
          :on-change="fileChange" :show-file-list="false" v-if="myattachmentData.attachment == null">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="cc-preview-img" v-else>
          <div v-if="myattachmentData.attachment != null"
            style="line-height: 22px;margin-top: -4px;" class="cc-mar-b-2 cc-tc-t4 cc-preview-title"
            :title="tempFile.name || ''">{{ tempFile.name || '' }}<span v-if="fileSize">(大小：{{ fileSize }})</span></div>
            <el-image 
                v-if="isImageAttachment(myattachmentData.attachment)"
                style="height: 150px"
                :src="myattachmentData.attachment"
                :preview-src-list="srcList">
            </el-image>
          <!-- <img :src="myattachmentData.attachment" style="height: 150px;"
            v-if="isImageAttachment(myattachmentData.attachment)"> -->
          <img v-else style="height: 150px;" src="@/assets/svg/file-empty.svg" alt="">
          <!-- <svg v-else style="width: 70%;" t="1589290185048" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="1134" width="200" height="200">
            <path
              d="M938.666667 192H569.6c-23.466667 0-44.8-4.266667-55.466667-25.6l-49.066666-87.466667c-10.666667-21.333333-32-36.266667-55.466667-36.266666H85.333333C49.066667 42.666667 21.333333 70.4 21.333333 106.666667v810.666666c0 36.266667 27.733333 64 64 64h853.333334c36.266667 0 64-27.733333 64-64V256c0-34.133333-29.866667-64-64-64z m-149.333334 341.333333H234.666667c-12.8 0-21.333333-8.533333-21.333334-21.333333s8.533333-21.333333 21.333334-21.333333h554.666666c12.8 0 21.333333 8.533333 21.333334 21.333333s-10.666667 21.333333-21.333334 21.333333z"
              fill="#666767" p-id="1135"></path>
          </svg> -->
        </div>
        <div class="cc-mar-t-10">
          <div v-if="myattachmentData.attachment == null" style="line-height: 22px;margin-top: -4px;" 
            class="cc-mar-t-4 cc-tc-t4"
            >仅支持上传小于200M文件，大文件请上传百度网盘后填写链接</div>
          <el-link
            v-if="myattachmentData.attachment != null"
            @click="downloadAttachment(myattachmentData.attachment)"
            :underline="false" type="primary" icon="el-icon-download">
            点击下载
          </el-link>
          <el-link 
            v-if="myattachmentData.attachment != null"
            @click="reUpload"
            class="cc-mar-l-20" :underline="false" type="primary" icon="el-icon-upload">
            重新上传
          </el-link>
          <el-tag class="cc-f--right" type="info" v-show="uploadStatus != ''">{{uploadStatus}}</el-tag>
        </div>
      </el-col>
      <el-col :span="13">
        <div >
          <el-input type="textarea" v-model="myattachmentData.attachment_desc" :rows="10" placeholder="请描述该附件内容与作用">
          </el-input>
          <!-- <el-tag type="info" v-show="uploadStatus != ''">{{uploadStatus}}</el-tag> -->
          <!-- <el-button
            v-if="myattachmentData.attachment != null"
            type="danger" v-on:click="deleteAttachment">删除这个附件</el-button> -->
          <!-- <el-button type="primary" v-if="myattachmentData.attachment != null" v-on:click="reUpload">重新上传</el-button> -->
          <!-- <el-button type="primary" v-if="myattachmentData.attachment != null"
            v-on:click="downloadAttachment(myattachmentData.attachment)">下载附件</el-button> -->
          <!-- <el-tag v-if="getFileExtName(myattachmentData.attachment)">
            {{getFileExtName(myattachmentData.attachment)}}
          </el-tag> -->
        </div>
      </el-col>
      <el-col :span="1">
        <el-link
          style="font-size: 30px;" :underline="false" type="info" icon="el-icon-close"
          @click="deleteAttachment"/>
          <!-- 删除 -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      attachmentIndex: { type: Number, required: true },
      attachmentData: { type: Object, required: true }
    },
    computed: {
      action() {
        // let url = 'http://demo1.99client.com/common/upload_file';
        let url = 'http://120.78.250.134:9090/common/upload_file';
        return url
      }
    },
    data() {
      return {
        uploadStatus: '',
        progress: 0,
        thumbnail: null,
        tempFile: {},
        myattachmentData: {
          attachment: null,
          attachment_desc: null,
          id: null,
          index: null,
          oss_id: null
        },
        srcList: [],
        fileSize: ''
      }
    },
    mounted() {
      this.myattachmentData.index = this.attachmentIndex
      if (this.attachmentData.attachment !== "") {
        console.log(this.attachmentData.attachment, 'attachmentDataattachmentDataattachmentDataattachmentData')
        this.myattachmentData.attachment = this.attachmentData.download_url
        this.myattachmentData.oss_id = this.attachmentData.id
        this.myattachmentData.attachment_desc = this.attachmentData.desc
        this.srcList.push(this.attachmentData.download_url)
      }
      console.log('myattachmentData', this.myattachmentData)
    },
    methods: {
      isImageAttachment(url) {
        let fileEXT = this.getFileExtName(url)
        fileEXT = fileEXT.toLowerCase();
        switch (fileEXT) {
          case '.gif':
            return true
          case '.jpg':
            return true
          case '.png':
            return true
          case '.jpeg':
            return true
          default:
            return false;
        }
      },
      downloadAttachment(url) {
        console.log(url)
        window.open(url)
      },

      getFileExtName(url) {
        let reg = /([/.][^-]+)$/;
        url = reg.exec(url)
        if (url) {
          return url[0]
        } else {
          return ''
        }

      },
      parseURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return {
          source: url,
          protocol: a.protocol.replace(':', ''),
          host: a.hostname,
          port: a.port,
          query: a.search,
          params: (function () {
            var ret = {},
              seg = a.search.replace(/^\?/, '').split('&'),
              len = seg.length,
              i = 0,
              s;
            for (; i < len; i++) {
              if (!seg[i]) {
                continue;
              }
              s = seg[i].split('=');
              ret[s[0]] = s[1];
            }
            return ret;
          })(),
          file: (a.pathname.match(/([^/?#]+)$/i) || [, ''])[1],
          hash: a.hash.replace('#', ''),
          path: a.pathname.replace(/^([^/])/, '/$1'),
          relative: (a.href.match(/tps?:\/[^/]+(.+)/) || [, ''])[1],
          segments: a.pathname.replace(/^\//, '').split('/')
        };
      },

      fileChange(file) {
        if (file.status == 'success') {
          this.uploadStatus = '上传成功'
        }
        if (file.status == 'uploading') {
          this.uploadStatus = '附件上传中'
        }
      },
      reUpload() {
        this.myattachmentData.attachment = null
      },
      deleteAttachment() {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$emit("deleteAttachment", this.myattachmentData.index)
        }).catch(() => {})
      },
      beforeUpload(file) {
        const isLt200M = file.size / 1024 / 1024 < 100
        if (!isLt200M) {
          this.$message.error('仅支持上传小于200M文件，大文件请上传百度网盘后填写链接!')
        }
        this.uploadStatus = '正在上传'
        return isLt200M
      },
      uploadFileProcess(event, file, fileList) {
          this.uploadStatus = '正在上传' + Math.floor(event.percent) + "%"
        console.log('Process', event)
      },
      handleFileSuccess(response, file, fileList) {
        this.uploadStatus = '上传成功'
        this.myattachmentData.oss_id = file.response.data.id
        this.myattachmentData.attachment = file.response.data.download_url
        this.tempFile = file
        this.fileSize = (file.size / 1024 / 1024).toFixed(2) + 'M'
        console.log('handleFileSuccess', file)
        this.$emit('uploadDone')
        console.log(this.myattachmentData.attachment)
        this.srcList.push(this.myattachmentData.attachment)
      },

      updateAttachmentInfo() {
        if (this.myattachmentData.attachment !== null && this.myattachmentData.attachment !== '' && this
          .myattachmentData !== undefined) {
          this.$emit('updateAttachmentInfo', {
            index: this.attachmentIndex,
            data: this.myattachmentData
          })
        }
      },
      getAttaData() {
        return this.myattachmentData
      }

    },
    watch: {
      'myattachmentData': {
        handler: function (val, oldVal) {
          this.updateAttachmentInfo()
        },
        deep: true
      }
    }
  }

</script>
