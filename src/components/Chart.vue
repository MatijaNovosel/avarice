<script>
import { defineComponent } from "vue";
import { Line } from "vue3-chart-v2";

export default defineComponent({
  name: "chart-test",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  extends: Line,
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      required: false
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
});
</script>
