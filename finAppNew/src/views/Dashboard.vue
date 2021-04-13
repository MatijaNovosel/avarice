<template>
  <v-row v-if="!state.loading">
    <v-col cols="12" class="pb-0">
      <h3>Overview</h3>
    </v-col>
    <v-col cols="12" md="4">
      <v-card rounded="lg">
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon>mdi-bank</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              {{ formatCurrencyDisplay(true, state.total, "HRK") }}
            </v-list-item-title>
            <v-list-item-subtitle class="mt-1">
              Total amount
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card rounded="lg">
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon>mdi-bank-transfer-in</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="green--text font-weight-bold">
              {{
                formatCurrencyDisplay(
                  true,
                  state.recentDepositsAndWithdrawals.deposits,
                  "HRK"
                )
              }}
            </v-list-item-title>
            <v-list-item-subtitle class="mt-1">
              Deposits (Last 30 days)
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card rounded="lg">
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon>mdi-bank-transfer-out</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="red--text font-weight-bold">
              {{
                formatCurrencyDisplay(
                  true,
                  state.recentDepositsAndWithdrawals.withdrawals,
                  "HRK"
                )
              }}
            </v-list-item-title>
            <v-list-item-subtitle class="mt-1">
              Withdrawals (Last 30 days)
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="12" class="pb-0">
      <h3>Data visualized</h3>
    </v-col>
    <v-col cols="12" md="6">
      <v-sheet class="pa-6 rounded-lg text-center" height="450">
        <h4 class="mb-5 grey--text lighten-2">Daily changes</h4>
        <bar-chart
          style="height: 370px"
          v-if="state.graphDataDailyChanges"
          :chart-data="state.graphDataDailyChanges"
          :options="dailyChangesGraphOptions"
        />
      </v-sheet>
    </v-col>
    <v-col cols="12" md="6">
      <v-sheet class="pa-6 rounded-lg text-center" height="450">
        <h4 class="mb-5 grey--text lighten-2">Total changes</h4>
        <line-chart
          style="height: 370px"
          v-if="state.graphTotalChanges"
          :chart-data="state.graphTotalChanges"
          :options="graphTotalChangesOptions"
        />
      </v-sheet>
    </v-col>
    <v-col cols="12" class="pb-0">
      <h3>Recent transactions</h3>
    </v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="state.transactions"
        hide-default-footer
        :items-per-page="10"
        class="rounded-lg"
      >
        <template #item.createdAt="{ item }">
          {{ item.createdAt }}
          <span class="grey--text">
            ({{
              formatDistance(
                parse(item.createdAt, "dd.MM.yyyy. HH:mm:ss", new Date()),
                new Date(),
                {
                  addSuffix: true
                }
              )
            }})
          </span>
        </template>
        <template #item.amount="{ item }">
          {{ formatCurrencyDisplay(true, item.amount, "HRK") }}
        </template>
        <template #item.tagIds="{ item }">
          <v-chip
            small
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
  FinancialChangeItem,
  RecentDepositsAndWithdrawals
} from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import { format, sub, formatDistance, parse } from "date-fns";
import { formatCurrencyDisplay } from "@/helpers";
import { GraphData, GraphOptions } from "@/models/graph";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { DatasetItem } from "@/models/dataset";
import { AppUser } from "@/models/user";

interface State {
  history: FinancialHistory[];
  recentDepositsAndWithdrawals: RecentDepositsAndWithdrawals;
  graphDataDailyChanges: GraphData | null;
  graphTotalChanges: GraphData | null;
  totalDataset: DatasetItem | null;
  transactions: FinancialChangeItem[];
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
      graphDataDailyChanges: null,
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
          ? state.history[state.history.length - 1].total
          : 0;
      })
    });

    async function cacheData() {
      const storage = getService<IWebStorage>(Types.WebStorageService);

      const history = await getService<ITransactionService>(
        Types.TransactionService
      ).getTotal(
        (context.root.$store.getters["user/data"] as AppUser).id as number,
        sub(new Date(), { days: 30 }),
        new Date()
      );
      storage.saveState("history", JSON.stringify(history));
      state.history = history;

      const dailyChanges = await getService<ITransactionService>(
        Types.TransactionService
      ).getDailyChanges(
        (context.root.$store.getters["user/data"] as AppUser).id as number
      );
      storage.saveState("dailyChanges", JSON.stringify(dailyChanges));

      const recentDepositsAndWithdrawals = await getService<
        ITransactionService
      >(Types.TransactionService).getRecentDepositsAndWithdrawals(
        (context.root.$store.getters["user/data"] as AppUser).id as number
      );

      storage.saveState(
        "recentDepositsAndWithdrawals",
        JSON.stringify(recentDepositsAndWithdrawals)
      );
    }

    async function getData() {
      await context.root.$store.dispatch("app/setLoading", true);

      const { latestDate } = await getService<ITransactionService>(
        Types.TransactionService
      ).getLatestDate(
        (context.root.$store.getters["user/data"] as AppUser).id as number
      );

      const storage = getService<IWebStorage>(Types.WebStorageService);
      const cachedHistory = storage.getSavedState("history");

      if (cachedHistory) {
        const data = JSON.parse(cachedHistory) as FinancialHistory[];
        const cachedLatestDate = data[data.length - 1].createdAt as string;
        if (latestDate == cachedLatestDate) {
          state.history = data;
        } else {
          await cacheData();
        }
      } else {
        await cacheData();
      }

      state.totalDataset = {
        label: "Total",
        data: state.history.map(x => x.total),
        fill: true,
        backgroundColor: "rgba(70, 135, 66, 0.4)",
        borderWidth: 4,
        borderColor: "#4a9650"
      };

      state.graphTotalChanges = {
        labels: state.history.map(x => x.createdAt),
        datasets: [state.totalDataset]
      };

      const dailyChanges = JSON.parse(
        storage.getSavedState("dailyChanges")
      ) as DailyChange[];

      state.graphDataDailyChanges = {
        labels: dailyChanges
          .reverse()
          .map(x => format(new Date(x.createdAt), "dd.MM.yyyy.")),
        datasets: [
          {
            type: "bar",
            label: "Withdrawals",
            borderColor: "#ff4f4f",
            backgroundColor: "#ff4f4f",
            data: dailyChanges.map(x => -x.withdrawals)
          },
          {
            type: "bar",
            label: "Deposits",
            borderColor: "#66BB6A",
            backgroundColor: "#66BB6A",
            data: dailyChanges.map(x => x.deposits)
          }
        ]
      };

      state.recentDepositsAndWithdrawals = JSON.parse(
        storage.getSavedState("recentDepositsAndWithdrawals")
      ) as RecentDepositsAndWithdrawals;

      const itemCollection = await getService<ITransactionService>(
        Types.TransactionService
      ).getChanges(
        (context.root.$store.getters["user/data"] as AppUser).id as number,
        0,
        10
      );

      state.transactions = itemCollection.items;
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
              color: "#424242"
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
            }
          }
        ]
      },
      elements: {
        point: {
          radius: 1
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
              color: "#424242"
            },
            stacked: true
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
        text: "Created at",
        value: "createdAt",
        sortable: false
      },
      {
        text: "Tags",
        value: "tagIds",
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
      parse
    };
  }
});
</script>
