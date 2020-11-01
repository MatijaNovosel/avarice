<template>
  <span class="v-chip v-size--default">
    <span class="v-chip__content">{{ state.label }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface Props {
  label?: string | null;
}

interface State {
  label?: string | null;
}

export default defineComponent({
  name: "chip",
  props: {
    label: String
  },
  setup(props: Props) {
    const state: State = reactive({
      label: props.label
    });

    watch(
      () => props.label,
      (val) => (state.label = val)
    );

    return {
      state
    };
  }
});
</script>

<style>
.v-chip.v-size--default {
  border-radius: 16px;
  font-size: 14px;
  height: 32px;
}
.v-chip {
  align-items: center;
  cursor: default;
  display: inline-flex;
  line-height: 20px;
  max-width: 100%;
  outline: none;
  overflow: hidden;
  padding: 0 12px;
  position: relative;
  text-decoration: none;
  transition-duration: 0.28s;
  transition-property: box-shadow, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  vertical-align: middle;
  white-space: nowrap;
  background-color: #f44336 !important;
  border-color: #f44336 !important;
}
.v-chip .v-chip__content {
  align-items: center;
  display: inline-flex;
  height: 100%;
  max-width: 100%;
  color: white;
}
</style>