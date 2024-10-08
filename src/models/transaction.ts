export interface TransactionCategoryModel {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentName?: string;
}

export interface TransactionAccountModel {
  id: string;
  name: string;
}

export interface TransactionModel {
  id: string;
  amount: number;
  createdAt: Date;
  description: string;
  currency: string;
  transactionType: string;
  category: TransactionCategoryModel;
  account: TransactionAccountModel;
}

export interface CreateTransactionModel {
  amount: number;
  description: string;
  accountId: string;
  categoryId: string;
  saveAsTemplate: boolean;
}

export interface TransactionHeatmapModel {
  week: number;
  value: number;
  date: Date;
  weekDay?: string;
}

export interface TransferModel {
  accountFromId: string;
  accountToId: string;
  amount: number;
}

export interface EditTransactionModel {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
}
