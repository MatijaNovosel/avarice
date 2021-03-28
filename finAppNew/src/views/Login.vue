<template>
  <div>
    <h1>Hello</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, onMounted } from "@vue/composition-api";
import RouteNames from "../constants/routeNames";

export default defineComponent({
  setup(props, context: SetupContext) {
    onMounted(async () => {
      if (context.root.$store.getters["user/data"] == null) {
        await context.root.$store.dispatch("user/login");
      }
      context.root.$router.push({
        name: RouteNames.HOME
      });
    });

    return {};
  }
});
</script>
