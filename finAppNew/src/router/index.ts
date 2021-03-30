import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import goTo from "vuetify/es5/services/goto";
import i18n from "../plugins/i18n";
import store from "../store";
import MainLayout from "../layouts/Main.vue";
import RouteNames from "../constants/routeNames";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "",
    component: MainLayout,
    children: [
      {
        path: "",
        name: RouteNames.HOME,
        component: () => import("../views/Home.vue"),
        meta: {
          isAuth: true,
          title: "routeNames.home"
        }
      },
      {
        path: "settings",
        name: RouteNames.SETTINGS,
        component: () => import("../views/Settings.vue"),
        meta: {
          isAuth: true,
          title: "routeNames.settings"
        }
      },
      {
        path: "accounts",
        name: RouteNames.ACCOUNTS,
        component: () => import("../views/Accounts.vue"),
        meta: {
          isAuth: true,
          title: "routeNames.accounts"
        }
      },
      {
        path: "history",
        name: RouteNames.HISTORY,
        component: () => import("../views/History.vue"),
        meta: {
          isAuth: true,
          title: "routeNames.history"
        }
      },
      {
        path: "login",
        name: RouteNames.LOGIN,
        component: () => import("../views/Login.vue"),
        meta: {
          isAuth: false,
          title: ""
        }
      },
      {
        path: "no-permissions",
        name: RouteNames.NO_PERMISSIONS,
        component: () => import("../views/NoPermissions.vue"),
        meta: {
          isAuth: false,
          title: "routeNames.noPermissions"
        }
      },
      {
        path: "*",
        redirect: ""
      }
    ]
  }
];

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
  linkExactActiveClass: "nav-item active",
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return goTo(to.hash);
    } else if (savedPosition) {
      goTo(savedPosition.y);
    }
    return goTo(0);
  }
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters["user/isAuthenticated"];
  if (to.matched.some(record => record.meta.isAuth)) {
    if (!isAuthenticated) {
      next({
        name: RouteNames.LOGIN,
        params: { nextUrl: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (!isAuthenticated) {
      next();
    } else {
      next({
        name: RouteNames.HOME
      });
    }
  } else {
    next();
  }
});

router.afterEach(to => {
  document.title =
    i18n.t("appTitle") +
    (i18n.t(to.meta.title) ? " - " + i18n.t(to.meta.title) : "");
});

export default router;
