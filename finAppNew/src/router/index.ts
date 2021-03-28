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
          isAuth: false,
          title: "home.title"
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
          title: "noPermissions.title"
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
  if (to.matched.length == 0) {
    if (store.getters["user/isAuthenticated"]) {
      next({ name: RouteNames.LOGIN });
    } else {
      next({ name: RouteNames.HOME });
    }
  } else if (
    store.getters["user/isAuthenticated"] &&
    to.name == RouteNames.HOME
  ) {
    next({ name: RouteNames.LOGIN });
  } else if (
    !store.getters["user/isAuthenticated"] &&
    to.name == RouteNames.LOGIN
  ) {
    next({ name: RouteNames.HOME });
  } else if (to.meta.isAuth == false) {
    next();
  } else if (to.meta.isAuth == true && !store.getters["user/isAuthenticated"]) {
    next({ name: RouteNames.HOME });
  } else if (store.getters["user/isAuthenticated"]) {
    next({ name: RouteNames.NO_PERMISSIONS });
  } else {
    next({ name: RouteNames.HOME });
  }
});

router.afterEach(to => {
  document.title =
    i18n.t("appTitle") +
    (i18n.t(to.meta.title) ? " - " + i18n.t(to.meta.title) : "");
});

export default router;
