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
  protected jsonParseReviver:
    | ((key: string, value: any) => any)
    | undefined = undefined;

  constructor(baseUrl?: string, instance?: AxiosInstance) {
    this.instance = instance ? instance : axios.create();
    this.baseUrl =
      baseUrl !== undefined && baseUrl !== null
        ? baseUrl
        : "http://localhost:5000";
  }

  tag_Get(cancelToken?: CancelToken | undefined): Promise<TagModel[]> {
    let url_ = this.baseUrl + "/Tag";
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
    payload: TransactionModel,
    cancelToken?: CancelToken | undefined
  ): Promise<number> {
    let url_ = this.baseUrl + "/Transaction";
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
        return this.processTransaction_Add(_response);
      });
  }

  protected processTransaction_Add(response: AxiosResponse): Promise<number> {
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
      result200 = resultData200 !== undefined ? resultData200 : <any>null;
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
    return Promise.resolve<number>(<any>null);
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

export class TagModel extends BaseModel implements ITagModel {
  userId?: number | undefined;
  description?: string | undefined;

  constructor(data?: ITagModel) {
    super(data);
  }

  init(_data?: any) {
    super.init(_data);
    if (_data) {
      this.userId = _data["userId"];
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
    data["userId"] = this.userId;
    data["description"] = this.description;
    super.toJSON(data);
    return data;
  }
}

export interface ITagModel extends IBaseModel {
  userId?: number | undefined;
  description?: string | undefined;
}

export class TransactionModel implements ITransactionModel {
  userId!: number;
  amount!: number;
  description?: string | undefined;
  createdAt!: Date;
  expense!: boolean;
  accountId!: number;
  tagIds?: number[] | undefined;

  constructor(data?: ITransactionModel) {
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

  static fromJS(data: any): TransactionModel {
    data = typeof data === "object" ? data : {};
    let result = new TransactionModel();
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

export interface ITransactionModel {
  userId: number;
  amount: number;
  description?: string | undefined;
  createdAt: Date;
  expense: boolean;
  accountId: number;
  tagIds?: number[] | undefined;
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
