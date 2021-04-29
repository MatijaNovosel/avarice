import { ItemCollection } from "@/models/item-collection";
import {
  CreateFinancialChangeItemDto,
  FinancialChangeItem,
  CreateTransferDto,
  DailyChange,
  RecentDepositsAndWithdrawals,
  TransactionAmountRange,
  DailyChangeDto,
  LatestDate
} from "@/models/change-item";
import { AccountHistoryRecord, FinancialHistory } from "@/models/history-item";
import { ITransactionService } from "@/interfaces/transactionService";
import { format } from "date-fns";
import { formatGqlRequest } from "@/helpers";
import axios from "axios";

export class TransactionService implements ITransactionService {
  async getHistoryForAccount(
    appUserId: number,
    from: Date,
    to: Date,
    accountId: number
  ): Promise<AccountHistoryRecord[]> {
    const query = formatGqlRequest({
      type: "query",
      name: "accountHistory",
      requestParams: [
        {
          name: "appUserId",
          value: appUserId
        },
        {
          name: "from",
          value: format(from, "yyyy-MM-dd HH:mm:ss"),
          quoted: true
        },
        {
          name: "to",
          value: format(to, "yyyy-MM-dd HH:mm:ss"),
          quoted: true
        },
        {
          name: "accountId",
          value: accountId
        }
      ],
      responseParams: ["createdAt", "amount"]
    });

    const {
      data: {
        data: { accountHistory }
      }
    } = await axios.post("", {
      query
    });

    return accountHistory;
  }

  async getRecentDepositsAndWithdrawals(
    appUserId: number
  ): Promise<RecentDepositsAndWithdrawals> {
    const query = formatGqlRequest({
      type: "query",
      name: "recentDepositsAndWithdrawals",
      requestParams: [
        {
          name: "appUserId",
          value: appUserId
        }
      ],
      responseParams: ["deposits", "withdrawals"]
    });

    const {
      data: {
        data: { recentDepositsAndWithdrawals }
      }
    } = await axios.post("", {
      query
    });

    return recentDepositsAndWithdrawals;
  }

  async transfer(payload: CreateTransferDto): Promise<void> {
    const { appUserId, amount, accountFromId, accountToId } = payload;

    const query = formatGqlRequest({
      type: "mutation",
      name: "transfer",
      requestParams: [
        {
          name: "transfer",
          subFields: [
            {
              name: "appUserId",
              value: appUserId
            },
            {
              name: "amount",
              value: amount
            },
            {
              name: "accountFromId",
              value: accountFromId
            },
            {
              name: "accountToId",
              value: accountToId
            }
          ]
        }
      ]
    });

    await axios.post("", {
      query
    });
  }

  async addChange(payload: CreateFinancialChangeItemDto): Promise<void> {
    const {
      appUserId,
      amount,
      description,
      expense,
      paymentSourceId,
      tagIds,
      createdAt
    } = payload;

    const query = formatGqlRequest({
      type: "mutation",
      name: "addFinancialChange",
      requestParams: [
        {
          name: "financialChange",
          subFields: [
            {
              name: "appUserId",
              value: appUserId
            },
            {
              name: "amount",
              value: amount
            },
            {
              name: "description",
              value: description,
              quoted: true
            },
            {
              name: "expense",
              value: expense
            },
            {
              name: "paymentSourceId",
              value: paymentSourceId
            },
            {
              name: "tagIds",
              value: `[${tagIds.join(",")}]`
            },
            {
              name: "createdAt",
              value: createdAt,
              quoted: true
            }
          ]
        }
      ]
    });

    await axios.post("", {
      query
    });
  }

  async getChanges(
    appUserId: number,
    skip: number | null = null,
    take: number | null = null,
    description = "",
    min: number | null = null,
    max: number | null = null,
    tags: number[] | null = null,
    transactionType: number | null = null,
    account: number | null = null,
    showTransfers: boolean | null = null
  ): Promise<ItemCollection<FinancialChangeItem>> {
    const query = formatGqlRequest({
      type: "query",
      name: "financialChanges",
      requestParams: [
        {
          name: "id",
          value: appUserId
        },
        {
          name: "take",
          value: take
        },
        {
          name: "skip",
          value: skip
        },
        {
          name: "description",
          value: description,
          quoted: true
        },
        {
          name: "min",
          value: min
        },
        {
          name: "max",
          value: max
        },
        {
          name: "tags",
          value: tags,
          array: true
        },
        {
          name: "transactionType",
          value: transactionType
        },
        {
          name: "account",
          value: account
        },
        {
          name: "showTransfers",
          value: showTransfers
        }
      ],
      responseParams: [
        "count",
        {
          name: "items",
          subFields: [
            "id",
            "amount",
            "transfer",
            "createdAt",
            "description",
            "expense",
            "account",
            {
              name: "tags",
              subFields: ["id", "description"]
            }
          ]
        }
      ]
    });

    const {
      data: {
        data: { financialChanges }
      }
    } = await axios.post("", {
      query
    });

    return financialChanges;
  }

  async getHistory(
    appUserId: number,
    from: Date,
    to: Date
  ): Promise<FinancialHistory[]> {
    const query = formatGqlRequest({
      type: "query",
      name: "financialHistory",
      requestParams: [
        {
          name: "id",
          value: appUserId
        },
        {
          name: "from",
          value: format(from, "yyyy-MM-dd HH:mm:ss"),
          quoted: true
        },
        {
          name: "to",
          value: format(to, "yyyy-MM-dd HH:mm:ss"),
          quoted: true
        }
      ],
      responseParams: [
        "createdAt",
        "total",
        {
          name: "paymentSources",
          subFields: ["id", "amount"]
        }
      ]
    });

    const {
      data: {
        data: { financialHistory }
      }
    } = await axios.post("", {
      query
    });

    return financialHistory;
  }

  async getTotal(
    appUserId: number,
    from: Date | null = null,
    to: Date | null = null
  ): Promise<FinancialHistory[]> {
    const query = formatGqlRequest({
      type: "query",
      name: "financialHistory",
      requestParams: [
        {
          name: "id",
          value: appUserId
        },
        {
          name: "from",
          value: from && format(from, "yyyy-MM-dd HH:mm:ss"),
          quoted: !!from
        },
        {
          name: "to",
          value: to && format(to, "yyyy-MM-dd HH:mm:ss"),
          quoted: !!to
        }
      ],
      responseParams: ["createdAt", "total"]
    });

    const {
      data: {
        data: { financialHistory }
      }
    } = await axios.post("", {
      query
    });

    return financialHistory;
  }

  async getTransactionAmountRange(
    appUserId: number,
    expense: boolean | null = null
  ): Promise<TransactionAmountRange> {
    const query = formatGqlRequest({
      type: "query",
      name: "transactionAmountRange",
      requestParams: [
        {
          name: "appUserId",
          value: appUserId
        },
        {
          name: "expense",
          value: expense
        }
      ],
      responseParams: ["min", "max"]
    });

    const {
      data: {
        data: { transactionAmountRange }
      }
    } = await axios.post("", {
      query
    });

    return transactionAmountRange;
  }

  async getDailyChanges(appUserId: number): Promise<DailyChange[]> {
    const query = formatGqlRequest({
      type: "query",
      name: "dailyChanges",
      requestParams: [
        {
          name: "appUserId",
          value: appUserId
        }
      ],
      responseParams: ["withdrawals", "deposits", "createdAt"]
    });

    const {
      data: {
        data: { dailyChanges }
      }
    } = await axios.post("", {
      query
    });

    return dailyChanges.map((x: DailyChangeDto) => ({
      withdrawals: x.withdrawals,
      deposits: x.deposits,
      createdAt: new Date(parseInt(x.createdAt))
    }));
  }

  async getLatestDate(appUserId: number): Promise<LatestDate> {
    const query = formatGqlRequest({
      type: "query",
      name: "latestDate",
      requestParams: [
        {
          name: "appUserId",
          value: appUserId
        }
      ],
      responseParams: ["latestDate"]
    });

    const {
      data: {
        data: { latestDate }
      }
    } = await axios.post("", {
      query
    });

    return latestDate;
  }
}
