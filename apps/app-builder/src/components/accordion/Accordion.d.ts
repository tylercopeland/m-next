import * as React from 'react';

export interface AccordionProps {
  id: string;
  index?: number;
  onDisableDragging?: (index: number | null) => void;
  onSelect?: () => void;
  onClose?: () => void;
  open?: boolean;
  isSelected?: boolean;
  children?: React.ReactNode;
  caption: string;
  subTitle?: string;
  isDragable?: boolean;
  isValid?: boolean;
  contentStyle?: React.CSSProperties;
  tooltip?: string;
  tooltipId?: string;
  onAdd?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  variant?: 'right' | 'left';
  addButtonRef?: React.Ref<SVGElement>;
  borderless?: boolean;
  hasBetaPill?: boolean;
  allowHtml?: boolean;
  suppressSubTitleIcon?: boolean;
}

declare const Accordion: React.FC<AccordionProps>;

export default Accordion; 