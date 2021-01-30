<template>
  <div class="mb-10 px-8 flex flex-col">
    <span class="mb-3 text-xl font-semibold"> Overview </span>
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
        currency="HRK"
      />
      <div class="flex px-5 py-6 bg-white rounded-lg shadow-md">
        <div class="w-full flex items-center content-between justify-between">
          <div class="flex items-center select-none">
            <mdi-icon :size="36" color="#acb0bf" name="bank-transfer-out" />
            <div class="flex flex-col ml-5">
              <span class="font-bold text-gray-400"
                >Withdrawals (Last 30 days)</span
              >
              <span class="font-semibold text-xl text-red-400"
                >- {{ state.recentWithdrawals }} HRK</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="flex px-5 py-6 bg-white rounded-lg shadow-md">
        <div class="w-full flex items-center content-between justify-between">
          <div class="flex items-center select-none">
            <mdi-icon :size="36" color="#acb0bf" name="bank-transfer-in" />
            <div class="flex flex-col ml-5">
              <span class="font-bold text-gray-400">Gains (Last 30 days)</span>
              <span class="font-semibold text-xl text-green-500"
                >+ {{ state.recentGains }} HRK</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="mb-3 my-5 text-xl font-semibold"> Recent transactions </span>
    <div class="rounded-lg bg-white px-6 shadow-md">
      <div v-if="state.transactionsLoading" class="text-center my-16">
        <progress-spinner strokeWidth="10" class="h-24 w-24" />
      </div>
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5">
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
    <span class="mb-3 my-5 text-xl font-semibold">
      Financial changes visualized
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
import { defineComponent, reactive, watch, inject, onMounted } from "vue";
import { hexToRgba, adjustHexColor } from "../helpers/helpers";
import { add, startOfMonth } from "date-fns";
import { DatasetItem } from "../models/dataset";
import { FinancialChangeItem } from "../models/change-item";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import TransactionCard from "../components/transaction-card.vue";
import { getService, Types } from "../di-container";
import { ITransactionService } from "../services/interfaces/transaction-service";
import { GraphOptions } from "@/models/graph";
import { PaymentSource } from "@/models/payment-source";
import { Pagination } from "@/models/pagination";
import MdiIcon from "@/components/mdi-icon.vue";
import { RefreshController } from "@/helpers/refresh";

interface GraphData {
  labels: string[];
  datasets: DatasetItem[];
}

interface State {
  recentWithdrawals: number;
  recentGains: number;
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
}

export default defineComponent({
  name: "Home",
  components: {
    DashboardAmountCard,
    TransactionCard,
    MdiIcon
  },
  setup() {
    const state: State = reactive({
      transactionPageOption: [10, 15],
      recentWithdrawals: 0,
      recentGains: 0,
      dateRange: [],
      total: {
        id: 1,
        description: "Total account balance",
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
          yAxes: [
            {
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
      ).getHistory(1, state.dateRange[0] as Date, state.dateRange[1] as Date);

      state.total.currentAmount = history[history.length - 1].total;

      state.totalDataset = {
        label: "Total",
        data: history.map((x) => x.total),
        fill: true,
        borderColor: "#ff8a00",
        backgroundColor: hexToRgba(
          adjustHexColor("#ff8a00".replace("#", ""), -10),
          0.4
        ) as string
      };

      state.graphData = {
        labels: history.map((x) => x.createdAt),
        datasets: [state.totalDataset]
      };

      state.recentWithdrawals = await getService<ITransactionService>(
        Types.ChangeService
      ).getRecentWithdrawals(1);

      state.recentGains = await getService<ITransactionService>(
        Types.ChangeService
      ).getRecentGains(1);

      state.loading = false;
    }

    function pageChanged(paginationInfo: Pagination) {
      const { page, rows } = { ...paginationInfo };
      getTransactions(page * rows, state.numberOfRows);
    }

    onMounted(async () => {
      state.dateRange = [
        startOfMonth(new Date()),
        add(new Date(), { days: 1 })
      ];
      updateData();
    });

    watch(
      () => state.refresh,
      () => updateData(),
      { deep: true }
    );

    return {
      state,
      pageChanged
    };
  }
});
</script>

<style lang="sass">
</style>
