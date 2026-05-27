/**
 * Type definitions for V3 Designer to V4 Canvas migration
 */

/**
 * ActionSet migration types
 */
export interface ActionSet {
  ActionSetId?: string;
  Key?: string;
  [key: string]: unknown;
}


export interface PositionContext {
  x: number;
  y: number;
  width: number;
}

export interface LayoutItem {
  id: string;
  containerId: string | null;
  desktop: {
    x: number;
    y: number;
    width: number;
    height: number;
    currentState: number;
  };
  tabletOverride: null;
  mobileOverride: null;
  content: unknown[];
}

export interface DesignerControl {
  Id?: string;
  Type?: string;
  TypeOverride?: string;
  LegacyClass?: string;
  LegacyDataWidth?: string;
  LegacyDataHeight?: string;
  Content?: DesignerControl[];
  IsComplexType?: boolean;
  isComplexType?: boolean;
  [key: string]: unknown;
}

export interface DesignerLayout {
  Content?: DesignerControl[];
}

export interface DesignerPayload {
  Data: {
    screen: {
      versionId?: string;
      layout: DesignerLayout;
      controls?: DesignerControl[];
      events?: Record<string, string[]>;
      actionSets?: Record<string, ActionSet>;
    };
  };
}

export interface LayoutV4Container {
  canvasId: string;
  type: string;
  size: number;
  content: LayoutItem[];
}

export interface LayoutV4Payload {
  LayoutV4?: {
    [containerId: string]: LayoutV4Container;
  };
  controls?: {
    [key: string]: Record<string, unknown>;
  };
  [key: string]: unknown;
}

export interface ExpressionSource {
  valueType?: number;
  ValueType?: number;
  value?: unknown;
  Value?: unknown;
  property?: string;
  Property?: string;
  childProperty?: unknown;
  ChildProperty?: unknown;
  validationMessage?: unknown;
  ValidationMessage?: unknown;
  fontStyles?: unknown;
  FontStyles?: unknown;
}

export interface ExpressionItem {
  operation?: number | null;
  Operation?: number | null;
  dateField?: unknown;
  source?: ExpressionSource;
  Source?: ExpressionSource;
  key?: unknown;
  additionalSources?: unknown;
  dateWhere?: unknown;
}

export interface GridMigration {
  newId: string;
  control: Record<string, unknown>;
}

export interface MigrationResult {
  success: boolean;
  layoutV4Payload: LayoutV4Payload;
  migratedControlsCount: number;
  skippedControlsCount: number;
  errors: string[];
}


export interface ActionSetMapping {
  oldEventId: string;
  newEventId: string;
  actionSetIds: string[];
}

export interface ControlIdMapping {
  [oldId: string]: string;
}

export interface EventIdMapping {
  [oldEventId: string]: string;
}

export interface ActionSetIdMapping {
  [oldActionSetId: string]: string;
}

export interface ActionSetMigrationResult {
  actionSets: Record<string, ActionSet>;
  events: Record<string, string[]>;
  eventIdMapping: EventIdMapping;
  actionSetIdMapping: ActionSetIdMapping;
  migratedCount: number;
}
