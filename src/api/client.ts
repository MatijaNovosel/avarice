/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";
import axios, { AxiosError } from "axios";

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

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<AccountModel[]>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<AccountModel[]>(null as any);
  }

  account_Create(
    payload: CreateAccountModel,
    cancelToken?: CancelToken | undefined
  ): Promise<FileResponse | null> {
    let url_ = this.baseUrl + "/api/account";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_: AxiosRequestConfig = {
      data: content_,
      responseType: "blob",
      method: "POST",
      url: url_,
      headers: {
        "Content-Type": "application/json",
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
        return this.processAccount_Create(_response);
      });
  }

  protected processAccount_Create(response: AxiosResponse): Promise<FileResponse | null> {
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
        data: new Blob([response.data], { type: response.headers["content-type"] }),
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
    return Promise.resolve<FileResponse | null>(null as any);
  }

  account_GetExpenseAndIncomeInTimePeriod(
    id: number,
    cancelToken?: CancelToken | undefined
  ): Promise<AccountExpenseAndIncomeModel> {
    let url_ = this.baseUrl + "/api/account/expense-income/{id}";
    if (id === undefined || id === null) throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<AccountExpenseAndIncomeModel>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<AccountExpenseAndIncomeModel>(null as any);
  }

  account_GetAccountHistory(
    id: number,
    timePeriod: TimePeriodEnum | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<AccountHistoryModel[]> {
    let url_ = this.baseUrl + "/api/account/history/{id}?";
    if (id === undefined || id === null) throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    if (timePeriod === null) throw new Error("The parameter 'timePeriod' cannot be null.");
    else if (timePeriod !== undefined)
      url_ += "timePeriod=" + encodeURIComponent("" + timePeriod) + "&";
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<AccountHistoryModel[]>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<AccountHistoryModel[]>(null as any);
  }

  auth_Register(
    payload: RegistrationModel,
    cancelToken?: CancelToken | undefined
  ): Promise<RegisterResult> {
    let url_ = this.baseUrl + "/api/auth/register";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_: AxiosRequestConfig = {
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

  protected processAuth_Register(response: AxiosResponse): Promise<RegisterResult> {
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
      result200 = RegisterResult.fromJS(resultData200);
      return Promise.resolve<RegisterResult>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<RegisterResult>(null as any);
  }

  auth_Login(payload: LoginModel, cancelToken?: CancelToken | undefined): Promise<LoginResult> {
    let url_ = this.baseUrl + "/api/auth/login";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_: AxiosRequestConfig = {
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

  protected processAuth_Login(response: AxiosResponse): Promise<LoginResult> {
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
      result200 = LoginResult.fromJS(resultData200);
      return Promise.resolve<LoginResult>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<LoginResult>(null as any);
  }

  auth_Settings(cancelToken?: CancelToken | undefined): Promise<FileResponse | null> {
    let url_ = this.baseUrl + "/api/auth/settings";
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
        data: new Blob([response.data], { type: response.headers["content-type"] }),
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
    return Promise.resolve<FileResponse | null>(null as any);
  }

  category_GetUserCategories(cancelToken?: CancelToken | undefined): Promise<CategoryModel[]> {
    let url_ = this.baseUrl + "/api/category";
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<CategoryModel[]>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<CategoryModel[]>(null as any);
  }

  category_Create(
    newCategory: CreateCategoryModel,
    cancelToken?: CancelToken | undefined
  ): Promise<void> {
    let url_ = this.baseUrl + "/api/category";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(newCategory);

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<void>(null as any);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(null as any);
  }

  template_Add(payload: AddTemplateDto, cancelToken?: CancelToken | undefined): Promise<void> {
    let url_ = this.baseUrl + "/api/template";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_: AxiosRequestConfig = {
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
        return this.processTemplate_Add(_response);
      });
  }

  protected processTemplate_Add(response: AxiosResponse): Promise<void> {
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
      return Promise.resolve<void>(null as any);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(null as any);
  }

  template_Get(
    skip: number | undefined,
    take: number | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<PageableCollectionOfTemplateModel> {
    let url_ = this.baseUrl + "/api/template?";
    if (skip === null) throw new Error("The parameter 'skip' cannot be null.");
    else if (skip !== undefined) url_ += "skip=" + encodeURIComponent("" + skip) + "&";
    if (take === null) throw new Error("The parameter 'take' cannot be null.");
    else if (take !== undefined) url_ += "take=" + encodeURIComponent("" + take) + "&";
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
        return this.processTemplate_Get(_response);
      });
  }

  protected processTemplate_Get(
    response: AxiosResponse
  ): Promise<PageableCollectionOfTemplateModel> {
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
      result200 = PageableCollectionOfTemplateModel.fromJS(resultData200);
      return Promise.resolve<PageableCollectionOfTemplateModel>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<PageableCollectionOfTemplateModel>(null as any);
  }

  template_Delete(id: number, cancelToken?: CancelToken | undefined): Promise<void> {
    let url_ = this.baseUrl + "/api/template/{id}";
    if (id === undefined || id === null) throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
        return this.processTemplate_Delete(_response);
      });
  }

  protected processTemplate_Delete(response: AxiosResponse): Promise<void> {
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
      return Promise.resolve<void>(null as any);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(null as any);
  }

  transaction_Add(
    payload: AddTransactionDto,
    cancelToken?: CancelToken | undefined
  ): Promise<void> {
    let url_ = this.baseUrl + "/api/transaction";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<void>(null as any);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(null as any);
  }

  transaction_Get(
    skip: number | undefined,
    take: number | undefined,
    description: string | null | undefined,
    transactionType: string | null | undefined,
    categoryType: number | null | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<PageableCollectionOfTransactionModel> {
    let url_ = this.baseUrl + "/api/transaction?";
    if (skip === null) throw new Error("The parameter 'skip' cannot be null.");
    else if (skip !== undefined) url_ += "skip=" + encodeURIComponent("" + skip) + "&";
    if (take === null) throw new Error("The parameter 'take' cannot be null.");
    else if (take !== undefined) url_ += "take=" + encodeURIComponent("" + take) + "&";
    if (description !== undefined && description !== null)
      url_ += "description=" + encodeURIComponent("" + description) + "&";
    if (transactionType !== undefined && transactionType !== null)
      url_ += "transactionType=" + encodeURIComponent("" + transactionType) + "&";
    if (categoryType !== undefined && categoryType !== null)
      url_ += "categoryType=" + encodeURIComponent("" + categoryType) + "&";
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<PageableCollectionOfTransactionModel>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<PageableCollectionOfTransactionModel>(null as any);
  }

  transaction_Transfer(
    payload: AddTransferDto,
    cancelToken?: CancelToken | undefined
  ): Promise<void> {
    let url_ = this.baseUrl + "/api/transaction/transfer";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(payload);

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<void>(null as any);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(null as any);
  }

  transaction_Delete(id: number, cancelToken?: CancelToken | undefined): Promise<void> {
    let url_ = this.baseUrl + "/api/transaction/{id}";
    if (id === undefined || id === null) throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
      return Promise.resolve<void>(null as any);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(null as any);
  }

  transaction_Duplicate(id: number, cancelToken?: CancelToken | undefined): Promise<void> {
    let url_ = this.baseUrl + "/api/transaction/duplicate/{id}";
    if (id === undefined || id === null) throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
      method: "POST",
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
        return this.processTransaction_Duplicate(_response);
      });
  }

  protected processTransaction_Duplicate(response: AxiosResponse): Promise<void> {
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
      return Promise.resolve<void>(null as any);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<void>(null as any);
  }

  transaction_GetHeatmap(
    cancelToken?: CancelToken | undefined
  ): Promise<TransactionActivityHeatmapModel[]> {
    let url_ = this.baseUrl + "/api/transaction/heatmap";
    url_ = url_.replace(/[?&]$/, "");

    let options_: AxiosRequestConfig = {
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
        return this.processTransaction_GetHeatmap(_response);
      });
  }

  protected processTransaction_GetHeatmap(
    response: AxiosResponse
  ): Promise<TransactionActivityHeatmapModel[]> {
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
        for (let item of resultData200)
          result200!.push(TransactionActivityHeatmapModel.fromJS(item));
      } else {
        result200 = <any>null;
      }
      return Promise.resolve<TransactionActivityHeatmapModel[]>(result200);
    } else if (status !== 200 && status !== 204) {
      const _responseText = response.data;
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    }
    return Promise.resolve<TransactionActivityHeatmapModel[]>(null as any);
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

  override init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.currency = _data["currency"];
      this.name = _data["name"];
      this.balance = _data["balance"];
    }
  }

  static override fromJS(data: any): AccountModel {
    data = typeof data === "object" ? data : {};
    let result = new AccountModel();
    result.init(data);
    return result;
  }

  override toJSON(data?: any) {
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

export enum TimePeriodEnum {
  SevenDays = 1,
  ThirtyDays = 2,
  TwelveWeeks = 3,
  SixMonths = 4,
  OneYear = 5
}

export class CreateAccountModel implements ICreateAccountModel {
  name?: string | undefined;
  initialBalance!: number;

  constructor(data?: ICreateAccountModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.name = _data["name"];
      this.initialBalance = _data["initialBalance"];
    }
  }

  static fromJS(data: any): CreateAccountModel {
    data = typeof data === "object" ? data : {};
    let result = new CreateAccountModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["name"] = this.name;
    data["initialBalance"] = this.initialBalance;
    return data;
  }
}

export interface ICreateAccountModel {
  name?: string | undefined;
  initialBalance: number;
}

export class RegisterResult implements IRegisterResult {
  result!: boolean;
  errors?: string[] | undefined;

  constructor(data?: IRegisterResult) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.result = _data["result"];
      if (Array.isArray(_data["errors"])) {
        this.errors = [] as any;
        for (let item of _data["errors"]) this.errors!.push(item);
      }
    }
  }

  static fromJS(data: any): RegisterResult {
    data = typeof data === "object" ? data : {};
    let result = new RegisterResult();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["result"] = this.result;
    if (Array.isArray(this.errors)) {
      data["errors"] = [];
      for (let item of this.errors) data["errors"].push(item);
    }
    return data;
  }
}

export interface IRegisterResult {
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

export class LoginResult implements ILoginResult {
  token?: string | undefined;
  result!: boolean;
  errors?: string[] | undefined;

  constructor(data?: ILoginResult) {
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

  static fromJS(data: any): LoginResult {
    data = typeof data === "object" ? data : {};
    let result = new LoginResult();
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

export interface ILoginResult {
  token?: string | undefined;
  result: boolean;
  errors?: string[] | undefined;
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

  override init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.name = _data["name"];
      this.icon = _data["icon"];
      this.color = _data["color"];
      this.parent = _data["parent"] ? CategoryModel.fromJS(_data["parent"]) : <any>undefined;
    }
  }

  static override fromJS(data: any): CategoryModel {
    data = typeof data === "object" ? data : {};
    let result = new CategoryModel();
    result.init(data);
    return result;
  }

  override toJSON(data?: any) {
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
  parentId?: number | undefined;

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
      this.parentId = _data["parentId"];
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
    data["parentId"] = this.parentId;
    return data;
  }
}

export interface ICreateCategoryModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  parentId?: number | undefined;
}

export class AddTemplateDto implements IAddTemplateDto {
  amount!: number;
  description?: string | undefined;
  accountId!: number;
  categoryId!: number;
  accountToId?: number | undefined;
  createdAt?: Date | undefined;

  constructor(data?: IAddTemplateDto) {
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
      this.accountId = _data["accountId"];
      this.categoryId = _data["categoryId"];
      this.accountToId = _data["accountToId"];
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
    }
  }

  static fromJS(data: any): AddTemplateDto {
    data = typeof data === "object" ? data : {};
    let result = new AddTemplateDto();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["description"] = this.description;
    data["accountId"] = this.accountId;
    data["categoryId"] = this.categoryId;
    data["accountToId"] = this.accountToId;
    data["createdAt"] = this.createdAt ? this.createdAt.toISOString() : <any>undefined;
    return data;
  }
}

export interface IAddTemplateDto {
  amount: number;
  description?: string | undefined;
  accountId: number;
  categoryId: number;
  accountToId?: number | undefined;
  createdAt?: Date | undefined;
}

export class PageableCollectionOfTemplateModel implements IPageableCollectionOfTemplateModel {
  results?: TemplateModel[] | undefined;
  total!: number;

  constructor(data?: IPageableCollectionOfTemplateModel) {
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
        for (let item of _data["results"]) this.results!.push(TemplateModel.fromJS(item));
      }
      this.total = _data["total"];
    }
  }

  static fromJS(data: any): PageableCollectionOfTemplateModel {
    data = typeof data === "object" ? data : {};
    let result = new PageableCollectionOfTemplateModel();
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

export interface IPageableCollectionOfTemplateModel {
  results?: TemplateModel[] | undefined;
  total: number;
}

export class TemplateModel extends BaseModel implements ITemplateModel {
  amount?: number | undefined;
  description?: string | undefined;
  currency?: string | undefined;
  category?: TemplateCategoryModel | undefined;
  account?: string | undefined;

  constructor(data?: ITemplateModel) {
    super(data);
  }

  override init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.amount = _data["amount"];
      this.description = _data["description"];
      this.currency = _data["currency"];
      this.category = _data["category"]
        ? TemplateCategoryModel.fromJS(_data["category"])
        : <any>undefined;
      this.account = _data["account"];
    }
  }

  static override fromJS(data: any): TemplateModel {
    data = typeof data === "object" ? data : {};
    let result = new TemplateModel();
    result.init(data);
    return result;
  }

  override toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["description"] = this.description;
    data["currency"] = this.currency;
    data["category"] = this.category ? this.category.toJSON() : <any>undefined;
    data["account"] = this.account;
    super.toJSON(data);
    return data;
  }
}

export interface ITemplateModel extends IBaseModel {
  amount?: number | undefined;
  description?: string | undefined;
  currency?: string | undefined;
  category?: TemplateCategoryModel | undefined;
  account?: string | undefined;
}

export class TemplateCategoryModel implements ITemplateCategoryModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  parentName?: string | undefined;

  constructor(data?: ITemplateCategoryModel) {
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

  static fromJS(data: any): TemplateCategoryModel {
    data = typeof data === "object" ? data : {};
    let result = new TemplateCategoryModel();
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

export interface ITemplateCategoryModel {
  name?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
  parentName?: string | undefined;
}

export class AddTransactionDto implements IAddTransactionDto {
  amount!: number;
  description?: string | undefined;
  accountId!: number;
  categoryId!: number;
  createdAt?: Date | undefined;
  saveAsTemplate?: boolean | undefined;

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
      this.accountId = _data["accountId"];
      this.categoryId = _data["categoryId"];
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
      this.saveAsTemplate = _data["saveAsTemplate"];
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
    data["accountId"] = this.accountId;
    data["categoryId"] = this.categoryId;
    data["createdAt"] = this.createdAt ? this.createdAt.toISOString() : <any>undefined;
    data["saveAsTemplate"] = this.saveAsTemplate;
    return data;
  }
}

export interface IAddTransactionDto {
  amount: number;
  description?: string | undefined;
  accountId: number;
  categoryId: number;
  createdAt?: Date | undefined;
  saveAsTemplate?: boolean | undefined;
}

export class AddTransferDto implements IAddTransferDto {
  amount!: number;
  accountFromId!: number;
  accountToId!: number;
  createdAt?: Date | undefined;

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
    data["createdAt"] = this.createdAt ? this.createdAt.toISOString() : <any>undefined;
    return data;
  }
}

export interface IAddTransferDto {
  amount: number;
  accountFromId: number;
  accountToId: number;
  createdAt?: Date | undefined;
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
  transactionType?: string | undefined;
  category?: TransactionCategoryModel | undefined;
  account?: string | undefined;

  constructor(data?: ITransactionModel) {
    super(data);
  }

  override init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.amount = _data["amount"];
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
      this.description = _data["description"];
      this.currency = _data["currency"];
      this.transactionType = _data["transactionType"];
      this.category = _data["category"]
        ? TransactionCategoryModel.fromJS(_data["category"])
        : <any>undefined;
      this.account = _data["account"];
    }
  }

  static override fromJS(data: any): TransactionModel {
    data = typeof data === "object" ? data : {};
    let result = new TransactionModel();
    result.init(data);
    return result;
  }

  override toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["createdAt"] = this.createdAt ? this.createdAt.toISOString() : <any>undefined;
    data["description"] = this.description;
    data["currency"] = this.currency;
    data["transactionType"] = this.transactionType;
    data["category"] = this.category ? this.category.toJSON() : <any>undefined;
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
  transactionType?: string | undefined;
  category?: TransactionCategoryModel | undefined;
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

export class TransactionActivityHeatmapModel implements ITransactionActivityHeatmapModel {
  week!: number;
  value!: number;
  date!: Date;
  weekDay?: string | undefined;

  constructor(data?: ITransactionActivityHeatmapModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.week = _data["week"];
      this.value = _data["value"];
      this.date = _data["date"] ? new Date(_data["date"].toString()) : <any>undefined;
      this.weekDay = _data["weekDay"];
    }
  }

  static fromJS(data: any): TransactionActivityHeatmapModel {
    data = typeof data === "object" ? data : {};
    let result = new TransactionActivityHeatmapModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["week"] = this.week;
    data["value"] = this.value;
    data["date"] = this.date ? this.date.toISOString() : <any>undefined;
    data["weekDay"] = this.weekDay;
    return data;
  }
}

export interface ITransactionActivityHeatmapModel {
  week: number;
  value: number;
  date: Date;
  weekDay?: string | undefined;
}

export interface FileResponse {
  data: Blob;
  status: number;
  fileName?: string;
  headers?: { [name: string]: any };
}

export class ApiException extends Error {
  override message: string;
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
