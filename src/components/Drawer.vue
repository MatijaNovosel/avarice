<template>
  <q-drawer show-if-above v-model="state.drawer" side="left" class="bg-grey-10">
    <div class="text-center q-py-lg">
      <span class="text-h4 text-dark-red"> Avarice </span>
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

<script lang="ts" setup>
import { DrawerItem as DrawerItemModel } from "src/models/common";
import { PropType, reactive } from "vue";
import DrawerItem from "src/components/DrawerItem.vue";

interface State {
  drawer: boolean;
}

defineProps({
  data: {
    type: Array as PropType<DrawerItemModel[]>,
    required: true
  }
});

const state: State = reactive({
  drawer: true
});
</script>
