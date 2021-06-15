<template>
  <v-card rounded="lg" class="text-right">
    <v-list-item dense two-line>
      <v-list-item-icon>
        <v-btn icon @click="state.visible = !state.visible">
          <v-icon
            v-text="state.visible ? 'mdi-panorama-fisheye' : 'mdi-circle'"
          />
        </v-btn>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="pb-2 text-overline white--text">
          {{ state.title }}
        </v-list-item-title>
        <v-list-item-title
          :class="state.subtitleColor && `${state.subtitleColor}--text`"
          class="font-weight-bold text-subtitle-1"
        >
          {{ formatCurrencyDisplay(state.visible, state.amount, "HRK") }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import { formatCurrencyDisplay } from "@/helpers";

interface Props {
  amount: number;
  title: string;
  subtitleColor: string;
  visible: boolean;
}

interface State {
  amount: number;
  title: string;
  subtitleColor: string;
  visible: boolean;
}

export default defineComponent({
  name: "amount-card",
  props: {
    amount: null,
    title: null,
    subtitleColor: null,
    visible: null
  },
  setup(props: Props) {
    const state: State = reactive({
      amount: props.amount,
      title: props.title,
      subtitleColor: props.subtitleColor,
      visible: props.visible ? props.visible : false
    });

    return {
      state,
      formatCurrencyDisplay
    };
  }
});
</script>
