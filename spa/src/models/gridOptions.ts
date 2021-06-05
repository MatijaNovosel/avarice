export default interface IGridOptions {
  page: number;
  itemsPerPage: number;
  sortBy?: string[];
  sortDesc?: boolean[];
  groupBy?: string[];
  groupDesc?: boolean[];
}