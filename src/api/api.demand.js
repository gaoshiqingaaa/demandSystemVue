import request from '../plugin/axios'

export function getDemandCount () {
  return request({
    url: '/demand/get_count_list',
    method: 'GET'
  })
}

export function getExecutorList(){
  return request({
    url:'/api/v1/user/user/?limit=99999999',
    method: 'get'
  })
}

export function getDemandList(params){
  return request({
    url:'/api/v1/demand/demand/',
    params,
    method: 'get'
  })
}

export function getStatusList(){
  return request({
    url:'/demand/getStatusList',
    method: 'get'
  })
}

export function createOrUpdateDemand(method,data,id = 0){
  let url = '/api/v1/demand/demand/'
  if(method == 'PUT'){
    url = '/api/v1/demand/demand/'+ id +'/'
  }
  return request({
    url,
    method,
    data,
    headers:{
      'Content-type': 'application/json'
    }
  })
}

export function apiGetDemandDetail(id){
  return request({
    url: '/api/v1/demand/demand/' + id + '/',
    method: 'GET'
  })
}

export function apiGetDemandType(){
  return request({
    url:'/api/v1/demand/demand_type/',
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    },
    dataType: 'json'
  })
}
export function apiGetManuscriptCount(id){
  return request({
    url:'/manuscript/getManscriptCount?demand_id=' + id,
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    dataType: 'json'
  })
}

export function apiSubmitComment(data){
  return request({
    url:'/api/v1/demand/demand_comment/',
    method: 'POST',
    data,
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function apiGetComment(params){
  return request({
    url:'/api/v1/demand/demand_comment/',
    method: 'GET',
    params
  })
}

export function apiGetDemandScene(){
  return request({
    url:'/api/v1/demand/demand_scene/',
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    },
    dataType: 'json'
  })
}

export function apiGetDemandSize(){
  return request({
    url:'/api/v1/demand/image_info/',
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    },
    dataType: 'json'
  })
}

export function apiGetDemandUser(){
  return request({
    url:'/api/v1/user/user/?limit=99999999',
    method: 'GET',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json'
  })
}

export function setSchedulingTime(data){
  return request({
    url:'/demand/setSchedulingTime',
    method: 'POST',
    data
  })
}

/**
 * 获取备注信息
 * @param {} data 
 */
export function getRemarkList(data){
  return request({
    url:'/demand/getRemarkList',
    method: 'POST',
    data
  })
}

/**
 * 创建备注信息
 * @param {} data 
 */
export function createRemark(data){
  return request({
    url:'/demand/createRemark',
    method: 'POST',
    data
  })
}

export function assignExecutor(demandId,data){
  return request({
    url:'/api/v1/demand/assign_executor/' + demandId + '/',
    method: 'PUT',
    data,
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function getUsersByCompany(data){
  return request({
    url:'/user/getUsersByCompany',
    method: 'POST',
    data
  })
}
// 获取分类统计数据
export function getCountList(params){
  return request({
    url:'/demand/get_count_list',
    method: 'get',
    params
  })
}