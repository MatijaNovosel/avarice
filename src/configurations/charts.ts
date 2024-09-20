import { Chart, registerables } from "chart.js";

export const configureCharts = () => {
  Chart.register(...registerables);
};
