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
      <v-sheet
        class="py-6 rounded-lg d-flex flex-column text-center"
        height="450"
      >
        <h4 class="mb-8 grey--text lighten-2">Spending distribution</h4>
        <div class="d-flex justify-center align-center">
          <pie-chart
            style="height: 280px"
            v-if="state.tagPercentagesData"
            :chart-data="state.tagPercentagesData"
            :options="tagPercentagesOptions"
          />
          <v-list
            class="text-left"
            v-if="$vuetify.breakpoint.mdAndUp"
            dense
            style="overflow-y: scroll; height: 320px"
            color="grey darken-4"
            rounded
            elevation="4"
          >
            <v-list-item
              :key="i"
              v-for="(tagPercentage, i) in state.tagPercentages"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ tagPercentage.description }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ tagPercentage.percentage }}%
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-sheet>
    </v-col>
    <v-col cols="12">
      <v-sheet class="pa-6 rounded-lg text-center" height="600">
        <h4 class="mb-5 grey--text lighten-2">Total changes</h4>
        <line-chart
          style="height: 515px"
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
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import { format, sub, formatDistance, parse } from "date-fns";
import { adjustHexColor, formatCurrencyDisplay } from "@/helpers";
import { GraphData, GraphOptions } from "@/models/graph";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import LineChart from "@/components/charts/LineChart";
import { DatasetItem } from "@/models/dataset";
import { TagPercentageRecord } from "@/models/payment-source";
import { IPaymentSourceService } from "@/interfaces/paymentSourceService";

interface State {
  history: FinancialHistory[];
  recentDepositsAndWithdrawals: RecentDepositsAndWithdrawals;
  graphDataDailyChanges: GraphData | null;
  graphTotalChanges: GraphData | null;
  totalDataset: DatasetItem | null;
  transactions: FinancialChangeItem[];
  tagPercentages: TagPercentageRecord[];
  tagPercentagesData: GraphData | null;
  loading: boolean;
}

export default defineComponent({
  name: "Home",
  components: {
    BarChart,
    LineChart,
    PieChart
  },
  setup(props, context: SetupContext) {
    const vm = getCurrentInstance();

    const state: State = reactive({
      history: [],
      tagPercentages: [],
      graphDataDailyChanges: null,
      graphTotalChanges: null,
      totalDataset: null,
      transactions: [],
      tagPercentagesData: null,
      loading: computed(() => {
        return context.root.$store.getters["app/loading"] as boolean;
      }),
      recentDepositsAndWithdrawals: {
        deposits: 0,
        withdrawals: 0
      }
    });

    async function getData() {
      await context.root.$store.dispatch("app/setLoading", true);

      state.history = await getService<ITransactionService>(
        Types.ChangeService
      ).getTotal(1, sub(new Date(), { days: 30 }), new Date());

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

      let tagPercentages = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getTagPercentages(1);

      tagPercentages = tagPercentages.sort(
        (a, b) => b.percentage - a.percentage
      );

      tagPercentages = tagPercentages.map(x => {
        x.percentage = parseFloat((x.percentage * 100).toFixed(3));
        return x;
      });

      state.tagPercentages = tagPercentages;
      state.tagPercentagesData = {
        labels: tagPercentages.map(x => x.description),
        datasets: [
          {
            borderWidth: 0,
            backgroundColor: tagPercentages.map(
              (_, i) => "#" + adjustHexColor("#4a9650", i * 7)
            ),
            data: tagPercentages.map(x => x.percentage)
          }
        ]
      };

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

    const tagPercentagesOptions: GraphOptions = {
      cutoutPercentage: 75,
      elements: {
        arc: {
          borderWidth: 0
        }
      },
      maintainAspectRatio: false,
      legend: {
        display: false
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
      parse,
      tagPercentagesOptions
    };
  }
});
</script>
