<template>
  <div id="demand">
    <el-form ref="form" status-icon :model="form" :rules="rules" label-width="90px">
      <div class="base-info">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="项目归属" prop="demand_company">
              <el-select v-model="form.demand_company" placeholder="请选择公司">
                <el-option v-for="company in companyList" :label="company.name" :key="company.id" :value="company.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求人" prop="demand_user">
              <el-select :disabled="userListDisabled" v-model="form.demand_user" placeholder="请选择需求人">
                <el-option v-for="(user, index) in userList" :label="user.nickname" :key="index" :value="user.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="沟通流程" prop="demand_flow">
              <el-select v-model="form.demand_flow" placeholder="请选择沟通流程">
                <el-option label="A" :value="1"/>
                <el-option label="B" :value="2"/>
                <el-option label="C" :value="3"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="交稿时间" prop="dg_time">
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
            <el-form-item label="项目分类">
              <el-select class="jq-demand-type-select" v-model="form.demand_type_name" placeholder="请选择或输入设计分类" allow-create filterable
                @change="handleDemandTypeChange" @focus='handleDemandTypeFocus'>
                <el-option v-for="type in typeList" :label="type.name" :key="type.id" :value="type.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="静态稿时间" prop="jtg_time">
              <el-date-picker v-model="form.jtg_time" class="input-datepicker" type="datetime"
                format="MM/dd 星期ddd HH:00" placeholder="选择静态稿时间"></el-date-picker>
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="期待结果">
              <div class="textarea-wrapper">
                <el-input type="textarea" autosize v-model="form.expected_result"
                  placeholder="表达您的设计目的和期望结果，设计师才能帮您一起想创意喔"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目名称" prop="name">
              <el-input type="textarea" autosize v-model="form.name" placeholder="格式：主题分类-主体名称，如：小植物语-关爱儿童排版"
                @input="handleNameInput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 多个需求提交 -->
      <div class="require-demand cc-mar-b-16"
        v-for="(item, index) in demandRequestList" :key="index + 'require_from'">
        <el-form :ref="'reqform_' + index" :model="item" :rules="demandReqRules">
          <div style="margin-bottom: 0px;" class="require-info">
            <div class="cc-mar-b-10 cc-tc-t3">稿件{{ index + 1 }}</div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="稿件尺寸" prop="img_size_name">
                  <el-select :class="'jq-img-size-select' + index " v-model="item.img_size_name" allow-create filterable placeholder="请选择或输入尺寸" @focus='handleImgSizeFocus(index)'>
                    <el-option v-for="size in sizeList" :label="size.size" :key="size.id" :value="size.size"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发布场景">
                  <el-select :class="'jq-demand-scene-select' + index" v-model="item.demand_scene_name" allow-create filterable placeholder="请选择或输入发布场景"  @focus='handleDemandSceneFocus(index)'>
                    <el-option v-for="scene in sceneList" :label="scene.name" :key="scene.index" :value="scene.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="整体要求" prop="requirements">
                  <el-input type="textarea" v-model="item.requirements" placeholder="表达您的设计目的和期望结果，设计师才能帮您一起想创意喔">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="文案" prop="copy_writing">
                  <el-input type="textarea" autosize v-model="item.copy_writing" placeholder="若无请填无"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="元素要求">
                  <el-input type="textarea" autosize v-model="item.element_require" placeholder="画面中要求出现哪些必要元素、可选元素">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="配色要求">
                  <el-input type="textarea" autosize v-model="item.color_require" placeholder="画面整体颜色要求"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <div 
          style="background-color: #FAFAFA"
          class="require-info-control cc-flex--jsa cc-tc-t1 cc-pad-t-12 cc-pad-b-12">
          <div v-if="demandRequestList.length !== 1" style="flex: 1;text-align: center;" class="cc-cur--p"
            @click="handleDemandReqDel(item, index)">-删除稿件需求</div>
          <!-- <div ><div class="require-control-line"></div></div> -->
          <div style="flex: 1;text-align: center;" class="cc-cur--p"
            v-if="index === demandRequestList.length - 1" 
            @click="handleDemandReqAdd(item)">+添加稿件需求</div>
        </div>
      </div>

      <div class="material-info">
        <el-row>
          <el-col :span="24">
            <el-form-item label="资料链接和说明">
              <el-input v-model="form.material" :rows="3" type="textarea" placeholder="请将大资料存在百度云后，链接填于此"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 添加附件或参考图 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="添加附件">
              <div class="upload-container">
                <ul>
                  <li class="upload-item"
                    v-for="(item, index) in form.attachment_file_arr" :key="item.t_nowtime">
                    <uploadAttachments
                      :ref="`uploadAttachment${index}`"
                      :attachmentData="item"
                      :attachmentIndex="index"
                      @deleteAttachment="deleteAttachment(index)"
                      @updateAttachmentInfo="updateAttachmentInfo"
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
              <div class="gray">
                {{ userInfo.nickname }}
                {{ $moment().format("YYYY-MM-DD HH:mm") }}
              </div>
              <el-input type="textarea" v-model="form.answer" autosize placeholder="（设计师填写）对于需求的疑问"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="疑问回复">
              <div class="gray">
                {{ userInfo.nickname }}
                {{ $moment().format("YYYY-MM-DD HH:mm") }}
              </div>
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
            <el-form-item label="需求人">
              <div class="gray">{{ copyPersonName }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="需求名称">
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
          <el-button data-clipboard-action="copy" class="btn btn-theme btn-copy"
          :data-clipboard-text="'需求人 ' + copyPersonName + '\n' + '项目名称 ' + copyName + '\n' + '需求链接 ' + shareLink"
            ref="copy_button">复制</el-button>
        </div>
        <!-- <div
        data-clipboard-action="copy"
        :data-clipboard-text="'需求人 ' + commitNickName + '\n' + '项目名称 ' + commitName + '\n' + '需求链接 ' + commitLink"
        class="btn btn-theme btn-copy"
        ref="copy_button">复制</div> -->
      </div>

      <div class="btn-group">
        <el-form-item>
          <el-button type="primary" :disabled="viewManuscriptDisabled" @click="gotoManuscriptPage">
            交稿页面({{ manuscript_count }})</el-button>
          <el-button type="primary" :disabled="submitDisabled" @click="onSubmit">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-dialog
    title=""
    :visible.sync="commitDialogVisible"
    width="450px">
        <img src="../../assets//images/success.png" width="60" height="60" style="display: block;margin: 0 auto;">
        <div style="margin-top: 5px;color: #333;font-size: 18px;text-align: center;">提交成功</div>
        <div style="color: #333;font-size: 18px;text-align: center;">内容已保存，可选择继续编辑或返回列表</div>
        <div style="margin: 10px 15px 5px;font-size: 13px;color: #333"><em style="font-style: inherit;">需&nbsp;&nbsp;求&nbsp;&nbsp;人：</em>{{commitNickName}}</div>
        <div style="margin: 5px 15px;font-size: 13px;color: #333"><em style="font-style: inherit;">项目名称：</em>{{commitName}}</div>
        <div style="overflow:hidden;margin: 5px 15px;font-size: 13px;color: #333"><em style="float:left;font-style: inherit;">需求链接：</em><span style="float: left;width: 300px;">{{commitLink}}</span></div>
        <div 
        style="margin: 0 auto;width: 75px;height: 29px;line-height: 29px;text-align: center;border: 1px solid #00CBCA;color: #00CBCA;font-size:13px;border-radius: 5px;cursor: pointer;"
        data-clipboard-action="copy"
        :data-clipboard-text="'需求人 ' + commitNickName + '\n' + '项目名称 ' + commitName + '\n' + '需求链接 ' + commitLink"
        class="btn btn-theme btn-copy1"
        ref="copy_button">复制</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="goToEdit">继续编辑</el-button>
            <el-button type="primary" @click="goToList">返回列表</el-button>
        </span>
    </el-dialog>

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
    apiGetDemandUser,
    getUsersByCompany
  } from "@/api/api.demand.js";
  import { getUserCompanyList } from '@/api/api.user'
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
          return callback(new Error("时间不能晚于交稿时间"));
        }
        return callback();
      };
      return {
        api: {
          save: "/api/api/v1/demand/demand/"
        },
        isEdit: false,
        userListDisabled: false,
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
        userList: [],
        sizeList: [],
        sceneList: [],
        typeList: [],
        companyList: [],
        manuscript_count: 0,
        statusOptions: [],
        dialogImageUrl: "",
        dialogVisible: false,
        commitDialogVisible: false,
        disabled: false,
        copyPersonName: '提交后自动生成',
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
          img_size_name: "", // 尺寸
          demand_type_name: "",
          demand_scene_name: "",
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
          demand_company: '',
          attachment_file_arr: [
            // { id: "", attachment: "", attachment_desc: "", t_nowtime: new Date().getTime() }
          ],
          getRsponse: {}
        },

        commitNickName: '',
        commitName: '',
        commitLink: '',

        rules: {
          demand_user: [{ required: true, message: "请选择需求人", trigger: "blur" }],
          reviewer_user: [{ required: true, message: "请选择需求人", trigger: "blur" }],
          demand_company: [{ required: true, message: "请选择项目归属", trigger: "blur" }],
          demand_flow: [{ required: true, message: "请选择流程类型", trigger: "blur" }],
          name: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
          requirements: [{ required: true, message: "请填写整体要求", trigger: "blur" }],
          copy_writing: [{ required: true, message: "请填写项目文案", trigger: "blur" }],
          img_size_name: [{ required: true, message: "请选择或输入尺寸", trigger: ["blur", "change"] }],
          demand_type_name: [{ required: true, message: "请选择项目分类", trigger: 'change' }],
          dg_time: [{ required: true, message: "请选择定稿时间", trigger: "blur" }],
          ct_time: [{ required: false, trigger: "change", validator: checkTime }],
          jtg_time: [{ required: false,trigger: "change", validator: checkTime }]
        },

        demandReqRules: {
          img_size_name: [{ required: true, message: "请选择稿件尺寸", trigger: ["blur", "change"] }],
          demand_scene_name: [{ required: true, message: "请选择发布场景", trigger: "change" }],
          demand_flow: [{ required: true, message: "请选择流程类型", trigger: "blur" }],
          requirements: [{ required: true, message: "请选择整体要求", trigger: "blur" }],
          element_require: [{ required: true, message: "请选择元素要求", trigger: "blur" }],
          color_require: [{ required: true, message: "请选择配色要求", trigger: "blur" }],
          copy_writing: [{ required: true, message: "请选择文案", trigger: "blur" }],
        },
        demandRequestList: [
          {
            "img_size_name": '',
            // "demand_type_name": '',
            "demand_scene_name": '',
            "requirements": '',
            "element_require": '',
            "copy_writing": '',
            "color_require": ''
          }
        ]
      }
    },
    filters: {
      formatFileSize(val) {
        return (val / 1024 / 1024).toFixed(2)
      }
    },
    computed: {},
    watch: {
      attachmentUploadBtnShow: {
        // 深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          this.$forceUpdate()
        },
        deep: true
      },
      'form.demand_company'(newVal) {
        this.getUsersByCompany();
      }
    },

    created() {
      var userInfoObj = this.$store.getters.getUserInfo
      getUserCompanyList({ demand_user: userInfoObj.id }).then(res => {
        if (res.companyList.length <= 0) {
          this.companyList = []
          return
        }
        this.companyList = res.companyList
        if (this.companyList[0]){ 
          this.form.demand_company = this.companyList[0].id;
        }
      })
    },

    mounted() {
      console.log("$parent", this);
      // 获取noble信息
      const _this = this;
      _this.init();
      _this.initClipboard();
      _this.addItem("attachment");
      if (_this.$route.query.id) {
        _this.isEdit = true;
        _this.form.id = _this.$route.query.id;
        _this.getDemandDetail();
      } else {
        this.getStatusData()

        // this.statusOptions = [{
        //   id: 1,
        //   status: "等待执行"
        // }];
      }
    },
    methods: {
      async getStatusData() {
        let statusList = await getStatusList();
        console.log("getStatusList", statusList.data);
        this.statusOptions = statusList.data;
      },
      init() {
        const _this = this
        var userInfoObj = this.$store.getters.getUserInfo
        // this.form.demand_user = userInfoObj.id
        // this.form.reviewer_user = userInfoObj.id
        this.userInfo = userInfoObj
        if (this.inArray(userInfoObj.role_id, [1, 2, 3, 4])) {
          this.statusOptions.forEach(function (item) {
            if (_this.inArray(item["value"], [3, 4, 5])) {
              item["disabled"] = true
            }
          });
        }
        // 初始化下拉框
        this.getDemandType()
        this.getDemandSize()
        this.getDemandScene()
        if (this.isEdit === false) {
          // 设置默认定稿时间
          this.form.dg_time = this.$moment(new Date())
            .add(1, "days")
            .set("hours", 16)
            .set("minutes", "00")
            .set("seconds", "00")
        }
      },
      // 提交稿件列表是否
      handleTestSubmimt() {
        let promises = []
        for (let i = 0; i < this.demandRequestList.length; i++) {
          promises.push(this.$refs['reqform_'+ i][0].validate())
        }
        Promise.all(promises).then(res => {
          console.log(res)
        }).catch(err => {
          console.log('err', err)
        })
        console.log('ss', promises)
      },
      // 需求删除
      handleDemandReqDel(item,index) {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
        //   let index = this.demandRequestList.findIndex(e => item)
          this.demandRequestList.splice(index, 1)
        }).catch(() => {})
      },
      // 需求添加
      handleDemandReqAdd(item) {
        // let id = 0
        // if (this.$route.query.act) {
        //     id = item.id
        // } else {
        //     id = 0
        // }
        let demand = {
          "id": 0,
          "demand_id": item.demand_id,
          "img_size_name": '',
        //   "demand_type_name": '',
          "demand_scene_name": '',
          "demand_scene_id": '',
          "requirements": '',
          "element_require": '',
          "copy_writing": '',
          "color_require": ''
        }
        this.demandRequestList.push(demand)
      },
      uploadDone() {
        this.addItem("attachment");
      },
      deleteAttachment(index) {
        console.log("delete", index);
        this.form.attachment_file_arr.splice(index, 1)
      },
      updateAttachmentInfo(data) {
        // 先不更新
        console.log('data.index', data)
        // this.form.attachment_file_arr[data.index] = data.data;
      },
      handleDemandTypeChange(val) {
        const _this = this;
        const type = _this.typeList.find(item => {
          return item.name === val;
        });

        _this.typeName = type.name;
        if (_this.typeName) {
          _this.copyName = _this.typeName + "-" + _this.form.name;
        } else {
          _this.copyName = _this.form.name;
        }
      },
      handleDemandTypeFocus() {
          let _this = this
          $('.jq-demand-type-select .el-input__inner').blur(function() {
            if ($(this).val() != '') {
                _this.$set(_this.form, 'demand_type_name', $(this).val())
            }
          })
      },

      handleImgSizeFocus(index) {
          let _this = this
          if (index == 0) {
            $('.jq-img-size-select0 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[0].img_size_name = $(this).val()
                }
            })
          } else if (index == 1) {
            $('.jq-img-size-select1 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[1].img_size_name = $(this).val()
                }
            })
          } else if (index == 2) {
            $('.jq-img-size-select2 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[2].img_size_name = $(this).val()
                }
            })
          } else if (index == 3) {
            $('.jq-img-size-select3 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[3].img_size_name = $(this).val()
                }
            })
          } else if (index == 4) {
            $('.jq-img-size-select4 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[4].img_size_name = $(this).val()
                }
            })
          }
      },
      handleDemandSceneFocus(index) {
          let _this = this
          if (index == 0) {
            $('.jq-demand-scene-select0 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[0].demand_scene_name = $(this).val()
                }
            })
          } else if (index == 1) {
            $('.jq-demand-scene-select1 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[1].demand_scene_name = $(this).val()
                }
            })
          } else if (index == 2) {
            $('.jq-demand-scene-select2 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[2].demand_scene_name = $(this).val()
                }
            })
          } else if (index == 3) {
            $('.jq-demand-scene-select3 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[3].demand_scene_name = $(this).val()
                }
            })
          } else if (index == 4) {
            $('.jq-demand-scene-select4 .el-input__inner').blur(function() {
                if ($(this).val() != '') {
                    _this.demandRequestList[4].demand_scene_name = $(this).val()
                }
            })
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
        return isLt25M
      },

      // 处理文件
      // 文件上传过程中的函数
      // 图片缩略图remove事件
      addItem: function (type, fileArr) {
        if (type === "attachment") {
          this.form.attachment_file_arr.push({
            attachment: "",
            attachment_desc: "",
            id: "",
            t_nowtime: new Date().getTime()
          })
          this.attachmentUploadBtnShow.push(true)
        }
        this.$forceUpdate()
      },

      onSubmit() {
        this.submitDisabled = true;
        this.$refs["form"].validate(valid => {
          if (valid) {
            let ajaxUrl = this.api.save
            let method = "POST"
            if (this.$route.query.act) {
              ajaxUrl = this.api.save + this.form.id + "/"
              method = "PUT"
            }
            createOrUpdateDemand(method, this.formatPostData(), this.form.id)
              .then(response => {
              console.log(response)
              this.getRsponse = response
              if (response.data && response.data.error_code != undefined) {
                this.$alert(response.data.error_msg)
                this.submitDisabled = false
                return
              }
              this.submitDisabled = false
              if (this.form.answer) {
                this.submitComment(1, this.form.answer, response.id)
              }
              if (this.form.reply) {
                this.submitComment(2, this.form.reply, response.id)
              }
              this.commitDialogVisible = true
              //处理附件
            //   this.$confirm("保存成功，留在当前页面继续编辑或返回列表?", "提示", {
            //     confirmButtonText: "返回列表",
            //     cancelButtonText: "继续编辑",
            //     type: "success"
            //   }).then(() => {
            //     this.$router.push({ name: "index" })
            //   }).catch(() => {
            //     this.form.id = response.id;
            //     this.$router.push({ name: "config_demand", query: { id: response.id, act: "edit" }
            //     })
            //   })
                if (this.$route.query.act) {
                    apiGetDemandDetail(this.form.id).then(response => {
                        this.commitNickName = response.demand_user.nickname
                        this.commitName = response.name
                        this.commitLink = window.top.document; //设置共享链接
                        let urlHash = window.location.hash;
    
                        urlHash = urlHash.replace("#/config_demand", "#/share/config_demand");
                        this.commitLink =
                            window.location.protocol +
                            "//" +
                            window.location.hostname +
                            ":" +
                            window.location.port +
                            "/" +
                            urlHash 
                    })
                } else {
                    apiGetDemandDetail(response.id).then(response => {
                        this.commitNickName = response.demand_user.nickname
                        this.commitName = response.name
                        this.commitLink = window.top.document; //设置共享链接
                        let urlHash = window.location.hash;
    
                        urlHash = urlHash.replace("#/config_demand", "#/share/config_demand");
                        this.commitLink =
                            window.location.protocol +
                            "//" +
                            window.location.hostname +
                            ":" +
                            window.location.port +
                            "/" +
                            urlHash +
                            '?id=' + response.id
                    })
                }

            }).catch(err => {
              this.submitDisabled = false;
            })
          } else {
            this.submitDisabled = false;
            console.log("error submit!!");
            return false;
          }
        });
      },

      goToEdit() {
        this.commitDialogVisible = false
        this.form.id = this.getRsponse.id;
        this.$router.push({ name: "config_demand", query: { id: this.getRsponse.id, act: "edit" }})
      },
      goToList() {
        this.commitDialogVisible = false
        this.$router.push({ name: "index" })
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
        let filelist = []
        console.log('this.$refs', this.$refs)
        filelist = self.form.attachment_file_arr.map((e, i) => {
           return this.$refs[`uploadAttachment${i}`] && this.$refs[`uploadAttachment${i}`][0].getAttaData()
        }).filter(e => e.attachment )
        var params = {
          name: self.form.name,
          demand_company: self.form.demand_company,
          demand_user: self.form.demand_user, // 需求人
          reviewer_user: self.form.reviewer_user, // 对接人
          demand_flow: self.form.demand_flow,
          dg_time: self.formatDate(self.form.dg_time),
          demand_type_name: self.form.demand_type_name,
          expected_result: self.form.expected_result,
          // img_size_name: self.form.img_size_name, // 尺寸
          // demand_scene_name: self.form.demand_scene_name,
          // requirements: self.form.requirements,
          // copy_writing: self.form.copy_writing,
          // element_require: self.form.element_require,
          // color_require: self.form.color_require,
          notes: self.form.notes,
          material: self.form.material, // 资料地址
          material_desc: self.form.material_desc,
          reference_img: [], // 参考图
          status: self.form.status,
          attachment: filelist,
          // attachment: self.form.attachment_file_arr,
          demand_manuscript: this.demandRequestList
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
          query: { demand_id: this.form.id }
        })
      },

      getUsersByCompany() {
        let self = this;
        this.userListDisabled = true;
        getUsersByCompany({company: this.form.demand_company}).then(response => {
          self.userListDisabled = false;
          if (response && response.userList) {
            self.userList = response.userList;
            if (self.userList.filter(item =>item.id == self.form.demand_user).length == 0) {
              self.form.demand_user = "";
            }
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
            self.sceneList = response.results
          }
        });
      },

      getManuscriptCount() {
        let self = this
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
        const _this = this
        this.getManuscriptCount()
        apiGetDemandDetail(this.form.id).then(response => {
          this.form.demand_user = response.demand_user.id; // 需求人
          // this.form.reviewer_user = response.demand_user.id; //对接人
          this.form.demand_company = response.demand_company.id; //对接人
          this.form.name = response.name;
          this.form.ct_time = response.ct_time;
          _this.typeName = response.name;
          _this.copyPersonName = response.demand_user.nickname

          // img_size_name: self.form.img_size_name, // 尺寸
          // demand_scene_name: self.form.demand_scene_name,
          // requirements: self.form.requirements,
          // copy_writing: self.form.copy_writing,
          // element_require: self.form.element_require,
          // color_require: self.form.color_require,

          this.form.demand_flow = response.demand_flow.id;
          // this.form.img_size_name = response.img_size_name.id; //尺寸
          if (response.demand_scene_name != null) {
            this.form.demand_scene_name = response.demand_scene_name.id;
          }

          if (response.demand_type_name != null) {
            this.form.demand_type_name = response.demand_type_name;
            this.typeName = response.demand_type_name;
          }

          this.form.expected_result = response.expected_result;
          this.shareLink = window.top.document; //设置共享链接
          let urlHash = window.location.hash;

          urlHash = urlHash.replace("#/config_demand", "#/share/config_demand");
          this.shareLink =
            window.location.protocol +
            "//" +
            window.location.hostname +
            ":" +
            window.location.port +
            "/" +
            urlHash 
          if (this.typeName) {
            this.copyName = this.typeName + "-" + this.form.name
          }
          // 拉取附件信息
          this.form.attachment_file_arr = response.attachment
          console.log("response", response)
          console.log("attachment_file_arr", this.form.attachment_file_arr)
          this.demandRequestList = response.demand_manuscript
        })

        _this.viewManuscriptDisabled = false
        // 项目疑问
        _this.getComment({ demand: _this.form.id, action: 1 })
        // 疑问回复
        _this.getComment({ demand: _this.form.id, action: 2 })
      },

      inArray(search, array) {
        for (var i in array) {
          if (array[i] == search) {
            return true
          }
        }
        return false
      },

      initClipboard() {
        const _this = this
        const clipboard = new Clipboard(".btn-copy");
        const clipboard1 = new Clipboard(".btn-copy1");
        clipboard.on("success", e => {
          console.log(e)
          _this.$message({  message: "复制成功", type: "success" })
          e.clearSelection();
          e.trigger.baseURI
        })
        clipboard.on("error", e => {
          _this.$message({ message: "复制失败，请再次尝试", type: "error" })
        })
        clipboard1.on("success", e => {
          console.log(e)
          _this.$message({  message: "复制成功", type: "success" })
          e.clearSelection();
          e.trigger.baseURI
        })
        clipboard1.on("error", e => {
          _this.$message({ message: "复制失败，请再次尝试", type: "error" })
        })
      },
    }
  }

</script>

<style lang="scss">
 @import '@/styles/config-edit.scss';
</style>
