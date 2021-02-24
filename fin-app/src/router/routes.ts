import { RouteNames } from "@/constants/route-names";

export default [
  {
    path: "/login",
    name: RouteNames.LOGIN,
    component: () => import("../views/Login.vue")
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
  },
  {
    path: "/start",
    name: RouteNames.START,
    component: () => import("../views/Start.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/:pathMatch(.*)",
    name: RouteNames.NOT_FOUND,
    component: () => import("../views/NotFound.vue")
  }
];
