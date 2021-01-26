import { MDIIcon } from "@/types";

export interface SidebarItem {
  text?: string;
  routeName?: string;
  iconName?: MDIIcon;
  divider?: boolean;
}
