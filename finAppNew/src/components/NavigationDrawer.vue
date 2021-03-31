<template>
  <v-navigation-drawer app disable-resize-watcher>
    <template #prepend>
      <v-list-item class="py-3 grey darken-4">
        <v-list-item-avatar>
          <v-icon large color="amber darken-2">mdi-poll-box</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            FinApp
          </v-list-item-title>
          <v-list-item-subtitle class="mt-1">
            v{{ state.appVersion }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-divider />
    <drawer-list v-if="links" :items="links" />
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "@vue/composition-api";
import NavigationLink from "../models/navigationLink";
import DrawerList from "@/components/DrawerList.vue";

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
  components: {
    DrawerList
  },
  setup(props: Props) {
    const state: State = reactive({
      links: props.links,
      appVersion: process.env.PACKAGE_VERSION
    });

    return {
      state
    };
  }
});
</script>
