import IWebStorage from "@/interfaces/webStorageService";
import { getService, Types } from '@/di-container';
import { User } from "@/models/user";

const storage = getService<IWebStorage>(Types.WebStorageService);

export default {
  login: (state, data: User) => {
    storage.saveState("user", JSON.stringify(data));
    state.data = data;
  },
  logout: (state) => {
    storage.removeSavedState("user");
    state.data = null;
  }
}
