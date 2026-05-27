declare module '@m-next/tabs' {
  import * as React from 'react';

  export interface TabItem {
    id: string;
    caption: string;
    [key: string]: any;
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
      destinationIndex: number
    ) => void;
  }

  export interface TabsProps {
    id: string;
    tabList: TabItem[];
    width?: string;
    onChange?: (headerId: string, index: number, e?: React.SyntheticEvent) => void;
    onRenderTabContent?: () => React.ReactNode;
    selectedTab?: string;
    onRenderTabHeader?: (tab: TabItem, refreshId?: number) => React.ReactNode;
    onRenderTabHeaderMenuItem?: (tab: TabItem, refreshId?: number) => React.ReactNode;
    onRenderTabHeaderMobile?: (tab: TabItem, refreshId?: number) => React.ReactNode;
    onRenderTabHeaderRightIcon?: () => React.ReactNode;
    refreshId?: number;
    isMobile?: boolean;
    containerMargin?: string;
    tabPadding?: number;
    borderless?: boolean;
    dyanmicHeight?: boolean;
    contentStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    legacyPadding?: boolean;
    fullHeight?: boolean;
    calMenuHeight?: boolean;
    fullWidthTabs?: boolean;
    collapsible?: boolean;
    onTabOrderChange?: (
      newTabList: TabItem[],
      sourceIndex: number,
      destinationIndex: number
    ) => void;
  }
  
  export const TabHeader: React.FC<TabHeaderProps>;

  const Tabs: React.FC<TabsProps>;
  export default Tabs;
}