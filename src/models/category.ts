export interface CategoryModel {
  name: string;
  icon: string;
  color: string;
  system: boolean;
  parent?: CategoryModel | undefined;
}
