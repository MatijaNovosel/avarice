<template>
  <div
    class="row justify-between bg-grey-10 q-py-md q-pr-md q-pl-lg items-center rounded-t-md"
    v-if="state.transactions"
  >
    <span class="text-grey-6"> Transactions </span>
    <div class="row">
      <q-btn
        @click="setSelectionMode"
        :disable="state.transactions.total === 0"
        flat
        dense
        :class="{
          'bg-grey-9': state.selectionMode === 'none',
          'bg-blue-7': state.selectionMode === 'multiple'
        }"
        class="q-mr-md rounded"
      >
        <q-icon class="q-pa-xs" name="mdi-selection-multiple" size="sm" />
        <q-tooltip> Select multiple records </q-tooltip>
      </q-btn>
      <q-btn :disable="state.transactions.total === 0" flat dense class="q-mr-md rounded bg-grey-9">
        <q-icon class="q-pa-xs" name="mdi-tune-variant" size="sm" />
        <q-menu>
          <div class="column no-wrap q-pa-md">
            <q-toggle label="Show transfers" />
            <q-toggle label="Bluetooth" />
          </div>
        </q-menu>
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
    hide-bottom
    flat
    dense
    class="rounded-b-md q-pa-md rounded-t-none"
    :rows="state.transactions.data"
    :columns="columns"
    :pagination="state.pagination"
    :rows-per-page-options="rowsPerPageOptions"
    row-key="id"
    separator="none"
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
    <template #header-cell-selection="props">
      <q-th :props="props">
        <q-checkbox size="sm" v-model="state.selectAll" @change="selectAllTriggered" />
      </q-th>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-menu context-menu touch-position>
          <q-list dense>
            <q-item clickable @click="deleteTransaction(props.row.id)">
              <q-item-section>
                <q-item-label> Delete transaction </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> Edit transaction </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label> Create copy of transaction </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        <q-td key="selection" :props="props">
          <q-checkbox size="sm" v-model="props.row.selected" />
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
          <q-btn flat round size="sm">
            <q-icon size="2.6em" name="mdi-dots-horizontal" color="grey" />
            <q-menu>
              <q-list dense>
                <q-item clickable @click="deleteTransaction(props.row.id)">
                  <q-item-section>
                    <q-item-label> Delete transaction </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>
                    <q-item-label> Edit transaction </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>
                    <q-item-label> Create copy of transaction </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <div class="row justify-end q-mt-md">
    <q-btn v-if="!hidePageSelection" no-caps class="bg-accent">
      {{ state.pagination.rowsPerPage }} records per page
      <q-menu auto-close>
        <q-list dense>
          <q-item
            @click="changeRowsPerPage(rows)"
            v-for="(rows, i) in rowsPerPageOptions"
            :key="i"
            clickable
          >
            <q-item-section>
              <q-item-label>
                {{ rows }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
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
import { defineComponent, computed, reactive, onMounted, Ref } from "vue";
import { QuasarTableColumn, QuasarTablePagination } from "src/models/quasar";
import { ITransactionModel } from "src/api/client";
import { format } from "date-fns";
import TransactionType from "src/utils/transactionTypes";
import { formatBalance } from "src/utils/helpers";
import { debounce, useQuasar } from "quasar";
import { getService, Types } from "src/di-container";
import ITransactionService from "src/api/interfaces/transactionService";
import { PageableCollection } from "src/models/common";

interface TransactionModelExtended extends ITransactionModel {
  id: number;
  selected: boolean;
}

interface State {
  pagination: QuasarTablePagination;
  pagesNumber: number;
  search: string | null;
  transactions: PageableCollection<TransactionModelExtended> | null;
  loading: boolean;
  selectAll: boolean;
  selectedRows: number[];
  selectionMode: string;
}

export default defineComponent({
  name: "transactions-table",
  props: {
    rowsPerPage: {
      type: Number,
      default: 5,
      required: false
    },
    hidePageSelection: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  setup(props) {
    const $q = useQuasar();

    const state: State = reactive({
      selectionMode: "none",
      selectedRows: [],
      search: null,
      transactions: null,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: props.rowsPerPage
      },
      loading: false,
      selectAll: false,
      pagesNumber: computed(() => {
        if (state.transactions) {
          return Math.ceil(state.transactions.total / state.pagination.rowsPerPage);
        }
        return 0;
      })
    });

    const columns: Ref<QuasarTableColumn<TransactionModelExtended>[]> = computed(() => {
      let cols: QuasarTableColumn<TransactionModelExtended>[] = [
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
          label: "",
          align: "center",
          field: "actions"
        }
      ];

      if (state.selectionMode === "multiple") {
        cols = [
          {
            name: "selection",
            label: "",
            align: "center",
            field: "selected"
          },
          ...cols
        ];
      }

      return cols;
    });

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

    const searchDebounce = debounce(() => {
      if (state.search && state.search !== "") {
        //
      }
    }, 300);

    const getTransactions = async (description?: string) => {
      state.loading = true;

      try {
        const transactions = await getService<ITransactionService>(Types.TransactionService).getAll(
          state.pagination.rowsPerPage,
          state.pagination.page - 1,
          description || ""
        );

        if (transactions.results) {
          state.transactions = {
            data: transactions.results?.map((t, i) => ({
              ...t,
              id: i + 1,
              selected: false
            })),
            total: transactions.total
          };
        }
      } catch (e) {
        $q.notify({
          message: (e as Error).message,
          color: "dark",
          textColor: "red",
          position: "bottom"
        });
      }

      state.loading = false;
    };

    async function deleteTransaction(id: number) {
      if (state.transactions) {
        const transaction = state.transactions.data.find((t) => t.id === id);
        try {
          if (transaction) {
            await getService<ITransactionService>(Types.TransactionService).delete(
              parseFloat(format(new Date(transaction.createdAt), "yyyyMMddHHmmss"))
            );
            $q.notify({
              message: "Transaction deleted!",
              color: "dark",
              position: "bottom",
              textColor: "green"
            });
            await getTransactions();
          }
        } catch (e) {
          $q.notify({
            message: (e as Error).message,
            color: "dark",
            textColor: "red",
            position: "bottom"
          });
        }
      }
    }

    const selectAllTriggered = () => {
      //
    };

    const setSelectionMode = () => {
      if (state.selectionMode === "none") {
        state.selectionMode = "multiple";
      } else {
        state.selectionMode = "none";
      }
    };

    const paginationUpdated = async () => {
      await getTransactions();
    };

    const changeRowsPerPage = async (rows: number) => {
      state.pagination.rowsPerPage = rows;
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
      paginationUpdated,
      changeRowsPerPage,
      setSelectionMode,
      selectAllTriggered,
      rowsPerPageOptions: [5, 10, 15]
    };
  }
});
</script>

<style scoped lang="scss">
.q-pagination {
  &::v-deep(.q-btn) {
    margin-left: 10px;
  }
}
</style>
