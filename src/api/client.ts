/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.11.1.0 (NJsonSchema v10.4.3.0 (Newtonsoft.Json v12.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken
} from "axios";

export class Client {
  private instance: AxiosInstance;
  private baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(baseUrl?: string, instance?: AxiosInstance) {
    this.instance = instance ? instance : axios.create();
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "https://localhost:5001";
  }

  account_GetUserAccounts(cancelToken?: CancelToken | undefined): Promise<AccountModel[]> {
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

  protected processAccount_GetUserAccounts(response: AxiosResponse): Promise<AccountModel[]> {
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
        for (let item of resultData200) result200!.push(AccountModel.fromJS(item));
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
    return Promise.resolve<AccountModel[]>(<any>null);
  }

  account_GetExpenseAndIncomeInTimePeriod(
    id: number,
    cancelToken?: CancelToken | undefined
  ): Promise<AccountExpenseAndIncomeModel> {
    let url_ = this.baseUrl + "/api/account/expense-income/{id}";
    if (id === undefined || id === null) throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
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
        return this.processAccount_GetExpenseAndIncomeInTimePeriod(_response);
      });
  }

  protected processAccount_GetExpenseAndIncomeInTimePeriod(
    response: AxiosResponse
  ): Promise<AccountExpenseAndIncomeModel> {
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
      result200 = AccountExpenseAndIncomeModel.fromJS(resultData200);
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
    return Promise.resolve<AccountExpenseAndIncomeModel>(<any>null);
  }

  account_GetAccountHistory(
    id: number,
    cancelToken?: CancelToken | undefined
  ): Promise<AccountHistoryModel[]> {
    let url_ = this.baseUrl + "/api/account/history/{id}";
    if (id === undefined || id === null) throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
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
        return this.processAccount_GetAccountHistory(_response);
      });
  }

  protected processAccount_GetAccountHistory(
    response: AxiosResponse
  ): Promise<AccountHistoryModel[]> {
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
        for (let item of resultData200) result200!.push(AccountHistoryModel.fromJS(item));
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
    return Promise.resolve<AccountHistoryModel[]>(<any>null);
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

  protected processAuth_Register(response: AxiosResponse): Promise<AuthResultModel> {
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

  auth_Login(payload: LoginModel, cancelToken?: CancelToken | undefined): Promise<AuthResultModel> {
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

  protected processAuth_Login(response: AxiosResponse): Promise<AuthResultModel> {
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

  auth_Settings(cancelToken?: CancelToken | undefined): Promise<FileResponse | null> {
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

  protected processAuth_Settings(response: AxiosResponse): Promise<FileResponse | null> {
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
      const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
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

  category_GetUserCategories(cancelToken?: CancelToken | undefined): Promise<CategoryModel[]> {
    let url_ = this.baseUrl + "/api/category";
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
        return this.processCategory_GetUserCategories(_response);
      });
  }

  protected processCategory_GetUserCategories(response: AxiosResponse): Promise<CategoryModel[]> {
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
        for (let item of resultData200) result200!.push(CategoryModel.fromJS(item));
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
    return Promise.resolve<CategoryModel[]>(<any>null);
  }

  category_Create(
    newCategory: CreateCategoryModel,
    cancelToken?: CancelToken | undefined
  ): Promise<void> {
    let url_ = this.baseUrl + "/api/category";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(newCategory);

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
        return this.processCategory_Create(_response);
      });
  }

  protected processCategory_Create(response: AxiosResponse): Promise<void> {
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
    else if (skip !== undefined) url_ += "skip=" + encodeURIComponent("" + skip) + "&";
    if (take === null) throw new Error("The parameter 'take' cannot be null.");
    else if (take !== undefined) url_ += "take=" + encodeURIComponent("" + take) + "&";
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

  protected processTransaction_Transfer(response: AxiosResponse): Promise<void> {
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

  transaction_Delete(id: number, cancelToken?: CancelToken | undefined): Promise<void> {
    let url_ = this.baseUrl + "/api/transaction/{id}";
    if (id === undefined || id === null) throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <AxiosRequestConfig>{
      method: "DELETE",
      url: url_,
      headers: {},
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
        return this.processTransaction_Delete(_response);
      });
  }

  protected processTransaction_Delete(response: AxiosResponse): Promise<void> {
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

export class BaseModel implements IBaseModel {
  id!: number;

  constructor(data?: IBaseModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
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

export class AccountModel extends BaseModel implements IAccountModel {
  currency?: string | undefined;
  name?: string | undefined;
  balance!: number;

  constructor(data?: IAccountModel) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.currency = _data["currency"];
      this.name = _data["name"];
      this.balance = _data["balance"];
    }
  }

  static fromJS(data: any): AccountModel {
    data = typeof data === "object" ? data : {};
    let result = new AccountModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["currency"] = this.currency;
    data["name"] = this.name;
    data["balance"] = this.balance;
    super.toJSON(data);
    return data;
  }
}

export interface IAccountModel extends IBaseModel {
  currency?: string | undefined;
  name?: string | undefined;
  balance: number;
}

export class AccountExpenseAndIncomeModel implements IAccountExpenseAndIncomeModel {
  expense!: number;
  income!: number;

  constructor(data?: IAccountExpenseAndIncomeModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.expense = _data["expense"];
      this.income = _data["income"];
    }
  }

  static fromJS(data: any): AccountExpenseAndIncomeModel {
    data = typeof data === "object" ? data : {};
    let result = new AccountExpenseAndIncomeModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["expense"] = this.expense;
    data["income"] = this.income;
    return data;
  }
}

export interface IAccountExpenseAndIncomeModel {
  expense: number;
  income: number;
}

export class AccountHistoryModel implements IAccountHistoryModel {
  date!: Date;
  amount!: number;

  constructor(data?: IAccountHistoryModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.date = _data["date"] ? new Date(_data["date"].toString()) : <any>undefined;
      this.amount = _data["amount"];
    }
  }

  static fromJS(data: any): AccountHistoryModel {
    data = typeof data === "object" ? data : {};
    let result = new AccountHistoryModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["date"] = this.date ? this.date.toISOString() : <any>undefined;
    data["amount"] = this.amount;
    return data;
  }
}

export interface IAccountHistoryModel {
  date: Date;
  amount: number;
}

export class AuthResultModel implements IAuthResultModel {
  token?: string | undefined;
  result!: boolean;
  errors?: string[] | undefined;

  constructor(data?: IAuthResultModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
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
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
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
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
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

export class CategoryModel extends BaseModel implements ICategoryModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  parent?: CategoryModel | undefined;

  constructor(data?: ICategoryModel) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.name = _data["name"];
      this.icon = _data["icon"];
      this.color = _data["color"];
      this.parent = _data["parent"] ? CategoryModel.fromJS(_data["parent"]) : <any>undefined;
    }
  }

  static fromJS(data: any): CategoryModel {
    data = typeof data === "object" ? data : {};
    let result = new CategoryModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["name"] = this.name;
    data["icon"] = this.icon;
    data["color"] = this.color;
    data["parent"] = this.parent ? this.parent.toJSON() : <any>undefined;
    super.toJSON(data);
    return data;
  }
}

export interface ICategoryModel extends IBaseModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  parent?: CategoryModel | undefined;
}

export class CreateCategoryModel implements ICreateCategoryModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;

  constructor(data?: ICreateCategoryModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.name = _data["name"];
      this.icon = _data["icon"];
      this.color = _data["color"];
    }
  }

  static fromJS(data: any): CreateCategoryModel {
    data = typeof data === "object" ? data : {};
    let result = new CreateCategoryModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["name"] = this.name;
    data["icon"] = this.icon;
    data["color"] = this.color;
    return data;
  }
}

export interface ICreateCategoryModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
}

export class AddTransactionDto implements IAddTransactionDto {
  amount!: number;
  description?: string | undefined;
  transactionType?: string | undefined;
  accountId!: number;
  categoryId!: number;

  constructor(data?: IAddTransactionDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.amount = _data["amount"];
      this.description = _data["description"];
      this.transactionType = _data["transactionType"];
      this.accountId = _data["accountId"];
      this.categoryId = _data["categoryId"];
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
    data["transactionType"] = this.transactionType;
    data["accountId"] = this.accountId;
    data["categoryId"] = this.categoryId;
    return data;
  }
}

export interface IAddTransactionDto {
  amount: number;
  description?: string | undefined;
  transactionType?: string | undefined;
  accountId: number;
  categoryId: number;
}

export class AddTransferDto implements IAddTransferDto {
  amount!: number;
  accountFromId!: number;
  accountToId!: number;

  constructor(data?: IAddTransferDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.amount = _data["amount"];
      this.accountFromId = _data["accountFromId"];
      this.accountToId = _data["accountToId"];
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
    return data;
  }
}

export interface IAddTransferDto {
  amount: number;
  accountFromId: number;
  accountToId: number;
}

export class PageableCollectionOfTransactionModel implements IPageableCollectionOfTransactionModel {
  results?: TransactionModel[] | undefined;
  total!: number;

  constructor(data?: IPageableCollectionOfTransactionModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      if (Array.isArray(_data["results"])) {
        this.results = [] as any;
        for (let item of _data["results"]) this.results!.push(TransactionModel.fromJS(item));
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

export class TransactionModel extends BaseModel implements ITransactionModel {
  amount?: number | undefined;
  createdAt!: Date;
  description?: string | undefined;
  currency?: string | undefined;
  category?: TransactionCategoryModel | undefined;
  transactionType?: string | undefined;
  account?: string | undefined;

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
      this.currency = _data["currency"];
      this.category = _data["category"]
        ? TransactionCategoryModel.fromJS(_data["category"])
        : <any>undefined;
      this.transactionType = _data["transactionType"];
      this.account = _data["account"];
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
    data["createdAt"] = this.createdAt ? this.createdAt.toISOString() : <any>undefined;
    data["description"] = this.description;
    data["currency"] = this.currency;
    data["category"] = this.category ? this.category.toJSON() : <any>undefined;
    data["transactionType"] = this.transactionType;
    data["account"] = this.account;
    super.toJSON(data);
    return data;
  }
}

export interface ITransactionModel extends IBaseModel {
  amount?: number | undefined;
  createdAt: Date;
  description?: string | undefined;
  currency?: string | undefined;
  category?: TransactionCategoryModel | undefined;
  transactionType?: string | undefined;
  account?: string | undefined;
}

export class TransactionCategoryModel implements ITransactionCategoryModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  parentName?: string | undefined;

  constructor(data?: ITransactionCategoryModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.name = _data["name"];
      this.icon = _data["icon"];
      this.color = _data["color"];
      this.parentName = _data["parentName"];
    }
  }

  static fromJS(data: any): TransactionCategoryModel {
    data = typeof data === "object" ? data : {};
    let result = new TransactionCategoryModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["name"] = this.name;
    data["icon"] = this.icon;
    data["color"] = this.color;
    data["parentName"] = this.parentName;
    return data;
  }
}

export interface ITransactionCategoryModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  parentName?: string | undefined;
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
