import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("pages/Index.vue")
      },
      {
        path: "",
        name: "history",
        component: () => import("pages/History.vue")
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
