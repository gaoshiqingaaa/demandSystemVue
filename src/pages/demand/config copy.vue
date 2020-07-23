<template>
  <div id="demand">
    <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
      <div class="base-info">
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目归属" prop="demand_user">
              <el-select v-model="form.demand_user" placeholder="请选择需求人">
                <el-option v-for="(user, index) in userList" :label="user.nickname" :key="index" :value="user.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求人" prop="demand_user">
              <el-select v-model="form.demand_user" placeholder="请选择需求人">
                <el-option v-for="(user, index) in userList" :label="user.nickname" :key="index" :value="user.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="对接人" prop="reviewer_user">
              <el-select v-model="form.reviewer_user" placeholder="请选择对接人">
                <el-option v-for="(user, index) in userList" :label="user.nickname" :key="index" :value="user.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>-->

          <el-col :span="8">
            <el-form-item label="流程" prop="demand_flow">
              <label slot="label">
                流程
                <el-tooltip placement="bottom-start">
                  <div slot="content">
                    A：（出图慢）甲方不提供任何设计参考，需乙方先提交方案甲方确认方向后再完成最终设计
                    <br />B：（易过稿）甲方提供了一些参考图，需乙方在参考的基础上进行优化或提出更好的方案提交甲方确认方向后再完成设计
                    <br />C：（出图快）甲方提供明确参考图和设计要求，乙方完全按照需求出成品图即可
                  </div>
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </label>
              <el-radio-group v-model="form.demand_flow">
                <el-radio-button label="1" value="1">A</el-radio-button>
                <el-radio-button label="2" value="2">B</el-radio-button>
                <el-radio-button label="3" value="3">C</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="定稿时间" prop="dg_time">
              <el-date-picker v-model="form.dg_time" class="input-datepicker" type="datetime" format="MM/dd 星期ddd HH:00"
                placeholder="选择定稿时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="草图时间" prop="ct_time">
              <el-date-picker v-model="form.ct_time" class="input-datepicker" type="datetime" format="MM/dd 星期ddd HH:00"
                placeholder="选择草图时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="静态稿时间" prop="jtg_time">
              <el-date-picker v-model="form.jtg_time" class="input-datepicker" type="datetime"
                format="MM/dd 星期ddd HH:00" placeholder="选择静态稿时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="尺寸" prop="img_size">
              <el-select v-model="form.img_size" allow-create filterable placeholder="请选择或输入尺寸">
                <el-option v-for="size in sizeList" :label="size.size" :key="size.id" :value="size.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="设计分类">
              <el-select v-model="form.demand_type" placeholder="请选择或输入设计分类" allow-create filterable
                @change="handleDemandTypeChange">
                <el-option v-for="type in typeList" :label="type.name" :key="type.id" :value="type.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="发布场景">
              <el-select v-model="form.demand_scene" placeholder="请选择或输入发布场景">
                <el-option v-for="scene in sceneList" :label="scene.name" :key="scene.index" :value="scene.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="期待结果">
              <div class="textarea-wrapper">
                <el-input type="textarea" autosize v-model="form.expected_result"
                  placeholder="表达您的设计目的和期望结果，设计师才能帮您一起想创意喔"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="require-info">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目名称" prop="name">
              <el-input type="textarea" autosize v-model="form.name" placeholder="格式：主题分类-主体名称，如：小植物语-关爱儿童排版"
                @input="handleNameInput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="整体要求" prop="requirements">
              <el-input type="textarea" autosize v-model="form.requirements" placeholder="表达您的设计目的和期望结果，设计师才能帮您一起想创意喔">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="文案" prop="copy_writing">
              <el-input type="textarea" autosize v-model="form.copy_writing" placeholder="若无请填无"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="元素要求">
              <el-input type="textarea" autosize v-model="form.element_require" placeholder="画面中要求出现哪些必要元素、可选元素">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="配色要求">
              <el-input type="textarea" autosize v-model="form.color_require" placeholder="画面整体颜色要求"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="注意事项">
              <el-input type="textarea" autosize v-model="form.notes" placeholder="提醒设计师特别注意的地方"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="material-info">
        <el-row>
          <el-col :span="24">
            <el-form-item label="资料链接和说明">
              <el-input v-model="form.material" type="textarea" autosize placeholder="请将大资料存在百度云后，链接填于此"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <!-- 添加附件或参考图 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="添加附件">
              <div class="upload-container">
                <ul>
                  <li class="upload-item" v-for="(item, index) in form.attachment_file_arr" :key="index">
                    <uploadAttachments :ref="`uploadAttachment${index}`" :attachmentData="item" :attachmentIndex="index"
                      @deleteAttachment="deleteAttachment" @updateAttachmentInfo="updateAttachmentInfo"
                      @uploadDone="uploadDone"></uploadAttachments>
                  </li>
                </ul>

                <div class="clear-b">
                  <el-button type="primary" class="btn" @click="addItem('attachment')">点击添加</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </div>
      <div class="qu-info">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目疑问">
              <div class="gray">{{ userInfo.nickname }} {{ $moment().format("YYYY-MM-DD HH:mm") }}</div>
              <el-input type="textarea" v-model="form.answer" autosize placeholder="（设计师填写）对于需求的疑问"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="疑问回复">
              <div class="gray">{{ userInfo.nickname }} {{ $moment().format("YYYY-MM-DD HH:mm") }}</div>
              <el-input type="textarea" v-model="form.reply" autosize placeholder="（需求方填写）回复设计师的疑问"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="项目状态">
              <el-select v-model="form.status">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.status" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="preview-info" id="share_link">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目名称">
              <div class="gray">{{ copyName }}</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="需求链接">
              <div class="gray">{{ shareLink }}</div>
            </el-form-item>
          </el-col>
        </el-row>

        <div>
          <el-button data-clipboard-target="#share_link" data-clipboard-action="copy" class="btn btn-theme btn-copy"
            ref="copy_button">复制</el-button>
        </div>
      </div>

      <div class="btn-group">
        <el-form-item>
          <el-button type="primary" :disabled="viewManuscriptDisabled" @click="gotoManuscriptPage">
            交稿页面({{manuscript_count}})</el-button>
          <el-button type="primary" :disabled="submitDisabled" @click="onSubmit">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {
    getStatusList,
    createOrUpdateDemand,
    apiGetDemandType,
    apiGetManuscriptCount,
    apiGetDemandDetail,
    apiSubmitComment,
    apiGetComment,
    apiGetDemandScene,
    apiGetDemandSize,
    apiGetDemandUser
  } from "@/api/api.demand.js";

  import Clipboard from "clipboard";
  import uploadAttachments from "./uploadAttachment.vue";
  const timeFormat = "YYYY-MM-DD HH:mm:ss";

  export default {
    components: {
      uploadAttachments
    },
    data() {
      const checkTime = (rule, value, callback) => {
        const _this = this;
        const dgTime = _this.$moment(_this.form.dg_time).unix();
        const currentPickerTime = _this.$moment(value).unix();

        if (dgTime < currentPickerTime) {
          return callback(new Error("时间不能设置早于定稿时间"));
        }

        return callback();
      };

      return {
        api: {
          save: "/api/api/v1/demand/demand/"
        },
        isEdit: false,
        // 上传文件使用参数
        attachment_file_list: [],
        reference_img_file_list: [],
        attachmentUploadBtnShow: [true],
        // 用户信息
        userInfo: {
          id: null,
          username: "",
          realname: "",
          nickname: "",
          role_id: null,
          role_name: "",
          role_name_id: null,
          role_level: "",
          role_level_id: "",
          company: {},
          permissions: {}
        },
        submitDisabled: false,
        viewManuscriptDisabled: true,
        userList: {},
        sizeList: {},
        sceneList: {},
        typeList: {},
        manuscript_count: 0,
        statusOptions: [],
        dialogImageUrl: "",
        dialogVisible: false,
        disabled: false,
        copyName: "提交后自动生成",
        typeName: "",
        shareLink: "提交后自动生成",
        form: {
          id: "",
          name: "",
          demand_user: "", // 需求人
          reviewer_user: "", // 对接人
          demand_flow: 3,
          dg_time: "",
          ct_time: "",
          jtg_time: "",
          img_size: "", // 尺寸
          demand_type: "",
          demand_scene: "",
          expected_result: "",
          requirements: "",
          copy_writing: "",
          element_require: "",
          color_require: "",
          notes: "",
          material: "", // 资料地址
          material_desc: "", // 资料说明
          attachment: [], // 附件地址
          reference_img: [], // 参考图
          status: 1,
          demand_num: "",
          answer: "",
          reply: "",
          attachment_file_arr: []
        },

        rules: {
          demand_user: [{
            required: true,
            message: "请选择需求人",
            trigger: "blur"
          }],
          reviewer_user: [{
            required: true,
            message: "请选择需求人",
            trigger: "blur"
          }],

          demand_flow: [{
            required: true,
            message: "请选择流程类型",
            trigger: "blur"
          }],
          name: [{
            required: true,
            message: "请填写项目名称",
            trigger: "blur"
          }],
          requirements: [{
            required: true,
            message: "请填写整体要求",
            trigger: "blur"
          }],
          copy_writing: [{
            required: true,
            message: "请填写项目文案",
            trigger: "blur"
          }],
          img_size: [{
            required: true,
            message: "请选择或输入尺寸",
            trigger: ["blur", "change"]
          }],
          dg_time: [{
            required: true,
            message: "请选择定稿时间",
            trigger: "blur"
          }],
          ct_time: [{
            required: false,
            trigger: "change",
            validator: checkTime
          }],
          jtg_time: [{
            required: false,
            trigger: "change",
            validator: checkTime
          }]
        }
      };
    },
    filters: {
      formatFileSize(val) {
        return (val / 1024 / 1024).toFixed(2);
      }
    },

    computed: {},

    watch: {
      attachmentUploadBtnShow: {
        // 深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          const _this = this;
          _this.$forceUpdate();
        },
        deep: true
      }
    },

    mounted() {
      console.log("$parent", this);
      // 获取noble信息
      const _this = this;
      _this.init();
      _this.initClipboard();
      if (_this.$route.query.id) {
        _this.isEdit = true;
        _this.form.id = _this.$route.query.id;
        _this.getDemandDetail();
      } else {
        this.statusOptions = [{
          id: 1,
          status: "等待执行"
        }]
      }
    },
    methods: {
      uploadDone() {
        this.addItem("attachment");
      },
      deleteAttachment(index) {
        console.log("delete", index);
        this.form.attachment_file_arr.splice(index);
      },
      updateAttachmentInfo(data) {
        this.form.attachment_file_arr[data.index] = data.data;
      },
      handleDemandTypeChange(val) {
        const _this = this;
        const type = _this.typeList.find(item => {
          return item.id === val;
        });

        _this.typeName = type.name;
        if (_this.typeName) {
          _this.copyName = _this.typeName + "-" + _this.form.name;
        } else {
          _this.copyName = _this.form.name;
        }
      },

      handleNameInput: function (val) {
        const _this = this;
        _this.copyName = _this.typeName + "-" + val;
      },

      // 检查文件上传大小
      beforeUpload(file) {
        console.log("开始上传", file);
        const isLt25M = file.size / 1024 / 1024 < 25;
        if (!isLt25M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }

        return isLt25M;
      },

      // 处理文件
      handleFile() {},

      handleFileSuccess: function (res, file, type, index) {
        const _this = this;
      },

      // 文件上传过程中的函数
      uploadFileProcess(event, file, fileList) {
        console.log("uploadFileProcess", event, file, fileList);
        const _this = this;
      },

      hanldeFileChange(file, fileList, type, index) {
        const _this = this;
        _this.form[type][index] = file.raw;

        if (type === "attachment") {
          _this.attachmentUploadBtnShow[index] = false;
          _this.form.attachment_file_arr[index]["attachment"] = file.raw;
        } else if (type === "reference_img") {}

        _this.$forceUpdate();
      },

      // 图片缩略图remove事件
      hanldeRemovefile(file, fileList, type, index) {
        const _this = this;
        _this.form[type][index] = "";
        // _this.$refs['ref_attachment_file_' + index].clearFiles()
        _this.$refs["ref_attachment_file_" + index][0].clearFiles();
        _this.attachmentUploadBtnShow[index] = true;
        _this.$forceUpdate();
      },

      addItem: function (type, fileArr) {
        const _this = this;
        if (type === "attachment") {
          _this.form.attachment_file_arr.push({
            attachment: "",
            attachment_desc: "",
            id: ""
          });

          _this.attachmentUploadBtnShow.push(true);
        }
        _this.$forceUpdate();
      },

      reomveItem: function (type, rowIndex) {
        const _this = this;
        if (type === "attachment") {
          // _this.$refs['ref_attachment_file_' + rowIndex][0].clearFiles()
          _this.form.attachment_file_arr.splice(rowIndex, 1);
          _this.attachmentUploadBtnShow.splice(rowIndex, 1);
          console.log(_this.form.attachment_file_arr);
        }

        _this.$forceUpdate();
      },

      onSubmit() {
        var _this = this;
        _this.submitDisabled = true;
        _this.$refs["form"].validate(valid => {
          if (valid) {
            let ajaxUrl = _this.api.save;
            let method = "POST";

            if (_this.$route.query.act) {
              ajaxUrl = _this.api.save + _this.form.id + "/";
              method = "PUT";
            }
            let self = this;
            createOrUpdateDemand(
              method,
              this.formatPostData(),
              this.form.id
            ).then(response => {
              console.log(response);
              if (response.data && response.data.error_code != undefined) {
                self.$alert(response.data.error_msg);
                self.submitDisabled = false;
                return;
              }

              self.submitDisabled = false;
              if (self.form.answer) {
                self.submitComment(1, self.form.answer, response.id);
              }

              if (self.form.reply) {
                self.submitComment(2, self.form.reply, response.id);
              }

              //处理附件

              self
                .$confirm("保存成功，留在当前页面继续编辑或返回列表?", "提示", {
                  confirmButtonText: "返回列表",
                  cancelButtonText: "继续编辑",
                  type: "success"
                })
                .then(() => {
                  _this.$router.push({
                    name: "index"
                  });
                })
                .catch(() => {
                  _this.form.id = response.id;
                  _this.$router.push({
                    name: "config_demand",
                    query: {
                      id: response.id,
                      act: "edit"
                    }
                  });
                });
            });
          } else {
            _this.submitDisabled = false;
            console.log("error submit!!");
            return false;
          }
        });
      },

      submitComment(action, content, demand) {
        const self = this;
        // const userInfoStr = sessionStorage.getItem('user')
        const userInfoObj = this.$store.getters.getUserInfo;
        apiSubmitComment({
          content: content,
          demand: demand,
          user: userInfoObj.id,
          action: action // 1提问，2回复
        });
      },

      formatPostData() {
        var self = this;
        var params = {
          name: self.form.name,
          demand_user: self.form.demand_user, // 需求人
          reviewer_user: self.form.reviewer_user, // 对接人
          demand_flow: self.form.demand_flow,
          dg_time: self.formatDate(self.form.dg_time),
          img_size: self.form.img_size, // 尺寸
          demand_type: self.form.demand_type,
          demand_scene: self.form.demand_scene,
          expected_result: self.form.expected_result,
          requirements: self.form.requirements,
          copy_writing: self.form.copy_writing,
          element_require: self.form.element_require,
          color_require: self.form.color_require,
          notes: self.form.notes,
          material: self.form.material, // 资料地址
          material_desc: self.form.material_desc,
          reference_img: [], // 参考图
          status: self.form.status,
          attachment: self.form.attachment_file_arr
        };

        // 附件地址
        if (self.fileArr) {
          self.fileArr.forEach(function (item) {
            if (item.status == "success") {
              console.log(item);
              params["attachment"].push(item.id);
            }
          });
        }

        if (self.form.id) {
          params["id"] = self.form.id;
        }

        if (self.form.ct_time) {
          params["ct_time"] = self.formatDate(self.form.ct_time);
        }

        if (self.form.jtg_time) {
          params["jtg_time"] = self.formatDate(self.form.jtg_time);
        }

        return JSON.stringify(params);
      },

      formatDate(val) {
        return this.$moment(val).format("YYYY-MM-DD HH:mm:ss");
      },

      gotoManuscriptPage() {
        this.$router.push({
          name: "manuscript",
          query: {
            demand_id: this.form.id
          }
        });
      },

      getDemandUser() {
        let self = this;
        apiGetDemandUser().then(response => {
          if (response && response.results) {
            self.userList = response.results;
          }
        });
      },

      getDemandType() {
        let self = this;
        apiGetDemandType().then(response => {
          if (response && response.results) {
            self.typeList = response.results;
          }
        });
      },

      getDemandSize() {
        let self = this;
        apiGetDemandSize().then(response => {
          if (response && response.results) {
            self.sizeList = response.results;
          }
        });
      },

      getDemandScene() {
        let self = this;
        apiGetDemandScene().then(response => {
          if (response && response.results) {
            self.sceneList = response.results;
          }
        });
      },

      getManuscriptCount() {
        console.log("getManuscriptCount");
        let self = this;
        apiGetManuscriptCount(this.$route.query.id).then(response => {
          if (response) {
            self.manuscript_count = response.count;
          }
        });
      },

      // 获取评论 (项目疑问action=1, 疑问回复action=2)
      getComment: function (params) {
        let self = this;
        params["order"] = "-created_at";
        apiGetComment(params).then(response => {
          if (response.results) {
            if (response.count > 0) {
              const comment = response.results.shift();
              if (comment.action == 1) {
                self.form.answer = comment.content;
              }

              if (comment.action == 2) {
                self.form.reply = comment.content;
              }
            }
          } else {
            self.$message({
              message: response.msg,
              type: "error"
            });
          }
        });
      },

      getAttachmentInfo(attachmentList) {
        console.log("AttachmentInfo", attachmentList);
      },
      getDemandDetail: async function (id) {
        this.statusOptions = await getStatusList();
        this.statusOptions = this.statusOptions.data;
        const _this = this;
        let self = this;
        _this.getManuscriptCount();

        apiGetDemandDetail(this.form.id).then(response => {
          console.log(response);
          Object.assign(self.form, response);

          self.form.demand_user = response.demand_user.id; // 需求人
          self.form.reviewer_user = response.reviewer_user.id; //对接人
          self.form.demand_flow = response.demand_flow.id;

          self.form.img_size = response.img_size.id; //尺寸
          if (response.demand_scene != null) {
            self.form.demand_scene = response.demand_scene.id;
          }

          if (response.demand_type != null) {
            self.form.demand_type = response.demand_type.id;
            self.typeName = response.demand_type.name;
          }

          self.form.expected_result = response.expected_result;
          self.shareLink = window.top.document; //设置共享链接
          let urlHash = window.location.hash;

          urlHash = urlHash.replace("#/config_demand", "#/share/config_demand");
          self.shareLink =
            window.location.protocol +
            "//" +
            window.location.hostname +
            ":" +
            window.location.port +
            "/" +
            urlHash;

          if (self.typeName) {
            self.copyName = self.typeName + "-" + self.form.name;
          }

          // 拉取附件信息
          self.form.attachment_file_arr = response.attachment;
          console.log("response", response);
          console.log("attachment_file_arr", self.form.attachment_file_arr);
        });

        _this.viewManuscriptDisabled = false;
        // 项目疑问
        _this.getComment({
          demand: _this.form.id,
          action: 1
        });

        // 疑问回复
        _this.getComment({
          demand: _this.form.id,
          action: 2
        });
      },

      inArray(search, array) {
        for (var i in array) {
          if (array[i] == search) {
            return true;
          }
        }
        return false;
      },

      initClipboard() {
        const _this = this;
        const clipboard = new Clipboard(".btn-copy");

        clipboard.on("success", e => {
          console.log("复制成功");
          _this.$message({
            message: "复制成功",
            type: "success"
          });
        });

        clipboard.on("error", e => {
          console.log("复制失败，请再次尝试");
          _this.$message({
            message: "复制失败，请再次尝试",
            type: "error"
          });
        });
      },

      init() {
        const _this = this;
        var userInfoObj = this.$store.getters.getUserInfo;
        _this.form.demand_user = userInfoObj.id;
        _this.form.reviewer_user = userInfoObj.id;
        _this.userInfo = userInfoObj;

        if (_this.inArray(userInfoObj.role_id, [1, 2, 3, 4])) {
          _this.statusOptions.forEach(function (item) {
            if (_this.inArray(item["value"], [3, 4, 5])) {
              item["disabled"] = true;
            }
          });
        }

        // 初始化下拉框
        _this.getDemandUser();
        _this.getDemandType();
        _this.getDemandSize();
        _this.getDemandScene();
        if (_this.isEdit === false) {
          // 设置默认定稿时间
          _this.form.dg_time = _this
            .$moment(new Date())
            .add(1, "days")
            .set("hours", 16)
            .set("minutes", "00")
            .set("seconds", "00");
        }
      }
    }
  };

</script>

<style lang="scss">
  #demand {
    margin: 10px 0px 0px 10px;
    overflow: hidden;

    label {
      font-size: 13px;
      font-weight: bold;
    }

    input {
      height: 30px;
      width: 180px;
      padding-left: unset;
      padding-left: 10px;
      border-radius: unset;
    }

    textarea.el-textarea__inner {
      // height: 30px;
      overflow: visible;
    }

    .el-row {
      line-height: 30px;

      .el-form-item {
        label {
          text-align: left;
        }
      }
    }

    .input-datepicker {
      .el-input__prefix {
        display: none;
      }

      .el-input--prefix {
        .el-input__inner {
          padding-left: 0px;
        }
      }
    }

    .base-info,
    .require-info,
    .material-info,
    .qu-info,
    .preview-info {
      background-color: #fff;
      padding-top: 30px;
      padding-left: 25px;
      padding-bottom: 1px;
      margin-bottom: 15px;
      padding-right: 35px;
    }

    .preview-info {
      padding-bottom: 20px;

      .btn-copy {
        width: 95px;
        height: 30px;
      }
    }

    .base-info {
      .el-radio-group {
        label {
          margin-right: 6px;

          &.is-active {
            border: unset;
          }
        }

        .el-radio-button__orig-radio:checked+.el-radio-button__inner {
          background-color: $theme-color;
        }

        .el-radio-button__inner {
          border-radius: 0.5em;
          border: 1px solid #dcdfe6;
          font-weight: 500;
          -webkit-appearance: none;
          text-align: center;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          outline: 0;
          margin: 0;
          position: relative;
          cursor: pointer;
          -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          font-size: 14px;
          height: 30px;
          line-height: 30px;
          display: block;
          padding: 0;
          width: 45px;
          box-shadow: unset !important;

          &hover {
            color: $theme-color;
          }
        }
      }
    }

    .material-info {
      .attachment-upload {
        .image-wrapper {
          // height: 148px;
        }

        .el-upload-list {
          li.is-ready {
            // height: 200px;
            border-radius: unset;
          }
        }
      }
    }

    .btn-group {
      margin-top: 20px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .el-form-item {
        .el-form-item__content {
          margin: unset !important;

          button {
            width: 160px;
            height: 40px;
            border-radius: 0;
            background-color: $theme-color;
            border: 0px;
          }
        }
      }
    }
  }

  .el-upload-list--picture-card .el-upload-list__item-actions {
    // height: 148px;
  }

  .el-input--prefix .el-input__inner {
    padding-left: unset;
    padding-left: 10px;
  }

  .el-input--suffix .el-input__inner {
    // padding-right: 30px;
  }

  .el-upload-list--picture .el-upload-list__item-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    float: left;
    position: relative;
    z-index: 1;
    margin-left: -80px;
    background-color: #fff;
  }

  .el-upload {
    width: 100%;
    display: unset;
  }

  .upload-container {
    ul {
      padding-left: 0px !important;

      .upload-item {
        margin: 10px 10px;
        float: left;
        width: 100%;
        border: 1px dashed #c0ccda;
        /* width: 600px; */
        padding: 10px 10px;
        position: relative;
        height: 210px;

        .btn-upload {
          height: 90px;
          width: 100%;
          background: #fff;
          color: #999;
          border: unset;
        }

        .romove-item {
          position: absolute;
          right: -12px;
          top: -12px;
          height: 24px;
          width: 24px;
          border: 0px;

          &:focus,
          &:hover {
            color: #fff;
            background-color: $theme-color;
          }

          .el-icon-error {
            font-size: 24px !important;

            &:hover {}
          }
        }

        textarea {
          margin-top: 8px;
        }

        .tip_note {
          color: #ccc;
          font-size: 10px;
          /* margin-left: 10px; */
          display: block;
          line-height: 18px;
        }
      }
    }
  }

</style>
<style>
  .upload-demo {
    float: left;
    width: 50%;
  }

</style>
