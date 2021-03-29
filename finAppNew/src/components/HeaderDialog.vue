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
  "max-height"?: number;
  open: false;
  title: string;
  haveCloseButton?: boolean;
  value: boolean;
}

export default defineComponent({
  name: "header-dialog",
  props: {
    maxWidth: null,
    "max-height": null,
    open: null,
    title: null,
    haveCloseButton: null,
    value: null
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive({
      title: props.title,
      open: props.value,
      "max-height": props["max-height"],
      maxWidth: props.maxWidth,
      haveCloseButton:
        props.haveCloseButton != null && props.haveCloseButton != undefined
          ? props.haveCloseButton
          : true
    });

    watch(
      () => props.value,
      val => (state.open = val)
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
