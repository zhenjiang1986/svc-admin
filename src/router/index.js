import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)



export const constantroutes = [
    {
       path: '/login',
       component: () => import('@/views/login/index'),
       hidden: true
     },
     {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
          {
            path: 'dashboard',
            component: () => import('@/views/dashboard/index'),
            name: 'Dashboard',
            meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
          }
        ]
      }
  ];

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


