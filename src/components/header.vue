<template>
  <header class="header">
    <nav class="navbar navbar-static-top d-flex">
      <div class="logo" id="index_logo">
        <a href="#" v-on:click="backHome()" class>
          <img :src="logo" class="logo-img" />
          <div class="logo-line"></div>
          <span class="logo-title">需求系统</span>
        </a>
      </div>

      <div class="d-flex order-lg-2 ml-auto">
        <div class="user-box">
          <div class="logout-box">
            <div class="avator">
              <img :src="userInfo.head_img" class="user-avator" alt="user avator" />
            </div>

            <div class="role-box">
              <span class="nickname">{{ userInfo.nickname }}|{{ userInfo.realname}}</span>
              <div v-if="userInfo.role_name">
                <span class="role">{{ userInfo.role_name }}</span>
              </div>
              <div v-else>
                <span>未设置</span>
              </div>
            </div>

            <div class="logout-btn">
              <span @click="logoutEvent">退出</span>
            </div>
          </div>
          <div class="login-box hidden clear-b">
            <div class="login-wrapper">
              <span>登录</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import logo from "@/assets/images/logo_min.png";
export default {
  data: function() {
    return {
      logo: logo,
      nickname: "",
      role: "",
      headImg: null,
      userInfo: {
        head_img: ""
      }
    };
  },

  methods: {
    backHome() {
      this.$router.push({ name: "index" });
    },
    init() {
      const _this = this;
      let userInfoObj = this.$store.getters.getUserInfo;
      this.userInfo = userInfoObj;
      // _this.nickname = userInfoObj.nickname
      // _this.role = userInfoObj.role_name
      // _this.headImg = userInfoObj.head_img
    },

    logoutEvent() {
      var _this = this;
      _this
        .$confirm("您确定要退出吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(() => {
          this.clearLoginInfo();
        })
        .catch(() => {});
    },

    clearLoginInfo() {
      this.$store.commit("setUserToken", null);
      this.$store.commit("setUserInfo", null);
      this.$store.commit("setIsLogin", false);
    }
  },

  mounted() {
    var _this = this;
    _this.init();
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  border-bottom: 1px solid #e5e5e5;
  background-color: #fff;
  margin-bottom: 10px;
  .navbar {
    max-width: 1200px;
    margin: auto;
    position: relative;
    .user-box {
      margin-left: auto !important;
      .logout-box {
        height: 60px;
        line-height: 60px;

        .avator {
          float: left;
          img {
            width: 27px;
            height: 27px;
            border-radius: 50%;
            margin-right: 7px;
            margin-top: 2px;
          }
        }

        .role-box {
          float: left;
          div {
            display: inline;
          }

          .role {
            margin-right: 12px;
            border-radius: 1rem;
            background-color: #c5c5c5;
            font-size: 12px;
            margin-top: 21px;
            padding: 2px 7px;
            color: #fff;
          }
        }

        .logout-btn {
          float: left;

          span {
            padding-left: 16px;
            border-left: 1px solid #333;
            cursor: pointer;
          }

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .logo {
      max-width: 325px;
      height: 60px;
      line-height: 60px;
      .logo-img {
        height: 46px;
      }
      .logo-line {
        display: inline-block;
        position: absolute;
        width: 1px;
        height: 24px;
        background-color: black;
        top: 22px;
        left: 175px;
      }
      .logo-title {
        color: #575757;
        font-size: 23px;
        line-height: 69px;
        vertical-align: top;
        padding-left: 4px;
      }
    }
  }
}
.header .navbar .logout-wrapper,
.main-header .navbar .login-wrapper {
  height: 60px;
  line-height: 60px;
}
</style>
