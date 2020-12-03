import { SettingsService } from "./services/api/settings-service";
import { ISettingsService } from "./services/interfaces/settings-service";
import { Container } from "inversify";
import "reflect-metadata";
import { AuthService } from "./services/api/auth-service";
import { IAuthService } from "./services/interfaces/auth-service";
import { IChangeService } from "./services/interfaces/change-service";
import { ChangeService } from "./services/api/change-service";

export class Types {
  static readonly AuthService = Symbol("IAuthService");
  static readonly ChangeService = Symbol("IChangeService");
  static readonly SettingsService = Symbol("ISettingsService");
}

const DIContainer = new Container();

// DIContainer bind list
DIContainer.bind<IAuthService>(Types.AuthService).toConstantValue(
  new AuthService()
);
DIContainer.bind<IChangeService>(Types.ChangeService).toConstantValue(
  new ChangeService()
);
DIContainer.bind<ISettingsService>(Types.SettingsService).toConstantValue(
  new SettingsService()
);

export function getService<T>(symbol: symbol): T {
  return DIContainer.get<T>(symbol);
}

export default DIContainer;