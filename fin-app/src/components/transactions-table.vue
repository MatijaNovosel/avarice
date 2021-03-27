<template>
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
        <tr v-for="transaction in state.transactions" :key="transaction.id">
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
                    "dd.MM.yyyy. HH:mm:ss",
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
</template>

<script lang="ts">
import { FinancialChangeItem } from "@/models/change-item";
import { TableHeaderItem } from "@/models/table";
import { formatDistance, parse } from "date-fns";
import { computed, defineComponent, reactive, watch } from "vue";
import { TagEnum } from "@/constants/tag-enum";

interface Props {
  loading?: boolean;
  transactions?: FinancialChangeItem[];
}

interface State {
  loading?: boolean;
  transactions?: FinancialChangeItem[];
  totalTransactions: number;
}

export default defineComponent({
  name: "transactions-table",
  props: {
    loading: Boolean,
    transactions: null
  },
  setup(props: Props) {
    const state: State = reactive({
      loading: props.loading,
      transactions: props.transactions,
      totalTransactions: computed(() => state.transactions?.length as number)
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
      }
    ];

    watch(
      () => props.loading,
      val => (state.loading = val)
    );

    watch(
      () => props.transactions,
      val => (state.transactions = val)
    );

    return {
      state,
      headers,
      formatDistance,
      parse,
      TagEnum
    };
  }
});
</script>
