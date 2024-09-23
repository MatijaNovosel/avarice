import { useUserStore } from "@/stores/user";
import { createRouter, createWebHistory } from "vue-router";
import ROUTE_NAMES from "./routeNames";
import routes from "./routes";

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
  linkExactActiveClass: "nav-item active"
});

router.beforeEach((to, from, next) => {
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

export default router;
