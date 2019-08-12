/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-27 15:11:26
 * @LastEditTime: 2019-08-10 15:52:56
 * @LastEditors: Please set LastEditors
 */
import Cookies from 'js-cookie'

const TokenKey = "Admin-Token"

export function getToken() {
    return Cookies.get(TokenKey)
  }
  
  export function setToken(token) {
    return Cookies.set(TokenKey, token,{ expires: 1 })
  }
  
  export function removeToken() {
    return Cookies.remove(TokenKey)
  }