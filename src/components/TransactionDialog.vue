<template>
  <q-dialog v-model="state.open" persistent>
    <q-card style="width: 700px">
      <q-card-section class="row justify-between items-center">
        <span class="text-h6">New transaction</span>
        <q-btn @click="closeDialog" flat dense class="q-mr-md bg-grey-2 rounded">
          <q-icon class="q-pa-xs" name="mdi-close" color="grey-9" size="sm" />
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input dense square filled clearable label="Amount" />
        </q-form>
      </q-card-section>
      <q-card-actions class="q-px-md justify-center">
        <q-btn unelevated color="light-green-7" size="md" label="Create" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface State {
  open: boolean;
}

export default defineComponent({
  name: "transaction-dialog",
  emits: ["update:open"],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const state: State = reactive({
      open: props.open
    });

    watch(
      () => props.open,
      (val) => {
        state.open = val;
      }
    );

    function closeDialog() {
      emit("update:open", false);
    }

    return {
      state,
      closeDialog
    };
  }
});
</script>
