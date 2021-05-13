import { DatasetItem } from "./dataset";

export interface GraphData {
  labels: string[];
  datasets: DatasetItem[];
}

interface GraphLegendOptions {
  display?: boolean;
  position?: string;
}

interface GraphAxesScaleLabelOptions {
  display?: boolean;
  labelString?: string;
}

interface GraphAxesGridLinesOptions {
  display?: boolean;
  color?: string;
}

interface GraphAxesTicksOptions {
  display?: boolean;
}

interface GraphAxesOptions {
  gridLines?: GraphAxesGridLinesOptions;
  display?: boolean;
  stacked?: boolean;
  scaleLabel?: GraphAxesScaleLabelOptions;
  ticks?: GraphAxesTicksOptions;
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
  borderRadius?: number;
}

interface GraphElementsOptions {
  line?: GraphElementsLineOptions;
  point?: GraphElementPointOptions;
  arc?: GraphElementArcOptions;
}

interface GraphTitleFontOptions {
  size?: number;
}

interface GraphTitleFontPaddingOptions {
  top?: number;
  bottom?: number;
}

interface GraphTitleOptions {
  display?: boolean;
  text?: string;
  font?: GraphTitleFontOptions;
  padding?: GraphTitleFontPaddingOptions;
}

export interface GraphOptions {
  cutoutPercentage?: number;
  tooltips?: GraphTooltipsOptions;
  scales?: GraphScalesOptions;
  legend?: GraphLegendOptions;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  elements?: GraphElementsOptions;
  title?: GraphTitleOptions;
}

export interface GraphHTMLElement {
  reinit: Function;
  refresh: Function;
  generateLegend: Function;
}
