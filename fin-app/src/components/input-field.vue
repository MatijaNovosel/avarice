<template>
  <span class="p-float-label">
    <input-number
      locale="hr-HR"
      mode="currency"
      currency="HRK"
      id="newEntry"
      v-model="state.value"
    />
    <label for="newEntry">{{ label }}</label>
  </span>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface Props {
  label?: string | null;
  value?: string | null;
}

interface State {
  label?: string | null;
  value?: string | null;
}

export default defineComponent({
  name: "navbar",
  props: {
    label: String,
    value: String
  },
  setup(props: Props) {
    const state: State = reactive({
      label: props.label,
      value: props.value
    });

    watch(
      () => props.label,
      (val) => (state.label = val)
    );

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

<style scoped>
.navbar-height {
  height: var(--navbar-height);
}
</style>
