import { IPaymentSourceService } from "@/interfaces/paymentSourceService";
import { AccountLatestValue, PaymentSource, TagPercentageRecord } from "@/models/payment-source";
import { formatGqlRequest } from "@/helpers";
import axios from "axios";

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
      responseParams: ["id", "description", "currency", "icon"]
    });

    const {
      data: {
        data: { paymentSources }
      }
    } = await axios.post("", {
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
      responseParams: ["id", "amount", "description", "currency", "icon"]
    });

    const {
      data: {
        data: { latestValues }
      }
    } = await axios.post("", {
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
      responseParams: ["id", "description", "percentage"]
    });

    const {
      data: {
        data: { tagPercentages }
      }
    } = await axios.post("", {
      query
    });

    return tagPercentages;
  }

  async create(): Promise<void> {
    //
  }
}
