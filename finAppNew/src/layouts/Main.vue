<template>
  <v-main>
    <v-overlay v-model="state.loading">
      <v-progress-circular indeterminate size="60" width="10" color="primary" />
    </v-overlay>
    <app-bar />
    <navigation-drawer :links="links" />
    <v-container>
      <router-view @set-loading="setLoading" />
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
  loading: boolean;
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
      loading: false
    });

    function setLoading(val) {
      state.loading = val;
    }

    return {
      state,
      links,
      setLoading
    };
  }
});
</script>
