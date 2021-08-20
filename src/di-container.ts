import { Container } from "inversify";
import "reflect-metadata";
import IWebStorage from "src/api/interfaces/webStorageService";
import SessionStorage from "src/api/services/sessionStorageService";
import AuthService from "src/api/services/authService";
import IAuthService from "src/api/interfaces/authService";
import AccountService from "./api/services/accountService";
import IAccountService from "./api/interfaces/accountService";
import TransactionService from "./api/services/transactionService";
import ITransactionService from "./api/interfaces/transactionService";
import CategoryService from "./api/services/categoryService";
import ICategoryService from "./api/interfaces/categoryService";

export class Types {
  static readonly WebStorageService = Symbol("IWebStorageService");
  static readonly AuthService = Symbol("IAuthService");
  static readonly AccountService = Symbol("IAccountService");
  static readonly TransactionService = Symbol("ITransactionService");
  static readonly CategoryService = Symbol("ICategoryService");
}

const DIContainer = new Container();

DIContainer.bind<IWebStorage>(Types.WebStorageService).toConstantValue(new SessionStorage());
DIContainer.bind<IAuthService>(Types.AuthService).toConstantValue(new AuthService());
DIContainer.bind<IAccountService>(Types.AccountService).toConstantValue(new AccountService());
DIContainer.bind<ICategoryService>(Types.CategoryService).toConstantValue(new CategoryService());
DIContainer.bind<ITransactionService>(Types.TransactionService).toConstantValue(
  new TransactionService()
);

export function getService<T>(symbol: symbol): T {
  return DIContainer.get<T>(symbol);
}

export default DIContainer;
