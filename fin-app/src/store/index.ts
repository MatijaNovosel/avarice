import { AppUser } from "./../models/user";
import { createStore, ActionContext } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { setAllPropertiesToVal } from "@/helpers/helpers";

interface State {
  user: AppUser;
}

const state: State = {
  user: {
    email: null,
    uid: null,
    displayName: null,
    photoURL: null,
    accessToken: null
  }
};

const mutations = {
  setUser(state: State, user: AppUser) {
    state.user = { ...user };
  },
  unsetUser(state: State) {
    setAllPropertiesToVal(state.user, null);
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
