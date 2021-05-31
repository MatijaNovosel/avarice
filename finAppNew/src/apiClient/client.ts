/* eslint-disable */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken
} from "axios";
import store from "@/store";
import Constants from "@/constants/constants";

export class Client {
  private instance: AxiosInstance;
  private baseUrl: string;
  protected jsonParseReviver:
    | ((key: string, value: any) => any)
    | undefined = undefined;

  constructor(baseUrl?: string, instance?: AxiosInstance) {
    const user = store.getters["user/data"];

    this.instance = instance
      ? instance
      : axios.create({
          headers: {
            Authorization: user ? `Bearer ${user.token}` : ""
          }
        });

    this.baseUrl =
      baseUrl !== undefined && baseUrl !== null
        ? baseUrl
        : Constants.API_BASE_URL;
  }

  account_LatestValues(
    userId: string | null | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<AccountLatestValueModel[]> {
    let url_ = this.baseUrl + "/api/account?";
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
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
        return this.processAccount_LatestValues(_response);
      });
  }

  protected processAccount_LatestValues(
    response: AxiosResponse
  ): Promise<AccountLatestValueModel[]> {
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
          result200!.push(AccountLatestValueModel.fromJS(item));
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
    return Promise.resolve<AccountLatestValueModel[]>(<any>null);
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

  history_Total(
    userId: string | null | undefined,
    from: Date | undefined,
    to: Date | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<HistoryTotalModel[]> {
    let url_ = this.baseUrl + "/api/history/total?";
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
    if (from === null) throw new Error("The parameter 'from' cannot be null.");
    else if (from !== undefined)
      url_ +=
        "from=" + encodeURIComponent(from ? "" + from.toJSON() : "") + "&";
    if (to === null) throw new Error("The parameter 'to' cannot be null.");
    else if (to !== undefined)
      url_ += "to=" + encodeURIComponent(to ? "" + to.toJSON() : "") + "&";
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
        return this.processHistory_Total(_response);
      });
  }

  protected processHistory_Total(
    response: AxiosResponse
  ): Promise<HistoryTotalModel[]> {
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
          result200!.push(HistoryTotalModel.fromJS(item));
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
    return Promise.resolve<HistoryTotalModel[]>(<any>null);
  }

  history_RecentDepositsAndWithdrawals(
    userId: string | null | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<RecentDepositsAndWithdrawalsModel> {
    let url_ = this.baseUrl + "/api/history/recent-deposits-and-withdrawals?";
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
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
        return this.processHistory_RecentDepositsAndWithdrawals(_response);
      });
  }

  protected processHistory_RecentDepositsAndWithdrawals(
    response: AxiosResponse
  ): Promise<RecentDepositsAndWithdrawalsModel> {
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
      result200 = RecentDepositsAndWithdrawalsModel.fromJS(resultData200);
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
    return Promise.resolve<RecentDepositsAndWithdrawalsModel>(<any>null);
  }

  history_DailyChanges(
    userId: string | null | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<DailyChangeModel[]> {
    let url_ = this.baseUrl + "/api/history/daily-changes?";
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
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
        return this.processHistory_DailyChanges(_response);
      });
  }

  protected processHistory_DailyChanges(
    response: AxiosResponse
  ): Promise<DailyChangeModel[]> {
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
          result200!.push(DailyChangeModel.fromJS(item));
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
    return Promise.resolve<DailyChangeModel[]>(<any>null);
  }

  history_LatestDate(
    userId: string | null | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<Date> {
    let url_ = this.baseUrl + "/api/history/latest-date?";
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
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
        return this.processHistory_LatestDate(_response);
      });
  }

  protected processHistory_LatestDate(response: AxiosResponse): Promise<Date> {
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
      result200 = resultData200
        ? new Date(resultData200.toString())
        : <any>null;
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
    return Promise.resolve<Date>(<any>null);
  }

  history_AccountHistoryTotal(
    accountId: number,
    userId: string | null | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<HistoryTotalModel[]> {
    let url_ = this.baseUrl + "/api/history/account-total/{accountId}?";
    if (accountId === undefined || accountId === null)
      throw new Error("The parameter 'accountId' must be defined.");
    url_ = url_.replace("{accountId}", encodeURIComponent("" + accountId));
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
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
        return this.processHistory_AccountHistoryTotal(_response);
      });
  }

  protected processHistory_AccountHistoryTotal(
    response: AxiosResponse
  ): Promise<HistoryTotalModel[]> {
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
          result200!.push(HistoryTotalModel.fromJS(item));
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
    return Promise.resolve<HistoryTotalModel[]>(<any>null);
  }

  history_AccountHistory(
    accountId: number,
    userId: string | null | undefined,
    from: Date | undefined,
    to: Date | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<HistoryTotalModel[]> {
    let url_ = this.baseUrl + "/api/history/account/{accountId}?";
    if (accountId === undefined || accountId === null)
      throw new Error("The parameter 'accountId' must be defined.");
    url_ = url_.replace("{accountId}", encodeURIComponent("" + accountId));
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
    if (from === null) throw new Error("The parameter 'from' cannot be null.");
    else if (from !== undefined)
      url_ +=
        "from=" + encodeURIComponent(from ? "" + from.toJSON() : "") + "&";
    if (to === null) throw new Error("The parameter 'to' cannot be null.");
    else if (to !== undefined)
      url_ += "to=" + encodeURIComponent(to ? "" + to.toJSON() : "") + "&";
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
        return this.processHistory_AccountHistory(_response);
      });
  }

  protected processHistory_AccountHistory(
    response: AxiosResponse
  ): Promise<HistoryTotalModel[]> {
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
          result200!.push(HistoryTotalModel.fromJS(item));
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
    return Promise.resolve<HistoryTotalModel[]>(<any>null);
  }

  tag_Get(
    userId: string | null | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<TagModel[]> {
    let url_ = this.baseUrl + "/api/tag?";
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
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
        return this.processTag_Get(_response);
      });
  }

  protected processTag_Get(response: AxiosResponse): Promise<TagModel[]> {
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
        for (let item of resultData200) result200!.push(TagModel.fromJS(item));
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
    return Promise.resolve<TagModel[]>(<any>null);
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
    userId: string | null | undefined,
    cancelToken?: CancelToken | undefined
  ): Promise<TransactionModel[]> {
    let url_ = this.baseUrl + "/api/transaction?";
    if (userId !== undefined && userId !== null)
      url_ += "userId=" + encodeURIComponent("" + userId) + "&";
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
  ): Promise<TransactionModel[]> {
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
          result200!.push(TransactionModel.fromJS(item));
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
    return Promise.resolve<TransactionModel[]>(<any>null);
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

export class AccountLatestValueModel extends BaseModel
  implements IAccountLatestValueModel {
  amount!: number;
  description?: string | undefined;
  currency?: string | undefined;
  icon?: string | undefined;

  constructor(data?: IAccountLatestValueModel) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.amount = _data["amount"];
      this.description = _data["description"];
      this.currency = _data["currency"];
      this.icon = _data["icon"];
    }
  }

  static fromJS(data: any): AccountLatestValueModel {
    data = typeof data === "object" ? data : {};
    let result = new AccountLatestValueModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["description"] = this.description;
    data["currency"] = this.currency;
    data["icon"] = this.icon;
    super.toJSON(data);
    return data;
  }
}

export interface IAccountLatestValueModel extends IBaseModel {
  amount: number;
  description?: string | undefined;
  currency?: string | undefined;
  icon?: string | undefined;
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

export class HistoryTotalModel implements IHistoryTotalModel {
  amount!: number;
  createdAt!: Date;

  constructor(data?: IHistoryTotalModel) {
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
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
    }
  }

  static fromJS(data: any): HistoryTotalModel {
    data = typeof data === "object" ? data : {};
    let result = new HistoryTotalModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["amount"] = this.amount;
    data["createdAt"] = this.createdAt
      ? this.createdAt.toISOString()
      : <any>undefined;
    return data;
  }
}

export interface IHistoryTotalModel {
  amount: number;
  createdAt: Date;
}

export class RecentDepositsAndWithdrawalsModel
  implements IRecentDepositsAndWithdrawalsModel {
  deposits!: number;
  withdrawals!: number;

  constructor(data?: IRecentDepositsAndWithdrawalsModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.deposits = _data["deposits"];
      this.withdrawals = _data["withdrawals"];
    }
  }

  static fromJS(data: any): RecentDepositsAndWithdrawalsModel {
    data = typeof data === "object" ? data : {};
    let result = new RecentDepositsAndWithdrawalsModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["deposits"] = this.deposits;
    data["withdrawals"] = this.withdrawals;
    return data;
  }
}

export interface IRecentDepositsAndWithdrawalsModel {
  deposits: number;
  withdrawals: number;
}

export class DailyChangeModel implements IDailyChangeModel {
  deposits!: number;
  withdrawals!: number;
  createdAt!: Date;

  constructor(data?: IDailyChangeModel) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.deposits = _data["deposits"];
      this.withdrawals = _data["withdrawals"];
      this.createdAt = _data["createdAt"]
        ? new Date(_data["createdAt"].toString())
        : <any>undefined;
    }
  }

  static fromJS(data: any): DailyChangeModel {
    data = typeof data === "object" ? data : {};
    let result = new DailyChangeModel();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["deposits"] = this.deposits;
    data["withdrawals"] = this.withdrawals;
    data["createdAt"] = this.createdAt
      ? this.createdAt.toISOString()
      : <any>undefined;
    return data;
  }
}

export interface IDailyChangeModel {
  deposits: number;
  withdrawals: number;
  createdAt: Date;
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

export class AddTransactionDto implements IAddTransactionDto {
  userId?: string | undefined;
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
      this.userId = _data["userId"];
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
    data["userId"] = this.userId;
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
  userId?: string | undefined;
  amount: number;
  description?: string | undefined;
  createdAt: Date;
  expense?: boolean | undefined;
  accountId?: number | undefined;
  tagIds?: number[] | undefined;
}

export class AddTransferDto implements IAddTransferDto {
  userId?: string | undefined;
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
      this.userId = _data["userId"];
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
    data["userId"] = this.userId;
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
  userId?: string | undefined;
  amount: number;
  accountFromId: number;
  accountToId: number;
  createdAt: Date;
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

export class AccountTransactionModel extends BaseModel
  implements IAccountTransactionModel {
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
