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
