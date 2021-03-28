<template>
  <v-snackbar>
    {{ state.message }}
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

interface State {
  message: string | null;
}

export default defineComponent({
  setup() {
    const state: State = reactive({ message: null });

    return {
      state
    };
  }
});
</script>
