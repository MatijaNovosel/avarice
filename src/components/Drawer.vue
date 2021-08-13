<template>
  <q-drawer show-if-above v-model="state.drawer" side="left" class="bg-white">
    <div class="text-center q-py-lg">
      <span class="text-h4"> FinApp </span>
    </div>
    <q-list class="q-px-md" dense>
      <drawer-item
        v-for="(link, i) in data"
        :class="{
          'q-mb-sm': i != data.length - 1
        }"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { DrawerItem as DrawerItemModel } from "src/models/common";
import { defineComponent, PropType, reactive } from "vue";
import DrawerItem from "src/components/DrawerItem.vue";

interface State {
  drawer: boolean;
}

export default defineComponent({
  name: "account-list",
  components: {
    DrawerItem
  },
  props: {
    data: {
      type: Array as PropType<DrawerItemModel[]>,
      required: true
    }
  },
  setup() {
    const state: State = reactive({
      drawer: true
    });

    return {
      state
    };
  }
});
</script>
