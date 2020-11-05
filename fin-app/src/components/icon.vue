<template>
  <i :class="`pi pi-${state.name}`"></i>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface Props {
  name?: string | null;
  size?: string | null;
}

interface State {
  name?: string | null;
  size?: string | null;
}

export default defineComponent({
  name: "icon",
  props: {
    name: String,
    size: String
  },
  setup(props: Props) {
    const state: State = reactive({
      name: props.name,
      size: props.size
    });

    watch(
      () => props.name,
      (val) => (state.name = val)
    );

    watch(
      () => props.size,
      (val) => (state.size = val)
    );

    return {
      state
    };
  }
});
</script>

<style>
</style>