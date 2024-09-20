import { injectable } from "inversify";
import { i18n } from "../configurations/i18n";
import Constants, { ApiUrlPrefixes } from "../constants";
import { queryOptionsToParams } from "../helpers/apiClient";
import { ApiClient } from "../infrastructure/apiClient";
import { IQueryParam } from "../interfaces/apiClient";
import { IPageableCollection } from "../interfaces/common";
import { IGetUsersParams } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { IUserService } from "./interfaces/userService";

@injectable()
export class UserService implements IUserService {
  client: ApiClient = new ApiClient(Constants.API_BASE_URL, Constants.API_VERSION);

  async getUsers(params: IGetUsersParams): Promise<IPageableCollection<IUserModel>> {
    const queryParams: IQueryParam[] = [
      ...queryOptionsToParams({
        skip: params.skip,
        take: params.take,
        sort: params.sort,
        group: params.group
      })
    ];

    if (params.search) {
      queryParams.push({
        name: "search",
        value: params.search
      });
    }

    const result = await this.client.get({
      apiPrefix: ApiUrlPrefixes.USER,
      apiLocation: "user",
      queryParams,
      genericMessage: i18n.global.t("notification.error.users.get")
    });

    return result.data;
  }
}
