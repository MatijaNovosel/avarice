<template>
  <q-item :to="link" exact active-class="bg-blue-1" class="rounded-md text-grey-9">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section class="q-py-sm">
      <q-item-label class="text-weight-medium">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { NavigationRoute } from "src/models/navigation";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "drawer-item",
  props: {
    title: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ""
    },
    link: {
      type: Object as PropType<NavigationRoute>,
      required: true
    },
    icon: {
      type: String,
      default: ""
    }
  }
});
</script>
