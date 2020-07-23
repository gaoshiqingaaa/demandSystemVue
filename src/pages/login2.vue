<template>
  <div class="">
    <div class="login-container cc-vh-container">
      <div class="login-body">
        <div class="login-bg">
          <img src="@/assets/images/login-bg.svg" alt="">
        </div>
        <el-card
          :body-style="{ width: '500px', padding: '40px' }"
          shadow="always">
          <div class="qrcode-contriner">
            <div class="main-logo">
              <img src="@/assets/images/9thlogo-01.svg" alt="">
              <div class="title">智能化的新媒体设计公司</div>
            </div>
            <el-divider></el-divider>
            <div class="main-qrcodelogin">
              <div class="title">扫码登录</div>
              <img class="qrcode" :src="QRcode" />
              <div class="subtitle">请使用微信扫码二维码登录</div>
            </div>
          </div>
        </el-card>
      </div>
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
        intervalIndex: null
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
                  this.$router.push({
                    path: this.$route.query.redirect || "/" 
                  });
                }
                window.location.reload();
                console.log("扫码完成，反馈结果", res);
              }
            });
          }, 1000);
        });
      }
    }
  };

</script>

<style lang="scss" scoped>
  .login-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #1376A9 0%,#7DCFCD 100%); height: 100%;
    .login-body {
      width: 100%;
      min-width: 1080px;
      display: flex;
      justify-content: space-between;
      padding: 0 10%;

    }
    .login-bg {
      width: 410px;
      text-align: center;
    }
    .qrcode-contriner {
      .main-logo {
        text-align: center;
        img {
          width: 256px;
        }
        .title {
          font-size: 20px;
          letter-spacing: 4px;
          margin-top: 16px;
          color: #1376A9;
        }
      }
      .main-qrcodelogin {
        text-align: center;
        .qrcode {
          width: 210px;
          height: 210px;
          margin-top: 20px;
        }
        .title {
          font-size: 26px;
          margin-top: 16px;
          font-weight: bold;
          color: rgb(4, 107, 158);
        }
        .subtitle {
          margin-top: 20px;
          font-size: 16px;
          color: #1376A9;
        }

      }
    }

  }
  



  // .login-container {
  //   -webkit-border-radius: 5px;
  //   border-radius: 5px;
  //   -moz-border-radius: 5px;
  //   background-clip: padding-box;
  //   margin: 180px auto;
  //   width: 570px;
  //   padding: 35px 35px 15px;
  //   background: #fff;
  //   border: 1px solid #eaeaea;
  //   box-shadow: 0 0 25px;
  //   background-repeat: no-repeat;
  //   background-position-x: 405px;
  //   background-position-y: 220px;
  //   background-size: 80px;

  //   /**&:after {
  //       opacity: 0.5;
  //   }**/

  //   .container-left {
  //     border-right: 1px dashed #1a1f22;

  //     .form-head-box {
  //       margin-bottom: 8px;

  //       img,
  //       span {
  //         display: inline-block;
  //       }

  //       .logo {
  //         width: 40%;
  //         box-sizing: border-box;
  //         vertical-align: middle;
  //       }

  //       span {
  //         box-sizing: border-box;
  //         vertical-align: -webkit-baseline-middle;
  //         font-size: 1.17em;
  //         font-weight: bold;
  //         padding: 0px 0px 8px 5px;
  //         color: #1a1f22;
  //       }
  //     }

  //     .el-form-item {
  //       label.el-checkbox {
  //         &.remember {
  //           margin: 0px 0px 35px 0px;
  //         }

  //         &.is-checked {}
  //       }

  //       .btn-login {
  //         background-color: $theme-color;
  //         width: 160px;
  //         height: 30px;
  //         border: unset;
  //         border-radius: 0px;
  //       }
  //     }
  //   }

  //   .container-right {

  //     /*margin-top: 20%;*/
  //     .img-box img {
  //       width: 230px;
  //     }

  //     .img-box {}

  //     .img-box span {
  //       margin-left: 40%;
  //     }
  //   }

  //   .el-checkbox__input.is-checked+.el-checkbox__label {
  //     color: $theme-color;
  //   }

  //   .el-message-box__btns {
  //     .el-button {
  //       height: 30px;
  //       width: 100px;
  //       border-radius: unset;
  //       background-color: $theme-color;
  //     }
  //   }
  // }

</style>
