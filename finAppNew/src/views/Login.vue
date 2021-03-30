<template>
  <div>
    <h1>Login</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from "@vue/composition-api";

export default defineComponent({
  setup(props, context: SetupContext) {
    async function login() {
      await context.root.$store.dispatch("user/login");
    }

    return {
      login
    };
  }
});
</script>
