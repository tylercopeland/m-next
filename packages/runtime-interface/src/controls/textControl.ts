import { BaseControl } from './baseControl';

export interface TextControl extends BaseControl {
  // Runtime value (from dataReducer when active record is loaded)
  value?: string | number | null;

  // Table name for mapped controls (used for designer display)
  baseModel?: string;

  // Text-specific properties
  displayTag?: string;
  color?: string;
  lineHeight?: string | number;
  wordBreak?: string;
  whiteSpace?: string;
  overflow?: string;
  center?: boolean;

  // Margin properties
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;

  // Icon properties
  icon?: string;
  iconAlign?: string;
  iconPosition?: string;

  // Link properties
  hrefFormat?: string;
  autoLinkText?: boolean;

  // Mapped field formatting
  fieldType?: number;
  formatType?: string;
  formatRounding?: number;

  // State properties
  defaultState?: 'Enabled' | 'Disabled' | 'Hidden';

  // Style override
  style?: React.CSSProperties;

  // Text-specific styles that extend the base styles
  styles?: {
    textAlignment?: string;
    fontWeight?: string;
    fontColor?: string;
    fontSize?: string;
  } & Record<string, unknown>;
}
