<template>
  <div
    class="relative select-none flex flex-col justify-center px-6 py-4 rounded-lg shadow-md border-gray-200 border"
  >
    <mdi-icon
      v-if="state.transfer"
      name="swap"
      class="absolute top-5 right-5"
      color="#97afcf"
    />
    <span class="text-gray-400 font-bold">{{ state.title }} </span>
    <span class="text-gray-300">{{ state.date }}</span>
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
        >{{ formatTag(tag) }}</tag
      >
    </div>
  </div>
</template>

<script lang="ts">
import { TagEnum } from "@/constants/tag-enum";
import { defineComponent, reactive, watch } from "vue";
import { formatTag } from "@/helpers/helpers";
import mdiIcon from "./mdi-icon.vue";

interface Props {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean;
  transfer?: boolean;
  tags?: TagEnum[] | null;
  show?: boolean;
}

interface State {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean;
  transfer?: boolean;
  tags?: TagEnum[] | null;
  show?: boolean;
}

export default defineComponent({
  components: { mdiIcon },
  name: "transaction-card",
  props: {
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
      show: props.show
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
      formatTag
    };
  }
});
</script>

<style scoped lang="sass">
.expense
  border-left: 10px solid rgb(197, 38, 38)
  color: rgb(197, 38, 38)
  background-color: rgb(94, 33, 33)

.gain
  border-left: 10px solid rgb(66, 135, 51)
  color: rgb(66, 135, 51)
  background-color: rgb(46, 84, 37)
</style>
