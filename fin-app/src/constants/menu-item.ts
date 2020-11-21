export default interface MenuItem {
  label?: string | null;
  icon?: string | null;
  items?: MenuItem[] | null;
  command?: Function;
}
