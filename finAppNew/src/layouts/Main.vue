<template>
  <v-main>
    <app-bar />
    <navigation-drawer :links="links" :drawer="state.drawer" />
    <v-container>
      <router-view />
    </v-container>
    <snackbar />
  </v-main>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import Snackbar from "@/components/Snackbar.vue";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import AppBar from "@/components/AppBar.vue";
import NavigationLink from "@/models/navigationLink";
import RouteNames from "@/constants/routeNames";

interface State {
  drawer: boolean;
}

export default defineComponent({
  components: {
    Snackbar,
    NavigationDrawer,
    AppBar
  },
  setup() {
    const links: NavigationLink[] = [
      {
        icon: "mdi-home",
        text: "Home",
        route: { name: RouteNames.HOME },
        sublinks: []
      },
      {
        icon: "mdi-account",
        text: "Accounts",
        route: { name: RouteNames.ACCOUNTS },
        sublinks: []
      },
      {
        icon: "mdi-clock",
        text: "History",
        route: { name: RouteNames.HISTORY },
        sublinks: []
      }
    ];

    const state: State = reactive({
      drawer: true
    });

    return {
      state,
      links
    };
  }
});
</script>
