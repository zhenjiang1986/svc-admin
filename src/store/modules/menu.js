/*
 * @Description: menu store
 * @Author: tongzj
 * @Date: 2019-08-03 09:09:04
 * @LastEditTime: 2019-08-19 11:18:14
 * @LastEditors: Please set LastEditors
 */

const initMenus = [
  {
    name: "Dashboard",
    displayName: "Dashboard",
    icon: "",
    url: "/dashboard",
    affix: true,
    customData: {
      guard: {
        roles: [],
        permissions: [],
        mode: "allOf"
      }
    }
  },
  {
    name: "Documentation",
    icon: "",
    url: "/documenttation"
  },
  {
    name: "Guild",
    icon: "",
    url: "/guild"
  },
  {
    name: "Permission",
    icon: "",
    url: "/permission",
    items: [
      {
        name: "Directive Permission",
        icon: "",
        url: "/permission/directive"
      }
    ]
  },
  {
    name: "Icons",
    icon: "",
    url: "/icons"
  },
  {
    name: "External url",
    icon: "",
    url: "https://www.hao123.com"
  }
];

import path from "path";
import { isExternal } from "@/utils/validate";
import { isAuth } from "@/guard";
import router from "@/router";

// 使用 `mode: 'allOf'` 表示必须同时拥有。

// - `oneOf` 表示只须满足角色或权限点数组中的一项算有效（默认）
// - `allOf` 表示必须满足所有角色或权限点数组算有效
const state = {
  menus: [],
  authMenus: []
};

const mutations = {
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  },

  SET_AUTH_MENUS: (state, authMenus) => {
    state.authMenus = authMenus;
  },

  CLEAR_AUTH_MENUS: state => {
    state.authMenus = [];
  }
};

/**
 *根据菜单获取授权的菜单,并且初始化fullPath
 *
 * @param {*} menus
 * @param {*} roles
 * @param {*} permissions
 * @param {string} [basePath="/"]
 * @returns
 */
function getAuthMenus(menus, roles, permissions, basePath = "/") {
  let authMenus = [];

  menus.forEach(menu => {
    if (isMenuAuth(menu, roles, permissions)) {
      //TODO:验证一下
      let authMenu = { ...menu };

      delete authMenu.items;

      if (menu.url) {
        if (!isExternal(menu.url)) {
          authMenu.fullPath = path.resolve(basePath, menu.url);
        } else {
          authMenu.fullPath = menu.url;
        }
      }

      if (menu.items && menu.items.length > 0) {
        let subAuthMenus = getAuthMenus(
          menu.items,
          roles,
          permissions,
          authMenu.fullPath || basePath
        );

        if (subAuthMenus.length > 0) {
          subAuthMenus.forEach(s => {
            authMenu.items.push(s);
          });
          authMenus.push(authMenu);
        }
      } else {
        //如果是链接型的菜单,我们检查它对应的Route是否有权限

        if (authMenu.fullPath && !isExternal(authMenu.fullPath)) {
          let result = router.resolve(authMenu.fullPath);

          if (result.matched.length > 0) {
            let allAuth = true;
            for (let i = 0; i < result.matched.length; i++) {
              var route = result.matched[i];

              if (route.meta && route.meta.guard) {
                if (!isAuth(route.meta.guard, roles, permissions)) {
                  allAuth = false;
                  break;
                }
              }
            }

            if (allAuth) {
              authMenus.push(authMenu);
            }
          }//匹配不上路由,则不显示该菜单
        } else {
          authMenus.push(authMenu);
        }
      }
    }
  });

  return authMenus;
}

function isMenuAuth(menu, roles, permissions) {
  if (menu.customData && menu.customData.guard) {
    return isAuth(menu.customData.guard, roles, permissions);
  }
  return true;
}

const actions = {
  setMenus({ commit, rootState }, menus) {
    commit("SET_MENUS", menus);

    let roles = rootState.getters.roles;
    let permissions = rootState.getters.permissions;
    console.log("角色");
    console.log(roles);
    console.log("权限");
    console.log(permissions);

    let authMenus = getAuthMenus(menus, roles, permissions);

    commit("SET_AUTH_MENUS", authMenus);
  }
};

function findMenus(menus, predicate) {
  menus.forEach(menu => {
    if (predicate(menu)) {
      return menu;
    }

    if (menu.items && menu.items.length > 0) {
      var found = findMenus(menu.items, predicate);
      if (found) {
        return found;
      }
    }
  });

  return null;
}

const getters = {
  getByName: state => name => {
    var authMenus = state.authMenus;
    return findMenus(authMenus, menu => {
      return menu.name.toUpperCase() == name.toUpperCase();
    });
  },
  getByFullPath: state => fullPath => {
    var authMenus = state.authMenus;
    return findMenus(authMenus, menu => {
      return (
        menu.fullPath && menu.fullPath.toUpperCase == fullPath.toUpperCase()
      );
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
