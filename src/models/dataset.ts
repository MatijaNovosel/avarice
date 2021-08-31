export interface DatasetItem {
  label?: string;
  data: number[] | number;
  fill?: boolean;
  borderColor?: string | string[];
  backgroundColor?: string | string[];
  pointBackgroundColor?: string;
  type?: string;
  borderWidth?: number;
  borderRadius?: number;
  borderSkipped?: boolean;
}
