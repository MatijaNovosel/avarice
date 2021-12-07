<template>
  <div
    class="row justify-between bg-grey-10 q-py-md q-pr-md q-pl-lg items-center rounded-t-md"
    v-if="state.transactions"
  >
    <span class="text-grey-6"> Transactions </span>
    <div class="row">
      <q-btn :disable="state.transactions.total === 0" flat dense class="q-mr-md rounded bg-grey-9">
        <q-icon class="q-pa-xs" name="mdi-tune-variant" size="sm" />
      </q-btn>
      <q-input
        @input="searchDebounce"
        v-model="state.search"
        :disable="state.transactions.total === 0"
        dense
        filled
        label="Search"
      >
        <template #prepend>
          <q-icon name="mdi-magnify" />
        </template>
      </q-input>
    </div>
  </div>
  <q-table
    v-if="state.transactions"
    :loading="state.loading"
    hide-pagination
    flat
    dense
    class="rounded-b-md q-pa-md rounded-t-none"
    :rows="state.transactions.results"
    :columns="columns"
    row-key="id"
    separator="none"
    :rows-per-page-options="[5, 10, 15]"
  >
    <template #no-data>
      <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pt-md">
        <q-icon size="2em" name="mdi-database-alert" />
        <span> {{ $t("noTransactionsFound") }}! </span>
      </div>
    </template>
    <template #header-cell-transactionType="props">
      <q-th :props="props">
        <q-icon name="mdi-swap-vertical" size="sm" />
      </q-th>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="transactionType" :props="props">
          <q-btn
            size="sm"
            flat
            dense
            :class="`bg-${formatTransactionColor(props.row.transactionType)}-6`"
          >
            <q-icon
              :name="formatTransactionIcon(props.row.transactionType)"
              size="1.3em"
              :class="`text-${formatTransactionColor(props.row.transactionType)}-2`"
            />
          </q-btn>
        </q-td>
        <q-td key="category" :props="props">
          <q-item class="q-pa-none">
            <q-item-section
              avatar
              :style="{
                color: props.row.category.color
              }"
            >
              <q-icon size="sm" :name="props.row.category.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label> {{ props.row.category.name }} </q-item-label>
              <q-item-label caption class="text-grey-7">
                {{ props.row.category.parentName || "No parent category" }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>
        <q-td
          key="amount"
          :props="props"
          :class="`text-${formatTransactionColor(props.row.transactionType)}`"
        >
          {{ formatBalance(props.row.amount, "HRK") }}
        </q-td>
        <q-td key="account" :props="props">
          {{ props.row.account }}
        </q-td>
        <q-td key="createdAt" :props="props">
          {{ format(props.row.createdAt, "dd.MM.yyyy. HH:mm") }}
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn flat dense class="bg-red-8 rounded" @click="deleteTransaction(props.row.id)">
            <q-icon size="1.3em" name="mdi-close" color="white" />
            <q-tooltip> Delete transaction </q-tooltip>
          </q-btn>
          <q-btn flat dense class="bg-grey-7 rounded q-ml-md">
            <q-icon size="1.3em" name="mdi-pencil" color="white" />
            <q-tooltip> Edit transction </q-tooltip>
          </q-btn>
          <q-btn flat dense class="bg-grey-9 rounded q-ml-md">
            <q-icon size="1.3em" name="mdi-repeat" color="white" />
            <q-tooltip> Create copy of transaction </q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <div class="row justify-end q-mt-md">
    <q-pagination
      direction-links
      v-model="state.pagination.page"
      color="grey-9"
      :max="state.pagesNumber"
      :max-pages="5"
      @update:model-value="paginationUpdated"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, onMounted } from "vue";
import { QuasarTableColumn, QuasarTablePagination } from "src/models/quasar";
import { IPageableCollectionOfTransactionModel, TransactionModel } from "src/api/client";
import { format } from "date-fns";
import TransactionType from "src/utils/transactionTypes";
import { formatBalance } from "src/utils/helpers";
import { debounce } from "quasar";
import { getService, Types } from "src/di-container";
import ITransactionService from "src/api/interfaces/transactionService";

interface State {
  pagination: QuasarTablePagination;
  pagesNumber: number;
  search: string | null;
  transactions: IPageableCollectionOfTransactionModel | null;
  loading: boolean;
}

export default defineComponent({
  name: "transactions-table",
  emits: ["delete-transaction"],
  setup(props, { emit }) {
    const state: State = reactive({
      search: null,
      transactions: null,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5
      },
      loading: false,
      pagesNumber: computed(() => {
        if (state.transactions) {
          return Math.ceil(state.transactions.total / state.pagination.rowsPerPage);
        }
        return 0;
      })
    });

    const columns: QuasarTableColumn<TransactionModel>[] = [
      {
        name: "id",
        label: "N°",
        align: "center",
        field: "id"
      },
      {
        name: "transactionType",
        label: "",
        align: "center",
        field: "transactionType"
      },
      {
        name: "category",
        label: "Category",
        align: "left",
        field: "category"
      },
      {
        name: "description",
        label: "Description",
        align: "left",
        field: "description"
      },
      {
        name: "amount",
        align: "left",
        label: "Amount",
        field: "amount",
        format: (val) => `${val} HRK`
      },
      {
        name: "account",
        label: "Account",
        align: "left",
        field: "account"
      },
      {
        name: "createdAt",
        label: "Created at",
        align: "left",
        field: "createdAt"
      },
      {
        name: "actions",
        label: "Actions",
        align: "center",
        field: "actions"
      }
    ];

    function formatTransactionIcon(transactionType: TransactionType) {
      switch (transactionType) {
        case TransactionType.Transfer:
          return "mdi-swap-horizontal";
        case TransactionType.Income:
          return "mdi-arrow-up";
        case TransactionType.Expense:
          return "mdi-arrow-down";
        default:
          return "mdi-account";
      }
    }

    function formatTransactionColor(transactionType: TransactionType) {
      switch (transactionType) {
        case TransactionType.Transfer:
          return "grey";
        case TransactionType.Income:
          return "green";
        case TransactionType.Expense:
          return "red";
        default:
          return "yellow";
      }
    }

    function deleteTransaction(id: number) {
      emit("delete-transaction", id);
    }

    const searchDebounce = debounce(() => {
      if (state.search && state.search !== "") {
        //
      }
    }, 300);

    const getTransactions = async (description?: string) => {
      state.loading = true;

      const transactions = await getService<ITransactionService>(Types.TransactionService).getAll(
        state.pagination.rowsPerPage,
        state.pagination.page - 1,
        description || ""
      );

      transactions.results?.forEach((t, i) => {
        // eslint-disable-next-line
        t.id = i + 1;
      });

      state.transactions = transactions;
      state.loading = false;
    };

    const paginationUpdated = async () => {
      await getTransactions();
    };

    onMounted(async () => {
      await getTransactions();
    });

    return {
      columns,
      state,
      format,
      formatTransactionIcon,
      formatTransactionColor,
      formatBalance,
      TransactionType,
      deleteTransaction,
      searchDebounce,
      paginationUpdated
    };
  }
});
</script>

<style scoped lang="scss">
.q-field {
  &::v-deep(.q-field__control) {
    border-radius: 10px;
  }
}

.q-pagination {
  &::v-deep(.q-btn) {
    margin-left: 10px;
  }
}
</style>
