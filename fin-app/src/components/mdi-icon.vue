<template>
  <img :src="state.svgDefinition" :style="{ filter: state.filter }" />
</template>

<script lang="ts">
import { hexToCssFilter } from "@/helpers/helpers";
import { defineComponent, reactive, watch } from "vue";
import { MDIIcon } from "@/types/index";

interface Props {
  name?: MDIIcon;
  color?: string;
}

interface State {
  color?: string;
  svgDefinition: string;
  filter: string;
}

export default defineComponent({
  name: "mdi-icon",
  props: {
    name: null,
    color: {
      type: String,
      default: "white"
    }
  },
  setup(props: Props) {
    const state: State = reactive({
      color: props.color,
      filter: "",
      svgDefinition: ""
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
      () => props.color,
      (val) => {
        if (val == "#") return;
        state.filter = hexToCssFilter(val as string);
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

<style>
</style>
