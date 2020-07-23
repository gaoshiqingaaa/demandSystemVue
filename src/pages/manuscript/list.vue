<template>
  <div id="manuscript">
    <div class="project_title">{{ this.demandInfo.name }} - 稿件</div>
    <ManuscriptSidebar
      ref="ManuscriptSidebar"
      v-show="true"
      @addManuscript="addManuscript"
      @setSelectedManuscriptType="setSelectedManuscriptType"
    ></ManuscriptSidebar>
    <div class="upload-form">
      <input
        id="reUpload"
        ref="reUpload"
        type="file"
        @change="reUpload"
        style="display:none"
      />
      <div class="upload-container">
        <div>
          <el-row>
            <el-col :span="4">
              <div
                class="imgStream"
                v-for="(item, index) in tempList"
                :key="index"
              >
                <img :src="item.url" v-on:click="selectPic" :id="index" />
                <span class="titleSpan"
                  >第{{ selectedManuscriptNo + 1 }}稿 第{{ index + 1 }}张</span
                >
                <span
                  class="reUpload"
                  v-on:click="reUploadManuscriptImage(index)"
                  >重新上传</span
                >
                <span class="delSpan" v-on:click="deleteManuscriptImage(index)"
                  >删除</span
                >
                <div style="margin-bottom: 10px;">
                  <span>{{ item.status }}</span>
                </div>
                <div class="fileInfo">
                  <el-button type="success" v-on:click="downloadFile(item)"
                    >下载稿件({{ getFileType(item) }})</el-button
                  >
                </div>
              </div>

              <div v-if="tempList.length == 0" class="nullTip">
                暂无内容
              </div>
            </el-col>

            <el-col :span="20">
              <div class="pictureDetails">
                <img :src="nowShowImg" />
                <div class="plz_selectPic" v-if="nowShowImg == null">
                  请选择图片
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="desc-container">
        <el-form
          ref="manuscriptForm"
          :model="manuscriptForm"
          label-width="80px"
          style="padding: 25px 0 0 25px;"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="源文件链接">
                <el-input
                  class="source-file"
                  v-model="manuscriptForm.source_file"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="设计说明">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="manuscriptForm.designDescription"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="修改意见:">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="manuscriptForm.reviseOpinion"
                >
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <div class="designDescription">
                <el-collapse v-model="activeNames" @change="handleChange">
                  <el-collapse-item
                    :title="getOpinionNickname(item)"
                    :name="index"
                    v-for="(item, index) in opinionsList"
                    :key="index"
                  >
                    <div>
                      {{ item.Opinion }}
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-col>
          </el-row>
        </el-form>

        <div class="excision"></div>
        <el-form
          ref="manuscriptForm"
          :model="manuscriptForm"
          label-width="80px"
          style="padding: 10px;"
        >
          <el-row>
            <!--            <el-col :span="24">-->
            <!--              评分预留-->
            <!--            </el-col>-->
            <el-col :span="12">
              <div v-on:click="showTimeDetails = !showTimeDetails">
                <span>项目耗时</span>
                <span>共计 {{ cumulativeTimeStr }}</span>
              </div>
            </el-col>

            <el-col :span="12">
              <span>异常情况</span>
              <span class="abnormalTag">
                <!--                <el-tag>标签一</el-tag>-->
                <!--                <el-tag type="success">标签二</el-tag>-->
                <!--                <el-tag type="info">标签三</el-tag>-->
                <!--                <el-tag type="warning">标签四</el-tag>-->
                <!--                <el-tag type="danger">标签五</el-tag>-->
              </span>
            </el-col>

            <el-col :span="24">
              <div class="timeLine" v-if="showTimeDetails">
                <el-timeline :reverse="reverse">
                  <el-timeline-item
                    v-for="(activity, index) in timeLine"
                    :key="index"
                    :timestamp="getTimeRange(activity)"
                  >
                    <span v-if="activity.endTime == null">
                      开始执行 -
                    </span>
                    <span v-else>
                      开始执行 - 暂停执行
                    </span>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-col>

            <el-col :span="24">
              <span>修改次数</span>
              <span v-if="this.demandInfo.manuscriptList.length > 0">{{
                this.demandInfo.manuscriptList.length - 1
              }}</span>
              <span v-else>0</span>
            </el-col>
            <el-col :span="24">
              <span>项目名称</span>
              <span>{{ this.demandInfo.name }}</span>
            </el-col>
            <el-col :span="24">
              <span>稿件链接</span>
              <span>
                {{ shareUrl }}
              </span>
            </el-col>
          </el-row>
        </el-form>

        <el-button
          type="primary"
          class="submitButton"
          v-on:click="submitManuscript"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import ManuscriptSidebar from "@/components/ManuscriptSidebar.vue";

import {
  apiUploadManuscript,
  submitManuscript,
  apiGetManuscriptList,
  apiGetOpinionsList,
  apigetDemandInfo,
  apiGetTimeLine
} from "@/api/api.manuscript.js";
import request from "@/plugin/axios";

export default {
  components: {
    ManuscriptSidebar
  },

  data() {
    return {
      shareUrl: null,
      cumulativeTimeStr: "",
      cumulativeTime: 0,
      demandInfo: null,
      opinionsList: [],
      isUploading: false,
      activeNames: null,
      textarea: null,
      tempList: [],
      manuscriptList: {
        demandID: null,
        draft: [
          {
            imageList: [
              // {
              //   url:'',
              //   sourceFile:'',
              //   designDescription:'',
              //   reviseOpinion:'',
              //   ossID:'',
              // }
            ]
          }
        ],
        complete: []
      },

      selectedManuscriptType: null,
      selectedManuscriptNo: 0,
      selectedManuscriptSubNo: 0,
      selectedManuscriptIDForReload: 0,

      nowShowImg: null,
      showTimeDetails: false,
      reverse: true,
      manuscriptForm: {
        designDescription: "",
        reviseOpinion: "",
        source_file: ""
      },
      timeLine: []
      // activities: [{
      //   content: '活动按期开始',
      //   timestamp: '2018-04-15'
      // }, {
      //   content: '通过审核',
      //   timestamp: '2018-04-13'
      // }, {
      //   content: '创建成功',
      //   timestamp: '2018-04-11'
      // }, {
      //   content: '创建成功',
      //   timestamp: '2018-04-11'
      // }, {
      //   content: '创建成功',
      //   timestamp: '2018-04-11'
      // }],
    };
  },
  methods: {
    downloadFile(item) {
      window.open(item.url);
    },

    getFileType(item) {
      let url = item.url;

      let reg = /([/.][^-]+)$/;
      url = reg.exec(url);
      if (url) {
        return url[0];
      } else {
        return "";
      }
    },

    timeSecond2String(secondsData) {
      let text = "";
      const days = Math.floor(secondsData / 86400);
      const hours = Math.floor((secondsData % 86400) / 3600);
      const minutes = Math.floor(((secondsData % 86400) % 3600) / 60);
      const seconds = Math.floor(((secondsData % 86400) % 3600) % 60);

      if (days !== 0) {
        text += days + "天";
      }
      if (hours !== 0) {
        text += hours + "小时";
      }

      if (minutes !== 0) {
        text += minutes + "分钟";
      }

      if (seconds !== 0) {
        text += seconds + "秒";
      }
      return text;
    },
    getTimeRange(data) {
      let text = "";
      if (data.endTime == null) {
        text = data.startTime + " - 至今";
      } else {
        text = data.startTime + " - " + data.endTime;
      }

      const days = Math.floor(data.consuming / 86400);
      const hours = Math.floor((data.consuming % 86400) / 3600);
      const minutes = Math.floor(((data.consuming % 86400) % 3600) / 60);
      const seconds = Math.floor(((data.consuming % 86400) % 3600) % 60);

      text = text + "  (";
      // text = text + '  ('+  +')'
      if (days !== 0) {
        text += days + "天";
      }
      if (hours !== 0) {
        text += hours + "小时";
      }

      if (minutes !== 0) {
        text += minutes + "分钟";
      }

      if (seconds !== 0) {
        text += seconds + "秒";
      }

      text += ")";

      return text;
    },
    reUpload(event) {
      let formData = new FormData();
      formData.append("file", event.target.files[0]);

      apiUploadManuscript(formData).then(response => {
        this.manuscriptList[this.selectedManuscriptType][
          this.selectedManuscriptNo
        ].imageList[this.selectedManuscriptIDForReload].ossID =
          response.data.id;
        this.manuscriptList[this.selectedManuscriptType][
          this.selectedManuscriptNo
        ].imageList[this.selectedManuscriptIDForReload].url =
          response.data.download_url;
      });
    },
    reUploadManuscriptImage(index) {
      this.selectedManuscriptIDForReload = index;
      this.$refs.reUpload.dispatchEvent(new MouseEvent("click"));
    },
    getOpinionNickname(data) {
      let title = "";
      if (data.Operator) {
        if (data.Operator.nickname) {
          title = data.Operator.nickname;
        } else {
          title = data.Operator.username;
        }
      } else {
        title = "佚名 ";
      }

      return title + "   | " + data.updated_at;
    },
    submitManuscript() {
      submitManuscript(this.manuscriptList).then(response => {
        this.$alert("提交成功");
      });
    },
    deleteManuscriptImage(index) {
      this.manuscriptList[this.selectedManuscriptType][
        this.selectedManuscriptNo
      ].imageList.splice(index, 1);
      this.getManuscriptList();
    },
    getManuscriptList() {
      if (
        this.selectedManuscriptType == null ||
        this.selectedManuscriptNo == null
      ) {
        return [];
      } else {
        if (
          this.manuscriptList[this.selectedManuscriptType][
            this.selectedManuscriptNo
          ]
        ) {
          this.tempList = this.manuscriptList[this.selectedManuscriptType][
            this.selectedManuscriptNo
          ].imageList;
        } else {
          this.manuscriptList[this.selectedManuscriptType][
            this.selectedManuscriptNo
          ] = {
            imageList: []
          };
          this.tempList = this.manuscriptList[this.selectedManuscriptType][
            this.selectedManuscriptNo
          ].imageList;
        }
      }
    },

    clearManuscriptForm() {
      this.manuscriptForm = {
        designDescription: "",
        reviseOpinion: "",
        source_file: ""
      };
    },
    setSelectedManuscriptType(data) {
      this.selectedManuscriptType = data.type;
      this.selectedManuscriptNo = data.id;
      this.selectedManuscriptSubNo = null;

      this.nowShowImg = null;
      this.getManuscriptList();

      this.clearManuscriptForm();
    },

    handleChange() {},
    selectPic(event) {
      this.selectedManuscriptSubNo = event.target.id;
      this.nowShowImg = event.target.currentSrc;
      if (
        this.manuscriptList[this.selectedManuscriptType][
          this.selectedManuscriptNo
        ].imageList[this.selectedManuscriptSubNo].info
      ) {
        this.manuscriptForm = this.manuscriptList[this.selectedManuscriptType][
          this.selectedManuscriptNo
        ].imageList[this.selectedManuscriptSubNo].info;
      } else {
        this.clearManuscriptForm();
      }

      let detailsID = this.manuscriptList[this.selectedManuscriptType][
        this.selectedManuscriptNo
      ].imageList[this.selectedManuscriptSubNo].id;

      this.opinionsList = [];
      apiGetOpinionsList(detailsID).then(response => {
        console.log("opinionsList", response);
        this.opinionsList = response;
      });
    },

    addManuscript(data) {
      this.selectedManuscriptType = data.attachmentType;
      if (
        !this.manuscriptList[this.selectedManuscriptType][
          this.selectedManuscriptNo
        ]
      ) {
        this.manuscriptList[this.selectedManuscriptType][
          this.selectedManuscriptNo
        ] = {
          imageList: []
        };
      }

      this.manuscriptList[this.selectedManuscriptType][
        this.selectedManuscriptNo
      ].imageList.push({
        url: data.url,
        status: "正在上传"
      });

      this.uploadManuscript(data.vue_uid, data.attachmentType);
      this.getManuscriptList();
    },

    uploadManuscript(data, type) {
      let file = null;
      this.$children.forEach((v, k) => {
        if (v._uid == data) {
          if (type == "complete") {
            file = v.$refs.fileComplete;
          }

          if (type == "draft") {
            file = v.$refs.fileDraft;
          }
        }
      });

      let formData = new FormData();

      formData.append("file", file.files[0]);

      apiUploadManuscript(formData).then(response => {
        this.manuscriptList[this.selectedManuscriptType][
          this.selectedManuscriptNo
        ].imageList.pop();
        this.manuscriptList[this.selectedManuscriptType][
          this.selectedManuscriptNo
        ].imageList.push({
          url: response.data.download_url,
          ossID: response.data.id,
          status: "上传完成",
          info: {
            source_file: "",
            designDescription: "",
            reviseOpinion: ""
          }
        });
      });
    },
    setLast(srcResult) {
      let result = JSON.parse(JSON.stringify(srcResult));
      let result2 = JSON.parse(JSON.stringify(srcResult));

      let lastComplete = 0;
      let lastDraft = 0;
      try {
        lastComplete = result.complete[result.complete.length - 1];
        if (lastComplete) {
          lastComplete =
            lastComplete.imageList[lastComplete.imageList.length - 1]
              .updated_at;
        } else {
          lastComplete = 0;
        }
        lastComplete = lastComplete.replace(/-/g, "/");
        lastComplete = new Date(lastComplete).getTime();
      } catch (error) {}

      try {
        lastDraft = result.draft[result.draft.length - 1];
        console.log("lastDraft", lastDraft);
        if (lastDraft) {
          lastDraft =
            lastDraft.imageList[lastDraft.imageList.length - 1].updated_at;
        } else {
          lastDraft = 0;
        }
        lastDraft = lastDraft.replace(/-/g, "/");
        lastDraft = new Date(lastDraft).getTime();
      } catch (error) {}

      console.log(lastComplete, lastDraft);
      if (lastComplete == 0 && lastDraft == 0) {
        return;
      }
      if (lastComplete > lastDraft) {
        this.selectedManuscriptNo = result.complete.length - 1;
        let tmp = result.complete[result.complete.length - 1];
        this.nowShowImg = tmp.imageList[tmp.imageList.length - 1].url;
        this.tempList = tmp.imageList;
      } else {
        this.selectedManuscriptNo = result.draft.length - 1;
        console.log(result.draft.length);
        let tmp = result.draft[result.draft.length - 1];
        this.nowShowImg = tmp.imageList[tmp.imageList.length - 1].url;
        this.tempList = tmp.imageList;
      }
    },

    setSelect4ossID(result, ossid) {
      let self = this;
      console.log("ossid", result);
      result.draft.forEach((v, k) => {
        v.imageList.forEach((v1, k1) => {
          if (v1.ossID == ossid) {
            self.tempList = v.imageList;
            self.nowShowImg = v1.url;
          }
        });
      });

      result.complete.forEach((v, k) => {
        v.imageList.forEach((v1, k1) => {
          if (v1.ossID == ossid) {
            self.tempList = v.imageList;
            self.nowShowImg = v1.url;
          }
        });
      });
    },
    async getManuscriptListData(demandID) {
      let result = await apiGetManuscriptList(demandID);

      this.setLast(result);

      if (this.$route.query.selectOssID !== undefined) {
        this.setSelect4ossID(result, this.$route.query.selectOssID);
      }

      result.complete.push({
        imageList: []
      });
      result.draft.push({ imageList: [] });
      this.manuscriptList = result;
      this.updateSideBar(result);
    },
    updateSideBar(data) {
      if (this.$refs.ManuscriptSidebar !== undefined) {
        this.$refs.ManuscriptSidebar.setSidebar(data);
      }
    },
    async getTimeLine(id) {
      let result = await apiGetTimeLine(id);
      this.timeLine = result;
      result.forEach((v, k) => {
        this.cumulativeTime = this.cumulativeTime + v.consuming;
      });
      this.cumulativeTimeStr = this.timeSecond2String(this.cumulativeTime);
    }
  },

  mounted() {
    let urlHash = window.location.hash;
    urlHash = urlHash.replace("#/manuscript", "#/share/manuscript");

    this.shareUrl =
      window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port +
      "/" +
      urlHash;

    this.manuscriptList.demandID = this.$route.query.demand_id;

    this.getManuscriptListData(this.$route.query.demand_id);

    apigetDemandInfo(this.$route.query.demand_id).then(response => {
      this.demandInfo = response;
    });

    this.getTimeLine(this.$route.query.demand_id);

    // if(this.$route.query.firstLoading !== '1'){
    //   console.log(this.$route.query.firstLoading)
    //   // this.$route.query.firstLoading = true
    //
    //   //
    //   window.location.href = document.URL+'&firstLoading=1'
    //   location.reload()
    // }
  },

  watch: {
    manuscriptList: {
      handler: function(newVal, oldVal) {
        this.updateSideBar(newVal);
      },
      deep: true
    },
    manuscriptForm: {
      handler: function(newVal, oldVal) {
        if (this.selectedManuscriptSubNo !== null) {
          this.manuscriptList[this.selectedManuscriptType][
            this.selectedManuscriptNo
          ].imageList[this.selectedManuscriptSubNo].info = newVal;
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
/* .container {
  max-width: 1600px !important;
}
.reUpload {
  left: 0px;
  position: absolute;
  bottom: 22px;
  background-color: #eeeeee6b;
} */
</style>
<style lang="scss">
// .plz_selectPic {
//   font-size: 24px;
//   text-align: center;
//   padding-top: 20vh;
//   color: #aaa;
// }
// .nullTip {
//   text-align: center;
//   margin-top: 30px;
//   font-size: 21px;
//   color: #aaa;
// }
// .pictureDetails img {
//   width: 100%;
// }
// .imgStream {
//   position: sticky;
//   margin-bottom: 10px;
// }
// .imgStream img {
//   width: 90%;
//   margin-bottom: 20px;
// }
// .imgStream .titleSpan {
//   position: absolute;
//   left: 0;
//   top: 0px;
//   background-color: #eeeeee6b;
// }
// .imgStream .delSpan {
//   right: 18px;
//   position: absolute;
//   left: auto;
//   background-color: #f443366b;
//   color: #fff;
//   bottom: 23px;
//   top: auto;
// }

// .submitButton {
//   padding: 10px !important;
//   width: 80%;
//   margin: 10%;
//   margin-top: 0%;
// }
// .designDescription .el-collapse-item__header {
//   height: 25px;
// }
// .timeLine {
//   border-top: 1px solid #f2f2f2;
//   margin-top: 15px;
//   padding-top: 20px;
//   border-bottom: 1px solid #f2f2f2;
// }
// .timeLine .el-timeline-item {
//   padding-bottom: 5px;
// }
// .timeLine .el-timeline-item__content {
//   height: 15px;
// }
// .timeLine .el-timeline-item__wrapper {
//   top: -11px;
// }

// .abnormalTag .el-tag {
//   margin-top: 10px;
// }
// .project_title {
//   font-size: 20px;
//   text-align: center;
//   padding: 10px;
//   margin-bottom: 10px;
//   background-color: #eee;
// }
// .designDescription {
//   overflow-y: scroll;
//   max-height: 300px;
// }
// .excision {
//   padding: 110px;
//   background-color: #f2f2f2;
//   margin: 10px 0;
// }
// #manuscript {
//   .upload-form {
//     .upload-container {
//       float: left;
//       width: 67%;
//       .no-files {
//         border: 1px solid #999;
//         width: 395px;
//         height: 240px;
//         margin: 0 auto;
//         text-align: center;
//         vertical-align: middle;
//         line-height: 220px;
//         span {
//           // display: block;
//         }
//         .iconxiangmu {
//           font-size: 32px;
//         }
//       }

//       .upload-preview {
//         ul {
//           li {
//             img {
//               width: 450px;
//             }
//           }
//         }
//       }
//     }
//     .desc-container {
//       float: right;
//       width: 24%;
//       /* max-width: 395px; */
//       background-color: #fff;
//       label {
//         font-size: 13px;
//         font-weight: bold;
//         width: 65px;
//       }
//       input {
//         height: 30px;
//         width: 90%;
//         border-radius: unset;
//       }
//       .el-row {
//         line-height: 30px;
//         .el-form-item {
//           label {
//             text-align: left;
//           }
//           button {
//             width: 160px;
//             height: 40px;
//             border-radius: 0;
//             background-color: $theme-color;
//             border: 0px;
//             color: #fff;
//             width: 106px;
//             height: 31px;
//           }
//         }
//       }
//     }
//   }

//   textarea {
//     width: 90%;
//     border-radius: unset;
//   }
// }
</style>
<style scoped>
/* .fileInfo {
  margin-bottom: 10px;
} */
</style>
