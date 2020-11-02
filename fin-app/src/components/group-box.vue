<template>
  <div class="group-box">
    <span
      class="group-box-title"
      :style="{
        backgroundColor: state.backgroundColor
      }"
      >{{ state.title }}</span
    >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface Props {
  title?: string | null;
  backgroundColor?: string | null;
}

interface State {
  title?: string | null;
  backgroundColor?: string | null;
}

export default defineComponent({
  name: "group-box",
  props: {
    title: String,
    backgroundColor: String
  },
  setup(props: Props) {
    const state: State = reactive({
      title: props.title,
      backgroundColor: props.backgroundColor
    });

    watch(
      () => props.title,
      (val) => (state.title = val)
    );

    watch(
      () => props.backgroundColor,
      (val) => (state.backgroundColor = val)
    );

    return {
      state
    };
  }
});
</script>

<style scoped>
.group-box {
  border-radius: 8px;
  border: 1px solid var(--color-dark);
  padding: 20px;
  position: relative;
}
.group-box-title {
  position: absolute;
  top: -12px;
  left: 20px;
  padding: 5px;
  color: var(--color-dark);
  background-color: var(--color-dark-gradient-3);
}
</style>
