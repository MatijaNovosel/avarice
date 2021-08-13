<template>
  <div class="row justify-between bg-white q-pt-md q-pr-md q-pl-xl items-center rounded-t-md">
    <span class="text-weight-bold"> Transactions </span>
    <div class="row">
      <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
        <q-icon class="q-pa-xs" name="mdi-tune-variant" color="grey-9" size="sm" />
      </q-btn>
      <q-input dense filled label="Search">
        <template #prepend>
          <q-icon name="mdi-magnify" />
        </template>
      </q-input>
    </div>
  </div>
  <q-table
    hide-pagination
    flat
    v-model:pagination="state.pagination"
    class="rounded-b-md q-pa-md"
    :rows="state.data"
    :columns="columns"
    row-key="id"
    separator="none"
    :rows-per-page-options="[5, 10, 15]"
  >
    <template #header-cell-expense="props">
      <q-th :props="props">
        <q-icon name="mdi-swap-vertical" size="sm" />
      </q-th>
    </template>
    <template #body-cell-category="props">
      <q-td :props="props">
        <q-item class="q-pa-none">
          <q-item-section avatar>
            <q-icon color="grey-7" size="sm" :name="props.value" />
          </q-item-section>
          <q-item-section>
            <q-item-label> Subcategory </q-item-label>
            <q-item-label caption> Category </q-item-label>
          </q-item-section>
        </q-item>
      </q-td>
    </template>
    <template #body-cell-expense="props">
      <q-td :props="props">
        <q-btn
          flat
          dense
          :class="{
            'bg-green-2': !props.value,
            'bg-red-2': props.value
          }"
          class="rounded"
        >
          <q-icon
            :name="!props.value ? 'mdi-arrow-up' : 'mdi-arrow-down'"
            size="1.3em"
            :color="!props.value ? 'green' : 'red'"
          />
        </q-btn>
      </q-td>
    </template>
  </q-table>
  <div class="row justify-end q-mt-md">
    <q-pagination
      direction-links
      v-model="state.pagination.page"
      color="grey-9"
      :max="state.pagesNumber"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, reactive } from "vue";
import { QuasarTableColumn, QuasarTablePagination } from "src/models/quasar";
import { Transaction } from "src/models/transaction";

const columns: QuasarTableColumn<Transaction>[] = [
  {
    name: "id",
    label: "N°",
    align: "center",
    field: "id"
  },
  {
    name: "expense",
    label: "Expense",
    align: "center",
    field: "expense"
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
    align: "center",
    label: "Amount",
    field: "amount",
    format: (val) => `${val} HRK`
  },
  {
    name: "account",
    label: "Account",
    align: "center",
    field: "account"
  },
  {
    name: "date",
    label: "Date",
    align: "center",
    field: "date"
  }
];

interface Props {
  data: Transaction[];
}

interface State {
  pagination: QuasarTablePagination;
  pagesNumber: number;
  data: Transaction[];
}

export default defineComponent({
  name: "transactions-table",
  props: {
    data: {
      type: Array as PropType<Transaction[]>,
      default: () => []
    }
  },
  setup(props: Props) {
    const state: State = reactive({
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5
      },
      data: props.data,
      pagesNumber: computed(() => Math.ceil(state.data.length / state.pagination.rowsPerPage))
    });

    return {
      columns,
      state
    };
  }
});
</script>

<style scoped lang="scss">
.q-field {
  &::v-deep {
    .q-field__control {
      border-radius: 10px;
    }
  }
}

.q-pagination {
  &::v-deep {
    .q-btn {
      margin-left: 10px;
    }
  }
}
</style>
