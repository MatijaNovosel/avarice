import { AppUser } from "src/models/user";
import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { UserStateInterface } from "./state";

const actions: ActionTree<UserStateInterface, StateInterface> = {
  login(context, data: AppUser) {
    context.commit("login", data);
  },
  logout(context) {
    context.commit("logout");
  }
};

export default actions;
