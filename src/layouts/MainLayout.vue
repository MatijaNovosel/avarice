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
        caption: "quasar.dev",
        icon: "mdi-view-dashboard-outline",
        link: {
          name: ROUTE_NAMES.DASHBOARD
        }
      },
      {
        title: "History",
        caption: "chat.quasar.dev",
        icon: "mdi-timer-sand",
        link: {
          name: ROUTE_NAMES.HISTORY
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
