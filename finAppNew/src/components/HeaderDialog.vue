<template>
  <v-dialog
    persistent
    v-model="state.open"
    :max-width="state.maxWidth"
    :fullscreen="$vuetify.breakpoint.xs"
  >
    <v-card :style="{ 'max-height': state['max-height'] }">
      <v-card-title>
        <span
          :style="{
            'font-size':
              $vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '15px' : '20px'
          }"
        >
          {{ state.title }}
        </span>
        <v-spacer />
        <v-btn
          :disabled="state.disabled"
          v-if="state.haveCloseButton"
          @click="close"
          small
          icon
          class="mr-3"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="pb-0">
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  reactive,
  watch
} from "@vue/composition-api";

interface Props {
  maxWidth?: number;
  maxHeight?: number;
  open: boolean;
  title: string;
  haveCloseButton?: boolean;
  value: boolean;
  disabled: boolean;
}

interface State {
  maxWidth?: number;
  maxHeight?: number;
  open: boolean;
  title: string;
  haveCloseButton?: boolean;
  disabled: boolean;
}

export default defineComponent({
  name: "header-dialog",
  props: {
    maxWidth: null,
    maxHeight: null,
    open: null,
    title: null,
    haveCloseButton: null,
    value: null,
    disabled: null
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      title: props.title,
      open: props.value,
      maxHeight: props.maxHeight,
      maxWidth: props.maxWidth,
      disabled: props.disabled,
      haveCloseButton:
        props.haveCloseButton != null && props.haveCloseButton != undefined
          ? props.haveCloseButton
          : true
    });

    watch(
      () => props.value,
      val => (state.open = val)
    );

    watch(
      () => props.disabled,
      val => (state.disabled = val)
    );

    function close() {
      state.open = false;
      context.emit("input", state.open);
      context.emit("close");
    }

    return {
      state,
      close
    };
  }
});
</script>
