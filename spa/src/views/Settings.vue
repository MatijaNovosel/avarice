<template>
  <v-row>
    <v-col cols="12">
      <v-tabs v-model="state.tab" centered>
        <v-tab>
          User settings
        </v-tab>
        <v-tab>
          App settings
        </v-tab>
        <v-tab>
          Account settings
        </v-tab>
      </v-tabs>
      <v-divider />
      <v-tabs-items v-model="state.tab">
        <v-tab-item v-for="i in 3" :key="i">
          <v-card flat>
            <v-card-text>
              Template
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

interface State {
  tab: number;
}

export default defineComponent({
  name: "Settings",
  setup() {
    const state: State = reactive({ tab: 0 });

    return {
      state
    };
  }
});
</script>
