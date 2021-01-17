<template>
  <div class="mb-10 px-8 flex flex-col">
    <span class="mb-3 text-xl font-semibold"> Accounts </span>
    <div class="grid grid-cols-1 md:grid-cols-3">
      <dashboard-amount-card
        :icon="state.total.icon"
        :title="state.total.description"
        :loading="state.loading"
        color="#acb0bf"
        :amount="state.total.currentAmount"
        :amount-visible="state.total.visible"
        currency="HRK"
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
import { getService, Types } from "../di-container";
import { IChangeService } from "../services/interfaces/change-service";
import { GraphOptions } from "@/models/graph";
import { PaymentSource } from "@/models/payment-source";
import { Pagination } from "@/models/pagination";

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
  // eslint-disable-next-line
  refresh: any;
  transactionsNumberOfPages: number;
  totalTransactions: number;
  numberOfRows: number;
  transactionsOffset: number;
  totalDataset: DatasetItem | null;
  graphOptions: GraphOptions;
  total: PaymentSource;
}

export default defineComponent({
  name: "Home",
  components: {
    DashboardAmountCard
  },
  setup() {
    const state: State = reactive({
      recentWithdrawals: 0,
      recentGains: 0,
      dateRange: [],
      total: {
        id: 1,
        description: "Total account balance",
        currency: "HRK",
        icon: "scale",
        currentAmount: 0,
        visible: false
      },
      totalDataset: null,
      transactionsNumberOfPages: 0,
      transactionsOffset: 0,
      totalTransactions: 0,
      numberOfRows: 32,
      refresh: inject("refresh"),
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

      const itemCollection = await getService<IChangeService>(
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

      const history = await getService<IChangeService>(
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

      state.recentWithdrawals = await getService<IChangeService>(
        Types.ChangeService
      ).getRecentWithdrawals(1);

      state.recentGains = await getService<IChangeService>(
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
