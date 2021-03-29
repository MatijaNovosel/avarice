<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="state.headers"
        :items="state.transactions"
        :items-per-page="15"
        class="elevation-2"
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
            v-for="(tag, i) in item.tagIds"
            :key="i"
            class="mr-2"
            :color="item.expense ? 'error' : 'success'"
          >
            {{ tag }}
          </v-chip>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import { ITransactionService } from "@/interfaces/transactionService";
import { FinancialChangeItem } from "@/models/change-item";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  SetupContext
} from "@vue/composition-api";
import { formatDistance, parse } from "date-fns";
import { TagEnum } from "@/constants/tag-enum";
import { formatCurrencyDisplay } from "@/helpers";

interface State {
  transactions: FinancialChangeItem[];
  totalTransactions: number;
  headers: any;
}

export default defineComponent({
  name: "History",
  setup(props, context: SetupContext) {
    const state: State = reactive({
      transactions: [],
      totalTransactions: 0,
      headers: computed(() => {
        return [
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
            sortable: false
          }
        ];
      })
    });

    onMounted(async () => {
      context.emit("set-loading", true);
      const itemCollection = await getService<ITransactionService>(
        Types.ChangeService
      ).getChanges(1);
      state.transactions = itemCollection.items;
      state.totalTransactions = itemCollection.count;
      context.emit("set-loading", false);
    });

    return {
      state,
      formatDistance,
      parse,
      TagEnum,
      formatCurrencyDisplay
    };
  }
});
</script>
