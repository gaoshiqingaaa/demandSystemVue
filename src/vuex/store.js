/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-05-19 12:40:40
 * @FilePath: \alien-docsg:\CaryFile\project\project\ninth-system\src\vuex\store.js
 */ 
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
Vue.use(Vuex)
import createPersistedState from "vuex-persistedstate"
import {
  getManuscriptsList,
  getOpinionList,
  getTimeLine
} from '@/api/api.manuscript.js'

export default new Vuex.Store({
  state: {
    // state 类似 data
    // 这里面写入数据
    isLogin: false,
    userInfo:null,
    userToken:null,
    statusList:null,
    manuscriptList: [],
    manuOptionList: [],
    manuTimeLineList: [],
    isListSelf: 0
  },
  getters: {
    setIsLogin: state => {
      return state.isLogin
    },
    getUserInfo: state =>{
      return state.userInfo
    },
    getUserToken: state => {
      return state.userToken
    },
    getStatusList: state => {
      return state.statusList
    },
    getManusList: state => state.manuscriptList,
    getOptionsList: state => state.manuOptionList,
    getTimeLineList: state => state.manuTimeLineList,
    getIsListSelf: state => state.isListSelf
  },
  mutations: {

    /**
     * 设置状态列表
     * @param state
     * @param statusList
     */
    setStatusList(state,statusList){
      state.statusList = statusList
    },
    /**
     * 设置用户登录状态
     * @param state
     * @param loginStatus
     */
    setIsLogin (state,loginStatus) {
      state.isLogin = loginStatus
      if (loginStatus === false) {
        router.replace({name: 'login', query: {redirect: window.location.hash.replace('#', '')}})
      }
    },

    /**
     * 设置用户信息
     * @param state
     * @param userInfo
     */
    setUserInfo(state,userInfo) {
      state.userInfo = userInfo
    },

    /**
     * 设置用户Token
     * @param state
     * @param userToken
     */
    setUserToken (state,userToken) {
      state.userToken = userToken
    },
    MANUSCRIPTLIST (state, list) {
      list.reverse()
      list.map(e => {
        e['t_currClickVersion'] = e.versionList && e.versionList[0]
        e['t_sourceFile'] = e.versionList && e.versionList[0] && e.versionList[0].url
        e['t_sourceFileid'] = e.versionList && e.versionList[0] && e.versionList[0].versionId
      })
      state.manuscriptList = list
    },
    MANUSCOPTIONLIST (state, list) {
      state.manuOptionList = list
    },
    MANU_GETTIMELINE (state, list) {
      state.manuTimeLineList = list
    },
    setManuItem(state, item) {
      if (!item) return
      state.manuscriptList.push(item)
    },
    setManuVersionItem(state, item) {
      if (!item) return
      state.manuscriptList.unshift(item)
    },
    setManuItemDel(state, item) {
      if (!item) return
      let index = state.manuscriptList.findIndex(e => e === item)
      state.manuscriptList.splice(index, 1)
    },
    addRightOption(state, item) {
      if (!item) return
      state.manuOptionList.unshift(item)
      
    },
    delRightOption(state, item) {
      if (!item) return
      let index = state.manuOptionList.findIndex(e => e === item)
      state.manuOptionList.splice(index, 1)
    },
    setIsListSelf(state, ov) {
      state.isListSelf = !state.isListSelf
    }
  },
  actions: {
    // actions 类似methods
    // 写方法对数据做出更改(异步操作)
    getOptionList({ state, commit }, id) {
      return new Promise((resolve, reject) => {
        getOpinionList({ manuscriptId: id }).then(res => {
          commit('MANUSCOPTIONLIST', res)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getManuEditList({ state, commit }, id) {
      return new Promise((resolve, reject) => {
        getManuscriptsList({ demandId: id }).then(res => {
          commit('MANUSCRIPTLIST', res.manuscriptList)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
        getTimeLine({ demandId: id }).then(res => {
          commit('MANU_GETTIMELINE', res.timeLine)
        })
      })
    }
  },
  plugins: [createPersistedState()]
})





