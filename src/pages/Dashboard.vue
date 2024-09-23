<template>
  <q-page class="row q-pt-sm">
    <div class="col-12 col-md-3 q-pr-md-md q-pb-xl q-md-pb-none">
      <account-list />
    </div>
    <div class="col-12 col-md-9">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md-md">
          <total-balance-card />
        </div>
        <div class="col-12 col-md-6 q-pt-md q-pt-md-none">
          <account-balance-graph-card />
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-12">
          <transactions-table hide-select-all hide-page-selection />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import AccountBalanceGraphCard from "@/components/AccountBalanceGraphCard.vue";
import AccountList from "@/components/AccountList.vue";
import TotalBalanceCard from "@/components/TotalBalanceCard.vue";
import TransactionsTable from "@/components/TransactionsTable.vue";
</script>
