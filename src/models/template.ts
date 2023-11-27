import { TransactionCategoryModel } from "./transaction";

export interface TemplateModel {
  id: string;
  amount: number;
  createdAt: Date;
  description: string;
  currency: string;
  transactionType: string;
  category: TransactionCategoryModel;
  account: string;
}
