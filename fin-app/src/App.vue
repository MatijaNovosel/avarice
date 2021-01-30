<template>
  <toast position="top-right" />
  <div class="grid grid-cols-12">
    <div class="col-span-2 bg-gray-600 space-y-2" v-if="state.isAuthenticated">
      <sidebar :items="state.sidebarItems" />
    </div>
    <div
      class="relative"
      :class="`col-span-${state.isAuthenticated ? '10' : '12'}`"
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
