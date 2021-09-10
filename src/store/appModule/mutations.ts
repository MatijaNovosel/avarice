/* eslint-disable no-param-reassign */
import { MutationTree } from "vuex";
import { AppStateInterface } from "./state";

const mutation: MutationTree<AppStateInterface> = {
  createTransaction(state) {
    state.createTransactionTrigger = !state.createTransactionTrigger;
  }
};

export default mutation;
