<template>
  <div class="flex flex-col sm:px-6 lg:px-8">
    <div class="mb-5 grid grid-cols-2 gap-5 items-center">
      <span class="p-float-label w-full">
        <input-text
          class="rounded-lg"
          v-model="state.search.description"
          @input="search"
          name="description"
          id="description"
        />
        <label for="description">Description</label>
      </span>
      <div class="flex flex-col space-y-4">
        <slider
          class="mx-5"
          :max="state.transactionAmountRange.max"
          :min="state.transactionAmountRange.min"
          :range="true"
          v-model="state.sliderRange"
        />
        <div class="flex justify-between">
          <span>{{ state.sliderRange[0] }} HRK</span>
          <span>{{ state.sliderRange[1] }} HRK</span>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto">
      <div class="min-w-full">
        <div class="shadow overflow-hidden rounded-t-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="(tableHeader, i) in headers"
                  :key="i"
                  scope="col"
                  :class="{
                    'text-left': tableHeader.align == 'left',
                    'text-center': tableHeader.align == 'center',
                    'text-right': tableHeader.align == 'right'
                  }"
                  class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ tableHeader.text }}
                </th>
              </tr>
            </thead>
            <tbody
              v-if="!state.loading"
              class="bg-white divide-y divide-gray-200"
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
                  <div class="text-sm text-gray-900">
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
            v-if="!state.loading && state.transactions.length == 0"
            class="py-5 text-center w-full bg-white border-t border-b border-gray-200"
          >
            <span>No records found!</span>
          </div>
        </div>
      </div>
    </div>
    <paginator
      v-model:first="state.transactionsOffset"
      v-model:rows="state.numberOfRows"
      :totalRecords="state.totalTransactions"
      :rowsPerPageOptions="state.pageOptions"
      :pageLinkSize="state.numberOfPages"
      @page="pageChanged"
      class="pb-2 bg-gray-200 rounded-b-lg"
    />
  </div>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import {
  FinancialChangeItem,
  TransactionAmountRange
} from "@/models/change-item";
import { ITransactionService } from "@/services/interfaces/transaction-service";
import { defineComponent, onMounted, reactive } from "vue";
import { formatDistance, parse } from "date-fns";
import { TableHeaderItem } from "@/models/table";
import { Pagination } from "@/models/pagination";
import { TagEnum } from "@/constants/tag-enum";
import { debounce } from "@/helpers/helpers";

interface Search {
  description: string;
}

interface State {
  transactions: FinancialChangeItem[];
  loading: boolean;
  totalTransactions: number;
  numberOfPages: number;
  numberOfRows: number;
  pageOptions: number[];
  transactionsOffset: number;
  search: Search;
  sliderRange: Array<number | null>;
  transactionAmountRange: TransactionAmountRange;
  currentPage: number;
}

export default defineComponent({
  name: "History",
  setup() {
    const state: State = reactive({
      transactionAmountRange: {
        min: null,
        max: null
      },
      sliderRange: [null, null],
      transactions: [],
      loading: false,
      totalTransactions: 0,
      numberOfPages: 0,
      numberOfRows: 10,
      pageOptions: [10, 15],
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
      state.numberOfPages = Math.floor(
        state.totalTransactions / state.numberOfRows
      );

      state.loading = false;
    }

    function pageChanged(paginationInfo: Pagination) {
      const { page } = { ...paginationInfo };
      state.currentPage = page;
      getTransactions();
    }

    onMounted(async () => {
      getTransactions();
      state.transactionAmountRange = await getService<ITransactionService>(
        Types.ChangeService
      ).getTransactionAmountRange(1);
      state.sliderRange = [
        state.transactionAmountRange.min as number,
        state.transactionAmountRange.max as number
      ];
    });

    const search = debounce(() => {
      state.currentPage = 0;
      state.transactionsOffset = 0;
      getTransactions();
    }, 2000);

    return {
      state,
      formatDistance,
      parse,
      headers,
      pageChanged,
      TagEnum,
      search
    };
  }
});
</script>
