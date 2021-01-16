interface GraphLineOptions {
  tension: number;
}

interface GraphElementsOptions {
  line: GraphLineOptions;
}

interface GraphLegendOptions {
  display: boolean;
}

interface GraphYAxesOptions {
  display?: boolean;
}

interface GraphScalesOptions {
  yAxes?: GraphYAxesOptions[];
}

export interface GraphOptions {
  scales?: GraphScalesOptions;
  legend: GraphLegendOptions;
  responsive: boolean;
}
