import { Container } from "inversify";
import "reflect-metadata";
import IAuthService from "src/api/interfaces/authService";
import IWebStorage from "src/api/interfaces/webStorageService";
import AuthService from "src/api/services/authService";
import SessionStorage from "src/api/services/sessionStorageService";
import IAccountService from "./api/interfaces/accountService";
import ICategoryService from "./api/interfaces/categoryService";
import ITemplateService from "./api/interfaces/templateService";
import ITransactionService from "./api/interfaces/transactionService";
import AccountService from "./api/services/accountService";
import CategoryService from "./api/services/categoryService";
import TemplateService from "./api/services/templateService";
import TransactionService from "./api/services/transactionService";

export class Types {
  static readonly WebStorageService = Symbol("IWebStorageService");
  static readonly AuthService = Symbol("IAuthService");
  static readonly AccountService = Symbol("IAccountService");
  static readonly TransactionService = Symbol("ITransactionService");
  static readonly CategoryService = Symbol("ICategoryService");
  static readonly TemplateService = Symbol("ITemplateService");
}

const DIContainer = new Container();

DIContainer.bind<IWebStorage>(Types.WebStorageService).toConstantValue(new SessionStorage());
DIContainer.bind<IAuthService>(Types.AuthService).toConstantValue(new AuthService());
DIContainer.bind<IAccountService>(Types.AccountService).toConstantValue(new AccountService());
DIContainer.bind<ICategoryService>(Types.CategoryService).toConstantValue(new CategoryService());
DIContainer.bind<ITransactionService>(Types.TransactionService).toConstantValue(
  new TransactionService()
);
DIContainer.bind<ITemplateService>(Types.TemplateService).toConstantValue(new TemplateService());

export function getService<T>(symbol: symbol): T {
  return DIContainer.get<T>(symbol);
}

export default DIContainer;
