<template>
  <v-row v-if="!state.loading">
    <v-col cols="12" md="4">
      <amount-card title="Total amount" :amount="state.total" />
    </v-col>
    <v-col cols="12" md="4">
      <amount-card
        subtitleColor="green"
        title="Deposits (Last 30 days)"
        :amount="state.recentDepositsAndWithdrawals.deposits"
        :visible="true"
      />
    </v-col>
    <v-col cols="12" md="4">
      <amount-card
        subtitleColor="red"
        title="Withdrawals (Last 30 days)"
        :amount="state.recentDepositsAndWithdrawals.withdrawals"
        :visible="true"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="pa-6 rounded-lg text-center" height="450">
        <h4 class="mb-5 grey--text lighten-2">Daily changes</h4>
        <bar-chart
          style="height: 360px"
          v-if="state.graphDataTransactions"
          :chart-data="state.graphDataTransactions"
          :options="dailyChangesGraphOptions"
        />
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="pa-6 rounded-lg text-center" height="450">
        <h4 class="mb-5 grey--text lighten-2">Total changes</h4>
        <line-chart
          ref="lineChartRef"
          style="height: 360px"
          v-if="state.graphTotalChanges"
          :chart-data="state.graphTotalChanges"
          :options="graphTotalChangesOptions"
          :bgGradient="{
            from: 'rgba(245, 124, 0, 0.45)',
            to: 'rgba(239, 83, 80, 0.7)'
          }"
          :strokeGradient="{
            from: '#ffc107',
            to: '#f57c00'
          }"
        />
      </v-card>
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
        <template #top>
          <v-toolbar height="40" flat class="px-5 rounded-t-lg">
            <v-toolbar-title class="text-overline">Recent transactions</v-toolbar-title>
          </v-toolbar>
        </template>
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
  ref,
  SetupContext,
  onBeforeUpdate,
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
import AmountCard from "@/components/AmountCard.vue";

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
    LineChart,
    AmountCard
  },
  setup(props, context: SetupContext) {
    const vm = getCurrentInstance();
    const lineChartRef = ref<any>();

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
      ).getTotal(sub(new Date(), { days: 30 }), new Date());

      storage.saveState("history", JSON.stringify(history));
      state.history = history;

      const dailyChanges = await getService<IHistoryService>(
        Types.HistoryService
      ).getDailyChanges();

      storage.saveState("dailyChanges", JSON.stringify(dailyChanges));

      const recentDepositsAndWithdrawals = await getService<IHistoryService>(
        Types.HistoryService
      ).getRecentDepositsAndWithdrawals();

      storage.saveState(
        "recentDepositsAndWithdrawals",
        JSON.stringify(recentDepositsAndWithdrawals)
      );
    }

    async function getData() {
      await context.root.$store.dispatch("app/setLoading", true);

      const latestDate = await getService<IHistoryService>(
        Types.HistoryService
      ).getLatestDate();

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
        fill: true,
        borderWidth: 5,
        borderColor: "#f57c00"
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
            borderSkipped: false,
            backgroundColor: "#E53935",
            data: dailyChanges.map(x => -x.withdrawals)
          },
          {
            type: "bar",
            label: "Deposits",
            borderColor: "#43A047",
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
      ).getTransactions(0, 10);

      state.transactions = transactions.results as TransactionModel[];
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
            stacked: true
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
      format,
      lineChartRef
    };
  }
});
</script>
