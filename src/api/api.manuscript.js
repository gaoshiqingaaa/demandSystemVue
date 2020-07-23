/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-05-19 12:40:40
 * @FilePath: \alien-docsg:\CaryFile\project\project\ninth-system\src\api\api.manuscript.js
 */ 
import request from '../plugin/axios'

export function apiUploadManuscript(data){
  return request({
    url:'/common/upload_file',
    method: 'POST',
    headers:{
      "Content-Type": "multipart/form-data"
    },
    timeout:36000000000,
    data,
    onUploadProgress : progressEvent => {
      console.log(progressEvent)
      console.log(Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%');
      window.localStorage.setItem('commonFileProgress', Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%');
    }
  })
}

export function submitManuscript(data){
  return request({
    url:'/manuscript/submitManuscript',
    method: 'POST',
    data
  })
}

export function apiGetManuscriptList(demandID){
  return request({
    url:'/manuscript/getManuscriptList?demand_id=' + demandID,
    method: 'GET',
  })
}

export function apiGetOpinionsList(detailsID){
  return request({
    url:'/manuscript/getOpinionsList?details_id=' + detailsID,
    method: 'GET'
  })
}

export function apigetDemandInfo(id){
  return request({
    url:'/manuscript/getDemandInfo?id=' + id,
    method: 'GET'
  })
}

export function apiGetTimeLine(id){
  return request({
    url:'/manuscript/getTimeLine?demand_id=' + id,
    method: 'GET'
  })
}

export function getImageModeGetList(data){
  return request({
    url:'/demand/getImageModeList',
    method: 'POST',
    data
  })
}

export function getFilter(){
  return request({
    url:'/demand/getImageModeFilter',
    method: 'GET'
  })
}

export function getManuscriptsList(data){
  return request({
    url:'/manuscript/getManuscriptList',
    method: 'POST',
    data
  })
}

export function getOpinionList(data){
  return request({
    url:'/manuscript/getOpinionList',
    method: 'POST',
    data
  })
}

export function delManuscript(data){
  return request({
    url:'/manuscript/delManuscript',
    method: 'POST',
    data
  })
}

export function createOpinion(data){
  return request({
    url:'/manuscript/createOpinion',
    method: 'POST',
    data
  })
}

/**
 * 更新 属性
 * @param {*} data 
 */
export function updateOpinion(data){
  return request({
    url:'/manuscript/updateOpinion',
    method: 'POST',
    data
  })
}

/**
 * 更新 属性
 * @param {*} data 
 */
export function deleteOpinion(data){
  return request({
    url:'/manuscript/deleteOpinion',
    method: 'POST',
    data
  })
}

/**
 * 稿件删
 * @param {*} data 
 */
export function delManuscriptALL(data){
  return request({
    url:'/manuscript/delManuscriptALL',
    method: 'POST',
    data
  })
}

/**
 * 获取时间线
 * @param {*} data 
 */
export function getTimeLine(data){
  return request({
    url:'/demand/getTimeLine',
    method: 'POST',
    data
  })
}

/**
 * 获取时间线状态
 * @param {*} data 
 */
export function getTimeLineStatus(data){
  return request({
    url:'/demand/getTimeLineStatus',
    method: 'POST',
    data
  })
}

/**
 * 获取总结列表
 * @param {*} data 
 */
export function getSummary(data){
  return request({
    url:'/manuscript/getSummary',
    method: 'POST',
    data
  })
}

/**
 * 稿件评分
 * @param {*} data 
 */
export function setDemandScore(data){
  return request({
    url:'/demand/setDemandScore',
    method: 'POST',
    data
  })
}

/**
 * 稿件创建总结
 * @param {*} data 
 */
export function createSummary(data){
  return request({
    url:'/manuscript/createSummary',
    method: 'POST',
    data
  })
}

/**
 * 稿件删除总结
 * @param {*} data 
 */
export function delSummary(data){
  return request({
    url:'/manuscript/delSummary',
    method: 'POST',
    data
  })
}

export function apiGetDemandDetail(id){
    return request({
      url: '/api/v1/demand/demand/' + id + '/',
      method: 'GET'
    })
  }