declare module 'react-select/async' {
  import { ComponentType } from 'react';
  import { Props } from 'react-select';

  export interface AsyncProps<OptionType, IsMulti extends boolean = false> extends Props<OptionType, IsMulti> {
    cacheOptions?: boolean;
    defaultOptions?: boolean | readonly OptionType[];
    loadOptions: (
      inputValue: string,
      callback: (options: readonly OptionType[]) => void,
    ) => void | Promise<readonly OptionType[]>;
    noOptionsMessage?: (obj: { inputValue: string }) => string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare const AsyncSelect: ComponentType<AsyncProps<any, boolean>>;

  export default AsyncSelect;
}
