/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-03 09:10:31
 * @LastEditTime: 2019-08-10 09:17:15
 * @LastEditors: Please set LastEditors
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)



export const constantroutes = [
    {
       path: '/',
       component: () => import('@/views/login/index'),
       hidden: true
     },
  ];
  
  export const asyncRoutes = [];
 
 
  const createRouter = () => new Router({
     scrollBehavior: ()=>({y:0}),
     routes:constantroutes
  });
 
  const router = createRouter();
 // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
  export function resetRouter(){
     const newRouter = createRouter();
     router.matcher = newRouter.matcher;
  }
 
  export default router


