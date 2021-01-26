<template>
  <div class="flex flex-col mb-5">
    <div class="overflow-x-auto">
      <div class="py-2 min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
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
            <tbody class="bg-white divide-y divide-gray-200">
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
                <td class="px-6 whitespace-nowrap space-x-2 text-center">
                  <tag
                    v-for="(tag, i) in transaction.tagIds"
                    :key="i"
                    :text-color="transaction.expense ? '#c52626' : '#428733'"
                    :color="transaction.expense ? '#ff9494' : '#bedeb7'"
                    >{{ formatTag(tag) }}</tag
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import { FinancialChangeItem } from "@/models/change-item";
import { IChangeService } from "@/services/interfaces/transaction-service";
import { defineComponent, onMounted, reactive } from "vue";
import { formatTag } from "@/helpers/helpers";
import { formatDistance, parse } from "date-fns";
import { TableHeaderItem } from "@/models/table";

interface State {
  transactions: FinancialChangeItem[];
  loading: boolean;
  totalTransactions: number;
  transactionsNumberOfPages: number;
  numberOfRows: number;
}

export default defineComponent({
  name: "History",
  setup() {
    const state: State = reactive({
      transactions: [],
      loading: false,
      totalTransactions: 0,
      transactionsNumberOfPages: 0,
      numberOfRows: 16
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

    async function getTransactions(skip?: number, take?: number) {
      state.loading = true;

      const itemCollection = await getService<IChangeService>(
        Types.ChangeService
      ).getChanges(1, skip, take);

      state.transactions = itemCollection.items;
      state.totalTransactions = itemCollection.count;
      state.transactionsNumberOfPages = Math.floor(
        state.totalTransactions / state.numberOfRows
      );

      state.loading = false;
    }

    onMounted(() => {
      getTransactions(0, state.numberOfRows);
    });

    return {
      state,
      formatTag,
      formatDistance,
      parse,
      headers
    };
  }
});
</script>
