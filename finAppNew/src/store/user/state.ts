import { getService, Types } from "@/di-container";
import IWebStorage from "@/interfaces/webStorageService";
import { AppUser } from "@/models/user";

const storage = getService<IWebStorage>(Types.WebStorageService);

export default {
  data: JSON.parse(storage.getSavedState("user")) as AppUser
};
