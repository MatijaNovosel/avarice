<template>
  <div class="text-white text-center q-pa-md flex flex-center bg-dark-1">
    <div>
      <div style="font-size: 30vh">404</div>
      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>
      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Categories"
});
</script>