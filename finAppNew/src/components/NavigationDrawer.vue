<template>
  <v-navigation-drawer
    color="grey darken-4"
    right
    clipped
    app
    mini-variant
    floating
    permanent
  >
    <v-list dense nav class="mt-1">
      <v-list-item
        color="red"
        exact
        v-for="(item, i) in state.links"
        :key="i"
        :to="item.route"
      >
        <v-icon v-text="item.icon" />
      </v-list-item>
      <v-list-item @click="logOut">
        <v-list-item-icon>
          <v-icon color="grey">mdi-logout</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext } from "@vue/composition-api";
import NavigationLink from "../models/navigationLink";
import RouteNames from "@/constants/routeNames";

interface Props {
  links: NavigationLink[];
}

interface State {
  links: NavigationLink[];
  appVersion?: string;
}

export default defineComponent({
  name: "navigation-drawer",
  props: {
    links: Array,
    drawer: null
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      links: props.links,
      appVersion: process.env.PACKAGE_VERSION
    });

    async function logOut() {
      await context.root.$store.dispatch("user/logout");
      context.root.$router.push({ name: RouteNames.LOGIN });
    }

    return {
      state,
      logOut
    };
  }
});
</script>
