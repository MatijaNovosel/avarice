<template>
  <div>
    <template v-if="loading || !account">
      <q-card flat class="q-pa-md">
        <q-skeleton height="55px" square />
        <q-card-section>
          <q-skeleton type="text" class="text-subtitle1" />
          <q-skeleton type="text" width="50%" class="text-subtitle1" />
          <q-skeleton type="text" class="text-caption" />
        </q-card-section>
      </q-card>
    </template>
    <template v-else>
      <q-card class="rounded-md q-px-md q-py-xs" flat>
        <q-card-section class="row items-center justify-between q-pb-sm">
          <span class="text-weight-bold"> Total balance </span>
          <div>
            <q-chip
              color="pink-1"
              size="sm"
              class="q-px-md"
              text-color="red"
              icon="mdi-arrow-top-right"
            >
              <b> 1,500.00 HRK </b>
            </q-chip>
            <q-chip
              size="sm"
              color="green-1"
              class="q-px-md"
              text-color="green"
              icon="mdi-arrow-bottom-left"
            >
              <b> 500.00 HRK </b>
            </q-chip>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h3 text-center">
            {{ formatBalance(account.balance, account.currency) }}
          </div>
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
    </template>
  </div>
</template>

<script lang="ts">
import { formatBalance } from "src/utils/helpers";
import { defineComponent } from "vue";

export default defineComponent({
  name: "total-balance-card",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    account: {
      type: null
    }
  },
  setup() {
    return {
      formatBalance
    };
  }
});
</script>
