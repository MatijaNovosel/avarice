import { Snackbar } from "@/models/appNotifications";

export default {
  refreshTrigger: state => state.refreshTrigger as boolean,
  loading: state => state.loading as boolean,
  snackbar: state => state.snackbar as Snackbar
};
