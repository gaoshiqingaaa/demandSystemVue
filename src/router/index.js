import Vue from 'vue'
import VueRouter from 'vue-router'
import DemandList from '@/pages/demand/list'  // 弃用
import DemandImageMode from '@/pages/demand_imageMode/imageList'
import ConfigDemand from '@/pages/demand/config'
import ConfigDemandShare from '@/pages/demand/config_share'

import SginEdit from '@/pages/manuscript/sgin-edit'
import Login from '@/pages/login'
import Login2 from '@/pages/login2'
import Login1 from '@/pages/login1'
import Store from '@/vuex/store.js'
import { publicLogin } from '@/api/api.user'
Vue.use(VueRouter)

let routes = [
  //   // 正式环境切换成这个登陆
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: Login2,
  //   meta:{
  //     showSideBar:false,
  //     title: '登陆'
  //   }
  // },
//  测试环境切换成这个登陆
  {
    path: '/login',
    name: 'login',
    component: Login1,
    meta:{
      showSideBar:false,
      title: '测试环境登陆'
    }
  },
  {
    path: '/',
    component: DemandList, // List2
    name: 'index',
    meta:{
      showSideBar:true,
      title: '需求系统'
    }
  },
  {
    path:'/DemandImageMode',
    component:DemandImageMode,
    name:'DemandImageMode',
    meta:{
      showSideBar:true
    }
  },
  {
    path: '/config_demand',
    component: ConfigDemand,
    name: 'config_demand',
    meta:{
      showSideBar:true,
      title: '填写需求'
    }
  },
  {
    path: '/share/config_demand',
    component: ConfigDemandShare,
    name:'config_demand_share',
    meta:{
      showSideBar:true
    }
  },
  {
    path: '/manuscript',
    component: SginEdit,
    name: 'manuscript',
    meta:{
      showSideBar:false,
      containerStyle:'max-width:1600px!important;',
      title: '交稿页面'
    }
  },
  {
    path: '/share/manuscript',
    component: SginEdit,
    name:'manuscript_share',
    meta:{
      showSideBar:false,
      containerStyle:'max-width:1600px!important;'
    }
  },
]

var router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {
  let isLogin = Store.getters.setIsLogin


  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  if(to.path.indexOf('/share/') > -1){
    console.log('匿名模式')
    publicLogin().then((response) => {
      if (!Store.getters.getUserToken) {
        Store.commit('setUserToken',response.data.token)
        Store.commit('setUserInfo',response.data.userInfo)
        Store.commit('setIsLogin',true)
      }
      next()
    })
  }

  if (isLogin) {
    next()
  } else {
    if (to.path !== '/login') {
      if(to.path.indexOf('/share/') > -1){
        console.log('匿名模式')
        publicLogin().then((response) => {
          if (!Store.getters.getUserToken) {
            Store.commit('setUserToken',response.data.token)
            Store.commit('setUserInfo',response.data.userInfo)
            Store.commit('setIsLogin',true)
          }
          next()
        })
      }else{
        next({ name: 'login', query: {redirect: to.fullPath != '/' &&  to.fullPath} })
      }
    } else {
      next();
    }
  }
})

export default router

// 放在后面
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
