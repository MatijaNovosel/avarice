import { IAppService } from "../interfaces/appService";
import { injectable } from "inversify";

@injectable()
export class AppService implements IAppService {
  getUserData(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async logoutUser(): Promise<void> {
    //
  }
}
