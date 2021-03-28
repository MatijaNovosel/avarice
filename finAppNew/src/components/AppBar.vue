<template>
  <v-app-bar dense app clipped-left>
    <v-app-bar-nav-icon @click="toggleDrawer" />
    <v-toolbar-title>
      {{ $t("appTitle") }}
    </v-toolbar-title>
    <v-spacer />
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext } from "@vue/composition-api";
import RouteNames from "../constants/routeNames";

interface UserMenu {
  open: boolean;
}

interface State {
  routeNames: RouteNames;
}

export default defineComponent({
  name: "app-bar",
  setup(props, context: SetupContext) {
    const state: State = reactive({
      routeNames: RouteNames
    });

    function toggleDrawer() {
      context.emit("toggle-drawer");
    }

    return {
      state,
      toggleDrawer
    };
  }
});
</script>
