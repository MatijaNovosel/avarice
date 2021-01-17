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

  async create(): Promise<void> {
    //
  }
}
