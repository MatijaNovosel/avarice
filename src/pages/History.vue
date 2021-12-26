<template>
  <div class="row q-mt-md">
    <div class="col-12">
      <transactions-table :rows-per-page="10" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TransactionsTable from "src/components/TransactionsTable.vue";

export default defineComponent({
  name: "History",
  components: {
    TransactionsTable
  }
});
</script>
