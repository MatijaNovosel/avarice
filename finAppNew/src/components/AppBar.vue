<template>
  <v-app-bar dense app class="elevation-1 rounded-bl-xl" height="70">
    <v-list-item>
      <v-list-item-avatar>
        <v-img alt="" src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title> Good evening <b>username</b>! </v-list-item-title>
        <v-list-item-subtitle>
          <v-icon small color="success">mdi-check-circle</v-icon>
          Verified account
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-spacer />
    <v-menu bottom left offset-y>
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" class="mr-3">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item>
          <v-list-item-title>
            New transaction
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            New transfer
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            New account
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
