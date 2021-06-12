import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["chartdata", "options", "bgGradient", "strokeGradient"],
  data() {
    return {
      gradient: null,
      gradientStroke: null
    };
  },
  mounted() {
    const newChartData = this.chartData;

    // Bg gradient

    if (this.bgGradient) {
      this.gradient = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 400);

      this.gradient.addColorStop(0, this.bgGradient.from);
      this.gradient.addColorStop(1, this.bgGradient.to);
      newChartData.datasets[0].backgroundColor = this.gradient;
    }

    // Stroke gradient

    if (this.strokeGradient) {
      this.gradientStroke = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(500, 0, 100, 0);

      this.gradientStroke.addColorStop(1, this.strokeGradient.from);
      this.gradientStroke.addColorStop(0, this.strokeGradient.from);

      newChartData.datasets[0].borderColor = this.gradientStroke;
      newChartData.datasets[0].pointBorderColor = this.gradientStroke;
      newChartData.datasets[0].pointBackgroundColor = this.gradientStroke;
      newChartData.datasets[0].pointHoverBackgroundColor = this.gradientStroke;
      newChartData.datasets[0].pointHoverBorderColor = this.gradientStroke;
    }

    this.renderChart(newChartData, this.options);
  }
};
