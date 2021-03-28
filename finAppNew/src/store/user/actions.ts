import { getService, Types } from "@/di-container";
import { IAppService } from "@/interfaces/appService";

export default {
  login: async context => {
    const userData = await getService<IAppService>(
      Types.AppService
    ).getUserData();
    context.commit("login", userData);
  },
  logout: async context => {
    context.commit("logout");
  }
};
