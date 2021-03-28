<template>
  <v-navigation-drawer app disable-resize-watcher>
    <template #prepend>
      <v-list-item class="my-2">
        <v-list-item-avatar>
          <v-icon size="3em">mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            Matija Novosel
          </v-list-item-title>
          <v-list-item-subtitle>
            Bruh
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
      links: props.links
    });

    return {
      state
    };
  }
});
</script>
