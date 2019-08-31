import router from "@/router";
import store from "@/store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import { isAuth } from "./guard";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/auth-redirect"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;

      if (!hasRoles) {
        await store.dispatch("user/getInfo");
      }
      let title = null;

      let menu = store.getters["menu/getByFullPath"](to.fullPath);

      if (menu) {
        title = menu.title;
      } else {
        if (to.meta && to.meta.title) {
          title = to.meta.title;
        }
      }

      //TODO:添加菜单优先级
      document.title = getPageTitle(title);

      if (to.meta && to.meta.guard) {
        let roles = store.getters.roles || [];
        let permissions = store.getters.permissions || [];
        if (isAuth(to.meta.guard, roles, permissions)) {
          next();
        } else {
          //未授权页面
          next({ path: "/401" });
        }
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
