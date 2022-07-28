<template>
  <div class="row q-mt-md">
    <div class="col-12">
      <transactions-table :rows-per-page="10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TransactionsTable from "src/components/TransactionsTable.vue";
</script>
