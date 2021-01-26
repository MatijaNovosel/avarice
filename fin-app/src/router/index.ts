import { RouteNames } from "./../constants/route-names";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store/index";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: RouteNames.LOGIN,
    component: () => import("../views/Login.vue"),
    meta: {
      auth: false
    }
  },
  {
    path: "/",
    name: RouteNames.HOME,
    component: () => import("../views/Home.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/accounts",
    name: RouteNames.ACCOUNTS,
    component: () => import("../views/Accounts.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/test",
    name: RouteNames.TEST,
    component: () => import("../views/Test.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/settings",
    name: RouteNames.SETTINGS,
    component: () => import("../views/Settings.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/privacy",
    name: RouteNames.PRIVACY,
    component: () => import("../views/Privacy.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/history",
    name: RouteNames.HISTORY,
    component: () => import("../views/History.vue"),
    meta: {
      auth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name !== RouteNames.LOGIN && !store.getters.isAuthenticated) {
    next({ name: RouteNames.LOGIN });
  } else {
    next();
  }
});

export default router;
