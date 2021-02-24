<template>
  <toast position="top-right" />
  <div class="grid grid-cols-12 h-screen" :class="{ dark: state.darkMode }">
    <div
      id="sidebar"
      class="col-span-2 bg-gray-500 dark:bg-gray-700 space-y-2 hidden lg:block"
      v-if="state.shouldDisplayNavigation"
    >
      <sidebar :items="state.sidebarItems" />
    </div>
    <div
      class="relative dark:bg-gray-900 bg-gray-100"
      :class="{
        'col-span-12 lg:col-span-10': state.shouldDisplayNavigation,
        'col-span-12': !state.shouldDisplayNavigation
      }"
    >
      <navbar v-if="state.shouldDisplayNavigation" />
      <router-view :class="{ 'mt-6': state.shouldDisplayNavigation }" />
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
import { useRoute } from "vue-router";

interface State {
  visible: boolean;
  sidebarItems: SidebarItem[];
  darkMode: boolean;
  shouldDisplayNavigation: boolean;
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
    const route = useRoute();
    const nonDisplayableRouteNames = [RouteNames.LOGIN, RouteNames.NOT_FOUND];

    const state: State = reactive({
      visible: false,
      shouldDisplayNavigation: computed(() => {
        return !nonDisplayableRouteNames.includes(route.name as string);
      }),
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
      store,
      nonDisplayableRouteNames
    };
  }
});
</script>
