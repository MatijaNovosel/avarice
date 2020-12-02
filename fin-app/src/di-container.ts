import { Container } from "inversify";
import "reflect-metadata";
import { AuthService } from "./services/api/auth-service";
import { IAuthService } from "./services/interfaces/auth-service";

export class Types {
  static readonly AuthService = Symbol("IAuthService");
}

const DIContainer = new Container();

DIContainer.bind<IAuthService>(Types.AuthService).toConstantValue(
  new AuthService()
);

export function getService<T>(symbol: symbol): T {
  return DIContainer.get<T>(symbol);
}

export default DIContainer;
