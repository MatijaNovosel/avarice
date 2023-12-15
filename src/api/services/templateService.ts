import { api } from "src/boot/axios";
import { CreateTemplateModel, TemplateModel } from "src/models/template";
import { TRANSACTION_TYPE } from "src/utils/constants";
import ITemplateService from "../interfaces/templateService";

class TemplateService implements ITemplateService {
  async create(payload: CreateTemplateModel): Promise<void> {
    //
  }

  async delete(id: number): Promise<void> {
    //
  }

  async getAll(): Promise<TemplateModel[]> {
    const {
      data: {
        data: { getUserTemplates }
      }
    } = await api.post("", {
      query: `query {
        getUserTemplates {
          amount,
          id,
          description,
          createdAt,
          category {
            id,
            name,
            icon
          }
          account {
            name
          }
        }
      }`
    });
    return getUserTemplates.map((a: any) => ({
      ...a,
      createdAt: new Date(a.createdAt),
      account: a.account.name,
      transactionType: a.amount > 0 ? TRANSACTION_TYPE.INCOME : TRANSACTION_TYPE.EXPENSE
    }));
  }
}

export default TemplateService;
