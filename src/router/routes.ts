import { RouteRecordRaw } from "vue-router";
import ROUTE_NAMES from "./routeNames";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: ROUTE_NAMES.DASHBOARD,
        component: () => import("src/pages/Dashboard.vue"),
        meta: {
          isAuth: true
        }
      },
      {
        path: "/history",
        name: ROUTE_NAMES.HISTORY,
        component: () => import("pages/History.vue"),
        meta: {
          isAuth: true
        }
      },
      {
        path: "/templates",
        name: ROUTE_NAMES.TEMPLATES,
        component: () => import("pages/Templates.vue"),
        meta: {
          isAuth: true
        }
      },
      {
        path: "/statistics",
        name: ROUTE_NAMES.STATISTICS,
        component: () => import("pages/Statistics.vue"),
        meta: {
          isAuth: true
        }
      },
      {
        path: "/settings",
        name: ROUTE_NAMES.SETTINGS,
        component: () => import("pages/Settings.vue"),
        meta: {
          isAuth: true
        }
      },
      {
        path: "/categories",
        name: ROUTE_NAMES.CATEGORIES,
        component: () => import("pages/Categories.vue"),
        meta: {
          isAuth: true
        }
      },
      {
        path: "/login",
        name: ROUTE_NAMES.LOGIN,
        component: () => import("pages/Login.vue"),
        meta: {
          guest: true
        }
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
