<template>
  <div
    :class="{
      'bg-gray-50': state.transfer
    }"
    class="relative select-none flex flex-col justify-center px-6 py-4 rounded-lg shadow-md border-gray-200 border"
  >
    <mdi-icon
      v-if="state.transfer"
      name="swap"
      class="absolute top-5 right-5"
      color="#97afcf"
    />
    <span class="text-gray-400 font-bold">{{ state.title }} </span>
    <span class="text-gray-300">{{
      state.describeDate
        ? formatDistance(
            parse(state.date, "dd.MM.yyyy. HH:mm", new Date()),
            new Date(),
            {
              addSuffix: true
            }
          )
        : state.date
    }}</span>
    <span class="text-xl">{{
      `${
        state.show
          ? state.amount.toLocaleString("en")
          : ("" + state.amount).replace(/[0-9]/gi, "*")
      } HRK`
    }}</span>
    <div class="flex self-end space-x-2 mt-3">
      <tag
        v-for="(tag, i) in state.tags"
        :key="i"
        :text-color="state.expense ? '#c52626' : '#428733'"
        :color="state.expense ? '#ff9494' : '#bedeb7'"
        >{{ $t(`tags.${TagEnum[tag]}`) }}</tag
      >
    </div>
  </div>
</template>

<script lang="ts">
import { TagEnum } from "@/constants/tag-enum";
import { defineComponent, reactive, watch } from "vue";
import mdiIcon from "./mdi-icon.vue";
import { formatDistance, parse } from "date-fns";

interface Props {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean;
  transfer?: boolean;
  tags?: TagEnum[] | null;
  show?: boolean;
  describeDate?: boolean;
}

interface State {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean;
  transfer?: boolean;
  tags?: TagEnum[] | null;
  show?: boolean;
  describeDate?: boolean;
}

export default defineComponent({
  components: { mdiIcon },
  name: "transaction-card",
  props: {
    describeDate: {
      type: Boolean,
      default: false
    },
    amount: Number,
    title: String,
    tags: null,
    date: String,
    expense: Boolean,
    transfer: Boolean,
    show: {
      type: Boolean,
      default: true
    }
  },
  setup(props: Props) {
    const state: State = reactive({
      amount: props.amount,
      title: props.title,
      date: props.date,
      tags: props.tags,
      expense: props.expense,
      transfer: props.transfer,
      show: props.show,
      describeDate: props.describeDate
    });

    watch(
      () => props.show,
      (val) => (state.show = val)
    );

    watch(
      () => props.tags,
      (val) => (state.tags = val)
    );

    return {
      state,
      TagEnum,
      parse,
      formatDistance
    };
  }
});
</script>
