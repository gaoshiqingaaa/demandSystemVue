<template>
  <div class="login-page-container">
    <div class="login-container">
      <el-row :gutter="50">
        <el-col :span="12" class="container-left">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-position="left"
            label-width="0px"
            class="demo-ruleForm"
          >
            <div class="form-head-box">
              <span>长期需求系统</span>
            </div>
            <el-form-item prop="account">
              <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input
                type="password"
                v-model="ruleForm.checkPass"
                auto-complete="off"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
            <el-form-item>
              <el-button type="primary" class="btn-login" @click="login" :loading="loginLoading">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="8" class="container-right">
          <div class="img-box">
            <img :src="QRcode" />
            <span>微信扫码登录</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  userLogin,
  getWeixinQRcode,
  checkLoginStatus
} from "@/api/api.user.js";

export default {
  props: {},
  data() {
    return {
      event_key: null,
      QRcode: null,
      header_show: false,
      loginLoading: false,
      intervalIndex: null,
      ruleForm: {
        account: "test",
        checkPass: "654321qq"
      },
      rules: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
          // { validator: validaePass }
        ],
        checkPass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
          // { validator: validaePass2 }
        ]
      },
      checked: true
    };
  },

  mounted() {
    this.getWeixinQRcode();
  },
  methods: {
    async getWeixinQRcode() {
      let self = this;
      getWeixinQRcode().then(response => {
        this.event_key = response.event_key;
        this.QRcode = response.qrcode;
        let intervalIndex = setInterval(() => {
          checkLoginStatus(this.event_key).then(res => {
            if (res.status == "已登陆") {
              clearInterval(intervalIndex);
              if (res.user_info.role_id === null) {
                self.$alert("登录失败，账户未激活。");
                return;
              } else {
                self.$store.commit("setUserToken", res.user_info.token);
                self.$store.commit("setUserInfo", res.user_info);
                self.$store.commit("setIsLogin", true);
                this.$router.push({ path: this.$route.query.redirect || "/" });
              }
              console.log("扫码完成，反馈结果", res);
            }
          });
        }, 3000);
      });
    },

    login() {
      let self = this;
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          self.logining = true;
          let result = await userLogin({
            username: this.ruleForm.account,
            password: this.ruleForm.checkPass
          });
          self.logining = false;

          if (result.error_code !== undefined) {
            self.$alert(result.error_msg, "登录失败" + result.error_code, {
              confirmButtonText: "确定"
            });
            return false;
          }

          this.$store.commit("setUserToken", result.data.token);
          this.$store.commit("setUserInfo", result.data);
          this.$store.commit("setIsLogin", true);

          var highestTimeoutId = setTimeout(";");
          for (var i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
          }

          this.$router.push({ path: this.$route.query.redirect || "/" });
        } else {
          return false;
        }
      });
    },
    onSubmit(ev) {
      let params = {
        username: this.ruleForm.account,
        password: this.ruleForm.checkPass
      };
      var self = this;
      self.$refs.ruleForm.validate(valid => {
        if (valid) {
          self.logining = true;

          this.axios({
            url: "/api/user/acount_login",
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: params,
            transformRequest: [
              data => {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                return ret;
              }
            ]
          })
            .then(function(response) {
              self.loginLoading = false;
              sessionStorage.setItem(
                "user",
                JSON.stringify(response.data.data)
              );
              sessionStorage.setItem("token", response.data.data.token);
              self.$router.push({ path: "/" });
            })
            .catch(function(err) {
              self.loginLoading = false;
              console.log(err, "错误");
              self.$alert("用户名或密码错误！", "提示信息", {
                confirmButtonText: "确定"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  beforeCreate() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#1A1F48");
  },
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 570px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px;
  background-repeat: no-repeat;
  background-position-x: 405px;
  background-position-y: 220px;
  background-size: 80px;

  /**&:after {
        opacity: 0.5;
    }**/

  .container-left {
    border-right: 1px dashed #1a1f22;
    .form-head-box {
      margin-bottom: 8px;
      img,
      span {
        display: inline-block;
      }

      .logo {
        width: 40%;
        box-sizing: border-box;
        vertical-align: middle;
      }

      span {
        box-sizing: border-box;
        vertical-align: -webkit-baseline-middle;
        font-size: 1.17em;
        font-weight: bold;
        padding: 0px 0px 8px 5px;
        color: #1a1f22;
      }
    }

    .el-form-item {
      label.el-checkbox {
        &.remember {
          margin: 0px 0px 35px 0px;
        }
        &.is-checked {
        }
      }

      .btn-login {
        background-color: $theme-color;
        width: 160px;
        height: 30px;
        border: unset;
        border-radius: 0px;
      }
    }
  }

  .container-right {
    /*margin-top: 20%;*/
    .img-box img {
      width: 230px;
    }
    .img-box {
    }
    .img-box span {
      margin-left: 40%;
    }
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $theme-color;
  }
  .el-message-box__btns {
    .el-button {
      height: 30px;
      width: 100px;
      border-radius: unset;
      background-color: $theme-color;
    }
  }
}
</style>
