<template>
  <v-list class="pt-0" dense>
    <v-list-item
      color="primary"
      :to="item.route"
      v-for="(item, i) in state.items"
      :key="i"
      exact
    >
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="item.text" />
      </v-list-item-content>
    </v-list-item>
    <v-list-item @click="logOut">
      <v-list-item-icon>
        <v-icon>mdi-logout</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          Log out
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

interface Props {
  items: any;
}

export default defineComponent({
  name: "drawer-list",
  props: {
    items: null
  },
  setup(props: Props) {
    const state = reactive({
      items: props.items
    });

    function logOut() {
      //
    }

    return {
      state,
      logOut
    };
  }
});
</script>
