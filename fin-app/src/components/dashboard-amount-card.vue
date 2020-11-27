<template>
  <group-box
    :icon="state.icon"
    :title="state.title"
    class="p-text-center p-shadow-6"
    style="position: relative"
  >
    <chip
      text-color="white"
      :color="state.loading ? '' : state.color"
      class="p-my-2"
    >
      <progress-spinner
        strokeWidth="10"
        class="spinner-accounts"
        v-if="state.loading"
      />
      <span v-else>
        {{ state.amount }}
      </span>
    </chip>
    <p-checkbox
      v-if="!state.noCheckbox"
      @change="checkboxClicked"
      v-model="state.enabled"
      class="aside-reverse"
      :binary="true"
    />
  </group-box>
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
</style>
