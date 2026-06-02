import * as React from 'react';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional. Auto-generated when not provided. */
  id?: string;
  /** Section title. Rendered as an <h3>. */
  title?: React.ReactNode;
  /** Section subtitle. Rendered as a <p>. */
  subTitle?: React.ReactNode;

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

declare const SectionHeader: React.ForwardRefExoticComponent<
  SectionHeaderProps & React.RefAttributes<HTMLDivElement>
>;

export { SectionHeader };
export default SectionHeader;
