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
        <div
          class="shadow overflow-hidden rounded-t-lg dark:border-0 border-gray-300 border"
        >
          <table class="min-w-full divide-y dark:divide-gray-900">
            <thead class="dark:bg-gray-700 bg-gray-50">
              <tr>
                <th
                  v-for="(header, i) in headers"
                  :key="i"
                  scope="col"
                  :class="{
                    'text-left': header.align == 'left',
                    'text-center': header.align == 'center',
                    'text-right': header.align == 'right'
                  }"
                  class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                >
                  {{ header.text }}
                </th>
              </tr>
            </thead>
            <tbody
              v-if="!state.loading"
              class="dark:bg-gray-800 bg-white divide-y dark:divide-gray-900 divide-gray-200 dark:text-gray-300"
            >
              <tr
                v-for="transaction in state.transactions"
                :key="transaction.id"
              >
                <td class="pl-6 py-5 whitespace-nowrap">
                  {{ transaction.description }}
                </td>
                <td class="px-6 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.amount }} HRK
                </td>
                <td class="px-6 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ transaction.createdAt }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{
                      formatDistance(
                        parse(
                          transaction.createdAt,
                          "dd.MM.yyyy. HH:mm",
                          new Date()
                        ),
                        new Date(),
                        {
                          addSuffix: true
                        }
                      )
                    }}
                  </div>
                </td>
                <td class="whitespace-nowrap space-x-2 text-center">
                  <tag
                    v-for="(tag, i) in transaction.tagIds"
                    :key="i"
                    :text-color="transaction.expense ? '#c52626' : '#428733'"
                    :color="transaction.expense ? '#ff9494' : '#bedeb7'"
                    >{{ $t(`tags.${TagEnum[tag]}`) }}</tag
                  >
                </td>
                <td
                  class="px-6 whitespace-nowrap text-center text-sm font-medium"
                >
                  <a href="#" class="text-indigo-600 hover:text-indigo-900"
                    >Edit</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <progress-bar v-if="state.loading" mode="indeterminate" class="h-2" />
          <div
            v-if="!state.loading && state.totalTransactions == 0"
            class="py-5 text-center w-full dark:bg-gray-800 bg-white border-t dark:text-gray-400 border-b dark:border-gray-900 border-gray-200"
          >
            {{ $t("noItemsFound") }}
          </div>
        </div>
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
import { TableHeaderItem } from "@/models/table";
import { Pagination } from "@/models/pagination";
import { TagEnum } from "@/constants/tag-enum";
import { debounce } from "@/helpers/helpers";
import { RefreshController } from "@/helpers/refresh";
import MDIIcon from "@/components/mdi-icon.vue";
import { useStore } from "vuex";

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
    "mdi-icon": MDIIcon
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
      numberOfRows: 20,
      pageOptions: [20, 30],
      currentPage: 0,
      transactionsOffset: 0,
      search: {
        description: ""
      }
    });

    const headers: TableHeaderItem[] = [
      {
        text: "Description",
        align: "left"
      },
      {
        text: "Amount",
        align: "left"
      },
      {
        text: "Date",
        align: "left"
      },
      {
        text: "Tags",
        align: "center"
      },
      {
        text: "",
        align: "left"
      }
    ];

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
      ).getTransactionAmountRange(1);
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
      headers,
      pageChanged,
      TagEnum,
      search,
      getSliderRange
    };
  }
});
</script>
