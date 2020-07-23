/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-06-04 12:51:07
 * @FilePath: \alien-docsg:\CaryFile\project\project\ninth-system\src\api\api.user.js
 */ 
import request from '../plugin/axios'

export function userLogin(data){
  return request({
    url:'/user/acount_login',
    method: 'POST',
    data
  })
}


export function getWeixinQRcode(){
  return request({
    url:'/user/login',
    method: 'get'
  })
}

export function checkLoginStatus(event_key){
  return request({
    url:'/user/check_login_status?event_key=' + event_key,
    method: 'get'
  })
}

/**
 * 检查是否有创建需求权限
 */
export function checkCreateDemandPermissions(){
  return request({
    url:'/user/checkCreateDemandPermissions',
    method: 'get'
  })
}

export function publicLogin(){
  return request({
    url:'/user/loginPublic',
    method:'GET'
  })
}

/**
 * 获取所有的乙方用户
 */
export function getPartyBList(){
  return request({
    url:'/user/getPartyBList',
    method:'POST'
  })
}

/**
 * 获取所有
 */
export function getUserCompanyList(data){
  return request({
    url:'/user/getUserCompanyList',
    method:'POST',
    data
  })
}
