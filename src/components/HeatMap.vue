<template>
  <q-card class="rounded-md q-px-md" flat style="height: 260px" ref="heatmapCard">
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
import { getService, Types } from "src/di-container";
import ITransactionService from "src/api/interfaces/transactionService";
import { TransactionActivityHeatmapModel } from "src/api/client";
import { format } from "date-fns";

interface d3MouseEvent {
  layerX: number;
  layerY: number;
}

interface QuasarHTMLElement {
  $el: HTMLElement;
}

export default defineComponent({
  name: "heat-map",
  setup() {
    const heatmapCard = ref<QuasarHTMLElement | null>(null);

    async function initHeatMap() {
      const card = heatmapCard.value;
      const margin = { top: 20, right: 25, bottom: 20, left: 35 };
      const width = card && card.$el.clientWidth - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      const svg = d3
        .select("#heat-map")
        .append("svg")
        .attr("width", (width || 0) + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const data = await getService<ITransactionService>(Types.TransactionService).getHeatmap();

      const weeks = data.map((d) => d.week.toString());
      const weekDays = data.map((d) => d.weekDay as string);

      const x = d3
        .scaleBand()
        .range([0, (width || 0) - margin.left - margin.right])
        .domain(weeks);
      const y = d3.scaleBand().range([0, height]).domain(weekDays);

      svg
        .append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain")
        .remove();

      const getColor = d3
        .scaleSequential()
        .interpolator(d3.interpolateReds)
        .domain([0, data.map((x) => x.value).sort((a, b) => b - a)[0]]);

      const tooltip = d3
        .select("#heat-map")
        .append("div")
        .style("opacity", 0)
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("padding", "6px 8px")
        .style("position", "absolute")
        .style("color", "white");

      const mouseover = () => {
        tooltip.style("opacity", 1);
      };

      const mousemove = (event: d3MouseEvent, d: TransactionActivityHeatmapModel) => {
        tooltip
          .html(`<b>${d.value}</b><i> transactions on </i><b>${format(d.date, "dd.MM.yyyy.")}</b>`)
          .style("left", `${event.layerX + 10}px`)
          .style("top", `${event.layerY}px`);
      };

      const mouseleave = function () {
        tooltip.style("opacity", 0);
      };

      svg
        .selectAll()
        .data(data, (d) => `${d && d.week}:${d && d.weekDay}`)
        .join("rect")
        .attr("x", (d) => (x(d.week.toString()) as number) + 15)
        .attr("y", (d) => y(d.weekDay as string) as number)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", (d) => getColor(d.value))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }

    onMounted(async () => {
      await initHeatMap();
    });

    return {
      heatmapCard
    };
  }
});
</script>
