<template>
  <q-layout view="lhh lpR lFf" :class="{ layout: shouldShowUi }" class="q-mx-auto">
    <template v-if="shouldShowUi">
      <navbar />
    </template>
    <q-page-container>
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

<script lang="ts">
import ROUTE_NAMES from "src/router/routeNames";
import Navbar from "src/components/Navbar.vue";
import { defineComponent, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { DrawerItem } from "src/models/common";
import { useStore } from "src/store";
import { setCssVar } from "quasar";

export default defineComponent({
  name: "MainLayout",
  components: {
    Navbar
  },
  setup() {
    const route = useRoute();
    const store = useStore();

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

    onMounted(() => {
      // eslint-disable-next-line
      setCssVar("accent", store.getters["app/accentColor"] as string);
    });

    return {
      shouldShowUi: computed(() => ![ROUTE_NAMES.LOGIN].includes(route.name as string)),
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
