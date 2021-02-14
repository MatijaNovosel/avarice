<template>
  <toast position="top-right" />
  <div class="grid grid-cols-12 h-screen" :class="{ dark: state.darkMode }">
    <div
      id="sidebar"
      class="col-span-2 bg-gray-500 dark:bg-gray-700 space-y-2"
      v-if="state.isAuthenticated"
    >
      <sidebar :items="state.sidebarItems" />
    </div>
    <div
      class="relative dark:bg-gray-900 bg-gray-100"
      :class="{
        'col-span-10': state.isAuthenticated,
        'col-span-12': !state.isAuthenticated
      }"
    >
      <navbar v-if="state.isAuthenticated" />
      <router-view :class="{ 'mt-6': state.isAuthenticated }" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import { SidebarItem } from "@/models/sidebar-item";
import { RouteNames } from "@/constants/route-names";
import navbar from "@/components/navbar.vue";
import sidebar from "@/components/sidebar.vue";
import refresh from "@/helpers/refresh";

interface State {
  visible: boolean;
  sidebarItems: SidebarItem[];
  isAuthenticated: boolean;
  darkMode: boolean;
}

export default defineComponent({
  components: {
    navbar,
    sidebar
  },
  provide: {
    refresh
  },
  setup() {
    const store = useStore();

    const state: State = reactive({
      visible: false,
      isAuthenticated: computed(() => store.getters.isAuthenticated),
      darkMode: computed(() => store.getters.darkMode),
      sidebarItems: [
        {
          text: "Home",
          routeName: RouteNames.HOME,
          iconName: "home"
        },
        {
          text: "History",
          routeName: RouteNames.HISTORY,
          iconName: "clock"
        },
        {
          text: "Accounts",
          routeName: RouteNames.ACCOUNTS,
          iconName: "credit-card-outline"
        },
        {
          divider: true
        },
        {
          text: "Settings",
          routeName: RouteNames.SETTINGS,
          iconName: "cog"
        },
        {
          text: "Privacy",
          routeName: RouteNames.PRIVACY,
          iconName: "shield-check"
        }
      ]
    });

    return {
      state,
      store
    };
  }
});
</script>
