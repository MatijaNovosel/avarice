<template>
  <q-page padding class="bg-grey-2">
    <div class="row">
      <div class="col-3 q-pr-lg p-rel">
        <q-list class="bg-white q-pa-md rounded">
          <q-item class="bg-orange-2 rounded q-mb-sm q-py-md" clickable>
            <q-item-section avatar>
              <q-icon
                color="orange-5"
                size="sm"
                name="mdi-credit-card-outline"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium"> Pocket </q-item-label>
              <q-item-label caption> Balance: 2,500.00 HRK </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="bg-green-2 rounded q-mb-sm q-py-md" clickable>
            <q-item-section avatar>
              <q-icon
                color="green-5"
                size="sm"
                name="mdi-credit-card-outline"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium"> Gyro </q-item-label>
              <q-item-label caption> Balance: 500.00 HRK </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="bg-red-2 rounded q-mb-sm q-py-md" clickable>
            <q-item-section avatar>
              <q-icon color="red-5" size="sm" name="mdi-credit-card-outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium"> Checking </q-item-label>
              <q-item-label caption> Balance: 12,500.00 HRK </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="bg-blue-2 rounded q-py-md" clickable>
            <q-item-section avatar>
              <q-icon color="blue-5" size="sm" name="mdi-credit-card-outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium"> Euros </q-item-label>
              <q-item-label caption> Balance: 2,000.00 € </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            class="q-pa-none row justify-center"
            style="margin-bottom: -36px"
          >
            <q-btn dense class="q-mr-md bg-grey-2 rounded q-mt-md">
              <q-icon
                class="q-pa-xs"
                name="mdi-plus"
                color="grey-9"
                size="sm"
              />
            </q-btn>
          </q-item>
        </q-list>
      </div>
      <div class="col-9">
        <div class="row">
          <div class="col-12 col-md-6 q-pr-lg">
            <q-card class="rounded-md q-px-md q-py-xs" flat>
              <q-card-section class="row items-center justify-between q-pb-sm">
                <span class="text-weight-bold"> Total balance </span>
                <div>
                  <q-chip
                    color="pink-1"
                    size="sm"
                    class="q-pa-md"
                    text-color="red"
                    icon="mdi-arrow-top-right"
                  >
                    <b> 1,500.00 HRK </b>
                  </q-chip>
                  <q-chip
                    size="sm"
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
                <div class="text-h3 text-center">2,500.00 HRK</div>
              </q-card-section>
              <q-card-actions class="row justify-center">
                <q-btn
                  flat
                  size="sm"
                  label="New transaction"
                  class="rounded bg-grey-3"
                  icon="mdi-swap-horizontal"
                />
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
            <transactions-table :data="state.transactions" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Transaction } from "src/models/transaction";
import { defineComponent, reactive } from "vue";
import TransactionsTable from "src/components/TransactionsTable.vue";

interface State {
  transactions: Transaction[];
}

export default defineComponent({
  name: "PageIndex",
  components: {
    TransactionsTable
  },
  setup() {
    const state: State = reactive({
      balance: 2500,
      transactions: [
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
      ]
    });

    return {
      state
    };
  }
});
</script>
