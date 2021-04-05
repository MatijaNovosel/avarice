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
      <router-view @show-snackbar="showSnackbar" />
    </v-container>
    <v-snackbar
      app
      timeout="2000"
      v-model="state.snackbar"
      bottom
      :color="state.snackbarColor"
      content-class="text-center"
      rounded="lg"
    >
      {{ state.snackbarMessage }}
    </v-snackbar>
  </v-main>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  SetupContext
} from "@vue/composition-api";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import AppBar from "@/components/AppBar.vue";
import NavigationLink from "@/models/navigationLink";
import RouteNames from "@/constants/routeNames";
import { SnackbarEmitData } from "@/models/snackbar";

interface State {
  loading: boolean;
  shouldShowUi: boolean;
  snackbar: boolean;
  snackbarColor: string;
  snackbarMessage: string;
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
        icon: "mdi-home",
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

    const state: State = reactive({
      loading: computed(() => {
        return context.root.$store.getters["app/loading"] as boolean;
      }),
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "primary",
      shouldShowUi: computed(() => {
        return ![RouteNames.LOGIN].includes(vm?.$route.name as string);
      })
    });

    function showSnackbar(data: SnackbarEmitData) {
      state.snackbarMessage = data.message;
      state.snackbarColor = data.color;
      state.snackbar = true;
    }

    return {
      state,
      links,
      showSnackbar
    };
  }
});
</script>
