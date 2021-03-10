<template>
  <div
    class="px-6 grid grid-cols-12 space-x-0 lg:space-x-5 space-y-4 lg:space-y-0 pb-6"
  >
    <div
      class="col-span-12 lg:col-span-3 rounded-lg dark:bg-gray-800 bg-white border dark:border-0 border-gray-300 text-center lg:h-72 pb-6"
    >
      <div
        class="w-full dark:bg-gray-700 bg-gray-100 rounded-t-lg py-2 border-b dark:border-0 border-gray-300 flex items-center justify-center relative"
      >
        <span class="text-gray-400 uppercase tracking-wider">Filters</span>
        <mdi-icon
          class="cursor-pointer absolute top-2 right-5"
          :size="15"
          name="export"
          v-tooltip.bottom="'Export'"
          :color="state.darkMode ? '#ffffff' : '#000000'"
        />
      </div>
      <progress-spinner
        class="w-10 h-10 mt-5"
        strokeWidth="10"
        v-if="state.optionsLoading"
      />
      <div class="px-5 pt-5 space-y-5" v-else>
        <input
          type="text"
          placeholder="Description"
          @input="search"
          v-model="state.search.description"
          class="w-full px-4 py-2 text-base dark:text-gray-400 text-black transition duration-500 ease-in-out transform dark:bg-gray-900 bg-gray-100 rounded-lg focus:outline-none"
        />
        <calendar
          dateFormat="dd.mm.yy"
          class="w-full"
          v-model="state.dateRange"
          placeholder="Time period"
          selectionMode="range"
          :manualInput="false"
        />
        <div
          class="flex flex-col px-5 pt-5 pb-3 dark:bg-gray-900 bg-gray-100 rounded-lg"
        >
          <slider
            class="mx-3"
            :max="state.transactionAmountRange.max"
            :min="state.transactionAmountRange.min"
            :range="true"
            v-model="state.sliderRange"
          />
          <div class="flex justify-between mt-4 dark:text-gray-400">
            <span>{{ state.sliderRange[0] }} HRK</span>
            <span>{{ state.sliderRange[1] }} HRK</span>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto col-span-12 lg:col-span-9">
      <div class="min-w-full">
        <transactions-table
          :transactions="state.transactions"
          :loading="state.loading"
        />
        <paginator
          v-model:first="state.transactionsOffset"
          v-model:rows="state.numberOfRows"
          :totalRecords="state.totalTransactions"
          :rowsPerPageOptions="state.pageOptions"
          :pageLinkSize="state.numberOfPages"
          @page="pageChanged"
          class="pb-2 dark:bg-gray-700 bg-gray-100 rounded-b-lg border-gray-300 dark:border-0 dark:text-gray-300 border-b border-l border-r"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import {
  FinancialChangeItem,
  TransactionAmountRange
} from "@/models/change-item";
import { ITransactionService } from "@/services/interfaces/transaction-service";
import {
  defineComponent,
  onMounted,
  reactive,
  inject,
  watch,
  computed
} from "vue";
import { formatDistance, parse } from "date-fns";
import { Pagination } from "@/models/pagination";
import { TagEnum } from "@/constants/tag-enum";
import { debounce } from "@/helpers/helpers";
import { RefreshController } from "@/helpers/refresh";
import MDIIcon from "@/components/mdi-icon.vue";
import { useStore } from "vuex";
import TransactionsTable from "../components/transactions-table.vue";

interface Search {
  description: string;
}

interface State {
  transactions: FinancialChangeItem[];
  loading: boolean;
  optionsLoading: boolean;
  darkMode: boolean;
  totalTransactions: number;
  numberOfPages: number;
  numberOfRows: number;
  pageOptions: number[];
  transactionsOffset: number;
  search: Search;
  sliderRange: Array<number | null>;
  transactionAmountRange: TransactionAmountRange;
  currentPage: number;
  dateRange: Date[] | null;
  refresh: RefreshController;
}

export default defineComponent({
  name: "History",
  components: {
    "mdi-icon": MDIIcon,
    TransactionsTable
  },
  setup() {
    const store = useStore();

    const state: State = reactive({
      optionsLoading: false,
      darkMode: computed(() => store.getters.darkMode),
      refresh: inject("refresh") as RefreshController,
      dateRange: null,
      transactionAmountRange: {
        min: null,
        max: null
      },
      sliderRange: [null, null],
      transactions: [],
      loading: false,
      totalTransactions: 0,
      numberOfPages: 5,
      numberOfRows: 10,
      pageOptions: [10, 15],
      currentPage: 0,
      transactionsOffset: 0,
      search: {
        description: ""
      }
    });

    async function getTransactions() {
      state.loading = true;

      const itemCollection = await getService<ITransactionService>(
        Types.ChangeService
      ).getChanges(
        1,
        state.currentPage * state.numberOfRows,
        state.numberOfRows,
        state.search.description.trim(),
        state.sliderRange[0],
        state.sliderRange[1]
      );

      state.transactions = itemCollection.items;
      state.totalTransactions = itemCollection.count;

      state.loading = false;
    }

    const pageChanged: (...payload: unknown[]) => unknown = payload => {
      const { page } = { ...(payload as Pagination) };
      state.currentPage = page;
      getTransactions();
    };

    async function getSliderRange() {
      state.optionsLoading = true;
      state.transactionAmountRange = await getService<ITransactionService>(
        Types.ChangeService
      ).getTransactionAmountRange(store.getters.user.id);
      state.sliderRange = [
        state.transactionAmountRange.min as number,
        state.transactionAmountRange.max as number
      ];
      state.optionsLoading = false;
    }

    async function updateData() {
      getTransactions();
      getSliderRange();
    }

    onMounted(() => {
      updateData();
    });

    const search = debounce(() => {
      state.currentPage = 0;
      state.transactionsOffset = 0;
      getTransactions();
    }, 2000);

    watch(
      () => state.refresh,
      () => updateData(),
      { deep: true }
    );

    return {
      state,
      formatDistance,
      parse,
      pageChanged,
      TagEnum,
      search,
      getSliderRange
    };
  }
});
</script>
