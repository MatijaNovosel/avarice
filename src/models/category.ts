export interface CategoryParent {
  id: string;
  name: string;
}

export interface CategoryModel {
  id: string;
  name: string;
  icon: string;
  color: string;
  system: boolean;
  parent?: CategoryParent;
}
