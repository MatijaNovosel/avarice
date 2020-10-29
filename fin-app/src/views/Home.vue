<template>
  <div class="p-grid p-mt-5 p-nogutter">
    <div class="p-col">
      <chart type="bar" :data="state.basicData" />
    </div>
    <div class="p-col">
      <chart type="bar" :data="state.basicData" />
    </div>
    <div class="p-col">
      <chart type="bar" :data="state.basicData" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "Home",
  setup() {
    const state = reactive({
      basicData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "#42A5F5",
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: "My Second dataset",
            backgroundColor: "#9CCC65",
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      }
    });
    return { state };
  }
});
</script>
