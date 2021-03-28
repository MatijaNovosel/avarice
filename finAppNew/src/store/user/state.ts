import { getService, Types } from '@/di-container';
import IWebStorage from "@/interfaces/webStorageService";
import IUser from '@/models/user';

const storage = getService<IWebStorage>(Types.WebStorageService);

export default {    
  data: JSON.parse(storage.getSavedState("user")) as IUser,
  isAuthenticated: document.cookie.indexOf("uc=true") != -1
}
