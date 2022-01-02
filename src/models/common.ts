export interface DrawerItemLink {
  name: string;
}

export interface DrawerItem {
  title: string;
  caption: string;
  icon: string;
  link: DrawerItemLink;
}

export interface SelectItem {
  label: string;
  value: string;
}

export interface DropResult<T> {
  removedIndex: number;
  addedIndex: number;
  payload: T;
}

export interface PageableCollection<T> {
  data: T[];
  total: number;
}
