<template>
  <div class="row">
    <div class="col-3 q-pr-lg p-rel">
      <q-list class="bg-white q-pa-md rounded">
        <q-item class="bg-orange-2 rounded q-mb-sm">
          <q-item-section>
            <q-item-label class="text-weight-medium"> Pocket </q-item-label>
            <q-item-label caption> Balance: 2,500.00 HRK </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="bg-green-2 rounded q-mb-sm">
          <q-item-section>
            <q-item-label class="text-weight-medium"> Gyro </q-item-label>
            <q-item-label caption> Balance: 2,500.00 HRK </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="bg-red-2 rounded q-mb-sm">
          <q-item-section>
            <q-item-label class="text-weight-medium"> Checking </q-item-label>
            <q-item-label caption> Balance: 2,500.00 HRK </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="bg-blue-2 rounded">
          <q-item-section>
            <q-item-label class="text-weight-medium"> Euros </q-item-label>
            <q-item-label caption> Balance: 2,000.00 € </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-pa-none row justify-center">
          <q-btn flat dense class="q-mr-md bg-grey-2 rounded q-mt-md">
            <q-icon class="q-pa-xs" name="mdi-plus" color="grey-9" size="sm" />
          </q-btn>
        </q-item>
      </q-list>
    </div>
    <div class="col-9">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-lg">
          <q-card class="rounded-md q-px-md q-py-xs" flat>
            <q-card-section class="row items-center justify-between">
              <span class="text-weight-bold"> Total balance </span>
              <div>
                <q-chip
                  dense
                  color="pink-1"
                  class="q-pa-md"
                  text-color="red"
                  icon="mdi-arrow-top-right"
                >
                  <b> 1,500.00 HRK </b>
                </q-chip>
                <q-chip
                  dense
                  color="green-1"
                  class="q-pa-md"
                  text-color="green"
                  icon="mdi-arrow-bottom-left"
                >
                  <b> 500.00 HRK </b>
                </q-chip>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h3 text-center">5,400.00 HRK</div>
            </q-card-section>
            <q-card-actions>
              <q-btn flat color="green" label="Deposit" class="rounded" />
              <q-btn flat color="red" label="Withdraw" class="rounded" />
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card flat class="rounded-md">
            <q-card-section>
              <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
                <q-icon
                  class="q-pa-xs"
                  name="mdi-tune-variant"
                  color="grey-9"
                  size="sm"
                />
              </q-btn>
              <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
                <q-icon
                  class="q-pa-xs"
                  name="mdi-calendar-outline"
                  color="grey-9"
                  size="sm"
                />
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-mt-lg">
        <div class="col-12">
          <div
            class="
              row
              justify-between
              bg-white
              q-pt-md q-pr-md q-pl-xl
              items-center
              rounded-t-md
            "
          >
            <span class="text-h5 text-weight-bold"> Transactions </span>
            <div class="row">
              <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
                <q-icon
                  class="q-pa-xs"
                  name="mdi-tune-variant"
                  color="grey-9"
                  size="sm"
                />
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
            :rows="rows"
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
        </div>
      </div>
      <div class="row justify-end q-mt-md">
        <q-pagination
          direction-links
          v-model="state.pagination.page"
          color="grey-9"
          :max="state.pagesNumber"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { QuasarTableColumn, QuasarTablePagination } from "src/models/quasar";
import { defineComponent, reactive, computed } from "vue";

interface State {
  pagination: QuasarTablePagination;
  pagesNumber: number;
}

interface Transaction {
  id: number;
  amount: number;
  account: string;
  description: string;
  category: string;
  expense: boolean;
  date: string;
}

export default defineComponent({
  name: "PageIndex",
  setup() {
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
        field: "amount"
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

    const rows: Transaction[] = [
      {
        id: 1,
        description: "Food #1",
        amount: 250,
        account: "Pocket",
        category: "mdi-laptop",
        expense: true,
        date: "2021-08-20"
      },
      {
        id: 2,
        description: "Food #2",
        amount: 150,
        account: "Gyro",
        category: "mdi-account",
        expense: false,
        date: "2021-10-20"
      },
      {
        id: 3,
        description: "Salary",
        amount: 5000,
        account: "Gyro",
        category: "mdi-filter",
        expense: false,
        date: "2021-12-20"
      },
      {
        id: 4,
        description: "Lunch money",
        amount: 1000,
        account: "Pocket",
        category: "mdi-food",
        expense: true,
        date: "2021-11-20"
      },
      {
        id: 5,
        description: "Trip",
        amount: 700,
        account: "Checking",
        category: "mdi-taxi",
        expense: true,
        date: "2021-04-10"
      },
      {
        id: 6,
        description: "Trip",
        amount: 700,
        account: "Checking",
        category: "mdi-taxi",
        expense: true,
        date: "2021-04-10"
      },
      {
        id: 7,
        description: "Trip",
        amount: 700,
        account: "Checking",
        category: "mdi-taxi",
        expense: true,
        date: "2021-04-10"
      },
      {
        id: 8,
        description: "Trip",
        amount: 700,
        account: "Checking",
        category: "mdi-taxi",
        expense: true,
        date: "2021-04-10"
      }
    ];

    const state: State = reactive({
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5
      },
      pagesNumber: computed(() => Math.ceil(rows.length / state.pagination.rowsPerPage))
    });

    return {
      columns,
      rows,
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
</style>
