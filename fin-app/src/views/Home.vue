<template>
  <div class="mb-10 px-8 flex flex-col">
    <span class="mb-3 text-xl font-semibold text-gray-400 select-none">
      {{ $t("overview") }}
    </span>
    <div v-if="state.loading" class="grid gap-4 grid-cols-3">
      <skeleton
        :key="n"
        v-for="n in 3"
        animation
        class="rounded-lg dark:bg-gray-700 bg-gray-300"
        height="100px"
      />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <dashboard-amount-card
        :icon="state.total.icon"
        :title="state.total.description"
        color="#acb0bf"
        :amount="state.total.currentAmount"
        :amount-visible="false"
        :currency="state.user.preferredCurrency"
      />
      <div class="flex px-5 py-6 dark:bg-gray-800 bg-white rounded-lg shadow">
        <div class="w-full flex items-center content-between justify-between">
          <div class="flex items-center select-none">
            <mdi-icon :size="36" color="#acb0bf" name="bank-transfer-out" />
            <div class="flex flex-col ml-5">
              <span class="font-bold text-gray-400">
                {{ $t("withdrawals") }} ({{ $t("last30Days") }})
              </span>
              <span class="font-semibold text-xl text-red-400">
                - {{ state.recentDepositsAndWithdrawals.withdrawals }}
                {{ state.user.preferredCurrency }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex px-5 py-6 dark:bg-gray-800 bg-white rounded-lg shadow">
        <div class="w-full flex items-center content-between justify-between">
          <div class="flex items-center select-none">
            <mdi-icon :size="36" color="#acb0bf" name="bank-transfer-in" />
            <div class="flex flex-col ml-5">
              <span class="font-bold text-gray-400">
                {{ $t("deposits") }} ({{ $t("last30Days") }})
              </span>
              <span class="font-semibold text-xl text-green-500">
                + {{ state.recentDepositsAndWithdrawals.deposits }}
                {{ state.user.preferredCurrency }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="mb-3 my-5 text-xl font-semibold text-gray-400 select-none">
      {{ $t("financialChangesVisualized") }}
    </span>
    <div
      class="pt-12 pb-12 flex justify-center items-center space-x-10 dark:bg-gray-800 bg-white rounded-lg shadow-md"
    >
      <chart
        ref="dailySpendingGraph"
        type="bar"
        :data="state.graphDataDailyChanges"
        :options="dailyChangesgraphOptions"
        :height="300"
        :width="500"
      />
      <chart
        ref="financialChangedVisualizedGraph"
        type="line"
        :data="state.graphData"
        :options="state.graphOptions"
        :height="300"
        :width="500"
      />
    </div>
    <span class="mb-3 my-5 text-xl font-semibold text-gray-400 select-none">
      {{ $t("recentTransactions") }}
    </span>
    <div class="rounded-lg dark:bg-gray-800 bg-white shadow-md">
      <div v-if="state.transactionsLoading" class="text-center my-16">
        <progress-spinner strokeWidth="10" class="h-24 w-24" />
      </div>
      <template v-else>
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-5 px-5">
          <transaction-card
            v-for="change in state.transactions"
            :key="change.id"
            :expense="change.expense"
            :title="change.description"
            :amount="change.amount"
            :tags="change.tagIds"
            :date="change.createdAt"
            :transfer="change.transfer"
            :currency="state.user.preferredCurrency"
            describe-date
          />
        </div>
        <paginator
          v-model:first="state.transactionsOffset"
          v-model:rows="state.numberOfRows"
          :totalRecords="state.totalTransactions"
          :rowsPerPageOptions="state.transactionPageOption"
          :pageLinkSize="state.transactionsNumberOfPages"
          @page="pageChanged"
          class="py-3 mt-5 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 dark:bg-gray-700 bg-gray-200 rounded-b-xl"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  watch,
  inject,
  onMounted,
  computed,
  ref,
  Ref
} from "vue";
import { hexToRgba, adjustHexColor } from "../helpers/helpers";
import { sub } from "date-fns";
import { DatasetItem } from "../models/dataset";
import {
  FinancialChangeItem,
  RecentDepositsAndWithdrawals
} from "../models/change-item";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import TransactionCard from "../components/transaction-card.vue";
import { getService, Types } from "../di-container";
import { ITransactionService } from "../services/interfaces/transaction-service";
import { GraphHTMLElement, GraphOptions } from "@/models/graph";
import { PaymentSource } from "@/models/payment-source";
import { Pagination } from "@/models/pagination";
import MdiIcon from "@/components/mdi-icon.vue";
import { RefreshController } from "@/helpers/refresh";
import { useStore } from "vuex";
import { AppUser } from "@/models/user";
import { useI18n } from "vue-i18n";
import { format } from "date-fns";

interface GraphData {
  labels: string[];
  datasets: DatasetItem[];
}

interface State {
  recentDepositsAndWithdrawals: RecentDepositsAndWithdrawals;
  dateRange: Array<Date | null>;
  loading: boolean;
  darkMode: boolean;
  transactionsLoading: boolean;
  graphData: GraphData | null;
  graphDataDailyChanges: GraphData | null;
  transactions: FinancialChangeItem[];
  refresh: RefreshController;
  transactionsNumberOfPages: number;
  totalTransactions: number;
  numberOfRows: number;
  transactionsOffset: number;
  totalDataset: DatasetItem | null;
  graphOptions: GraphOptions;
  total: PaymentSource;
  transactionPageOption: number[];
  user: AppUser;
}

export default defineComponent({
  name: "Home",
  components: {
    DashboardAmountCard,
    TransactionCard,
    MdiIcon
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();

    const state: State = reactive({
      user: computed(() => store.getters.user),
      darkMode: computed(() => store.getters.darkMode),
      transactionPageOption: [10, 15],
      recentDepositsAndWithdrawals: {
        withdrawals: 0,
        deposits: 0
      },
      dateRange: [],
      total: {
        id: 1,
        description: t("totalAccountBalance"),
        currency: "HRK",
        icon: "scale",
        currentAmount: 0,
        visible: false
      },
      totalDataset: null,
      transactionsNumberOfPages: 5,
      transactionsOffset: 0,
      totalTransactions: 0,
      numberOfRows: 15,
      refresh: inject("refresh") as RefreshController,
      transactions: [],
      loading: false,
      transactionsLoading: false,
      graphOptions: {
        title: {
          display: true,
          text: `${t("totalAccountBalance")} (Last 30 days)`
        },
        legend: {
          display: false
        },
        elements: {
          point: {
            radius: 0
          },
          line: {
            tension: 0.6
          }
        },
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
              display: false
            }
          ]
        },
        responsive: true
      },
      graphData: null,
      graphDataDailyChanges: null
    });

    const financialChangedVisualizedGraph: Ref<GraphHTMLElement | null> = ref(
      null
    );
    const dailySpendingGraph: Ref<GraphHTMLElement | null> = ref(null);

    async function getTransactions(skip?: number, take?: number) {
      state.transactionsLoading = true;

      const itemCollection = await getService<ITransactionService>(
        Types.ChangeService
      ).getChanges(1, skip, take);

      state.transactions = itemCollection.items;
      state.totalTransactions = itemCollection.count;

      state.transactionsLoading = false;
    }

    function reinitGraphs() {
      const totalDataset = state.totalDataset as DatasetItem;

      totalDataset.backgroundColor = hexToRgba(
        adjustHexColor(
          state.darkMode ? "#59c262" : "#acb0bf".replace("#", ""),
          30
        ),
        0.7
      ) as string;
      totalDataset.borderColor = state.darkMode ? "#59c262" : "#acb0bf";

      dailySpendingGraph?.value?.reinit();
      financialChangedVisualizedGraph?.value?.reinit();
    }

    async function updateData() {
      state.loading = true;

      state.dateRange = [sub(new Date(), { days: 30 }), new Date()];
      getTransactions(0, state.numberOfRows);

      const history = await getService<ITransactionService>(
        Types.ChangeService
      ).getTotal(1, state.dateRange[0] as Date, state.dateRange[1] as Date);

      state.total.currentAmount = history[history.length - 1].total;

      state.totalDataset = {
        label: t("total"),
        data: history.map(x => x.total),
        fill: true,
        borderColor: state.darkMode ? "#59c262" : "#acb0bf",
        backgroundColor: hexToRgba(
          adjustHexColor(
            state.darkMode ? "#59c262" : "#acb0bf".replace("#", ""),
            30
          ),
          0.7
        ) as string
      };

      state.graphData = {
        labels: history.map(x => x.createdAt),
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
            label: t("withdrawals"),
            borderColor: "#ff4f4f",
            backgroundColor: hexToRgba(
              adjustHexColor("#ff4f4f".replace("#", ""), 30),
              0.7
            ) as string,
            fill: true,
            data: dailyChanges.reverse().map(x => x.withdrawals)
          },
          {
            type: "bar",
            label: t("deposits"),
            borderColor: "#66BB6A",
            backgroundColor: hexToRgba(
              adjustHexColor("#66BB6A".replace("#", ""), 30),
              0.7
            ) as string,
            fill: true,
            data: dailyChanges.reverse().map(x => x.deposits)
          }
        ]
      };

      reinitGraphs();
      state.loading = false;
    }

    const pageChanged: (...payload: unknown[]) => unknown = payload => {
      const { page, rows } = { ...(payload as Pagination) };
      getTransactions(page * rows, state.numberOfRows);
    };

    onMounted(async () => {
      updateData();
    });

    watch(
      () => state.refresh,
      () => updateData(),
      { deep: true }
    );

    watch(
      () => state.darkMode,
      () => reinitGraphs()
    );

    const dailyChangesgraphOptions: GraphOptions = {
      title: {
        display: true,
        text: t("dailyChanges")
      },
      tooltips: {
        mode: "index",
        intersect: false
      },
      legend: {
        display: false
      },
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
            scaleLabel: {
              display: true,
              labelString: `${t("amount")} (HRK)`
            },
            stacked: true
          }
        ]
      }
    };

    return {
      state,
      pageChanged,
      dailyChangesgraphOptions,
      financialChangedVisualizedGraph,
      dailySpendingGraph
    };
  }
});
</script>
