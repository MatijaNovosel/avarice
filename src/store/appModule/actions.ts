import { ActionTree } from "vuex";
import { StateInterface } from "../index";
import { AppStateInterface } from "./state";

const actions: ActionTree<AppStateInterface, StateInterface> = {
  createTransaction(context) {
    context.commit("createTransaction");
  }
};

export default actions;
