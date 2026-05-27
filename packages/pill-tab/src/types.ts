export interface PillTabOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}
