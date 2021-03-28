<template>
  <v-app-bar dense app class="elevation-1">
    <v-toolbar-title>
      Good afternoon Username!
    </v-toolbar-title>
    <v-spacer />
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext } from "@vue/composition-api";
import RouteNames from "../constants/routeNames";

interface State {
  routeNames: RouteNames;
}

export default defineComponent({
  name: "app-bar",
  setup() {
    const state: State = reactive({
      routeNames: RouteNames
    });

    return {
      state
    };
  }
});
</script>
