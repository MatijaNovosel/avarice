<template>
  <div class="row justify-between bg-grey-10 q-py-md q-pr-md q-pl-lg items-center rounded-t-md">
    <span class="text-grey-6"> Transactions </span>
    <div class="row">
      <q-btn v-if="!hidePageSelection" no-caps class="bg-accent q-mr-md rounded">
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
      <q-btn
        v-if="!hideSelectAll"
        @click="setSelectionMode"
        :disable="state.transactions.total === 0"
        flat
        dense
        :class="{
          'bg-grey-9': !state.multiple,
          'bg-blue-7': state.multiple
        }"
        class="q-mr-md rounded"
      >
        <q-icon class="q-pa-xs" name="mdi-selection-multiple" size="sm" />
        <q-tooltip> Select multiple records </q-tooltip>
      </q-btn>
      <q-btn flat dense class="q-mr-md rounded bg-grey-9">
        <q-icon class="q-pa-xs" name="mdi-tune-variant" size="sm" />
        <q-badge v-if="activeFilters" rounded color="accent" floating align="top" />
        <q-menu>
          <div class="column no-wrap q-pa-md">
            <q-select
              clearable
              filled
              dense
              hide-bottom-space
              v-model="state.transactionType"
              :options="transactionTypeOptions"
              option-value="value"
              option-label="label"
              map-options
              emit-value
              label="Transaction type"
              @update:model-value="searchDebounce"
              :style="{
                width: '300px'
              }"
            />
            <q-select
              hide-bottom-space
              options-dense
              filled
              dense
              v-model="state.categoryType"
              :options="categories"
              label="Category"
              option-value="id"
              option-label="name"
              @update:model-value="searchDebounce"
              class="q-mt-sm"
              clearable
              emit-value
              map-options
            >
              <template #selected-item="scope">
                <q-item class="q-px-none q-pb-sm q-pt-md">
                  <q-item-section avatar>
                    <q-icon :style="{ color: scope.opt.color }" :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      {{ (scope.opt.parent && scope.opt.parent.name) || "No parent category" }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #option="scope">
                <q-item class="q-py-sm" v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon
                      :style="{ color: scope.opt.color }"
                      :name="scope.opt.icon"
                      :color="scope.opt.color"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      {{ (scope.opt.parent && scope.opt.parent.name) || "No parent category" }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn size="sm" class="q-mt-sm" color="accent" :disable="!activeFilters">
              Clear
            </q-btn>
          </div>
        </q-menu>
      </q-btn>
      <q-btn flat dense class="q-mr-md rounded bg-grey-9">
        <q-icon class="q-pa-xs" name="mdi-information" size="sm" />
        <q-tooltip> Tip: You can right click on a row to display cooresponding actions! </q-tooltip>
      </q-btn>
      <q-input
        @update:model-value="searchDebounce"
        v-model="state.search"
        dense
        filled
        label="Search"
        clearable
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
    class="rounded-b-md q-pa-md rounded-t-none bg-dark-2"
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
        <q-checkbox size="sm" v-model="state.selectAll" @update:model-value="selectAllTriggered" />
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
            :class="`bg-${TRANSACTION_TYPE_COLOR[props.row.transactionType]}-6`"
          >
            <q-icon
              :name="TRANSACTION_TYPE_ICON[props.row.transactionType]"
              size="1.3em"
              :class="`text-${TRANSACTION_TYPE_COLOR[props.row.transactionType]}-2`"
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
        <q-td key="description" :props="props" class="text-grey-7">
          {{ props.row.description || "No description" }}
        </q-td>
        <q-td
          key="amount"
          :props="props"
          :class="`text-${TRANSACTION_TYPE_COLOR[props.row.transactionType]}`"
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
  <div class="row justify-end q-mt-md" v-if="state.transactions && state.transactions.total !== 0">
    <q-pagination
      direction-links
      v-model="state.pagination.page"
      color="grey-9"
      :max="pagesNumber"
      :max-pages="5"
      @update:model-value="searchDebounce"
    />
  </div>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import { debounce, useQuasar } from "quasar";
import { ITransactionModel } from "src/api/client";
import IAccountService from "src/api/interfaces/accountService";
import ITransactionService from "src/api/interfaces/transactionService";
import { getService, Types } from "src/di-container";
import { PageableCollection, SelectItem } from "src/models/common";
import { QuasarTableColumn, QuasarTablePagination } from "src/models/quasar";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";
import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_COLOR,
  TRANSACTION_TYPE_ICON
} from "src/utils/constants";
import { formatBalance } from "src/utils/helpers";
import { computed, onMounted, reactive, watch } from "vue";

interface TransactionModelExtended extends ITransactionModel {
  id: number;
  selected: boolean;
}

interface State {
  pagination: QuasarTablePagination;
  categoryType: number | null;
  search: string;
  transactions: PageableCollection<TransactionModelExtended>;
  loading: boolean;
  selectAll: boolean;
  selectedRows: number[];
  multiple: boolean;
  transactionType: string | null;
}

const props = defineProps({
  rowsPerPage: {
    type: Number,
    default: 5
  },
  hidePageSelection: {
    type: Boolean,
    default: false
  },
  hideSelectAll: {
    type: Boolean,
    default: false
  }
});

const $q = useQuasar();
const userStore = useUserStore();
const { categories } = storeToRefs(userStore);
const appStore = useAppStore();
const { transactionsChangeNotifier } = storeToRefs(appStore);
const rowsPerPageOptions = [5, 10, 15];

const activeFilters = computed(() => state.transactionType || state.categoryType);

const pagesNumber = computed(() => {
  if (state.transactions) {
    return Math.ceil(state.transactions.total / state.pagination.rowsPerPage);
  }
  return 0;
});

const state: State = reactive({
  selectionMode: "none",
  transactionType: null,
  multiple: false,
  categoryType: null,
  selectedRows: [],
  search: "",
  transactions: {
    data: [],
    total: 0
  },
  pagination: {
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 15
  },
  loading: false,
  selectAll: false
});

const columns = computed(() => {
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

  if (state.multiple) {
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

const getTransactions = async () => {
  try {
    state.loading = true;
    const { total, results } = await getService<ITransactionService>(
      Types.TransactionService
    ).getAll(
      state.pagination.rowsPerPage,
      state.pagination.page - 1,
      state.search || "",
      state.transactionType,
      state.categoryType
    );

    if (results) {
      state.transactions = {
        data: results?.map((t) => ({
          ...t,
          selected: false
        })),
        total
      };
    }
  } catch (e) {
    $q.notify({
      message: (e as Error).message,
      color: "dark",
      textColor: "red",
      position: "bottom"
    });
  } finally {
    state.loading = false;
  }
};

const deleteTransaction = async (id: number) => {
  try {
    await getService<ITransactionService>(Types.TransactionService).delete(id);
    $q.notify({
      message: "Transaction deleted!",
      color: "dark",
      position: "bottom",
      textColor: "green"
    });
    appStore.notifyTransactionChanged();
    const fetchedAccounts = await getService<IAccountService>(
      Types.AccountService
    ).getLatestValues();
    userStore.setAccounts(fetchedAccounts);
  } catch (e) {
    $q.notify({
      message: (e as Error).message,
      color: "dark",
      textColor: "red",
      position: "bottom"
    });
  }
};

const selectAllTriggered = () => {
  if (state.transactions) {
    state.transactions.data.forEach((t) => {
      t.selected = state.selectAll;
    });
  }
};

const setSelectionMode = () => {
  state.multiple = !state.multiple;
};

const changeRowsPerPage = async (rows: number) => {
  state.pagination.rowsPerPage = rows;
  await getTransactions();
};

const searchDebounce = debounce(getTransactions, 300);

watch(transactionsChangeNotifier, getTransactions);

const transactionTypeOptions = Object.entries(TRANSACTION_TYPE).map<SelectItem<string, string>>(
  (x) => ({
    label: x[0],
    value: x[1]
  })
);

onMounted(async () => {
  state.pagination.rowsPerPage = props.rowsPerPage; // This is here just to ensure the number of rows renders properly since the initial state doesn't prove fruitful
  await getTransactions();
});
</script>

<style scoped lang="scss">
.q-pagination {
  &::v-deep(.q-btn) {
    margin-left: 10px;
  }
}
</style>
