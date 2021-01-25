import { TagPercentageRecord } from './../../models/payment-source';
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";
import { IPaymentSourceService } from "../interfaces/payment-source-service";
import { AccountLatestValue, PaymentSource } from "@/models/payment-source";

export class PaymentSourceService implements IPaymentSourceService {
  async getAllByUserId(appUserId: number): Promise<PaymentSource[]> {
    const { data: { data: { paymentSources } } } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          paymentSources(id: ${appUserId}) {
            id
            description
            currency
            icon
          }
        }
      `
    });
    return paymentSources;
  }

  async getLatestValues(appUserId: number): Promise<AccountLatestValue[]> {
    const { data: { data: { latestValues } } } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          latestValues(id: ${appUserId}) {
            amount
            description
            currency
            icon
          }
        }
      `
    });
    return latestValues;
  }

  async getTagPercentages(appUserId: number): Promise<TagPercentageRecord[]> {
    const { data: { data: { tagPercentages } } } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          tagPercentages(appUserId: ${appUserId}) {
            id
            description
            percentage
          }
        }
      `
    });
    return tagPercentages;
  }

  async create(): Promise<void> {
    //
  }
}
