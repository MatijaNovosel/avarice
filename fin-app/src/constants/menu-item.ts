export default interface MenuItem {
  label?: string | null;
  icon?: string | null;
  items?: Array<MenuItem> | null;
  command?: Function;
};