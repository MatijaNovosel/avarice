<template>
  <p-dialog
    @hide="hideDialog"
    :maximizable="true"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Postavke</h3>
    </template>
    <div class="p-fluid p-grid p-formgrid p-mt-5 p-mb-2 p-px-3">
      Bruh
    </div>
  </p-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, watch } from "vue";

interface Props {
  dialog: boolean;
}

interface State {
  dialog: boolean;
}

export default defineComponent({
  name: "settings-dialog",
  props: {
    dialog: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      dialog: props.dialog
    });

    watch(
      () => props.dialog,
      (val) => (state.dialog = val)
    );

    function hideDialog() {
      context.emit("update:dialog", state.dialog);
    }

    return {
      state,
      hideDialog
    };
  }
});
</script>

<style scoped>
</style>
