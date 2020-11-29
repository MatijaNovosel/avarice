<template>
  <div
    :style="{
      borderLeft: `10px solid ${state.color}`
    }"
    class="amount-container p-shadow-6"
    style="width: 100%"
  >
    <span class="amount-title p-mb-1">{{ state.title }}</span>
    <progress-spinner
      strokeWidth="10"
      class="spinner-accounts"
      v-if="state.loading"
    />
    <span
      v-else
      :style="{
        color: state.color
      }"
      class="amount-text"
      >{{ state.amount }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, watch } from "vue";

interface Props {
  amount?: string | null;
  icon?: string | null;
  title?: string | null;
  color?: string | null;
  loading?: boolean;
  enabled?: boolean;
  noCheckbox?: boolean;
}

interface State {
  amount?: string | null;
  icon?: string | null;
  title?: string | null;
  color?: string | null;
  loading?: boolean;
  enabled?: boolean;
  noCheckbox?: boolean;
}

export default defineComponent({
  name: "dashboard-amount-card",
  props: {
    amount: String,
    icon: String,
    title: String,
    color: String,
    loading: Boolean,
    enabled: Boolean,
    noCheckbox: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      amount: props.amount,
      icon: props.icon,
      title: props.title,
      color: props.color,
      loading: props.loading,
      enabled: props.enabled,
      noCheckbox: props.noCheckbox
    });

    function checkboxClicked() {
      context.emit("update:enabled", state.enabled);
    }

    watch(
      () => props.amount,
      (val) => (state.amount = val)
    );

    watch(
      () => props.color,
      (val) => (state.color = val)
    );

    watch(
      () => props.loading,
      (val) => (state.loading = val)
    );

    watch(
      () => props.enabled,
      (val) => (state.enabled = val)
    );

    return {
      state,
      checkboxClicked
    };
  }
});
</script>

<style scoped>
.amount-container {
  display: flex;
  flex-direction: column;
  padding: 1.2rem;
  background-color: #1e1e1e;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}
.amount-title {
  color: #927d7d;
}
.amount-text {
  font-size: 1.5rem;
  font-weight: 700;
}
.amount-circle {
  border-radius: 50%;
  width: 25px;
  height: 25px;
}
</style>
