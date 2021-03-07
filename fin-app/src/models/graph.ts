interface GraphLegendOptions {
  display?: boolean;
}

interface GraphAxesScaleLabelOptions {
  display?: boolean;
  labelString?: string;
}

interface GraphAxesGridLinesOptions {
  display?: boolean;
}

interface GraphAxesOptions {
  gridLines?: GraphAxesGridLinesOptions;
  display?: boolean;
  stacked?: boolean;
  scaleLabel?: GraphAxesScaleLabelOptions;
}

interface GraphScalesOptions {
  yAxes?: GraphAxesOptions[];
  xAxes?: GraphAxesOptions[];
}

interface GraphTooltipsOptions {
  mode?: string;
  intersect?: boolean;
}

interface GraphElementsLineOptions {
  tension?: number;
}

interface GraphElementPointOptions {
  radius?: number;
}

interface GraphElementArcOptions {
  borderWidth?: number;
}

interface GraphElementsOptions {
  line?: GraphElementsLineOptions;
  point?: GraphElementPointOptions;
  arc?: GraphElementArcOptions;
}

interface GraphTitleOptions {
  display?: boolean;
  text?: string;
}

export interface GraphOptions {
  tooltips?: GraphTooltipsOptions;
  scales?: GraphScalesOptions;
  legend?: GraphLegendOptions;
  responsive?: boolean;
  elements?: GraphElementsOptions;
  title?: GraphTitleOptions;
}

export interface GraphHTMLElement {
  reinit: Function;
  refresh: Function;
  generateLegend: Function;
}
