<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "component",
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
</script>
