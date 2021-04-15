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
            @change="search"
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
            @change="search"
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
            @change="search"
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
            @change="search"
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
          {{ item.account }}
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
import { IPaymentSourceService } from "@/interfaces/paymentSourceService";
import { AppUser } from "@/models/user";

interface SearchInput {
  description: string | null;
  transactionType: TransactionType | null;
  tags: number[];
  account: number | null;
  showTransfers: boolean;
}

interface State {
  transactions: FinancialChangeItem[];
  totalTransactions: number;
  search: SearchInput;
  tags: Tag[];
  accounts: any;
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
        transactionType: null,
        tags: [],
        account: null,
        showTransfers: false
      },
      totalTransactions: 0,
      tags: [],
      accounts: []
    });

    async function getData() {
      await context.root.$store.dispatch("app/setLoading", true);
      const itemCollection = await getService<ITransactionService>(
        Types.TransactionService
      ).getChanges(
        1,
        null,
        null,
        state.search.description || "",
        null,
        null,
        state.search.tags,
        state.search.transactionType,
        state.search.account,
        state.search.showTransfers
      );
      state.transactions = itemCollection.items;
      state.totalTransactions = itemCollection.count;
      await context.root.$store.dispatch("app/setLoading", false);
    }

    onMounted(async () => {
      state.accounts = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getAllByUserId(
        (context.root.$store.getters["user/data"] as AppUser).id as number
      );
      state.tags = await getService<ITagService>(Types.TagService).getTags(
        (context.root.$store.getters["user/data"] as AppUser).id as number
      );
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
      transactionTypes,
      TransactionType
    };
  }
});
</script>
