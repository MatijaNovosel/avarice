/* eslint-disable */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken
} from "axios";
import Constants from "src/utils/constants";
import { useStore } from "vuex";

export class Client {
  private instance: AxiosInstance;
  private baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined =
    undefined;

  constructor(baseUrl?: string, instance?: AxiosInstance) {
    const store = useStore();
    const user = store.getters["user/data"];

    this.instance = instance
      ? instance
      : axios.create({
          headers: {
            Authorization: user ? `Bearer ${user.token}` : ""
          }
        });

    this.baseUrl =
      baseUrl !== undefined && baseUrl !== null ? baseUrl : Constants.API_URL;
  }

  account_GetUserAccounts(
    cancelToken?: CancelToken | undefined
  ): Promise<Account[]> {
    let url_ = this.baseUrl + "/api/account";
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <AxiosRequestConfig>{
      method: "GET",
      url: url_,
      headers: {
        Accept: "application/json"
      },
      cancelToken
    };

    return this.instance
      .request(options_)
      .catch((_error: any) => {
        if (isAxiosError(_error) && _error.response) {
          return _error.response;
        } else {
          throw _error;
        }
      })
      .then((_response: AxiosResponse) => {
        return this.processAccount_GetUserAccounts(_response);
      });
  }

  protected processAccount_GetUserAccounts(
    response: AxiosResponse
  ): Promise<Account[]> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && typeof response.headers === "object") {
      for (let k in response.headers) {
        if (response.headers.hasOwnProperty(k)) {
          _headers[k] = response.headers[k];
        }
      }
    }
    if (status === 200) {
      const _responseText = response.data;
      let result200: any = null;
      let resultData200 = _responseText;
      if (Array.isArray(resultData200)) {
        result200 = [] as any;
        for (let item of resultData200) result200!.push(Account.fromJS(item));
      } else {
        result200 = <any>null;
      }
      return result200;
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<Account[]>(<any>null);
  }

  auth_Register(
    payload: RegistrationModel,
    cancelToken?: CancelToken | undefined
  ): Promise<AuthResultModel> {
    let url_ = this.baseUrl + "/api/auth/register";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_ = <AxiosRequestConfig>{
      data: content_,
      method: "POST",
      url: url_,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      cancelToken
    };

    return this.instance
      .request(options_)
      .catch((_error: any) => {
        if (isAxiosError(_error) && _error.response) {
          return _error.response;
        } else {
          throw _error;
        }
      })
      .then((_response: AxiosResponse) => {
        return this.processAuth_Register(_response);
      });
  }

  protected processAuth_Register(
    response: AxiosResponse
  ): Promise<AuthResultModel> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && typeof response.headers === "object") {
      for (let k in response.headers) {
        if (response.headers.hasOwnProperty(k)) {
          _headers[k] = response.headers[k];
        }
      }
    }
    if (status === 200) {
      const _responseText = response.data;
      let result200: any = null;
      let resultData200 = _responseText;
      result200 = AuthResultModel.fromJS(resultData200);
      return result200;
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<AuthResultModel>(<any>null);
  }

  auth_Login(
    payload: LoginModel,
    cancelToken?: CancelToken | undefined
  ): Promise<AuthResultModel> {
    let url_ = this.baseUrl + "/api/auth/login";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_ = <AxiosRequestConfig>{
      data: content_,
      method: "POST",
      url: url_,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      cancelToken
    };

    return this.instance
      .request(options_)
      .catch((_error: any) => {
        if (isAxiosError(_error) && _error.response) {
          return _error.response;
        } else {
          throw _error;
        }
      })
      .then((_response: AxiosResponse) => {
        return this.processAuth_Login(_response);
      });
  }

  protected processAuth_Login(
    response: AxiosResponse
  ): Promise<AuthResultModel> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && typeof response.headers === "object") {
      for (let k in response.headers) {
        if (response.headers.hasOwnProperty(k)) {
          _headers[k] = response.headers[k];
        }
      }
    }
    if (status === 200) {
      const _responseText = response.data;
      let result200: any = null;
      let resultData200 = _responseText;
      result200 = AuthResultModel.fromJS(resultData200);
      return result200;
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<AuthResultModel>(<any>null);
  }

  auth_Settings(
    cancelToken?: CancelToken | undefined
  ): Promise<FileResponse | null> {
    let url_ = this.baseUrl + "/api/auth/settings";
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <AxiosRequestConfig>{
      responseType: "blob",
      method: "GET",
      url: url_,
      headers: {
        Accept: "application/octet-stream"
      },
      cancelToken
    };

    return this.instance
      .request(options_)
      .catch((_error: any) => {
        if (isAxiosError(_error) && _error.response) {
          return _error.response;
        } else {
          throw _error;
        }
      })
      .then((_response: AxiosResponse) => {
        return this.processAuth_Settings(_response);
      });
  }

  protected processAuth_Settings(
    response: AxiosResponse
  ): Promise<FileResponse | null> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && typeof response.headers === "object") {
      for (let k in response.headers) {
        if (response.headers.hasOwnProperty(k)) {
          _headers[k] = response.headers[k];
        }
      }
    }
    if (status === 200 || status === 206) {
      const contentDisposition = response.headers
        ? response.headers["content-disposition"]
        : undefined;
      const fileNameMatch = contentDisposition
        ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition)
        : undefined;
      const fileName =
        fileNameMatch && fileNameMatch.length > 1
          ? fileNameMatch[1]
          : undefined;
      return Promise.resolve({
        fileName: fileName,
        status: status,
        data: response.data as Blob,
        headers: _headers
      });
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<FileResponse | null>(<any>null);
  }

  transaction_Add(
    payload: AddTransactionDto,
    cancelToken?: CancelToken | undefined
  ): Promise<void> {
    let url_ = this.baseUrl + "/api/transaction";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_ = <AxiosRequestConfig>{
      data: content_,
      method: "POST",
      url: url_,
      headers: {
        "Content-Type": "application/json"
      },
      cancelToken
    };

    return this.instance
      .request(options_)
      .catch((_error: any) => {
        if (isAxiosError(_error) && _error.response) {
          return _error.response;
        } else {
          throw _error;
        }
      })
      .then((_response: AxiosResponse) => {
        return this.processTransaction_Add(_response);
      });
  }

  protected processTransaction_Add(response: AxiosResponse): Promise<void> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && typeof response.headers === "object") {
      for (let k in response.headers) {
        if (response.headers.hasOwnProperty(k)) {
          _headers[k] = response.headers[k];
        }
      }
    }
    if (status === 200) {
      const _responseText = response.data;
      return Promise.resolve<void>(<any>null);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(<any>null);
  }

  transaction_Get(
    skip: number | undefined,
    take: number | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<PageableCollectionOfTransactionModel> {
    let url_ = this.baseUrl + "/api/transaction?";
    if (skip === null) throw new Error("The parameter 'skip' cannot be null.");
    else if (skip !== undefined)
      url_ += "skip=" + encodeURIComponent("" + skip) + "&";
    if (take === null) throw new Error("The parameter 'take' cannot be null.");
    else if (take !== undefined)
      url_ += "take=" + encodeURIComponent("" + take) + "&";
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <AxiosRequestConfig>{
      method: "GET",
      url: url_,
      headers: {
        Accept: "application/json"
      },
      cancelToken
    };

    return this.instance
      .request(options_)
      .catch((_error: any) => {
        if (isAxiosError(_error) && _error.response) {
          return _error.response;
        } else {
          throw _error;
        }
      })
      .then((_response: AxiosResponse) => {
        return this.processTransaction_Get(_response);
      });
  }

  protected processTransaction_Get(
    response: AxiosResponse
  ): Promise<PageableCollectionOfTransactionModel> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && typeof response.headers === "object") {
      for (let k in response.headers) {
        if (response.headers.hasOwnProperty(k)) {
          _headers[k] = response.headers[k];
        }
      }
    }
    if (status === 200) {
      const _responseText = response.data;
      let result200: any = null;
      let resultData200 = _responseText;
      result200 = PageableCollectionOfTransactionModel.fromJS(resultData200);
      return result200;
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<PageableCollectionOfTransactionModel>(<any>null);
  }

  transaction_Transfer(
    payload: AddTransferDto,
    cancelToken?: CancelToken | undefined
  ): Promise<void> {
    let url_ = this.baseUrl + "/api/transaction/transfer";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_ = <AxiosRequestConfig>{
      data: content_,
      method: "POST",
      url: url_,
      headers: {
        "Content-Type": "application/json"
      },
      cancelToken
    };

    return this.instance
      .request(options_)
      .catch((_error: any) => {
        if (isAxiosError(_error) && _error.response) {
          return _error.response;
        } else {
          throw _error;
        }
      })
      .then((_response: AxiosResponse) => {
        return this.processTransaction_Transfer(_response);
      });
  }

  protected processTransaction_Transfer(
    response: AxiosResponse
  ): Promise<void> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && typeof response.headers === "object") {
      for (let k in response.headers) {
        if (response.headers.hasOwnProperty(k)) {
          _headers[k] = response.headers[k];
        }
      }
    }
    if (status === 200) {
      const _responseText = response.data;
      return Promise.resolve<void>(<any>null);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(<any>null);
  }
}

export abstract class EntityBaseOfLong implements IEntityBaseOfLong {
  id!: number;

  constructor(data?: IEntityBaseOfLong) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.id = _data["id"];
    }
  }

  static fromJS(data: any): EntityBaseOfLong {
    data = typeof data === "object" ? data : {};
    throw new Error(
      "The abstract class 'EntityBaseOfLong' cannot be instantiated."
    );
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    return data;
  }
}

export interface IEntityBaseOfLong {
  id: number;
}

export abstract class Entity extends EntityBaseOfLong implements IEntity {
  constructor(data?: IEntity) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
  }

  static fromJS(data: any): Entity {
    data = typeof data === "object" ? data : {};
    throw new Error("The abstract class 'Entity' cannot be instantiated.");
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    super.toJSON(data);
    return data;
  }
}

export interface IEntity extends IEntityBaseOfLong {}

export class Account extends Entity implements IAccount {
  currency?: string | undefined;
  name?: string | undefined;
  balance!: number;
  userId?: string | undefined;
  user?: User | undefined;
  transactions?: Transaction[] | undefined;

  constructor(data?: IAccount) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.currency = _data["currency"];
      this.name = _data["name"];
      this.balance = _data["balance"];
      this.userId = _data["userId"];
      this.user = _data["user"] ? User.fromJS(_data["user"]) : <any>undefined;
      if (Array.isArray(_data["transactions"])) {
        this.transactions = [] as any;
        for (let item of _data["transactions"])
          this.transactions!.push(Transaction.fromJS(item));
      }
    }
  }

  static fromJS(data: any): Account {
    data = typeof data === "object" ? data : {};
    let result = new Account();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["currency"] = this.currency;
    data["name"] = this.name;
    data["balance"] = this.balance;
    data["userId"] = this.userId;
    data["user"] = this.user ? this.user.toJSON() : <any>undefined;
    if (Array.isArray(this.transactions)) {
      data["transactions"] = [];
      for (let item of this.transactions)
        data["transactions"].push(item.toJSON());
    }
    super.toJSON(data);
    return data;
  }
}

export interface IAccount extends IEntity {
  currency?: string | undefined;
  name?: string | undefined;
  balance: number;
  userId?: string | undefined;
  user?: User | undefined;
  transactions?: Transaction[] | undefined;
}

/** Represents a user in the identity system */
export class IdentityUserOfString implements IIdentityUserOfString {
  /** Gets or sets the primary key for this user. */
  id?: string | undefined;
  /** Gets or sets the user name for this user. */
  userName?: string | undefined;
  /** Gets or sets the normalized user name for this user. */
  normalizedUserName?: string | undefined;
  /** Gets or sets the email address for this user. */
  email?: string | undefined;
  /** Gets or sets the normalized email address for this user. */
  normalizedEmail?: string | undefined;
  /** Gets or sets a flag indicating if a user has confirmed their email address. */
  emailConfirmed!: boolean;
  /** Gets or sets a salted and hashed representation of the password for this user. */
  passwordHash?: string | undefined;
  /** A random value that must change whenever a users credentials change (password changed, login removed) */
  securityStamp?: string | undefined;
  /** A random value that must change whenever a user is persisted to the store */
  concurrencyStamp?: string | undefined;
  /** Gets or sets a telephone number for the user. */
  phoneNumber?: string | undefined;
  /** Gets or sets a flag indicating if a user has confirmed their telephone address. */
  phoneNumberConfirmed!: boolean;
  /** Gets or sets a flag indicating if two factor authentication is enabled for this user. */
  twoFactorEnabled!: boolean;
  /** Gets or sets the date and time, in UTC, when any user lockout ends. */
  lockoutEnd?: Date | undefined;
  /** Gets or sets a flag indicating if the user could be locked out. */
  lockoutEnabled!: boolean;
  /** Gets or sets the number of failed login attempts for the current user. */
  accessFailedCount!: number;

  constructor(data?: IIdentityUserOfString) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.id = _data["id"];
      this.userName = _data["userName"];
      this.normalizedUserName = _data["normalizedUserName"];
      this.email = _data["email"];
      this.normalizedEmail = _data["normalizedEmail"];
      this.emailConfirmed = _data["emailConfirmed"];
      this.passwordHash = _data["passwordHash"];
      this.securityStamp = _data["securityStamp"];
      this.concurrencyStamp = _data["concurrencyStamp"];
      this.phoneNumber = _data["phoneNumber"];
      this.phoneNumberConfirmed = _data["phoneNumberConfirmed"];
      this.twoFactorEnabled = _data["twoFactorEnabled"];
      this.lockoutEnd = _data["lockoutEnd"]
        ? new Date(_data["lockoutEnd"].toString())
        : <any>undefined;
      this.lockoutEnabled = _data["lockoutEnabled"];
      this.accessFailedCount = _data["accessFailedCount"];
    }
  }

  static fromJS(data: any): IdentityUserOfString {
    data = typeof data === "object" ? data : {};
    let result = new IdentityUserOfString();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["userName"] = this.userName;
    data["normalizedUserName"] = this.normalizedUserName;
    data["email"] = this.email;
    data["normalizedEmail"] = this.normalizedEmail;
    data["emailConfirmed"] = this.emailConfirmed;
    data["passwordHash"] = this.passwordHash;
    data["securityStamp"] = this.securityStamp;
    data["concurrencyStamp"] = this.concurrencyStamp;
    data["phoneNumber"] = this.phoneNumber;
    data["phoneNumberConfirmed"] = this.phoneNumberConfirmed;
    data["twoFactorEnabled"] = this.twoFactorEnabled;
    data["lockoutEnd"] = this.lockoutEnd
      ? this.lockoutEnd.toISOString()
      : <any>undefined;
    data["lockoutEnabled"] = this.lockoutEnabled;
    data["accessFailedCount"] = this.accessFailedCount;
    return data;
  }
}

/** Represents a user in the identity system */
export interface IIdentityUserOfString {
  /** Gets or sets the primary key for this user. */
  id?: string | undefined;
  /** Gets or sets the user name for this user. */
  userName?: string | undefined;
  /** Gets or sets the normalized user name for this user. */
  normalizedUserName?: string | undefined;
  /** Gets or sets the email address for this user. */
  email?: string | undefined;
  /** Gets or sets the normalized email address for this user. */
  normalizedEmail?: string | undefined;
  /** Gets or sets a flag indicating if a user has confirmed their email address. */
  emailConfirmed: boolean;
  /** Gets or sets a salted and hashed representation of the password for this user. */
  passwordHash?: string | undefined;
  /** A random value that must change whenever a users credentials change (password changed, login removed) */
  securityStamp?: string | undefined;
  /** A random value that must change whenever a user is persisted to the store */
  concurrencyStamp?: string | undefined;
  /** Gets or sets a telephone number for the user. */
  phoneNumber?: string | undefined;
  /** Gets or sets a flag indicating if a user has confirmed their telephone address. */
  phoneNumberConfirmed: boolean;
  /** Gets or sets a flag indicating if two factor authentication is enabled for this user. */
  twoFactorEnabled: boolean;
  /** Gets or sets the date and time, in UTC, when any user lockout ends. */
  lockoutEnd?: Date | undefined;
  /** Gets or sets a flag indicating if the user could be locked out. */
  lockoutEnabled: boolean;
  /** Gets or sets the number of failed login attempts for the current user. */
  accessFailedCount: number;
}

/** The default implementation of IdentityUser`1 which uses a string as a primary key. */
export class IdentityUser
  extends IdentityUserOfString
  implements IIdentityUser
{
  constructor(data?: IIdentityUser) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
  }

  static fromJS(data: any): IdentityUser {
    data = typeof data === "object" ? data : {};
    let result = new IdentityUser();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    super.toJSON(data);
    return data;
  }
}

/** The default implementation of IdentityUser`1 which uses a string as a primary key. */
export interface IIdentityUser extends IIdentityUserOfString {}

export class User extends IdentityUser implements IUser {
  accounts?: Account[] | undefined;
  transactions?: Transaction[] | undefined;
  categories?: Category[] | undefined;

  constructor(data?: IUser) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      if (Array.isArray(_data["accounts"])) {
        this.accounts = [] as any;
        for (let item of _data["accounts"])
          this.accounts!.push(Account.fromJS(item));
      }
      if (Array.isArray(_data["transactions"])) {
        this.transactions = [] as any;
        for (let item of _data["transactions"])
          this.transactions!.push(Transaction.fromJS(item));
      }
      if (Array.isArray(_data["categories"])) {
        this.categories = [] as any;
        for (let item of _data["categories"])
          this.categories!.push(Category.fromJS(item));
      }
    }
  }

  static fromJS(data: any): User {
    data = typeof data === "object" ? data : {};
    let result = new User();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    if (Array.isArray(this.accounts)) {
      data["accounts"] = [];
      for (let item of this.accounts) data["accounts"].push(item.toJSON());
    }
    if (Array.isArray(this.transactions)) {
      data["transactions"] = [];
      for (let item of this.transactions)
        data["transactions"].push(item.toJSON());
    }
    if (Array.isArray(this.categories)) {
      data["categories"] = [];
      for (let item of this.categories) data["categories"].push(item.toJSON());
    }
    super.toJSON(data);
    return data;
  }
}

export interface IUser extends IIdentityUser {
  accounts?: Account[] | undefined;
  transactions?: Transaction[] | undefined;
  categories?: Category[] | undefined;
}

export class Transaction extends Entity implements ITransaction {
  amount?: number | undefined;
  description?: string | undefined;
  transactionType?: string | undefined;
  accountId?: number | undefined;
  categoryId?: number | undefined;
  userId?: string | undefined;
  account?: Account | undefined;
  category?: Category | undefined;
  user?: User | undefined;

  constructor(data?: ITransaction) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.amount = _data["amount"];
      this.description = _data["description"];
      this.transactionType = _data["transactionType"];
      this.accountId = _data["accountId"];
      this.categoryId = _data["categoryId"];
      this.userId = _data["userId"];
      this.account = _data["account"]
        ? Account.fromJS(_data["account"])
        : <any>undefined;
      this.category = _data["category"]
        ? Category.fromJS(_data["category"])
        : <any>undefined;
      this.user = _data["user"] ? User.fromJS(_data["user"]) : <any>undefined;
    }
  }

  static fromJS(data: any): Transaction {
    data = typeof data === "object" ? data : {};
    let result = new Transaction();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["description"] = this.description;
    data["transactionType"] = this.transactionType;
    data["accountId"] = this.accountId;
    data["categoryId"] = this.categoryId;
    data["userId"] = this.userId;
    data["account"] = this.account ? this.account.toJSON() : <any>undefined;
    data["category"] = this.category ? this.category.toJSON() : <any>undefined;
    data["user"] = this.user ? this.user.toJSON() : <any>undefined;
    super.toJSON(data);
    return data;
  }
}

export interface ITransaction extends IEntity {
  amount?: number | undefined;
  description?: string | undefined;
  transactionType?: string | undefined;
  accountId?: number | undefined;
  categoryId?: number | undefined;
  userId?: string | undefined;
  account?: Account | undefined;
  category?: Category | undefined;
  user?: User | undefined;
}

export class Category extends Entity implements ICategory {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  userId?: string | undefined;
  user?: User | undefined;
  transactions?: Transaction[] | undefined;

  constructor(data?: ICategory) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.name = _data["name"];
      this.icon = _data["icon"];
      this.color = _data["color"];
      this.userId = _data["userId"];
      this.user = _data["user"] ? User.fromJS(_data["user"]) : <any>undefined;
      if (Array.isArray(_data["transactions"])) {
        this.transactions = [] as any;
        for (let item of _data["transactions"])
          this.transactions!.push(Transaction.fromJS(item));
      }
    }
  }

  static fromJS(data: any): Category {
    data = typeof data === "object" ? data : {};
    let result = new Category();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["name"] = this.name;
    data["icon"] = this.icon;
    data["color"] = this.color;
    data["userId"] = this.userId;
    data["user"] = this.user ? this.user.toJSON() : <any>undefined;
    if (Array.isArray(this.transactions)) {
      data["transactions"] = [];
      for (let item of this.transactions)
        data["transactions"].push(item.toJSON());
    }
    super.toJSON(data);
    return data;
  }
}

export interface ICategory extends IEntity {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  userId?: string | undefined;
  user?: User | undefined;
  transactions?: Transaction[] | undefined;
}

export class AuthResultModel implements IAuthResultModel {
  token?: string | undefined;
  result!: boolean;
  errors?: string[] | undefined;

  constructor(data?: IAuthResultModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.token = _data["token"];
      this.result = _data["result"];
      if (Array.isArray(_data["errors"])) {
        this.errors = [] as any;
        for (let item of _data["errors"]) this.errors!.push(item);
      }
    }
  }

  static fromJS(data: any): AuthResultModel {
    data = typeof data === "object" ? data : {};
    let result = new AuthResultModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["token"] = this.token;
    data["result"] = this.result;
    if (Array.isArray(this.errors)) {
      data["errors"] = [];
      for (let item of this.errors) data["errors"].push(item);
    }
    return data;
  }
}

export interface IAuthResultModel {
  token?: string | undefined;
  result: boolean;
  errors?: string[] | undefined;
}

export class RegistrationModel implements IRegistrationModel {
  username!: string;
  email!: string;
  password!: string;

  constructor(data?: IRegistrationModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.username = _data["username"];
      this.email = _data["email"];
      this.password = _data["password"];
    }
  }

  static fromJS(data: any): RegistrationModel {
    data = typeof data === "object" ? data : {};
    let result = new RegistrationModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["username"] = this.username;
    data["email"] = this.email;
    data["password"] = this.password;
    return data;
  }
}

export interface IRegistrationModel {
  username: string;
  email: string;
  password: string;
}

export class LoginModel implements ILoginModel {
  email?: string | undefined;
  password?: string | undefined;

  constructor(data?: ILoginModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.email = _data["email"];
      this.password = _data["password"];
    }
  }

  static fromJS(data: any): LoginModel {
    data = typeof data === "object" ? data : {};
    let result = new LoginModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["email"] = this.email;
    data["password"] = this.password;
    return data;
  }
}

export interface ILoginModel {
  email?: string | undefined;
  password?: string | undefined;
}

export class AddTransactionDto implements IAddTransactionDto {
  amount!: number;
  description?: string | undefined;
  createdAt!: Date;
  expense?: boolean | undefined;
  accountId?: number | undefined;
  tagIds?: number[] | undefined;

  constructor(data?: IAddTransactionDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.amount = _data["amount"];
      this.description = _data["description"];
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
      this.expense = _data["expense"];
      this.accountId = _data["accountId"];
      if (Array.isArray(_data["tagIds"])) {
        this.tagIds = [] as any;
        for (let item of _data["tagIds"]) this.tagIds!.push(item);
      }
    }
  }

  static fromJS(data: any): AddTransactionDto {
    data = typeof data === "object" ? data : {};
    let result = new AddTransactionDto();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["description"] = this.description;
    data["createdAt"] = this.createdAt
      ? this.createdAt.toISOString()
      : <any>undefined;
    data["expense"] = this.expense;
    data["accountId"] = this.accountId;
    if (Array.isArray(this.tagIds)) {
      data["tagIds"] = [];
      for (let item of this.tagIds) data["tagIds"].push(item);
    }
    return data;
  }
}

export interface IAddTransactionDto {
  amount: number;
  description?: string | undefined;
  createdAt: Date;
  expense?: boolean | undefined;
  accountId?: number | undefined;
  tagIds?: number[] | undefined;
}

export class AddTransferDto implements IAddTransferDto {
  amount!: number;
  accountFromId!: number;
  accountToId!: number;
  createdAt!: Date;

  constructor(data?: IAddTransferDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.amount = _data["amount"];
      this.accountFromId = _data["accountFromId"];
      this.accountToId = _data["accountToId"];
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
    }
  }

  static fromJS(data: any): AddTransferDto {
    data = typeof data === "object" ? data : {};
    let result = new AddTransferDto();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["accountFromId"] = this.accountFromId;
    data["accountToId"] = this.accountToId;
    data["createdAt"] = this.createdAt
      ? this.createdAt.toISOString()
      : <any>undefined;
    return data;
  }
}

export interface IAddTransferDto {
  amount: number;
  accountFromId: number;
  accountToId: number;
  createdAt: Date;
}

export class PageableCollectionOfTransactionModel
  implements IPageableCollectionOfTransactionModel
{
  results?: TransactionModel[] | undefined;
  total!: number;

  constructor(data?: IPageableCollectionOfTransactionModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      if (Array.isArray(_data["results"])) {
        this.results = [] as any;
        for (let item of _data["results"])
          this.results!.push(TransactionModel.fromJS(item));
      }
      this.total = _data["total"];
    }
  }

  static fromJS(data: any): PageableCollectionOfTransactionModel {
    data = typeof data === "object" ? data : {};
    let result = new PageableCollectionOfTransactionModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    if (Array.isArray(this.results)) {
      data["results"] = [];
      for (let item of this.results) data["results"].push(item.toJSON());
    }
    data["total"] = this.total;
    return data;
  }
}

export interface IPageableCollectionOfTransactionModel {
  results?: TransactionModel[] | undefined;
  total: number;
}

export class BaseModel implements IBaseModel {
  id!: number;

  constructor(data?: IBaseModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.id = _data["id"];
    }
  }

  static fromJS(data: any): BaseModel {
    data = typeof data === "object" ? data : {};
    let result = new BaseModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    return data;
  }
}

export interface IBaseModel {
  id: number;
}

export class TransactionModel extends BaseModel implements ITransactionModel {
  amount?: number | undefined;
  createdAt!: Date;
  description?: string | undefined;
  expense?: boolean | undefined;
  userId?: string | undefined;
  transfer?: boolean | undefined;
  tags?: TagModel[] | undefined;
  account?: AccountTransactionModel | undefined;

  constructor(data?: ITransactionModel) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.amount = _data["amount"];
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
      this.description = _data["description"];
      this.expense = _data["expense"];
      this.userId = _data["userId"];
      this.transfer = _data["transfer"];
      if (Array.isArray(_data["tags"])) {
        this.tags = [] as any;
        for (let item of _data["tags"]) this.tags!.push(TagModel.fromJS(item));
      }
      this.account = _data["account"]
        ? AccountTransactionModel.fromJS(_data["account"])
        : <any>undefined;
    }
  }

  static fromJS(data: any): TransactionModel {
    data = typeof data === "object" ? data : {};
    let result = new TransactionModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["createdAt"] = this.createdAt
      ? this.createdAt.toISOString()
      : <any>undefined;
    data["description"] = this.description;
    data["expense"] = this.expense;
    data["userId"] = this.userId;
    data["transfer"] = this.transfer;
    if (Array.isArray(this.tags)) {
      data["tags"] = [];
      for (let item of this.tags) data["tags"].push(item.toJSON());
    }
    data["account"] = this.account ? this.account.toJSON() : <any>undefined;
    super.toJSON(data);
    return data;
  }
}

export interface ITransactionModel extends IBaseModel {
  amount?: number | undefined;
  createdAt: Date;
  description?: string | undefined;
  expense?: boolean | undefined;
  userId?: string | undefined;
  transfer?: boolean | undefined;
  tags?: TagModel[] | undefined;
  account?: AccountTransactionModel | undefined;
}

export class TagModel extends BaseModel implements ITagModel {
  description?: string | undefined;

  constructor(data?: ITagModel) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.description = _data["description"];
    }
  }

  static fromJS(data: any): TagModel {
    data = typeof data === "object" ? data : {};
    let result = new TagModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["description"] = this.description;
    super.toJSON(data);
    return data;
  }
}

export interface ITagModel extends IBaseModel {
  description?: string | undefined;
}

export class AccountTransactionModel
  extends BaseModel
  implements IAccountTransactionModel
{
  description?: string | undefined;

  constructor(data?: IAccountTransactionModel) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.description = _data["description"];
    }
  }

  static fromJS(data: any): AccountTransactionModel {
    data = typeof data === "object" ? data : {};
    let result = new AccountTransactionModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["description"] = this.description;
    super.toJSON(data);
    return data;
  }
}

export interface IAccountTransactionModel extends IBaseModel {
  description?: string | undefined;
}

export interface FileResponse {
  data: Blob;
  status: number;
  fileName?: string;
  headers?: { [name: string]: any };
}

export class ApiException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any };
  result: any;

  constructor(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result: any
  ) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }
}

function throwException(
  message: string,
  status: number,
  response: string,
  headers: { [key: string]: any },
  result?: any
): any {
  if (result !== null && result !== undefined) throw result;
  else throw new ApiException(message, status, response, headers, null);
}

function isAxiosError(obj: any | undefined): obj is AxiosError {
  return obj && obj.isAxiosError === true;
}
