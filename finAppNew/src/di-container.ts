import { Container } from "inversify";
import "reflect-metadata";
import IWebStorage from "@/interfaces/webStorageService";
import SessionStorage from "@/services/sessionStorageService";
import { AppService } from "./services/appService";
import { IAppService } from "./interfaces/appService";
import { AuthService } from "./services/authService";
import { IAuthService } from "./interfaces/authService";
import { ITransactionService } from "./interfaces/transactionService";
import { ChangeService } from "./services/transactionService";
import { SettingsService } from "./services/settingsService";
import { IPaymentSourceService } from "./interfaces/paymentSourceService";
import { ISettingsService } from "./interfaces/settingsService";
import { PaymentSourceService } from "./services/paymentSourceService";

export function getService<T>(symbol): T {
  return DIContainer.get<T>(symbol);
}

export class Types {
  static readonly AppService = Symbol("IAppService");
  static readonly WebStorageService = Symbol("IWebStorageService");
  static readonly AuthService = Symbol("IAuthService");
  static readonly ChangeService = Symbol("ITransactionService");
  static readonly SettingsService = Symbol("ISettingsService");
  static readonly PaymentSourceService = Symbol("IPaymentSourceService");
}

const DIContainer = new Container();

DIContainer.bind<IAppService>(Types.AppService).toConstantValue(
  new AppService()
);

DIContainer.bind<IWebStorage>(Types.WebStorageService).toConstantValue(
  new SessionStorage()
);

DIContainer.bind<IAuthService>(Types.AuthService).toConstantValue(
  new AuthService()
);

DIContainer.bind<ITransactionService>(Types.ChangeService).toConstantValue(
  new ChangeService()
);

DIContainer.bind<ISettingsService>(Types.SettingsService).toConstantValue(
  new SettingsService()
);

DIContainer.bind<IPaymentSourceService>(
  Types.PaymentSourceService
).toConstantValue(new PaymentSourceService());

export default DIContainer;
