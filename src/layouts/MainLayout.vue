<template>
  <q-layout view="lhh lpR lFf">
    <template v-if="shouldShowUi">
      <navbar />
      <drawer :data="drawerItems" />
    </template>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import ROUTE_NAMES from "src/router/routeNames";
import Navbar from "src/components/Navbar.vue";
import Drawer from "src/components/Drawer.vue";
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import { DrawerItem } from "src/models/common";

export default defineComponent({
  name: "MainLayout",
  components: {
    Drawer,
    Navbar
  },
  setup() {
    const route = useRoute();

    const drawerItems: DrawerItem[] = [
      {
        title: "Dashboard",
        caption: "Data overview",
        icon: "mdi-view-dashboard-outline",
        link: {
          name: ROUTE_NAMES.DASHBOARD
        }
      },
      {
        title: "History",
        caption: "Detailed transaction history",
        icon: "mdi-timer-sand",
        link: {
          name: ROUTE_NAMES.HISTORY
        }
      },
      {
        title: "Categories",
        caption: "User created categories",
        icon: "mdi-tag-multiple",
        link: {
          name: ROUTE_NAMES.CATEGORIES
        }
      },
      {
        title: "Templates",
        caption: "Predefined transactions",
        icon: "mdi-file-multiple",
        link: {
          name: ROUTE_NAMES.TEMPLATES
        }
      },
      {
        title: "Statistics",
        caption: "Visual representation of user data",
        icon: "mdi-chart-line",
        link: {
          name: ROUTE_NAMES.STATISTICS
        }
      },
      {
        title: "Settings",
        caption: "App and user preferences",
        icon: "mdi-cog",
        link: {
          name: ROUTE_NAMES.SETTINGS
        }
      }
    ];

    return {
      drawerItems,
      shouldShowUi: computed(() => ![ROUTE_NAMES.LOGIN].includes(route.name as string))
    };
  }
});
</script>
