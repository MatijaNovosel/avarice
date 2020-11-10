import { reactive, readonly } from "vue";

const state = reactive({
  refresh: false
});

const refresh = () => {
  state.refresh = !state.refresh;
};

export default { state: readonly(state), refresh };
