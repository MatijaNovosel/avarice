import { Container } from "inversify";
import "reflect-metadata";
import IWebStorage from "@/interfaces/webStorageService";
import SessionStorage from "@/services/sessionStorageService";
import { AuthService } from "./services/authService";
import { IAuthService } from "./interfaces/authService";
import { ITransactionService } from "./interfaces/transactionService";
import { TransactionService } from "./services/transactionService";
import { SettingsService } from "./services/settingsService";
import { IAccountService } from "./interfaces/accountService";
import { ISettingsService } from "./interfaces/settingsService";
import { AccountService } from "./services/accountService";
import { TagService } from "./services/tagService";
import { ITagService } from "./interfaces/tagService";
import { IHistoryService } from "./interfaces/historyService";
import { HistoryService } from "./services/historyService";

export function getService<T>(symbol): T {
  return DIContainer.get<T>(symbol);
}

export class Types {
  static readonly WebStorageService = Symbol("IWebStorageService");
  static readonly AuthService = Symbol("IAuthService");
  static readonly TransactionService = Symbol("ITransactionService");
  static readonly HistoryService = Symbol("IHistoryService");
  static readonly SettingsService = Symbol("ISettingsService");
  static readonly AccountService = Symbol("IAccountService");
  static readonly TagService = Symbol("ITagService");
}

const DIContainer = new Container();

DIContainer.bind<IWebStorage>(Types.WebStorageService).toConstantValue(
  new SessionStorage()
);

DIContainer.bind<IAuthService>(Types.AuthService).toConstantValue(
  new AuthService()
);

DIContainer.bind<ITransactionService>(Types.TransactionService).toConstantValue(
  new TransactionService()
);

DIContainer.bind<ISettingsService>(Types.SettingsService).toConstantValue(
  new SettingsService()
);

DIContainer.bind<ITagService>(Types.TagService).toConstantValue(
  new TagService()
);

DIContainer.bind<IHistoryService>(Types.HistoryService).toConstantValue(
  new HistoryService()
);

DIContainer.bind<IAccountService>(Types.AccountService).toConstantValue(
  new AccountService()
);

export default DIContainer;
