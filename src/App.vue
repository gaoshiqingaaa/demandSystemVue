<template>
  <div id="app">
    <app-header v-show="header_show"></app-header>

    <app-subnav v-if="showSideBarBlo"></app-subnav>
    <el-container class="container" :style="containerStyle">
      <el-aside width="auto">
        <app-sidebar v-if="sidevar_show"></app-sidebar>
      </el-aside>
      <el-container class="content-wrapper">
        <el-main :style="{maxWidth: mainWidthStyle}">
          <router-view :key="key"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppHeader from '@/components/header.vue'
import SubNav from '@/components/subnav.vue'
import SideBar from '@/components/sidebar.vue'

export default {
  data () {
    return {
      containerStyle:'',
      header_show: true,
      footer_show: false,
      sidevar_show: true,
      mainWidthStyle: 1025,
      showSideBarBlo: true
    }
  },
  name: 'App',
  components: {
    'app-header': AppHeader,
    'app-subnav': SubNav,
    'app-sidebar': SideBar
  },
  methods: {
    // 是否显示头部
    header: function (bool) {
      this.header_show = bool
    }
  },
  watch: {
    $route () {
      console.log('触发路由改变',this.$route);
      this.containerStyle = this.$route.meta.containerStyle
      this.sidevar_show = this.$route.meta.showSideBar
      console.log(this.sidevar_show);

      if (this.$route.name == 'manuscript') {
        this.mainWidthStyle = '100%'
      }
      console.log(this.$route.query)
      console.log(this.$route.name, 'this.$route.name')
      if (this.$route.name == 'config_demand') {
        this.showSideBarBlo = false
      } else {
        this.showSideBarBlo = true
      }
    }
  },
  created () {
    this.containerStyle = this.$route.meta.containerStyle
    console.log('主页面初始化',this.$route.name)
    const self = this
    // 需要初始化，因为watch拿不到初始值，只有在变的时候才能响应
    // self.header_show = self.$route.name !== 'login'
    // self.sidevar_show = self.$route.name !== 'manuscript'
    if (self.$route.name === 'login') {
      self.sidevar_show = false
      self.manuscript_sidebar_show = false
    }

    self.mainWidthStyle = '1025px'

    if (self.$route.name == 'manuscript') {
      self.mainWidthStyle = '100%'
    }

    self.header_show = self.$route.name !== 'login'
    if(self.$route.name == 'manuscript' || self.$route.name == 'manuscript_share'){
      this.sidevar_show = false;
      self.mainWidthStyle = '100%'
    }
    if (this.$route.path == '/config_demand') {
        this.showSideBarBlo = false
    } else {
        this.showSideBarBlo = true
    }
    console.log(this.$route.path, 'this.$route.path')

  },
  computed:{
    key(){
      console.log('app key')
      return this.$route.path + Math.random();
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/ele-color.scss';
@import '@/styles/index.scss';
</style>

<style>
@import "./assets/css/common.css";
@import "./styles/cc-css-tools.css";
</style>
<style>
@import "./assets/scss/_global.scss";
</style>

<style>
  .container {
    position: relative;
    margin: 0 auto;
    max-width: 1200px;
    padding-right: 0px;
    padding-left: 0px;
  }
  .container .content-wrapper.-webkit-scrollbar {
    display: none;
  }
  .container .el-main {
    max-width: 1025px;
    margin: unset;
    padding: unset;
  }
</style>
