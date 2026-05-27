import { FieldTypeIds, type FieldTypeId } from '../types/fieldTypes';

export const ColumnTypes = {
  Data: 0,
  Link: 1,
  Expression: 2,
  Button: 3,
  CardColumn: 4,
  Complex: 5,
  Formula: 6,
} as const;

// Column format interface
export interface ColumnFormat {
  visible: boolean;
  visibleMobile: boolean;
}

// Base column data interface
export interface BaseColumnData {
  fieldType?: FieldTypeId;
  name?: string;
  caption?: string;
  isKey?: boolean;
  columnType?: number;
  width?: number;
  format?: Partial<ColumnFormat>;
  hasSubtotal?: boolean;
  isLinked?: boolean;
  tableNameRef?: string | null;
  isRequired?: boolean;
  isUnique?: boolean;
  size?: number;
  id?: number;
  showHeader?: boolean;
}

// Base column interface
export interface BaseColumn {
  caption: string;
  name: string;
  width: number;
  format: ColumnFormat;
  isKey: boolean;
  columnType: number;
  fieldType: FieldTypeId;
  hasSubtotal: boolean;
  isLinked: boolean;
  tableNameRef: string | null;
  isRequired: boolean;
  isUnique: boolean;
  size: number;
  showHeader: boolean;
}

export const createBaseColumn = (data: BaseColumnData = {}): BaseColumn => ({
  caption: data.caption || '',
  name: data.name || '',
  width: data.width || 0,
  format: {
    visible: data.format?.visible ?? true,
    visibleMobile: data.format?.visibleMobile ?? true,
  },
  isKey: data.isKey || false,
  columnType: data.columnType || ColumnTypes.Data,
  fieldType: data.fieldType || FieldTypeIds.Text,
  hasSubtotal: data.hasSubtotal || false,
  isLinked: data.isLinked || false,
  tableNameRef: data.tableNameRef || null,
  isRequired: data.isRequired || false,
  isUnique: data.isUnique || false,
  size: data.size || 0,
  showHeader: data.showHeader ?? true,
});

export default createBaseColumn;
