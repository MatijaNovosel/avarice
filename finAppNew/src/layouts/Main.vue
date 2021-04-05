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
      <router-view @set-loading="setLoading" @show-snackbar="showSnackbar" />
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
  reactive
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
  setup() {
    const vm = getCurrentInstance();

    const links: NavigationLink[] = [
      {
        icon: "mdi-home",
        text: "Home",
        route: { name: RouteNames.HOME },
        sublinks: []
      },
      {
        icon: "mdi-credit-card-outline",
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
      loading: false,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "primary",
      shouldShowUi: computed(() => {
        return ![RouteNames.LOGIN].includes(vm?.$route.name as string);
      })
    });

    function setLoading(val: boolean) {
      state.loading = val;
    }

    function showSnackbar(data: SnackbarEmitData) {
      state.snackbarMessage = data.message;
      state.snackbarColor = data.color;
      state.snackbar = true;
    }

    return {
      state,
      links,
      setLoading,
      showSnackbar
    };
  }
});
</script>
