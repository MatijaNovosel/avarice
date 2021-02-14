import { LanguageEnum } from "./../constants/language";
import { AppUser } from "./../models/user";
import { createStore, ActionContext } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { setAllPropertiesToVal } from "@/helpers/helpers";

interface State {
  user: AppUser;
  darkMode: boolean;
}

const state: State = {
  darkMode: false,
  user: {
    email: null,
    uid: null,
    accessToken: "",
    dateFormat: "",
    displayName: "",
    language: LanguageEnum.English,
    photoURL: "",
    preferredCurrency: "HRK"
  }
};

const mutations = {
  setDarkMode(state: State, darkMode: boolean) {
    state.darkMode = darkMode;
  },
  setUser(state: State, user: AppUser) {
    state.user = { ...user };
  },
  unsetUser(state: State) {
    setAllPropertiesToVal(state.user, undefined);
  }
};

const actions = {
  setUser: ({ commit }: ActionContext<State, State>, user: AppUser) =>
    commit("setUser", user),
  unsetUser: ({ commit }: ActionContext<State, State>) => commit("unsetUser"),
  setDarkMode: ({ commit }: ActionContext<State, State>, darkMode: boolean) =>
    commit("setDarkMode", darkMode)
};

const getters = {
  user: (state: State) => state.user,
  isAuthenticated: (state: State) => state.user.uid != null,
  darkMode: (state: State) => state.darkMode
};

export default createStore({
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersistedState()]
});
