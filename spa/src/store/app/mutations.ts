import { Snackbar } from "@/models/appNotifications";

export default {
  refresh: state => {
    state.refreshTrigger = !state.refreshTrigger;
  },
  setLoading: (state, val: boolean) => {
    state.loading = val;
  },
  showSnackbar: (state, val: Snackbar) => {
    state.snackbar.color = val.color;
    state.snackbar.message = val.message;
    state.snackbar.timeout = val.timeout;
    state.snackbar.active = !state.snackbar.active;
  }
};
