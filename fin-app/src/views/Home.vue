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
        class="rounded-lg bg-gray-300"
        height="100px"
      />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <dashboard-amount-card
        :icon="state.total.icon"
        :title="state.total.description"
        color="#acb0bf"
        :amount="state.total.currentAmount"
        :amount-visible="state.total.visible"
        :currency="state.user.preferredCurrency"
      />
      <div class="flex px-5 py-6 bg-white rounded-lg shadow">
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
      <div class="flex px-5 py-6 bg-white rounded-lg shadow">
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
      {{ $t("dailyChanges") }}
    </span>
    <div
      class="px-6 pt-24 pb-12 flex flex-col items-center bg-white rounded-lg shadow-md"
    >
      <chart
        :height="400"
        :width="1000"
        type="bar"
        :data="stackedData"
        :options="stackedOptions"
      />
    </div>
    <span class="mb-3 my-5 text-xl font-semibold text-gray-400 select-none">
      {{ $t("recentTransactions") }}
    </span>
    <div class="rounded-lg bg-white px-6 shadow-md">
      <div v-if="state.transactionsLoading" class="text-center my-16">
        <progress-spinner strokeWidth="10" class="h-24 w-24" />
      </div>
      <template v-else>
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-5">
          <transaction-card
            v-for="change in state.transactions"
            :key="change.id"
            :expense="change.expense"
            :title="change.description"
            :amount="change.amount"
            :tags="change.tagIds"
            :date="change.createdAt"
            :transfer="change.transfer"
            :describeDate="true"
            :currency="state.user.preferredCurrency"
          />
        </div>
        <paginator
          v-model:first="state.transactionsOffset"
          v-model:rows="state.numberOfRows"
          :totalRecords="state.totalTransactions"
          :rowsPerPageOptions="state.transactionPageOption"
          :pageLinkSize="state.transactionsNumberOfPages"
          @page="pageChanged"
          class="pb-5 mt-5"
        />
      </template>
    </div>
    <span class="mb-3 my-5 text-xl font-semibold text-gray-400 select-none">
      {{ $t("financialChangesVisualized") }}
    </span>
    <div
      class="px-6 pt-24 pb-12 flex flex-col items-center bg-white rounded-lg shadow-md"
    >
      <chart
        type="line"
        :data="state.graphData"
        :options="state.graphOptions"
        :height="400"
        :width="1000"
      />
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
  computed
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
import { GraphOptions } from "@/models/graph";
import { PaymentSource } from "@/models/payment-source";
import { Pagination } from "@/models/pagination";
import MdiIcon from "@/components/mdi-icon.vue";
import { RefreshController } from "@/helpers/refresh";
import { useStore } from "vuex";
import { AppUser } from "@/models/user";
import { useI18n } from "vue-i18n";

interface GraphData {
  labels: string[];
  datasets: DatasetItem[];
}

interface State {
  recentDepositsAndWithdrawals: RecentDepositsAndWithdrawals;
  dateRange: Array<Date | null>;
  loading: boolean;
  transactionsLoading: boolean;
  graphData: GraphData | null;
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
    const user = useStore();
    const { t } = useI18n();

    const state: State = reactive({
      user: computed(() => user.getters.user),
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
        visible: true
      },
      totalDataset: null,
      transactionsNumberOfPages: 0,
      transactionsOffset: 0,
      totalTransactions: 0,
      numberOfRows: 15,
      refresh: inject("refresh") as RefreshController,
      transactions: [],
      loading: false,
      transactionsLoading: false,
      graphOptions: {
        legend: {
          display: false
        },
        elements: {
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
              scaleLabel: {
                display: true,
                labelString: "Amount (HRK)"
              },
              display: true
            }
          ]
        },
        responsive: true
      },
      graphData: null
    });

    async function getTransactions(skip?: number, take?: number) {
      state.transactionsLoading = true;

      const itemCollection = await getService<ITransactionService>(
        Types.ChangeService
      ).getChanges(1, skip, take);

      state.transactions = itemCollection.items;
      state.totalTransactions = itemCollection.count;
      state.transactionsNumberOfPages = Math.floor(
        state.totalTransactions / state.numberOfRows
      );

      state.transactionsLoading = false;
    }

    async function updateData() {
      state.loading = true;
      getTransactions(0, state.numberOfRows);

      const history = await getService<ITransactionService>(
        Types.ChangeService
      ).getTotal(1, state.dateRange[0] as Date, state.dateRange[1] as Date);

      state.total.currentAmount = history[history.length - 1].total;

      state.totalDataset = {
        label: t("total"),
        data: history.map(x => x.total),
        fill: true,
        borderColor: "#ff8a00",
        backgroundColor: hexToRgba(
          adjustHexColor("#ff8a00".replace("#", ""), -10),
          0.4
        ) as string
      };

      state.graphData = {
        labels: history.map(x => x.createdAt),
        datasets: [state.totalDataset]
      };

      state.recentDepositsAndWithdrawals = await getService<
        ITransactionService
      >(Types.ChangeService).getRecentDepositsAndWithdrawals(1);

      state.loading = false;
    }

    const pageChanged: (...payload: unknown[]) => unknown = payload => {
      const { page, rows } = { ...(payload as Pagination) };
      getTransactions(page * rows, state.numberOfRows);
    };

    onMounted(async () => {
      state.dateRange = [sub(new Date(), { days: 30 }), new Date()];
      updateData();
    });

    watch(
      () => state.refresh,
      () => updateData(),
      { deep: true }
    );

    const stackedData = {
      labels: [
        "06.01.2021.",
        "06.01.2021.",
        "07.01.2021.",
        "07.01.2021.",
        "08.01.2021.",
        "08.01.2021.",
        "09.01.2021.",
        "09.01.2021.",
        "11.01.2021.",
        "11.01.2021.",
        "11.01.2021.",
        "11.01.2021.",
        "11.01.2021.",
        "12.01.2021.",
        "12.01.2021.",
        "13.01.2021.",
        "13.01.2021.",
        "13.01.2021.",
        "13.01.2021.",
        "13.01.2021.",
        "13.01.2021.",
        "13.01.2021.",
        "13.01.2021.",
        "17.01.2021.",
        "17.01.2021.",
        "17.01.2021.",
        "17.01.2021.",
        "17.01.2021.",
        "17.01.2021.",
        "17.01.2021.",
        "17.01.2021.",
        "18.01.2021.",
        "18.01.2021.",
        "18.01.2021.",
        "19.01.2021.",
        "19.01.2021.",
        "19.01.2021.",
        "20.01.2021.",
        "20.01.2021.",
        "20.01.2021.",
        "21.01.2021.",
        "21.01.2021.",
        "21.01.2021.",
        "22.01.2021.",
        "22.01.2021.",
        "22.01.2021.",
        "22.01.2021.",
        "24.01.2021.",
        "24.01.2021.",
        "24.01.2021.",
        "24.01.2021.",
        "24.01.2021.",
        "25.01.2021.",
        "25.01.2021.",
        "25.01.2021.",
        "26.01.2021.",
        "26.01.2021.",
        "27.01.2021.",
        "27.01.2021.",
        "27.01.2021.",
        "28.01.2021.",
        "29.01.2021.",
        "29.01.2021.",
        "30.01.2021.",
        "30.01.2021.",
        "31.01.2021.",
        "01.02.2021.",
        "01.02.2021.",
        "01.02.2021.",
        "02.02.2021.",
        "02.02.2021.",
        "02.02.2021.",
        "02.02.2021."
      ],
      datasets: [
        {
          type: "bar",
          label: t("withdrawals"),
          backgroundColor: "#DC2626",
          data: [
            158,
            165,
            147,
            29,
            109,
            95,
            61,
            58,
            62,
            186,
            58,
            108,
            40,
            33,
            68,
            148,
            66,
            9,
            179,
            60,
            43,
            11,
            140,
            91,
            167,
            30,
            39,
            164,
            42,
            171,
            59,
            67,
            18,
            58,
            27,
            60,
            36,
            159,
            131,
            118,
            92,
            118,
            127,
            136,
            102,
            188,
            145,
            123,
            72,
            88,
            174,
            98,
            97,
            189,
            9,
            152,
            100,
            191,
            153,
            77,
            66,
            119,
            80,
            175,
            54,
            20,
            183,
            66,
            109,
            28,
            106,
            17,
            23
          ]
        },
        {
          type: "bar",
          label: t("deposits"),
          backgroundColor: "#66BB6A",
          data: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            130,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            71,
            60,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ]
        }
      ]
    };

    const stackedOptions = {
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
      stackedData,
      stackedOptions
    };
  }
});
</script>

<style lang="sass"></style>
