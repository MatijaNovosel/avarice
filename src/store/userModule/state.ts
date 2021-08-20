import { AppUser } from "src/models/user";
import IWebStorage from "src/api/interfaces/webStorageService";
import { getService, Types } from "src/di-container";
import { CategoryModel } from "src/api/client";

export interface UserStateInterface {
  data: AppUser | null;
  categories: CategoryModel[];
}

const storage = getService<IWebStorage>(Types.WebStorageService);

function state(): UserStateInterface {
  return {
    data: JSON.parse(storage.getSavedState("user")) as AppUser,
    categories: JSON.parse(storage.getSavedState("categories")) as CategoryModel[]
  };
}

export default state;
