/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-27 17:40:00
 * @LastEditTime: 2019-08-19 17:32:37
 * @LastEditors: Please set LastEditors
 */
import axios from "axios";
import { getToken, setToken, removeToken } from "@/utils/auth";
import request from "@/utils/request";
import {isAuth} from '@/guard'

const state = {
  token: getToken(),
  id:'',
  name: "",
  avatar: "",
  preferredUsername:"",
  roles: [],
  permissions: [],
  settings:new Map()
};

const mutations = { 
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ID: (state, userId) => {
    state.id = userId;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_PREFERRED_USERNAME: (state, preferred_username) => {
    state.preferredUsername = preferred_username;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
  SET_SETTINGS: (state, settings) => {
    state.settings = settings;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      let data = new FormData();

      data.append("grant_type", "password");
      data.append("username", username);
      data.append("password", password);
      data.append("client_id", "Decision_ConsoleTestApp");
      data.append("client_secret", "1q2w3e*");
      data.append("scope", "email openid profile role phone address Decision");

      request
        .post("/connect/token", data, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        .then(response => {
          console.log(response);
          commit("SET_TOKEN", response.access_token);
          setToken(response.access_token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {

        axios.all([request.get("/connect/userinfo"),request.get("/api/abp/application-configuration")])
        .then(axios.spread((user,config) =>{
            const {sub, role, name, preferred_username } = user;

            // roles must be a non-empty array
          if (!role) {
            reject("未配置角色!");
          }
          let roles = [];
          if(typeof role === "string"){

            roles = role.split(/,,; /);
          }else if(role instanceof Array){
              roles = role;
          }

          commit("SET_ROLES", roles);
          commit("SET_NAME", name);
          commit("SET_ID", sub);
          commit("SET_AVATAR", '');
          commit("SET_PREFERRED_USERNAME",preferred_username);
          function objToStrMap(obj) {
            let strMap = new Map();
            for (let k of Object.keys(obj)) {
              strMap.set(k, obj[k]);
            }
            return strMap;
          }

            if(config.auth && config.auth.grantedPolicies){
                    
                commit("SET_PERMISSIONS", objToStrMap(config.auth.grantedPolicies));
            }

            if(config.setting && config.setting.values){
                commit("SET_SETTINGS", objToStrMap(config.setting.values));
            }
            resolve();
        }));
  });

  
  }
  //user logout
    // logout({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
