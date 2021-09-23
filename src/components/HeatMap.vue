<template>
  <q-card class="rounded-md q-px-md" flat style="height: 250px" ref="heatmapCard">
    <q-card-section class="column q-pb-none">
      <span class="text-grey-6"> Activity heatmap </span>
      <span class="text-grey-8 text-caption"> Number of entries per day </span>
    </q-card-section>
    <div id="heat-map" />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import * as d3 from "d3";
import { format, sub, getWeek } from "date-fns";
import { randInt } from "src/utils/helpers";

interface d3MouseEvent {
  layerX: number;
  layerY: number;
}

interface QuasarHTMLElement {
  $el: HTMLElement;
}

interface DataItem {
  date: string;
  weekDay: string;
  value: number;
}

export default defineComponent({
  name: "heat-map",
  setup() {
    const heatmapCard = ref<QuasarHTMLElement | null>(null);

    function initHeatMap() {
      const card = heatmapCard.value;
      const margin = { top: 20, right: 25, bottom: 20, left: 35 };
      const width = card && card.$el.clientWidth - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      const svg = d3
        .select("#heat-map")
        .append("svg")
        .attr("width", width || 0 + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const data: DataItem[] = [];

      [...Array.from({ length: 100 }, (x, i) => i)].forEach((n) => {
        const date = sub(new Date(), { days: n });
        data.push({
          date: getWeek(date).toString(),
          weekDay: format(date, "EEEEEE"),
          value: randInt(1, 50)
        });
      });

      const dates = data.map((d) => d.date);
      const weekDays = data.map((d) => d.weekDay);

      const x = d3
        .scaleBand()
        .range([0, width || 0 - 50])
        .domain(dates);
      const y = d3.scaleBand().range([height, 0]).domain(weekDays);

      svg
        .append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain")
        .remove();

      const getColor = d3.scaleSequential().interpolator(d3.interpolateReds).domain([1, 50]);

      // create a tooltip
      const tooltip = d3
        .select("#heat-map")
        .append("div")
        .style("opacity", 0)
        .style("background-color", "#111010")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("padding", "6px 8px")
        .style("position", "absolute")
        .style("color", "white");

      const mouseover = function () {
        tooltip.style("opacity", 1);
      };
      const mousemove = function (event: d3MouseEvent, d: DataItem) {
        tooltip
          .html(`${d.value} transactions on this date`)
          .style("left", `${event.layerX + 10}px`)
          .style("top", `${event.layerY}px`);
      };
      const mouseleave = function () {
        tooltip.style("opacity", 0);
      };

      svg
        .selectAll()
        .data(data, (d) => `${d && d.date}:${d && d.weekDay}`)
        .join("rect")
        .attr("x", (d) => (x(d.date) as number) + 10)
        .attr("y", (d) => y(d.weekDay) as number)
        .attr("width", 15)
        .attr("height", 15)
        .attr("rx", 4)
        .attr("ry", 4)
        .style("fill", (d) => getColor(d.value))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }

    onMounted(() => {
      initHeatMap();
    });

    return {
      heatmapCard
    };
  }
});
</script>
