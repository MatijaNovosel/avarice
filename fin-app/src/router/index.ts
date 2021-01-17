import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store/index";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      auth: false
    }
  },
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/accounts",
    name: "accounts",
    component: () => import("../views/Accounts.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/Test.vue"),
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
  if (to.name !== "login" && !store.getters.isAuthenticated) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
