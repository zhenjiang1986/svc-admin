import store from "@/store";
import path from "path";
import { isExternal } from "@/utils/validate";
import { isAuth } from "@/guard";
import router from "@/router";
import { Log } from "@/utils/log";

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
function getAuthMenus(
  menus,
  roles,
  permissions,
  parentMenu = null,
  basePath = "/"
) {
  let authMenus = [];

  menus.forEach(menu => {
    if (isMenuAuth(menu, roles, permissions)) {
      let authMenu = { ...menu };

      authMenu.title = menu.displayName || menu.name;

      if (parentMenu) {
        authMenu.parentName = parentMenu.name;
      }

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
          authMenu,
          authMenu.fullPath || basePath
        );

        if (subAuthMenus.length > 0) {
            authMenu.items = []
          subAuthMenus.forEach(s => {
            authMenu.items.push(s);
          });
          authMenus.push(authMenu);
        }
      } else {
        //如果是链接型的菜单,我们检查它对应的Route是否有权限

        if (authMenu.fullPath && !isExternal(authMenu.fullPath)) {
          let result = router.resolve(authMenu.fullPath);

          var matched = result.resolved.matched;

          if (matched.length > 0) {
            let allAuth = true;
            for (let i = 0; i < matched.length; i++) {
              var route = matched[i];

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
          } //匹配不上路由,则不显示该菜单
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
  setMenus({ commit }, menus) {
    commit("SET_MENUS", menus);

    let roles = store.getters.roles;
    let permissions = store.getters.permissions.keys;

    let authMenus = getAuthMenus(menus, roles, permissions);

    commit("SET_AUTH_MENUS", authMenus);
  }
};

function findMenus(menus, predicate) {

  for (let i = 0; i < menus.length; i++) {

    let menu = menus[i];

    if (predicate(menu)) {
      return menu;
    }

    if (menu.items && menu.items.length > 0) {
      var found = findMenus(menu.items, predicate);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

const getters = {
  getByName: state => name => {
    var authMenus = state.authMenus;
    return findMenus(
      authMenus,
      menu => menu.name.toUpperCase() == name.toUpperCase()
    );
  },
  getByFullPath: state => fullPath => {
    var authMenus = state.authMenus;
    return findMenus(
      authMenus,
      menu =>
        menu.fullPath && menu.fullPath.toUpperCase() == fullPath.toUpperCase()
    );
  },
  getBreadcrumbMenus: (state, getters) => fullPath => {
    var curMenu = getters.getByFullPath(fullPath);

    if (!curMenu) {

      return null;
    }

    let breadcrumb = [curMenu];

    var deep = 0;

    while (curMenu.parentName) {
      var parentMenu = getters.getByName(curMenu.parentName);

      if (parentMenu) {
        breadcrumb.push(parentMenu);

        curMenu = parentMenu;
      }

      if (++deep > 10) {
        throw new Error(
          "when find menu breadcrumb, the deep is bigger than 10"
        );
      }
    }

    return breadcrumb.reverse();
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
