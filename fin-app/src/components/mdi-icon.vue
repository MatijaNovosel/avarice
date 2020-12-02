<template>
  <img :style="state.style" :src="state.svgDefinition" />
</template>

<script lang="ts">
import { hexToCssFilter } from "@/helpers/helpers";
import { defineComponent, reactive, watch } from "vue";
import { MDIIcon } from "@/types/index";

interface Style {
  filter: string;
  width: string;
  height: string;
}

interface Props {
  name?: MDIIcon;
  size?: number;
  color?: string;
}

interface State {
  color?: string;
  svgDefinition: string;
  style: Style;
}

export default defineComponent({
  name: "mdi-icon",
  props: {
    name: null,
    size: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: "#ffffff"
    }
  },
  setup(props: Props) {
    const state: State = reactive({
      color: props.color,
      svgDefinition: "",
      style: {
        filter: "",
        width: "",
        height: ""
      }
    });

    watch(
      () => props.name,
      (val) => {
        state.svgDefinition = require(`@/assets/icons/${val}.svg`);
      },
      {
        immediate: true
      }
    );

    watch(
      () => props.size,
      (val) => {
        state.style.width = `${val}px`;
        state.style.height = `${val}px`;
      },
      {
        immediate: true
      }
    );

    watch(
      () => props.color,
      (val) => {
        if (val == "#") return;
        state.style.filter = hexToCssFilter(val as string);
      },
      {
        immediate: true
      }
    );

    return {
      state
    };
  }
});
</script>

<style scoped lang="sass">
</style>
