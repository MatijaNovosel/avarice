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
