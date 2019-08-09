/*
 * @Description: menu store
 * @Author: tongzj
 * @Date: 2019-08-03 09:09:04
 * @LastEditTime: 2019-08-09 17:25:18
 * @LastEditors: Please set LastEditors
 */

const initMenus = [
    {
        "name":"Dashboard",
        "icon":"",
        "url":"/dashboard",
        "customData":{
            "guard":{
                "roles":[],
                "permissions": [],
                "mode": 'allOf'
            }
        }
    },
    {
        "name":"Documentation",
        "icon":"",
        "url":"/documenttation"
    },
    {
        "name":"Guild",
        "icon":"",
        "url":"/guild"
    },
    {
        "name":"Permission",
        "icon":"",
        "url":"/permission",
        "items":[
            {
                "name":"Directive Permission",
                "icon":"",
                "url":"/permission/directive"
            },
        ]
    },
    {
        "name":"Icons",
        "icon":"",
        "url":"/icons"
    },
    {
        "name":"External url",
        "icon":"",
        "url":"https://www.hao123.com"
    }
];

// 使用 `mode: 'allOf'` 表示必须同时拥有。

// - `oneOf` 表示只须满足角色或权限点数组中的一项算有效（默认）
// - `allOf` 表示必须满足所有角色或权限点数组算有效
const state = {
    menus:[],
    authedMenus:[]
}

const mutations = {

    SET_MENUS: (state,menus) => {
        state.menus = menus;
    },

    SET_AUTHED_MENUS: (state,authedMenus) => {
        state.authedMenus = authedMenus;
    },

    CLEAR_AUTHED_MENUS: (state) => {
        state.authedMenus = [];
    }
}

function getAuthedMenus(menus,roles,permissions){

    let authedMenus = [];
    menus.forEach(menu => {
        
        if(isAuthed(menu)){

            //TODO:验证一下
            let authedMenu = {...menu};

            if(menu.items && menu.items.length >0){
                authedMenu.items = [];
                let subAuthedMenus = getAuthedMenus(menu.items,roles,permissions);

                if(subAuthedMenus.length >=0){
                    subAuthedMenus.forEach(s=> {
                        authedMenu.items.push(s);
                    });
                    authedMenus.push(authedMenu);
                }
            }
            }else{
                authedMenus.push(authedMenus);
            }    
    });   

    return authedMenus;
}

function isAuthed(menu,authedRoles,authedPermissions){
    if(menu.customData && menu.guard){
        
        let roles = menu.guard.roles || [];
        let permissions = menu.guard.roles || [];
        let mode = menu.guard.mode || "oneOf";

        if(roles.length <=0 && permissions.length <=0){
            return true;
        }

        if(mode == "oneOf"){
            
            if(roles.length > 0){
                if(roles.some(r=>authedRoles.some(a=>a == r))>=0){
                    return true;
                }
            }

            if(permissions.length > 0){
                if(permissions.some(p=>authedPermissions.some(a=>a == p))>=0){
                    return true;
                }
            }

            return false;
        }
        
        if(roles.length > 0){
            if(roles.every(r=>authedRoles.some(a=>a == r))){
                return true;
            }
        }

        if(permissions.length > 0){
            if(permissions.every(p=>authedPermissions.some(a=>a == p))>=0){
                return true;
            }
        }

        return false;
    }

    return true;
}

const actions = {

    setMenus({commit,rootState},menus) {

        commit('SET_MENUS',menus);

        let roles = rootState.getters.roles;
        let permissions = rootState.getters.permissions;
        console.log("角色");
        console.log(roles);
        console.log("权限");
        console.log(permissions);

        let authedMenus = getAuthedMenus(menus,roles,permissions);

        commit("SET_AUTHED_MENUS",authedMenus);
    },

}



export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  