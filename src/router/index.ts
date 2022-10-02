import { route } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router";
import ROUTE_NAMES from "./routeNames";
import routes from "./routes";

export default route(() => {
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
    const userStore = useUserStore();
    const isAuthenticated = userStore.isAuthenticated;
    const accounts = userStore.accounts;

    if (to.matched.some((record) => record.meta.isAuth)) {
      if (isAuthenticated) {
        if (to.name === ROUTE_NAMES.ACCOUNT_SETUP) {
          next();
        } else {
          if (accounts.length === 0) {
            next({
              name: ROUTE_NAMES.ACCOUNT_SETUP
            });
          } else {
            next();
          }
        }
      } else {
        next({
          name: ROUTE_NAMES.LOGIN
        });
      }
    } else if (to.matched.some((record) => record.meta.guest)) {
      if (isAuthenticated) {
        if (accounts.length !== 0) {
          next({
            name: ROUTE_NAMES.DASHBOARD
          });
        } else {
          next({
            name: ROUTE_NAMES.ACCOUNT_SETUP
          });
        }
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return Router;
});
