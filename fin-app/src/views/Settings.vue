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
      <div class="flex items-center">
        <div class="flex flex-col">
          <span class="text-gray-500 font-bold mb-3">Display name</span>
          <input-text v-model="state.userData.displayName" />
        </div>
        <img
          class="inline-block h-32 w-32 rounded-full ml-6"
          :src="state.user.photoURL"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppUser } from "@/models/user";
import { computed, defineComponent, onMounted, reactive } from "vue";
import { useStore } from "vuex";

enum TabsEnum {
  Appearance = 1,
  Currency = 2,
  Account = 3
}

interface UserData {
  displayName: string;
}

interface TabHeaderItem {
  text: string;
  value: TabsEnum;
}

interface State {
  tabHeaders: TabHeaderItem[];
  activeTab: TabsEnum;
  userData: UserData;
  user: AppUser;
}

export default defineComponent({
  name: "Settings",
  setup() {
    const store = useStore();

    const state: State = reactive({
      userData: {
        displayName: ""
      },
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

    onMounted(() => {
      state.userData.displayName = state.user.displayName as string;
    });

    return {
      state,
      TabsEnum
    };
  }
});
</script>
