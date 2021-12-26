import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { AppStateInterface } from "./state";

const actions: ActionTree<AppStateInterface, StateInterface> = {
  createTransaction(context) {
    context.commit("createTransaction");
  },
  changeAccentColor(context, color: string | null) {
    context.commit("changeAccentColor", color);
  }
};

export default actions;
