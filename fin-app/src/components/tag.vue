<template>
  <span
    class="tag size-default"
    :style="{ 'background-color': state.color, 'border-color': state.color }"
  >
    <span class="tag-content font-bold" :style="{ color: state.textColor }">
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
  name: "tag",
  props: {
    color: {
      type: String,
      default: "#000000"
    },
    textColor: {
      type: String,
      default: "#ffffff"
    }
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

<style lang="sass">
.tag.size-default
  border-radius: 16px
  font-size: 0.75rem

.tag
  align-items: center
  cursor: default
  display: inline-flex
  line-height: 20px
  max-width: 100%
  outline: none
  overflow: hidden
  padding: 0 12px
  position: relative
  text-decoration: none
  transition-duration: 0.28s
  transition-property: box-shadow, opacity
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)
  vertical-align: middle
  white-space: nowrap

  & .tag-content
    align-items: center
    display: inline-flex
    height: 100%
    max-width: 100%
</style>