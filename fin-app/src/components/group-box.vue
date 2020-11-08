<template>
  <field-set>
    <template #legend>
      <span
        ><icon v-if="state.icon" class="p-pr-2" :name="state.icon" />{{
          state.title
        }}</span
      >
    </template>
    <slot></slot>
  </field-set>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface Props {
  title?: string | null;
  icon?: string | null;
}

interface State {
  title?: string | null;
  icon?: string | null;
}

export default defineComponent({
  name: "group-box",
  props: {
    title: String,
    backgroundColor: String,
    icon: String
  },
  setup(props: Props) {
    const state: State = reactive({
      title: props.title,
      icon: props.icon
    });

    watch(
      () => props.title,
      (val) => (state.title = val)
    );

    watch(
      () => props.icon,
      (val) => (state.icon = val)
    );

    return {
      state
    };
  }
});
</script>

<style>
.p-fieldset .p-fieldset-legend {
  border: 1px solid var(--tarkov-brown) !important;
  border-radius: 6px;
}
</style>
