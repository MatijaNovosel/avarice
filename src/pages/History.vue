<template>
  <q-page class="row">
    <div class="col-12">
      <transactions-table :rows-per-page="10" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import TransactionsTable from "@/components/TransactionsTable.vue";
</script>
