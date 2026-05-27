// Override the svg-icon module to avoid JSX compilation errors
declare module '@m-next/svg-icon' {
  import * as React from 'react';

  export type SvgIconName = string;

  export interface SvgIconProps {
    name?: SvgIconName;
    height?: number;
    width?: number;
    color?: string;
    [key: string]: any;
  }

  const SvgIcon: React.FC<SvgIconProps>;
  export default SvgIcon;

  // Export all the problematic widget icons as any to avoid compilation errors
  export const ButtonWidget: React.FC<any>;
  export const ButtonMenuWidget: React.FC<any>;
  export const CheckboxWidget: React.FC<any>;
  export const ChartWidget: React.FC<any>;
  export const ContainerWidget: React.FC<any>;
  export const DateTimePickerWidget: React.FC<any>;
  export const DividerWidget: React.FC<any>;
  export const DocumentsWidget: React.FC<any>;
  export const DropdownWidget: React.FC<any>;
  export const FormulaWidget: React.FC<any>;
  export const GalleryWidget: React.FC<any>;
  export const GridWidget: React.FC<any>;
  export const HtmlEditorWidget: React.FC<any>;
  export const MapWidget: React.FC<any>;
  export const RadioButtonWidget: React.FC<any>;
  export const RecurrenceWidget: React.FC<any>;
  export const SignatureWidget: React.FC<any>;
  export const SyncWidget: React.FC<any>;
  export const TagWidget: React.FC<any>;
  export const TextAreaWidget: React.FC<any>;
  export const TextInputWidget: React.FC<any>;
  export const ToggleWidget: React.FC<any>;
}
