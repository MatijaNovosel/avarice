import { AppUser } from "src/models/user";
import { GetterTree } from "vuex";
import { StateInterface } from "../index";
import { UserStateInterface } from "./state";

const getters: GetterTree<UserStateInterface, StateInterface> = {
  data(state): AppUser | null {
    return state.data;
  },
  isAuthenticated(state) {
    return state.data != null;
  },
  categories(state) {
    return state.categories;
  },
  accounts(state) {
    return state.accounts;
  }
};

export default getters;
