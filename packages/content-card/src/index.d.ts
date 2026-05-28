/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface ActionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  id?: string;
  /** Card title — rendered in the heading slot. */
  title?: string;
  /** Body copy — two-line clamped. */
  description?: string;
  /** Estimated time to complete, shown in a Pill (e.g. `5` → "~5min"). */
  timeToComplete?: string | number;
  /** Label on the primary action button. Defaults to "Launch Demo". */
  buttonText?: string;
  /** Click handler for the primary action button (NOT the card root). */
  onClick?: (e: React.MouseEvent) => void;
  /** When true, renders the completion icon overlay in the corner. */
  isComplete?: boolean;
  /** Optional thumbnail image source. Falls back to a grey placeholder. */
  thumbnail?: string;
  /** Completion-badge icon name (only renders when `isComplete` is true). */
  icon?: string;
  /** Completion-badge icon color. Defaults to `colors.green.base`. */
  iconColor?: string;
  /** Completion-badge icon size. Defaults to 16. */
  iconSize?: string | number;
  /** Style overrides for the outer wrapper. */
  style?: React.CSSProperties;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect — don't render instead. */
  hidden?: boolean;
}

/** Legacy alias — same shape as `ActionCardProps`. */
export type ContentCardProps = ActionCardProps;

export const ActionCard: React.ForwardRefExoticComponent<
  ActionCardProps & React.RefAttributes<HTMLDivElement>
>;

/** @deprecated Use `ActionCard` — same component, canonical name. */
export const ContentCard: React.ForwardRefExoticComponent<
  ActionCardProps & React.RefAttributes<HTMLDivElement>
>;

export default ContentCard;
