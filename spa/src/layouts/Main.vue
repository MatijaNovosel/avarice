<template>
  <v-main>
    <v-overlay v-model="state.loading" />
    <template v-if="state.shouldShowUi">
      <app-bar :loading="state.loading" />
      <navigation-drawer :links="links" />
    </template>
    <v-container
      :class="{
        'px-6': state.shouldShowUi,
        'py-0 mx-0': !state.shouldShowUi
      }"
    >
      <router-view />
    </v-container>
    <v-snackbar
      app
      bottom
      v-model="state.snackbarActive"
      content-class="text-center"
      rounded="lg"
      :timeout="state.snackbar.timeout"
      :color="state.snackbar.color"
    >
      {{ state.snackbar.message }}
    </v-snackbar>
  </v-main>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import AppBar from "@/components/AppBar.vue";
import NavigationLink from "@/models/navigationLink";
import RouteNames from "@/constants/routeNames";
import { Snackbar } from "@/models/appNotifications";

interface State {
  loading: boolean;
  shouldShowUi: boolean;
  snackbar: Snackbar;
  snackbarActive: boolean;
}

export default defineComponent({
  components: {
    NavigationDrawer,
    AppBar
  },
  setup(props, context: SetupContext) {
    const vm = getCurrentInstance();

    const links: NavigationLink[] = [
      {
        icon: "mdi-view-dashboard",
        text: vm?.$t("routeNames.dashboard") as string,
        route: { name: RouteNames.DASHBOARD },
        sublinks: []
      },
      {
        icon: "mdi-credit-card-outline",
        text: vm?.$t("routeNames.accounts") as string,
        route: { name: RouteNames.ACCOUNTS },
        sublinks: []
      },
      {
        icon: "mdi-clock",
        text: vm?.$t("routeNames.history") as string,
        route: { name: RouteNames.HISTORY },
        sublinks: []
      },
      {
        icon: "mdi-cogs",
        text: vm?.$t("routeNames.settings") as string,
        route: { name: RouteNames.SETTINGS },
        sublinks: []
      }
    ];

    watch(
      () => context.root.$store.getters["app/snackbar"].active,
      () => {
        state.snackbarActive = true;
      }
    );

    const state: State = reactive({
      snackbarActive: false,
      loading: computed(() => {
        return context.root.$store.getters["app/loading"] as boolean;
      }),
      snackbar: computed(() => {
        return context.root.$store.getters["app/snackbar"] as Snackbar;
      }),
      shouldShowUi: computed(() => {
        return ![RouteNames.LOGIN].includes(vm?.$route.name as string);
      })
    });

    return {
      state,
      links
    };
  }
});
</script>
