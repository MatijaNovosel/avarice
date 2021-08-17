<template>
  <q-card flat class="rounded-md">
    <q-card-section>
      <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
        <q-icon class="q-pa-xs" name="mdi-tune-variant" color="grey-9" size="sm" />
      </q-btn>
      <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
        <q-icon class="q-pa-xs" name="mdi-calendar-outline" color="grey-9" size="sm" />
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "account-balance-graph-card",
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {};
  }
});
</script>
