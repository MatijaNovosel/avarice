import { AppUser } from "./../models/user";
import { createStore, ActionContext } from "vuex";
import createPersistedState from "vuex-persistedstate";

interface State {
  user: AppUser;
}

const state: State = {
  user: {
    email: "",
    uid: "",
    displayName: "",
    photoURL: ""
  }
};

const mutations = {
  setUser(state: State, user: AppUser) {
    state.user = { ...user };
  }
};

const actions = {
  setUser: ({ commit }: ActionContext<State, State>, user: AppUser) =>
    commit("setUser", user)
};

const getters = {
  user: (state: State) => state.user
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersistedState()]
});
