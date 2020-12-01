import { AppUser } from "./../models/user";
import { createStore, ActionContext } from "vuex";
import createPersistedState from "vuex-persistedstate";

interface State {
  user: AppUser;
}

const state: State = {
  user: {
    email: null,
    uid: null,
    displayName: null,
    photoURL: null
  }
};

const mutations = {
  setUser(state: State, user: AppUser) {
    state.user = { ...user };
  },
  unsetUser(state: State) {
    state.user.email = null;
    state.user.uid = null;
    state.user.displayName = null;
    state.user.photoURL = null;
  }
};

const actions = {
  setUser: ({ commit }: ActionContext<State, State>, user: AppUser) =>
    commit("setUser", user),
  unsetUser: ({ commit }: ActionContext<State, State>) => commit("unsetUser")
};

const getters = {
  user: (state: State) => state.user,
  isAuthenticated: (state: State) => state.user.uid != null
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersistedState()]
});
