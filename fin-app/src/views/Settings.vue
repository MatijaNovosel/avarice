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
  <div class="mt-6 px-6">
    <div
      class="flex flex-col space-y-5"
      v-if="state.activeTab == TabsEnum.Account"
    >
      <div class="flex justify-between">
        <span class="text-gray-500 font-bold mr-3">Display name</span>
        <span>{{ state.user.displayName }}</span>
        <span>
          <button
            class="text-white rounded-md bg-gray-500 hover:bg-gray-600 py-1 px-6 shadow-md select-none p-ripple"
            v-ripple
          >
            Update
          </button>
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500 font-bold mr-3">Email:</span>
        <span>{{ state.user.email }}</span>
        <span>
          <button
            class="text-white rounded-md bg-gray-500 hover:bg-gray-600 py-1 px-6 shadow-md select-none p-ripple"
            v-ripple
          >
            Update
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import { useStore } from "vuex";

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
    const store = useStore();

    const state: State = reactive({
      user: computed(() => store.getters.user),
      activeTab: TabsEnum.Account,
      tabHeaders: [
        {
          text: "Account",
          value: TabsEnum.Account
        },
        {
          text: "Appearance",
          value: TabsEnum.Appearance
        },
        {
          text: "Currency",
          value: TabsEnum.Currency
        }
      ]
    });

    return {
      state,
      TabsEnum
    };
  }
});
</script>
