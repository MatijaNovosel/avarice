<template>
  <div class="display-contents">
    <slot />
    <q-dialog
      v-model="state.isOpen"
      :max-width="state.options.width"
      :persistent="state.options.persistent"
    >
      <q-card
        flat
        :style="{
          minWidth: `${state.options.width}px`
        }"
      >
        <q-card-section class="d-flex justify-center bg-grey-10 text-h6">
          {{ state.title }}
        </q-card-section>
        <q-card-section v-show="!!state.content">
          {{ state.content }}
        </q-card-section>
        <q-card-actions class="q-pa-md justify-center">
          <q-btn v-show="!!state.options.showCancel" color="red" @click="cancel"> No </q-btn>
          <q-btn color="green" @click="agree"> Yes </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  CreateConfirmDialogKey,
  CreateConfirmDialogOptions
} from "src/composables/useConfirmationDialog";
import { provide, reactive } from "vue";

const state = reactive({
  isOpen: false,
  resolve: (_val: boolean) => {
    //
  },
  reject: (_val: boolean) => {
    //
  },
  content: "",
  title: "",
  options: {
    width: 500,
    showCancel: true,
    persistent: false
  } as CreateConfirmDialogOptions
});

const createConfirmDialog = (
  title: string,
  content: string,
  options: CreateConfirmDialogOptions = {}
) => {
  state.isOpen = true;
  state.title = title;
  state.content = content;
  state.options = Object.assign(state.options, options);
  return new Promise<boolean>((resolve, reject) => {
    state.resolve = resolve;
    state.reject = reject;
  });
};

provide(CreateConfirmDialogKey, createConfirmDialog);

const agree = () => {
  state.resolve(true);
  state.isOpen = false;
};

const cancel = () => {
  state.resolve(false);
  state.isOpen = false;
};
</script>
