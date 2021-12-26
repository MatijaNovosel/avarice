import IWebStorage from "src/api/interfaces/webStorageService";
import { getService, Types } from "src/di-container";

const storage = getService<IWebStorage>(Types.WebStorageService);

export interface AppStateInterface {
  createTransactionTrigger: boolean;
  accentColor: string | null;
}

function state(): AppStateInterface {
  return {
    createTransactionTrigger: false,
    accentColor: (JSON.parse(storage.getSavedState("accentColor")) as string | null) || "#f44336"
  };
}

export default state;
