/* eslint-disable no-param-reassign */
import { MutationTree } from "vuex";
import IWebStorage from "src/api/interfaces/webStorageService";
import { getService, Types } from "src/di-container";
import { setCssVar } from "quasar";
import { AppStateInterface } from "./state";

const storage = getService<IWebStorage>(Types.WebStorageService);

const mutation: MutationTree<AppStateInterface> = {
  createTransaction(state) {
    state.createTransactionTrigger = !state.createTransactionTrigger;
  },
  changeAccentColor(state, color: string | null) {
    storage.saveState("accentColor", JSON.stringify(color));
    setCssVar("accent", color as string);
    state.accentColor = color;
  }
};

export default mutation;
