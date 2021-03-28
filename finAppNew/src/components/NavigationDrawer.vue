<template>
  <v-navigation-drawer
    clipped
    app
    v-model="state.drawer"
    disable-resize-watcher
    left
    color="grey lighten-3"
  >
    <template #prepend>
      <v-list-item class="my-2">
        <v-list-item-avatar style="width: none">
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
import {
  defineComponent,
  SetupContext,
  reactive,
  watch
} from "@vue/composition-api";
import NavigationLink from "../models/navigationLink";
import DrawerList from "@/components/DrawerList.vue";

interface Props {
  links: NavigationLink[];
  drawer: boolean;
}

interface State {
  mini: boolean;
  drawer: boolean;
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
      mini: false,
      drawer: props.drawer,
      links: props.links
    });

    watch(
      () => props.drawer,
      value => (state.drawer = value)
    );

    return {
      state
    };
  }
});
</script>
