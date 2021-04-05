<template>
  <v-row>
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
              {{
                formatCurrencyDisplay(
                  true,
                  state.history && state.history.length != 0
                    ? state.history[state.history.length - 1].total
                    : 0,
                  "HRK"
                )
              }}
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
      <v-sheet class="pa-6 rounded-lg" height="425">
        <bar-chart
          style="height: 370px"
          v-if="state.graphDataDailyChanges"
          :chart-data="state.graphDataDailyChanges"
          :options="dailyChangesGraphOptions"
        />
      </v-sheet>
    </v-col>
    <v-col cols="12" md="6">
      <v-sheet class="pa-6 rounded-lg" height="425">
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
import {
  FinancialChangeItem,
  RecentDepositsAndWithdrawals
} from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import {
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

interface State {
  history: FinancialHistory[];
  recentDepositsAndWithdrawals: RecentDepositsAndWithdrawals;
  graphDataDailyChanges: GraphData | null;
  graphTotalChanges: GraphData | null;
  totalDataset: DatasetItem | null;
  transactions: FinancialChangeItem[];
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
      recentDepositsAndWithdrawals: {
        deposits: 0,
        withdrawals: 0
      }
    });

    async function getData() {
      context.emit("set-loading", true);

      state.history = await getService<ITransactionService>(
        Types.ChangeService
      ).getTotal(1, sub(new Date(), { days: 30 }), new Date());

      state.totalDataset = {
        label: "Total",
        data: state.history.map(x => x.total),
        fill: false,
        borderWidth: 4,
        borderColor: "#4a9650"
      };

      state.graphTotalChanges = {
        labels: state.history.map(x => x.createdAt),
        datasets: [state.totalDataset]
      };

      state.recentDepositsAndWithdrawals = await getService<
        ITransactionService
      >(Types.ChangeService).getRecentDepositsAndWithdrawals(1);

      const dailyChanges = await getService<ITransactionService>(
        Types.ChangeService
      ).getDailyChanges(1);

      state.graphDataDailyChanges = {
        labels: dailyChanges
          .reverse()
          .map(x => format(x.createdAt, "dd.MM.yyyy.")),
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

      const itemCollection = await getService<ITransactionService>(
        Types.ChangeService
      ).getChanges(1, 0, 10);

      state.transactions = itemCollection.items;

      context.emit("set-loading", false);
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
      title: {
        display: true,
        text: "Total account balance"
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
      title: {
        display: true,
        text: vm?.$t("dailyChanges") as string
      },
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
