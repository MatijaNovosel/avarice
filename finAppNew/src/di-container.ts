import { Container } from "inversify";
import "reflect-metadata";
import IWebStorage from "@/interfaces/webStorageService";
import SessionStorage from "@/services/sessionStorageService";
import { AppService } from "./services/appService";
import { IAppService } from "./interfaces/appService";

export function getService<T>(symbol): T {
  return DIContainer.get<T>(symbol);
}

export class Types {
  static readonly AppService = Symbol("IAppService");
  static readonly WebStorageService = Symbol("IWebStorageService");
}

const DIContainer = new Container();

DIContainer.bind<IAppService>(Types.AppService).toConstantValue(
  new AppService()
);
DIContainer.bind<IWebStorage>(Types.WebStorageService).toConstantValue(
  new SessionStorage()
);

export default DIContainer;
