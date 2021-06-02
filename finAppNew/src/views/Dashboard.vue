<template>
  <v-row v-if="!state.loading">
    <v-col cols="12" class="pb-0 text-overline">
      <h3>Overview</h3>
    </v-col>
    <v-col cols="12" md="4">
      <v-card rounded="lg" class="pa-2 text-right">
        <v-list-item dense two-line>
          <v-list-item-content>
            <v-list-item-subtitle class="pb-2 text-overline">
              Total amount
            </v-list-item-subtitle>
            <v-list-item-title class="font-weight-bold text-subtitle-1">
              {{ formatCurrencyDisplay(true, state.total, "HRK") }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card rounded="lg" class="pa-2 text-right">
        <v-list-item dense two-line>
          <v-list-item-content>
            <v-list-item-subtitle class="pb-2 text-overline">
              Deposits (Last 30 days)
            </v-list-item-subtitle>
            <v-list-item-title
              class="green--text font-weight-bold text-subtitle-1"
            >
              {{
                formatCurrencyDisplay(
                  true,
                  state.recentDepositsAndWithdrawals.deposits,
                  "HRK"
                )
              }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card rounded="lg" class="pa-2 text-right">
        <v-list-item dense two-line>
          <v-list-item-content>
            <v-list-item-subtitle class="pb-2 text-overline">
              Withdrawals (Last 30 days)
            </v-list-item-subtitle>
            <v-list-item-title
              class="red--text font-weight-bold text-subtitle-1"
            >
              {{
                formatCurrencyDisplay(
                  true,
                  state.recentDepositsAndWithdrawals.withdrawals,
                  "HRK"
                )
              }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="12" class="pb-0 text-overline">
      <h3>Data visualized</h3>
    </v-col>
    <v-col cols="12" md="6">
      <div class="pa-6 rounded-lg text-center" height="450">
        <h4 class="mb-5 grey--text lighten-2">Daily changes</h4>
        <bar-chart
          style="height: 370px"
          v-if="state.graphDataTransactions"
          :chart-data="state.graphDataTransactions"
          :options="dailyChangesGraphOptions"
        />
      </div>
    </v-col>
    <v-col cols="12" md="6">
      <div class="pa-6 rounded-lg text-center" height="450">
        <h4 class="mb-5 grey--text lighten-2">Total changes</h4>
        <line-chart
          style="height: 370px"
          v-if="state.graphTotalChanges"
          :chart-data="state.graphTotalChanges"
          :options="graphTotalChangesOptions"
        />
      </div>
    </v-col>
    <v-col cols="12" class="pb-0 text-overline">
      <h3>Recent transactions</h3>
    </v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="state.transactions"
        hide-default-footer
        :items-per-page="10"
        class="rounded-lg"
        dense
      >
        <template #item.createdAt="{ item }">
          {{ format(new Date(item.createdAt), "dd.MM.yyyy. HH:mm") }}
          <span class="grey--text">
            ({{
              formatDistance(new Date(item.createdAt), new Date(), {
                addSuffix: true
              })
            }})
          </span>
        </template>
        <template #item.description="{ item }">
          <span
            class="font-weight-bold"
            :class="{
              'error--text': item.expense,
              'success--text': !item.expense
            }"
          >
            {{ item.description }}
          </span>
        </template>
        <template #item.amount="{ item }">
          {{ formatCurrencyDisplay(true, item.amount, "HRK") }}
        </template>
        <template #item.account="{ item }">
          {{ item.account.description }}
        </template>
        <template #item.tags="{ item }">
          <v-chip
            x-small
            v-for="(tag, i) in item.tags"
            :key="i"
            class="mr-2"
            :color="item.expense ? 'error' : 'success'"
          >
            {{ tag.description }}
          </v-chip>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import { ITransactionService } from "@/interfaces/transactionService";
import IWebStorage from "@/interfaces/webStorageService";
import {
  DailyChange,
  RecentDepositsAndWithdrawals
} from "@/models/transaction";
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import { format, sub, formatDistance } from "date-fns";
import { formatCurrencyDisplay } from "@/helpers";
import { GraphData, GraphOptions } from "@/models/graph";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { DatasetItem } from "@/models/dataset";
import { User } from "@/models/user";
import { IHistoryService } from "@/interfaces/historyService";
import { HistoryTotalModel, TransactionModel } from "@/apiClient/client";

interface State {
  history: HistoryTotalModel[];
  recentDepositsAndWithdrawals: RecentDepositsAndWithdrawals;
  graphDataTransactions: GraphData | null;
  graphTotalChanges: GraphData | null;
  totalDataset: DatasetItem | null;
  transactions: TransactionModel[];
  loading: boolean;
  total: number;
}

export default defineComponent({
  name: "Home",
  components: {
    BarChart,
    LineChart
  },
  setup(props, context: SetupContext) {
    const vm = getCurrentInstance();

    const state: State = reactive({
      history: [],
      graphDataTransactions: null,
      graphTotalChanges: null,
      totalDataset: null,
      transactions: [],
      loading: computed(() => {
        return context.root.$store.getters["app/loading"] as boolean;
      }),
      recentDepositsAndWithdrawals: {
        deposits: 0,
        withdrawals: 0
      },
      total: computed(() => {
        return state.history && state.history.length != 0
          ? state.history[state.history.length - 1].amount
          : 0;
      })
    });

    async function cacheData() {
      const storage = getService<IWebStorage>(Types.WebStorageService);

      const history = await getService<IHistoryService>(
        Types.HistoryService
      ).getTotal(
        (context.root.$store.getters["user/data"] as User).id,
        sub(new Date(), { days: 30 }),
        new Date()
      );

      storage.saveState("history", JSON.stringify(history));
      state.history = history;

      const dailyChanges = await getService<IHistoryService>(
        Types.HistoryService
      ).getDailyChanges((context.root.$store.getters["user/data"] as User).id);

      storage.saveState("dailyChanges", JSON.stringify(dailyChanges));

      const recentDepositsAndWithdrawals = await getService<IHistoryService>(
        Types.HistoryService
      ).getRecentDepositsAndWithdrawals(
        (context.root.$store.getters["user/data"] as User).id
      );

      storage.saveState(
        "recentDepositsAndWithdrawals",
        JSON.stringify(recentDepositsAndWithdrawals)
      );
    }

    async function getData() {
      await context.root.$store.dispatch("app/setLoading", true);

      const latestDate = await getService<IHistoryService>(
        Types.HistoryService
      ).getLatestDate((context.root.$store.getters["user/data"] as User).id);

      const storage = getService<IWebStorage>(Types.WebStorageService);
      const cachedHistory = storage.getSavedState("history");

      if (cachedHistory) {
        const data = JSON.parse(cachedHistory) as HistoryTotalModel[];
        const cachedLatestDate = new Date(data[data.length - 1].createdAt);

        if (latestDate.getTime() == cachedLatestDate.getTime()) {
          state.history = data;
        } else {
          await cacheData();
        }
      } else {
        await cacheData();
      }

      state.totalDataset = {
        label: "Total",
        data: state.history.map(x => x.amount),
        fill: false,
        borderWidth: 5,
        borderColor: "#43A047"
      };

      state.graphTotalChanges = {
        labels: state.history.map(x =>
          format(new Date(x.createdAt), "dd.MM.yyyy. HH:mm")
        ),
        datasets: [state.totalDataset]
      };

      const dailyChanges = JSON.parse(
        storage.getSavedState("dailyChanges")
      ) as DailyChange[];

      state.graphDataTransactions = {
        labels: dailyChanges.map(x =>
          format(new Date(x.createdAt), "dd.MM.yyyy.")
        ),
        datasets: [
          {
            type: "bar",
            label: "Withdrawals",
            borderColor: "#E53935",
            borderRadius: 15,
            borderWidth: 3,
            borderSkipped: false,
            backgroundColor: "#E53935",
            data: dailyChanges.map(x => -x.withdrawals)
          },
          {
            type: "bar",
            label: "Deposits",
            borderColor: "#43A047",
            borderRadius: 5,
            borderWidth: 3,
            borderSkipped: false,
            backgroundColor: "#43A047",
            data: dailyChanges.map(x => x.deposits)
          }
        ]
      };

      state.recentDepositsAndWithdrawals = JSON.parse(
        storage.getSavedState("recentDepositsAndWithdrawals")
      ) as RecentDepositsAndWithdrawals;

      const transactions = await getService<ITransactionService>(
        Types.TransactionService
      ).getTransactions(
        (context.root.$store.getters["user/data"] as User).id,
        0,
        10
      );

      state.transactions = transactions;

      await context.root.$store.dispatch("app/setLoading", false);
    }

    onMounted(() => {
      getData();
    });

    watch(
      () => context.root.$store.getters["app/refreshTrigger"] as boolean,
      () => {
        getData();
      }
    );

    const graphTotalChangesOptions: GraphOptions = {
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: `${vm?.$t("amount") as string} (HRK)`
            }
          }
        ]
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          tension: 0.2
        }
      },
      responsive: true
    };

    const dailyChangesGraphOptions: GraphOptions = {
      tooltips: {
        mode: "index",
        intersect: false
      },
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            stacked: true,
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              color: "#424242"
            },
            scaleLabel: {
              display: true,
              labelString: `${vm?.$t("amount") as string} (HRK)`
            },
            stacked: true
          }
        ]
      },
      responsive: true
    };

    const headers = [
      {
        text: "Description",
        value: "description",
        sortable: false
      },
      {
        text: "Amount",
        value: "amount",
        sortable: false
      },
      {
        text: "Account",
        value: "account",
        sortable: false
      },
      {
        text: "Created at",
        value: "createdAt",
        sortable: false
      },
      {
        text: "Tags",
        value: "tags",
        sortable: false,
        align: "center"
      }
    ];

    return {
      state,
      formatCurrencyDisplay,
      dailyChangesGraphOptions,
      graphTotalChangesOptions,
      headers,
      formatDistance,
      format
    };
  }
});
</script>
