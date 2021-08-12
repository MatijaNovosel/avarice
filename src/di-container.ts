import { Container } from "inversify";
import "reflect-metadata";
import IWebStorage from "src/api/interfaces/webStorageService";
import SessionStorage from "src/api/services/sessionStorageService";
import AuthService from "src/api/services/authService";
import IAuthService from "src/api/interfaces/authService";

export class Types {
  static readonly WebStorageService = Symbol("IWebStorageService");
  static readonly AuthService = Symbol("IAuthService");
}

const DIContainer = new Container();

DIContainer.bind<IWebStorage>(Types.WebStorageService).toConstantValue(
  new SessionStorage()
);

DIContainer.bind<IAuthService>(Types.AuthService).toConstantValue(
  new AuthService()
);

export function getService<T>(symbol: symbol): T {
  return DIContainer.get<T>(symbol);
}

export default DIContainer;
