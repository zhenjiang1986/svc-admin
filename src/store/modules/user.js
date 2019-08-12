/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-27 17:40:00
 * @LastEditTime: 2019-08-12 15:55:25
 * @LastEditors: Please set LastEditors
 */

import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import request from '@/utils/request'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions:[]
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS:(state, permissions) => {
    state.permissions = permissions;
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    console.log(userInfo);
    const { username, password } = userInfo
    console.log(username);
    console.log(password);
    return new Promise((resolve, reject) => {

        let param = new FormData();

        param.append("grant_type","password");
        param.append("username",username);
        param.append("password",password);
        param.append("client_id","Decision_ConsoleTestApp");
        param.append("client_secret","1q2w3e*");
        param.append("scope","email openid profile role phone address Decision");



        request.post('/connect/token',param,{
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(response => {
        //const { data } = response
        console.log(response);
        //commit('SET_TOKEN', data.access_token)
        //setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           reject('Verification failed, please Login again.')
//         }

//         const { roles, name, avatar, introduction } = data

//         // roles must be a non-empty array
//         if (!roles || roles.length <= 0) {
//           reject('getInfo: roles must be a non-null array!')
//         }

//         commit('SET_ROLES', roles)
//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         commit('SET_INTRODUCTION', introduction)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

  // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         commit('SET_TOKEN', '')
//         commit('SET_ROLES', [])
//         removeToken()
//         resetRouter()
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

  // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       commit('SET_TOKEN', '')
//       commit('SET_ROLES', [])
//       removeToken()
//       resolve()
//     })
//   },

  // dynamically modify permissions
//   changeRoles({ commit, dispatch }, role) {
//     return new Promise(async resolve => {
//       const token = role + '-token'

//       commit('SET_TOKEN', token)
//       setToken(token)

//       const { roles } = await dispatch('getInfo')

//       resetRouter()

//       // generate accessible routes map based on roles
//       const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

//       // dynamically add accessible routes
//       router.addRoutes(accessRoutes)

//       // reset visited views and cached views
//       dispatch('tagsView/delAllViews', null, { root: true })

//       resolve()
//     })
//   }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
