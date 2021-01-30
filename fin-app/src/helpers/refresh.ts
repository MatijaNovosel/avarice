import { reactive, readonly } from "vue";

export interface RefreshState {
  refresh: boolean;
}

export interface RefreshController {
  state: RefreshState;
  refresh: Function;
}

const state: RefreshState = reactive({
  refresh: false
});

const refresh = () => {
  state.refresh = !state.refresh;
};

export default { state: readonly(state), refresh };
