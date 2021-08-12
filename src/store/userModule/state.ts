import { AppUser } from "src/models/user";
import IWebStorage from "src/api/interfaces/webStorageService";
import { getService, Types } from "src/di-container";

export interface UserStateInterface {
  data: AppUser | null;
}

const storage = getService<IWebStorage>(Types.WebStorageService);

function state(): UserStateInterface {
  return {
    data: JSON.parse(storage.getSavedState("user")) as AppUser
  };
}

export default state;
