/* eslint-disable @typescript-eslint/no-explicit-any */
interface ComplexValueProps {
  id: string;
  complexValue: any;
  fieldListOptions: any[];
  fieldType: string;
  includeControls?: boolean;
  includeNone?: boolean;
  includeCurrentDate?: boolean;
  includeSessionVariables?: boolean;
  controlList: Record<string, any>;
  width: number;
  onChange: (value: any) => void;
  controlId: string;
  formatType?: string;
}

declare const ComplexValue: React.FC<ComplexValueProps>;
export default ComplexValue; 