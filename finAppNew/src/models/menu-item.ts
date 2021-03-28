export interface MenuItem {
  label?: string;
  command?: ((payload: MouseEvent) => void) | undefined;
  separator?: boolean;
}