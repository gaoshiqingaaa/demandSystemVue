<template>
  <div class="sub-nav" v-show="subNavShow">
    <el-button class="go-index-btn theme-btn" @click="gotoIndexPage" v-show="gotoIndexBtnShow">
      &lt;&lt;返回首页</el-button>
    <el-button
      v-show="demandBtnShow"
      class="add-demand-btn theme-btn"
      @click="gotoConfigDemandPage">+新需求
    </el-button>
    <el-button
      v-show="isLookSelf"
      class="add-demand-btn theme-btn"
      @click="handleIsCheckSelf">
      {{ getIsListSelf ? '查看全部' : '查看自己' }}
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
  .sub-nav {
    background: #fff;
    height: 50px;
    margin: 0 auto;
    // border-bottom: 1px solid $border-color;
    max-width: 1200px;
    .go-index-btn {
      float: left;
      margin: 7px;
      border-radius: 0px;
      height: 30px;
      width: 105px;
      background-color: $theme-color;
      color: #fff;
      border: unset;
      padding: unset;
    }

    .add-demand-btn {
      float: right;
      margin: 7px;
      border-radius: 0px;
      height: 30px;
      width: 105px;
      background-color: $theme-color;
      color: #fff;
      border: unset;
      padding: unset;
    }
  }

</style>
<script>
  import {
    checkCreateDemandPermissions
  } from "@/api/api.user.js"
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        gotoIndexBtnShow: false,
        demandBtnShow: true,
        subNavShow: false,
        isLookSelf: false
      }
    },
    methods: {
      /**
       * 检查是否有创建需求权限
       * @returns {Promise<boolean>}
       */
      async checkCreateDemandPermissions() {
        let result = await checkCreateDemandPermissions()
        if (result.data) {
          this.$router.push('config_demand')
          return
        }
        this.$alert('您没有创建需求权限')
        return false
      },
      gotoConfigDemandPage() {
        let result = this.checkCreateDemandPermissions();
      },
      gotoIndexPage: function () {
        const _this = this
        _this.$router.push({
          path: '/'
        })
      },
      handleIsCheckSelf() {
        this.$store.commit('setIsListSelf')
      }
    },

    computed: {
      ...mapGetters([
        'getIsListSelf'
      ])
    },

    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          // 不等于登录页面的时候为true
          // TODO 优化\
          let targetPageName = to.name
          console.log('route', targetPageName)
          console.log('route', this.$route.name)
          if (targetPageName === 'config_demand' || this.$route.name == 'index') {
            this.subNavShow = true
          } else {
            this.subNavShow = false
          }

          // if (targetPageName === 'config_demand') {
          //   _this.demandBtnShow = false
          // } else {
          //   _this.demandBtnShow = true
          // }

          if (targetPageName === 'index') {
            this.gotoIndexBtnShow = false
            this.isLookSelf = true
          } else {
            this.isLookSelf = false
            this.gotoIndexBtnShow = true
          }
        }
        
      }
    },

    beforeCreate() {},

    beforeRouteUpdate(to, from, next) {},

    mounted() {}
  }

</script>
