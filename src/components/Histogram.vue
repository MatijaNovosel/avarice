<template>
  <q-card class="rounded-md q-px-md" flat style="height: 260px" ref="histogram">
    <q-card-section class="column q-pb-none">
      <span class="text-grey-6"> Spending per day </span>
      <span class="text-grey-8 text-caption"> Accumulated spending </span>
    </q-card-section>
    <div id="histogram" />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as d3 from "d3";

export default defineComponent({
  name: "histogram",
  setup() {
    async function initHeatMap() {
      const margin = { top: 10, right: 30, bottom: 30, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

      const svg = d3
        .select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const data = await d3.csv(
        "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv"
      );

      const x = d3.scaleLinear().domain([0, 1000]).range([0, width]);

      svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));

      const histogram = d3
        .bin()
        .value((d: DataItem) => d.price)
        .domain(x.domain())
        .thresholds(x.ticks(70));

      const bins = histogram(data);

      const y = d3.scaleLinear().range([height, 0]);
      y.domain([0, d3.max(bins, (d) => d.length)]);

      svg.append("g").call(d3.axisLeft(y));

      svg
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", 1)
        .attr("transform", (d) => `translate(${x(d.x0)} , ${y(d.length)})`)
        .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
        .attr("height", (d) => height - y(d.length))
        .style("fill", "#C3181C");
    }

    onMounted(async () => {
      await initHeatMap();
    });

    return {};
  }
});
</script>
