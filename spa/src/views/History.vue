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
            @input="searchDebounce"
            label="Description"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :items="state.accounts"
            hide-details
            v-model="state.search.account"
            clearable
            dense
            outlined
            :return-object="false"
            item-text="description"
            item-value="id"
            label="Account"
            @change="searchDebounce"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :items="state.tags"
            hide-details
            v-model="state.search.tags"
            multiple
            clearable
            dense
            outlined
            :return-object="false"
            item-text="description"
            item-value="id"
            label="Tags"
            @change="searchDebounce"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :items="transactionTypes"
            v-model="state.search.transactionType"
            hide-details
            dense
            outlined
            clearable
            :return-object="false"
            label="Transaction type"
            item-text="text"
            item-value="value"
            @change="searchDebounce"
          >
            <template #item="{ item, on, attrs }">
              <span
                v-on="on"
                v-bind="attrs"
                :class="{
                  'error--text': item.value == TransactionType.WITHDRAWAL,
                  'success--text': item.value == TransactionType.DEPOSIT
                }"
                class="text-body-1"
              >
                {{ item.text }}
              </span>
            </template>
            <template #selection="{ item }">
              <span
                :class="{
                  'error--text':
                    state.search.transactionType == TransactionType.WITHDRAWAL,
                  'success--text':
                    state.search.transactionType == TransactionType.DEPOSIT
                }"
                class="text-body-1"
              >
                {{ item.text }}
              </span>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-range-slider
            hint="[20, 1200] HRK"
            persistent-hint
            label="Amount"
            step="10"
            ticks="always"
            tick-size="4"
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-switch
            dense
            hide-details
            label="Show transfers"
            v-model="state.search.showTransfers"
            @change="searchDebounce"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        @update:options="optionsUpdated"
        :footer-props="{ itemsPerPageOptions: state.itemsPerPageItems }"
        :items="state.transactions"
        :server-items-length="state.totalTransactions"
        :options="state.options"
        :items-per-page="15"
        class="rounded-lg"
      >
        <template #item.createdAt="{ item }">
          {{ format(new Date(item.createdAt), "dd.MM.yyyy. HH:mm") }}
          <span class="grey--text">
            ({{
              formatDistance(new Date(item.createdAt), new Date(), {
                addSuffix: true
              })
            }})
          </span>
        </template>
        <template #item.description="{ item }">
          <span
            class="font-weight-bold"
            :class="{
              'error--text': item.expense,
              'success--text': !item.expense
            }"
          >
            {{ item.description }}
          </span>
        </template>
        <template #item.amount="{ item }">
          {{ formatCurrencyDisplay(true, item.amount, "HRK") }}
        </template>
        <template #item.account="{ item }">
          {{ item.account.description }}
        </template>
        <template #item.tags="{ item }">
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
import {
  defineComponent,
  onMounted,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import { formatDistance, format } from "date-fns";
import { TagEnum } from "@/constants/tag-enum";
import { createSelectFromEnum, formatCurrencyDisplay } from "@/helpers";
import { debounce } from "debounce/index";
import { ITagService } from "@/interfaces/tagService";
import { TransactionType } from "@/constants/transactionTypes";
import { IAccountService } from "@/interfaces/accountService";
import { User } from "@/models/user";
import { AccountModel, TagModel, TransactionModel } from "@/apiClient/client";
import IGridOptions from "@/models/gridOptions";
import { stat } from "fs";

interface SearchInput {
  description: string | null;
  transactionType: TransactionType | null;
  tags: number[];
  account: number | null;
  showTransfers: boolean;
}

interface State {
  transactions: TransactionModel[];
  totalTransactions: number;
  search: SearchInput;
  tags: TagModel[];
  accounts: AccountModel[];
  options: IGridOptions;
  itemsPerPageItems: number[];
  searchReady: boolean;
}

export default defineComponent({
  name: "History",
  setup(props, context: SetupContext) {
    const transactionTypes = createSelectFromEnum(
      "transactionType",
      TransactionType
    );

    const state: State = reactive({
      searchReady: false,
      transactions: [],
      search: {
        description: null,
        transactionType: null,
        tags: [],
        account: null,
        showTransfers: false
      },
      totalTransactions: 0,
      tags: [],
      accounts: [],
      itemsPerPageItems: [10, 25, 50],
      options: {
        page: 1,
        itemsPerPage: 25
      }
    });

    function searchTransactions() {
      state.searchReady = true;

      if (state.options.page != 1) {
        const itemsPerPage = state.options.itemsPerPage;
        state.options = {
          page: 1,
          itemsPerPage: itemsPerPage
        };
      } else {
        getData();
      }
    }

    async function getData() {
      await context.root.$store.dispatch("app/setLoading", true);
      const transactions = await getService<ITransactionService>(
        Types.TransactionService
      ).getTransactions(
        (context.root.$store.getters["user/data"] as User).id,
        (state.options.page - 1) * state.options.itemsPerPage,
        state.options.itemsPerPage
      );
      state.transactions = transactions.results as TransactionModel[];
      state.totalTransactions = transactions.total;
      await context.root.$store.dispatch("app/setLoading", false);
    }

    function optionsUpdated(options: IGridOptions) {
      state.options = options;
      getData();
    }

    onMounted(async () => {
      state.accounts = await getService<IAccountService>(
        Types.AccountService
      ).getAllByUserId((context.root.$store.getters["user/data"] as User).id);
      state.tags = await getService<ITagService>(Types.TagService).getTags(
        (context.root.$store.getters["user/data"] as User).id
      );
      getData();
    });

    const searchDebounce = debounce(() => {
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
        text: "Account",
        value: "account",
        sortable: false
      },
      {
        text: "Created at",
        value: "createdAt",
        sortable: false
      },
      {
        text: "Tags",
        value: "tags",
        sortable: false,
        align: "center"
      }
    ];

    return {
      state,
      formatDistance,
      TagEnum,
      headers,
      formatCurrencyDisplay,
      searchDebounce,
      transactionTypes,
      TransactionType,
      format,
      optionsUpdated,
      searchTransactions
    };
  }
});
</script>
