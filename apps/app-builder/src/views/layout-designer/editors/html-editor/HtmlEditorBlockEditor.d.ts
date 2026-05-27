import { ReactNode } from 'react';
import { BaseControl } from '@m-next/runtime-interface';

export interface HtmlEditorBlockEditorProps {
  control: BaseControl;
  onChange: (control: BaseControl) => void;
  onAddAction: (control: BaseControl, eventName: string) => void;
  children?: ReactNode;
  className?: string;
}

declare const HtmlEditorBlockEditor: React.FC<HtmlEditorBlockEditorProps>;
export default HtmlEditorBlockEditor;
