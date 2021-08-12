import { route } from "quasar/wrappers";
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { StateInterface } from "../store";
import ROUTE_NAMES from "./routeNames";
import routes from "./routes";

export default route<StateInterface>(({ store }) => {
  let createHistory = null;

  if (process.env.SERVER) {
    createHistory = createMemoryHistory;
  } else if (process.env.VUE_ROUTER_MODE === "history") {
    createHistory = createWebHistory;
  } else {
    createHistory = createWebHashHistory;
  }

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE)
  });

  Router.beforeEach((to, from, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isAuthenticated = store.getters["user/isAuthenticated"] as boolean;

    if (to.matched.some((record) => record.meta.isAuth)) {
      if (!isAuthenticated) {
        next({
          name: ROUTE_NAMES.LOGIN,
          params: { nextUrl: to.fullPath }
        });
      } else {
        next();
      }
    } else if (to.matched.some((record) => record.meta.guest)) {
      if (!isAuthenticated) {
        next();
      } else {
        next({
          name: ROUTE_NAMES.DASHBOARD
        });
      }
    } else {
      next();
    }
  });

  return Router;
});
