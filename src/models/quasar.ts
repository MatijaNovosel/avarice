/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

export interface QuasarTableColumn<T> {
  name: string;
  required?: boolean;
  label: string;
  align?: "left" | "center" | "right";
  field: ((row: T) => string) | string;
  format?: (val: number | string) => string;
  sortable?: boolean;
  sort?: (a: any, b: any) => number;
}

export interface QuasarTablePagination {
  sortBy: string | null;
  descending: boolean;
  page: number;
  rowsPerPage: number;
}
