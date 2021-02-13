import { TagPercentageRecord } from "./../../models/payment-source";
import axiosInstance from "../axios-instance";
import { IPaymentSourceService } from "../interfaces/payment-source-service";
import { AccountLatestValue, PaymentSource } from "@/models/payment-source";
import { formatGqlRequest } from "@/helpers/helpers";

export class PaymentSourceService implements IPaymentSourceService {
  async getAllByUserId(appUserId: number): Promise<PaymentSource[]> {
    const query = formatGqlRequest({
      type: "query",
      name: "paymentSources",
      requestParams: [
        {
          name: "id",
          value: appUserId
        }
      ],
      responseParams: [
        {
          name: "id"
        },
        {
          name: "description"
        },
        {
          name: "currency"
        },
        {
          name: "icon"
        }
      ]
    });

    const {
      data: {
        data: { paymentSources }
      }
    } = await axiosInstance.post("", {
      query
    });

    return paymentSources;
  }

  async getLatestValues(appUserId: number): Promise<AccountLatestValue[]> {
    const query = formatGqlRequest({
      type: "query",
      name: "latestValues",
      requestParams: [
        {
          name: "id",
          value: appUserId
        }
      ],
      responseParams: [
        {
          name: "amount"
        },
        {
          name: "description"
        },
        {
          name: "currency"
        },
        {
          name: "icon"
        }
      ]
    });

    const {
      data: {
        data: { latestValues }
      }
    } = await axiosInstance.post("", {
      query
    });

    return latestValues;
  }

  async getTagPercentages(appUserId: number): Promise<TagPercentageRecord[]> {
    const query = formatGqlRequest({
      type: "query",
      name: "tagPercentages",
      requestParams: [
        {
          name: "appUserId",
          value: appUserId
        }
      ],
      responseParams: [
        {
          name: "id"
        },
        {
          name: "description"
        },
        {
          name: "percentage"
        }
      ]
    });

    const {
      data: {
        data: { tagPercentages }
      }
    } = await axiosInstance.post("", {
      query
    });

    return tagPercentages;
  }

  async create(): Promise<void> {
    //
  }
}
