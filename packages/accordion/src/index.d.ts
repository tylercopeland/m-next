import * as React from 'react';

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  id?: string;
  /** When true, multiple items can be expanded at once. Defaults to false (radio-style). */
  allowMultiple?: boolean;
  /** Uncontrolled initial expanded state. Ignored when `expanded` is provided. */
  defaultExpanded?: string | string[];
  /** Controlled expanded state. */
  expanded?: string | string[];
  /** Called with the next array of expanded item ids when state would change. */
  onExpandedChange?: (next: string[]) => void;
  children?: React.ReactNode;

  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLDivElement> | null;
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export interface AccordionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Stable id used for expanded-state tracking. Strongly recommended. */
  id?: string;
  /** Header content. */
  title?: React.ReactNode;
  /** Disables the toggle. */
  disabled?: boolean;
  /** Optional left-side icon next to the title. */
  icon?: React.ReactNode;
  /** Body content shown when expanded. */
  children?: React.ReactNode;
}

declare const Accordion: React.ForwardRefExoticComponent<
  AccordionProps & React.RefAttributes<HTMLDivElement>
> & {
  Item: React.ForwardRefExoticComponent<
    AccordionItemProps & React.RefAttributes<HTMLDivElement>
  >;
};

export declare const Item: React.ForwardRefExoticComponent<
  AccordionItemProps & React.RefAttributes<HTMLDivElement>
>;

export default Accordion;
