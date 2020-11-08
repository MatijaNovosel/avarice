<template>
  <card style="width: 400px">
    <template #title>
      <span>Current value</span>
    </template>
    <template #content>
      <div>
        Žiro račun: 10,000HRK
      </div>
    </template>
  </card>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface Props {
  value?: string | null;
}

interface State {
  value?: string | null;
}

export default defineComponent({
  name: "dashboard-card",
  props: {
    value: String
  },
  setup(props: Props) {
    const state: State = reactive({
      value: props.value
    });

    watch(
      () => props.value,
      (val) => (state.value = val)
    );

    return {
      state
    };
  }
});
</script>

<style>
.p-card-body {
  padding: 20px 0px !important;
}
.p-card-content {
  border-top: 1px solid var(--color-dark);
  margin: 0px 0px 0px 0px;
}
.p-card .p-card-title {
  margin-bottom: 1.5rem;
}
</style>
