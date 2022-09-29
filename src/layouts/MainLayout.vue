<template>
  <q-layout view="lhh lpR lFf" :class="{ layout: shouldShowUi }" class="q-mx-auto">
    <template v-if="shouldShowUi">
      <navbar />
    </template>
    <q-page-container class="q-pt-none">
      <q-tabs
        v-if="shouldShowUi"
        dense
        class="text-grey q-mt-md"
        active-color="accent"
        indicator-color="accent"
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

<script lang="ts" setup>
import ROUTE_NAMES from "src/router/routeNames";
import Navbar from "src/components/Navbar.vue";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { DrawerItem } from "src/models/common";
import { setCssVar } from "quasar";
import { useAppStore } from "src/store/app";

const route = useRoute();
const appStore = useAppStore();

const shouldShowUi = computed(
  () => ![ROUTE_NAMES.LOGIN, ROUTE_NAMES.REGISTER].includes(route.name as string)
);

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

onMounted(() => setCssVar("accent", appStore.accentColor));
</script>

<style lang="scss">
.layout {
  width: 1350px;
}
</style>
