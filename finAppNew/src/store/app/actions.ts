export default {
  refresh: async context => {
    context.commit("refresh");
  },
  setLoading: async (context, val: boolean) => {
    context.commit("setLoading", val);
  }
};
