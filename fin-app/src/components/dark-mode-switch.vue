<template>
  <div class="h-12 grid items-center">
    <input
      @change="switchChanged"
      v-model="state.value"
      type="checkbox"
      id="time"
    />
    <label for="time">N</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, watch } from "vue";

interface Props {
  value: boolean;
}

interface State {
  value: boolean;
}

export default defineComponent({
  name: "dark-mode-switch",
  emits: ["update:value", "change"],
  props: {
    value: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      value: props.value
    });

    watch(
      () => props.value,
      val => (state.value = val)
    );

    function switchChanged() {
      context.emit("update:value", state.value);
      context.emit("change");
    }

    return {
      state,
      switchChanged
    };
  }
});
</script>

<style lang="scss">
$d: 1.2em;
$p: 0.4em;
$g: 1em;

#time {
  position: absolute;
  right: 100vw;

  + label {
    --i: 0;
    --j: calc(0.8 - var(--i));
    display: grid;
    gap: 0.2em $g;
    padding: $p;
    overflow: hidden;
    height: $d + 0.8em;
    border-radius: 2.2em;
    background: hsl(199, 98%, calc(var(--j) * 41%));
    color: transparent;
    user-select: none;
    transition: 0.3s;
    cursor: pointer;

    &:before,
    &:after {
      width: $d;
      height: $d;
      transition: inherit;
      content: "";
    }

    &:before {
      transform-origin: 20% 20%;
      transform: translate(calc(var(--i) * (100% + #{$g})))
        scale(calc(1 - var(--i) * 0.7));
      background: rgb(242, 242, 108);
      border-radius: 50%;
      content: "";
    }

    &:after {
      grid-column: 2;
      border-radius: 50%;
      transform: translatey(calc(var(--i) * (-100% - #{$p})));
      background: radial-gradient(
        circle at 19% 19%,
        transparent 41%,
        rgb(238, 231, 193) 43%
      );
    }
  }

  &:checked + label {
    --i: 1;
  }
}
</style>
