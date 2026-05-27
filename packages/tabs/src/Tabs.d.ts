/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface TabItem {
  /** Stable identifier for the tab. Used for selection, ARIA wiring, and React keys. */
  id: string;
  /** Visible label. If `onRenderTabHeader` is provided, this is still required (used as fallback). */
  caption: string;
  /** Disable interaction on this tab. */
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TabsProps {
  /** Optional — auto-generated if not provided. Used to namespace tab and panel ids for ARIA. */
  id?: string;
  /** Array of tab descriptors. Order in this array is the display order. */
  tabList: TabItem[];
  /** Id of the currently active tab. Component is controlled. */
  selectedTab?: string | null;
  /** Called when the user clicks or keyboard-activates a tab. */
  onChange?: (headerId: string, index: number, e?: React.SyntheticEvent) => void;
  /** Render-prop for the active panel's content. */
  onRenderTabContent?: () => React.ReactNode;
  /** Render-prop for each tab header button (overrides default `caption` rendering). */
  onRenderTabHeader?: (tab: TabItem, refreshId?: number) => React.ReactNode;
  /** Render-prop for entries in the overflow More-menu. */
  onRenderTabHeaderMenuItem?: (tab: TabItem, refreshId?: number) => React.ReactNode;
  /** Optional right-aligned icon / action area in the tab bar. */
  onRenderTabHeaderRightIcon?: () => React.ReactNode;
  /** When provided, tabs become drag-reorderable. Called with the new list + indices on drop. */
  onTabOrderChange?: (
    newTabList: TabItem[],
    sourceIndex: number,
    destinationIndex: number,
  ) => void;

  /** Render-pass bump — increment to force the header to re-measure / re-call render-props. */
  refreshId?: number;
  /** Container width (CSS). */
  width?: string;
  /** Outer container margin (CSS). */
  containerMargin?: string;
  /** Extra px padding added when measuring tab widths for overflow calculation. */
  tabPadding?: number;
  /** Remove the 1px panel border. */
  borderless?: boolean;
  /** Allow the panel to shrink to its content instead of holding a min-height. */
  dyanmicHeight?: boolean;
  /** Container fills 100% height. */
  fullHeight?: boolean;
  /** Use a panel height of `calc(100% - 65px)` (calendar-menu special case). */
  calMenuHeight?: boolean;
  /** Distribute tabs to fill the bar evenly (no More menu). */
  fullWidthTabs?: boolean;
  /** Reserved — currently no behavioral effect. */
  collapsible?: boolean;
  /** Use the older padding rules for the More-menu dropdown positioning. */
  legacyPadding?: boolean;

  /** Style overrides. */
  contentStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries / a separate mobile component. */
  isMobile?: boolean;
  /** @deprecated The mobile render branch was removed. Use a custom mobile layout instead. */
  onRenderTabHeaderMobile?: (tab: TabItem, refreshId?: number) => React.ReactNode;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
}

export interface TabHeaderProps {
  id: string;
  tabList: TabItem[];
  onChange?: (headerId: string, index: number, e?: React.SyntheticEvent) => void;
  selectedTab?: string;
  onRenderTabHeader?: (tab: TabItem, refreshId?: number) => React.ReactNode;
  onRenderTabHeaderMenuItem?: (tab: TabItem, refreshId?: number) => React.ReactNode;
  onRenderTabHeaderRightIcon?: () => React.ReactNode;
  tabPadding?: number;
  headerStyle?: React.CSSProperties;
  legacyPadding?: boolean;
  refreshId?: number;
  onTabOrderChange?: (
    newTabList: TabItem[],
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
}

export const TabHeader: React.FC<TabHeaderProps>;

declare const Tabs: React.ForwardRefExoticComponent<
  TabsProps & React.RefAttributes<HTMLDivElement>
>;
export default Tabs;
export { Tabs };
