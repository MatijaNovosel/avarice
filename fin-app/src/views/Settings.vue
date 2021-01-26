<template>
  <div class="flex flex-col px-6">
    <div class="flex border-b border-gray-300">
      <span
        :class="{
          'text-gray-400 border-b-2 border-gray-400':
            state.activeTab == tabHeaderItem.value
        }"
        class="font-bold cursor-pointer p-3"
        @click="state.activeTab = tabHeaderItem.value"
        v-for="(tabHeaderItem, i) in state.tabHeaders"
        :key="i"
      >
        {{ tabHeaderItem.text }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

enum TabsEnum {
  Appearance = 1,
  Currency = 2,
  Account = 3
}

interface TabHeaderItem {
  text: string;
  value: TabsEnum;
}

interface State {
  tabHeaders: TabHeaderItem[];
  activeTab: TabsEnum;
}

export default defineComponent({
  name: "Settings",
  setup() {
    const state: State = reactive({
      activeTab: TabsEnum.Appearance,
      tabHeaders: [
        {
          text: "Appearance",
          value: TabsEnum.Appearance
        },
        {
          text: "Currency",
          value: TabsEnum.Currency
        },
        {
          text: "Account",
          value: TabsEnum.Account
        }
      ]
    });

    return {
      state
    };
  }
});
</script>
