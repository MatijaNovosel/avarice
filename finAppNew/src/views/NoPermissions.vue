<template>
  <v-container fill-height>
    <v-row
      class="justify-items-center text-center"
      justify="center"
      align="center"
    >
      <v-col cols="12" sm="6"> Nemate prava na zatraženi dio aplikacije </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "NoPermissions",
  setup() {
    return {};
  }
});
</script>
