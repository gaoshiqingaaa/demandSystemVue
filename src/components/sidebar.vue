<template>
  <div :style="{height: navheight + 'px'}" class="main-navbg">
    <el-menu
      :default-openeds="['1']"
      default-active="1-1"
      background-color="#4F6173"
      text-color="#999"
      class="main-side"
      active-text-color="#00CBCA">
      <el-submenu index="1">
        <template slot="title">
          <i class="icon iconfont iconloading-v cc-tc-w"></i>
          <!-- <div class="cc-flex--jsa"> -->
          <span class="sidebar-title">待完成</span>
          <span class="sidebar-count">{{ pendingCount }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1" @click.native="getDemandList(pendingStatus)">
            全部客户
            <span class="cc-f--right sidebar-count-ch">{{ pendingCount }}</span>
          </el-menu-item>
          <el-menu-item v-for="(item, index) in pendingList" :index="'1-' + index+2" :key="index"
            @click.native="getDemandList(pendingStatus, item.id)" class="item">
            {{ item.name }}
            <div class="cc-f--right sidebar-count-ch">{{ item.count }}</div>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="icon iconfont iconwancheng cc-tc-w"></i>
          <span class="sidebar-title">已完成</span>
          <span class="sidebar-count sidebar-ot">{{ finishedCount }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1"  @click.native="getDemandList(finishedStatus)">
            全部客户
            <span class="cc-f--right sidebar-count-ch">{{ finishedCount }}</span>
          </el-menu-item>
          <el-menu-item v-for="(item, index) in finishedList" @click.native="getDemandList(finishedStatus, item.id)"
            :index="'3-' + index+2"
            :key="index" class="item">
            {{ item.name }}
            <div class="cc-f--right sidebar-count-ch">{{ item.count }}</div>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="icon iconfont iconquxiao cc-tc-w"></i>
          <span class="sidebar-title">已搁置</span>
          <span class="sidebar-count sidebar-ot">{{ shelveCount }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            index="2-1"
            @click.native="getDemandList(shelveStatus)">
            全部客户
            <span class="cc-f--right sidebar-count-ch">{{ shelveCount }}</span>
          </el-menu-item>
          <el-menu-item v-for="(item, index) in shelveList" @click.native="getDemandList(shelveStatus, item.id)"
            :key="index"
            :index="'2-' + index+2"
            class="item">
            {{ item.name }}
            <div class="cc-f--right sidebar-count-ch">{{ item.count }}</div>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      
      <el-submenu index="4">
        <template slot="title">
          <i class="icon iconfont icontupian cc-tc-w"></i>
          <span class="sidebar-title">图片模式</span>
          <span class="sidebar-count sidebar-ot">{{ pendingCount }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-1" @click.native="getDemandImageMode(0)">
            全部客户
            <span class="cc-f--right sidebar-count-ch">{{ pendingCount }}</span>
          </el-menu-item>
          <el-menu-item v-for="(item, index) in pendingList" :key="index" @click.native="getDemandImageMode(item.id)"
            :index="'4-' + index+2"
            class="item">
            {{ item.name }}
            <div class="cc-f--right sidebar-count-ch">{{ item.count }}</div>  
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item style="padding-left: 5px" index="5-1" @click.native="gotoHelp">
        <template slot="title">
          <i style="margin-right: -4px" class="el-icon-question cc-tc-w"></i>
          <span class="cc-tc-w">使用说明</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {
    getDemandCount
  } from "../../src/api/api.demand.js";
  export default {
    data() {
      return {
        pendingStatus: null,
        pendingCount: 0,
        pendingList: {},
        shelveStatus: null,
        shelveCount: 0,
        shelveList: {},
        finishedStatus: null,
        finishedCount: 0,
        finishedList: {},
        userInfo: null,
        navheight: 1000
      };
    },
    watch: {
      $route() {
        setTimeout(() => {
          this.initHeight()
        }, 300)
      }
    },
    created() {
    },
    mounted() {
      this.userInfo = this.$store.getters.getUserInfo;
      this.init();
      setTimeout(() => {
          this.initHeight()
      }, 300)
    },
    methods: {
      initHeight() {
        // let height = document.documentElement.clientHeight - 120
        let height = 1000
        if (this.$route.path == '/config_demand') {
            height = $('.el-container').height()
        } else {
            height = 1000
        }
        this.navheight = height
      },
      init: function () {
        this.getSideCount();
      },

      gotoHelp() {
        window.open('https://docs.qq.com/sheet/DTFVycmN5UnFNTWZM', '_blank');
      },

      getDemandList(status_str, company_id) {
        this.$router.push({
          name: "index",
          query: {
            status: status_str,
            demand_company: company_id
          }
        });
      },

      getDemandImageMode(company_id) {
        console.log(company_id);
        this.$router.push({
          name: "DemandImageMode",
          query: {
            demand_company: company_id
          }
        });
      },

      /**
       * 获取侧边栏数据
       */
      async getSideCount() {
        let result = await getDemandCount();
        result = result.data;
        this.pendingCount = result.to_be_completed_count.total;
        this.pendingList = result.to_be_completed_count.company_list;
        this.pendingStatus = result.to_be_completed_count.status_code;

        this.finishedCount = result.completed_count.total;
        this.finishedList = result.completed_count.company_list;
        this.finishedStatus = result.completed_count.status_code;

        this.shelveCount = result.shelved_count.total;
        this.shelveList = result.shelved_count.company_list;
        this.shelveStatus = result.shelved_count.status_code;
      }
    },

    computed: {},
  };

</script>
<style lang="scss">
.main-side {
  width: 175px;
  height: 100%;
  .el-menu-item-group__title {
    display: none;
  }
  .el-menu-item-group {
    ul {
      background-color: #374554;
      .el-menu-item {
        padding-left: 20px !important;
        background-color: unset !important;
        cursor: pointer;
      }
    }
  }
  .el-submenu__title {
    height: 38px;
    line-height: 38px;
    font-size: 12px;
    padding-left: 10px !important;
  }
  .el-menu-item {
    height: 38px;
    line-height: 38px;
    font-size: 12px;
  }
}
.el-aside {
  font-size: 12px !important;
  overflow: hidden;
  height: 100%;
}
.main-navbg {
  background-color: #4F6173;
}

.sidebar-title {
  color: #eee;
}
.sidebar-count {
  color: #fff;
  background-color: #FA6400;
  padding: 0 4px;
  font-size: 12px;
  border-radius: 100px;
}
.sidebar-count-ch {
  @extend .sidebar-count;
  background-color: #666;
  line-height: 16px;
  margin-top: 10px;
}

.sidebar-ot {
  background-color: #666;
}

</style>
