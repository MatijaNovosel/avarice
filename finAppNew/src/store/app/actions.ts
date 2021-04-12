import { Snackbar } from '@/models/appNotifications';

export default {
  refresh: async context => {
    context.commit("refresh");
  },
  setLoading: async (context, val: boolean) => {
    context.commit("setLoading", val);
  },
  showSnackbar: async (context, val: Snackbar) => {
    context.commit("showSnackbar", val);
  }
};
