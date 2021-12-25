<template>
  <q-layout view="lhh lpR lFf" class="layout q-mx-auto">
    <template v-if="shouldShowUi">
      <navbar />
    </template>
    <q-page-container>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-mt-md"
        active-color="red"
        indicator-color="red"
        align="center"
        narrow-indicator
      >
        <q-route-tab
          v-for="(route, i) in routes"
          :key="i"
          :label="route.title"
          :to="route.link"
          exact
        />
      </q-tabs>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import ROUTE_NAMES from "src/router/routeNames";
import Navbar from "src/components/Navbar.vue";
import { defineComponent, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { DrawerItem } from "src/models/common";

export default defineComponent({
  name: "MainLayout",
  components: {
    Navbar
  },
  setup() {
    const route = useRoute();
    const tab = ref("mails");

    const routes: DrawerItem[] = [
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
      shouldShowUi: computed(() => ![ROUTE_NAMES.LOGIN].includes(route.name as string)),
      tab,
      routes
    };
  }
});
</script>

<style lang="scss" scoped>
.layout {
  width: 1500px;
}
</style>
