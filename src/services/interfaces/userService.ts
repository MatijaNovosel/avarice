import { IPageableCollection } from "@/shared/interfaces/common";
import { IGetUsersParams } from "@/shared/interfaces/user";
import {
  IUserModel
} from "@/shared/models/user";

export interface IUserService {
  getUsers(params: IGetUsersParams): Promise<IPageableCollection<IUserModel>>;
}
