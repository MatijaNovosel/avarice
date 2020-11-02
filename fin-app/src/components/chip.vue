<template>
  <span
    class="chip size-default"
    :style="{ 'background-color': state.color, 'border-color': state.color }"
  >
    <span class="chip-content" :style="{ color: state.textColor }">
      <slot />
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface Props {
  color?: string | null;
  textColor?: string | null;
}

interface State {
  color?: string | null;
  textColor?: string | null;
}

export default defineComponent({
  name: "chip",
  props: {
    color: String,
    textColor: String
  },
  setup(props: Props) {
    const state: State = reactive({
      color: props.color,
      textColor: props.textColor
    });

    watch(
      () => props.color,
      (val) => (state.color = val)
    );

    watch(
      () => props.textColor,
      (val) => (state.textColor = val)
    );

    return {
      state
    };
  }
});
</script>

<style>
.chip.size-default {
  border-radius: 16px;
  font-size: 14px;
  height: 32px;
}
.chip {
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
}
.chip .chip-content {
  align-items: center;
  display: inline-flex;
  height: 100%;
  max-width: 100%;
}
</style>