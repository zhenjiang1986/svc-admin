import Vue from "vue";
import Router from "vue-router";
import Layout from "@/layout";
import componentsRouter from "./modules/components";

Vue.use(Router);

export const constantroutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index")
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404")
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401")
  },
  {
    path: "/error",
    component: Layout,
    redirect: "noRedirect",
    name: "ErrorPages",
    children: [
      {
        path: "401",
        component: () => import("@/views/error-page/401"),
        name: "Page401",
        meta: { title: "401", noCache: true }
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404"),
        name: "Page404",
        meta: { title: "404", noCache: true }
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "Dashboard", icon: "dashboard", affix: true }
      }
    ]
  },
  componentsRouter
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantroutes
  });

const router = createRouter();
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
