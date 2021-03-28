export interface DatasetItem {
  label?: string;
  data: number[] | number;
  fill?: boolean;
  borderColor?: string | string[];
  backgroundColor?: string | string[];
  type?: string;
  borderWidth?: number;
}
