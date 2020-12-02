<template>
  <div />
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
  name: "component",
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
</style>
