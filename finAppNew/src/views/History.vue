<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="state.search.description"
            hide-details
            dense
            outlined
            @input="search"
            label="Description"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :items="state.tags"
            hide-details
            multiple
            clearable
            dense
            outlined
            :return-object="false"
            item-text="description"
            item-value="id"
            label="Tags"
          />
        </v-col>
        <v-col cols="12" md="6">
          <date-time-picker
            label="From"
            :text-field-props="{
              'hide-details': true,
              dense: true,
              outlined: true
            }"
          />
        </v-col>
        <v-col cols="12" md="6">
          <date-time-picker
            label="To"
            :text-field-props="{
              'hide-details': true,
              dense: true,
              outlined: true
            }"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :items="transactionTypes"
            v-model="state.search.transactionType"
            hide-details
            dense
            multiple
            outlined
            :return-object="false"
            label="Transaction type"
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex">
          <v-range-slider
            hint="[20, 1200] HRK"
            persistent-hint
            label="Amount"
            step="10"
            ticks="always"
            tick-size="4"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="state.transactions"
        :items-per-page="15"
        class="rounded-lg"
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
            v-for="(tag, i) in item.tags"
            :key="i"
            class="mr-2"
            :color="item.expense ? 'error' : 'success'"
          >
            {{ tag.description }}
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
  defineComponent,
  onMounted,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import { formatDistance, parse } from "date-fns";
import { TagEnum } from "@/constants/tag-enum";
import { createSelectFromEnum, formatCurrencyDisplay } from "@/helpers";
import { debounce } from "debounce/index";
import { Tag } from "@/models/tag";
import { ITagService } from "@/interfaces/tagService";
import { TransactionType } from "@/constants/transactionTypes";

interface SearchInput {
  description: string | null;
  transactionType: TransactionType[] | null;
}

interface State {
  transactions: FinancialChangeItem[];
  totalTransactions: number;
  search: SearchInput;
  tags: Tag[];
}

export default defineComponent({
  name: "History",
  setup(props, context: SetupContext) {
    const transactionTypes = createSelectFromEnum(
      "transactionType",
      TransactionType
    );

    const state: State = reactive({
      transactions: [],
      search: {
        description: null,
        transactionType: null
      },
      totalTransactions: 0,
      tags: []
    });

    async function getData() {
      await context.root.$store.dispatch("app/setLoading", true);
      const itemCollection = await getService<ITransactionService>(
        Types.ChangeService
      ).getChanges(1, null, null, state.search.description || "", null, null);
      state.transactions = itemCollection.items;
      state.totalTransactions = itemCollection.count;
      await context.root.$store.dispatch("app/setLoading", false);
    }

    onMounted(async () => {
      state.tags = await getService<ITagService>(Types.TagService).getTags(1);
      getData();
    });

    const search = debounce(() => {
      getData();
    }, 750);

    watch(
      () => context.root.$store.getters["app/refreshTrigger"] as boolean,
      () => {
        getData();
      }
    );

    const headers = [
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
        sortable: false,
        align: "center"
      }
    ];

    return {
      state,
      formatDistance,
      parse,
      TagEnum,
      headers,
      formatCurrencyDisplay,
      search,
      transactionTypes
    };
  }
});
</script>
