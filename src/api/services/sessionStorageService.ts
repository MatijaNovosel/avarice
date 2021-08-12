import { injectable } from "inversify";
import IWebStorage from "../interfaces/webStorageService";

@injectable()
export default class SessionStorage implements IWebStorage {
  saveState(key: string, data: string) {
    sessionStorage.setItem(key, data);
  }

  getSavedState(key: string) {
    const savedState = sessionStorage.getItem(key);
    return savedState;
  }

  removeSavedState(key: string) {
    sessionStorage.removeItem(key);
  }
}
