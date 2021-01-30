<template>
  <div class="flex flex-col px-6 pt-4">
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
      <table>
        <tbody>
          <tr>
            <td class="py-3">
              <span class="text-gray-500 font-bold">Display name</span>
            </td>
            <td class="text-left">
              <span>{{ state.user.displayName }}</span>
            </td>
            <td class="text-right">
              <button
                class="text-white rounded-md bg-gray-500 hover:bg-gray-600 py-1 px-6 shadow-md select-none p-ripple"
                v-ripple
              >
                Update
              </button>
            </td>
          </tr>
          <tr>
            <td class="py-3">
              <span class="text-gray-500 font-bold">Email</span>
            </td>
            <td class="text-left">
              <span>{{ state.user.email }}</span>
            </td>
            <td class="text-right">
              <button
                class="text-white rounded-md bg-gray-500 hover:bg-gray-600 py-1 px-6 shadow-md select-none p-ripple"
                v-ripple
              >
                Update
              </button>
            </td>
          </tr>
          <tr>
            <td class="py-3">
              <span class="text-gray-500 font-bold">Date format</span>
            </td>
            <td class="text-left">
              <span>dd.MM.yyyy. HH:mm</span>
            </td>
            <td class="text-right">
              <button
                class="text-white rounded-md bg-gray-500 hover:bg-gray-600 py-1 px-6 shadow-md select-none p-ripple"
                v-ripple
              >
                Update
              </button>
            </td>
          </tr>
          <tr>
            <td class="py-3">
              <span class="text-gray-500 font-bold">Preferred currency</span>
            </td>
            <td class="text-left">
              <span>HRK</span>
            </td>
            <td class="text-right">
              <button
                class="text-white rounded-md bg-gray-500 hover:bg-gray-600 py-1 px-6 shadow-md select-none p-ripple"
                v-ripple
              >
                Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import { useStore } from "vuex";

enum TabsEnum {
  Appearance = 1,
  Account = 2
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
