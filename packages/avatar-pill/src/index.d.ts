import * as React from 'react';

export type AvatarPillColorScheme =
  | 'blue'
  | 'green'
  | 'fuchsia'
  | 'grey'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'orange'
  | 'teal';

export type AvatarPillVariant = 'subtle' | 'solid';
export type AvatarPillSize = 'sm' | 'md' | 'lg';

export interface AvatarConfig {
  /** Image source URL. Wins over `initials` when both are provided. */
  src?: string;
  /** 1-3 character initials fallback. Auto-derived from the label when omitted. */
  initials?: string;
  /** Accessible alt text for the avatar. Empty alt = decorative. */
  alt?: string;
}

export interface AvatarPillProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  id?: string;
  /** Either a fully-formed avatar node OR a `{src, initials, alt}` config. */
  avatar?: React.ReactNode | AvatarConfig;
  colorScheme?: AvatarPillColorScheme;
  variant?: AvatarPillVariant;
  size?: AvatarPillSize;
  leadingIcon?: React.ReactNode;
  /** Pass `true` to get the default × glyph; pass a node for a custom icon. */
  trailingIcon?: React.ReactNode | true;
  onTrailingIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  trailingIconLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  maxWidth?: string | number;
  /** Convenience alternative to `children`. */
  label?: React.ReactNode;
  children?: React.ReactNode;

  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLElement> | null;
  /** @deprecated Use `leadingIcon`. */
  leadIcon?: React.ReactNode;
  /** @deprecated Use `trailingIcon` + `onTrailingIconClick`. */
  trailIcon?: React.ReactNode;
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

declare const AvatarPill: React.ForwardRefExoticComponent<
  AvatarPillProps & React.RefAttributes<HTMLSpanElement>
>;

export { AvatarPill };
export default AvatarPill;
