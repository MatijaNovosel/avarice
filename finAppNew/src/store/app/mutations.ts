export default {
  refresh: (state) => {
    state.refreshTrigger = !state.refreshTrigger;
  },
  setLoading: (state, val: boolean) => {
    state.loading = val;
  }
}
