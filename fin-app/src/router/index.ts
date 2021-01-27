import { RouteNames } from "./../constants/route-names";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store/index";
import routes from "./routes";

const routesList: RouteRecordRaw[] = [...routes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesList
});

router.beforeEach((to, from, next) => {
  if (to.name !== RouteNames.LOGIN && !store.getters.isAuthenticated) {
    next({ name: RouteNames.LOGIN });
  } else {
    next();
  }
});

export default router;
