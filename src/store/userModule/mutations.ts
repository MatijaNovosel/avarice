/* eslint-disable no-param-reassign */
import { MutationTree } from "vuex";
import IWebStorage from "src/api/interfaces/webStorageService";
import { getService, Types } from "src/di-container";
import { AppUser } from "src/models/user";
import { UserStateInterface } from "./state";

const storage = getService<IWebStorage>(Types.WebStorageService);

const mutation: MutationTree<UserStateInterface> = {
  login(state, data: AppUser) {
    storage.saveState("user", JSON.stringify(data));
    state.data = data;
  },
  logout(state) {
    storage.removeSavedState("user");
    state.data = null;
  }
};

export default mutation;