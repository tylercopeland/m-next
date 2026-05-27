/**
 * Designer to Canvas Migration Service
 *
 * Migrates V3 Designer layouts to V4 Canvas layouts
 * - Converts legacy GRD controls to EDT format
 * - Converts expressions to formulas
 * - Preserves control data while updating layout structure
 * - Excludes legacy widgets (App Ribbon, ICON) from V4 canvas
 */

import Guid from '@m-next/utilities/src/guid';
import {
  DesignerPayload,
  LayoutV4Payload,
  DesignerControl,
  PositionContext,
  LayoutItem,
  GridMigration,
  MigrationResult,
  EventIdMapping,
  ActionSetIdMapping,
  ControlIdMapping,
} from './types';
import { GRID_COLUMNS, WIDGET_TYPES, COLUMN_TYPES, FIELD_TYPES, STANDARD_EVENT_PROPERTIES, CONTROL_SPECIFIC_EVENTS } from './constants';
import { calculateColumnWidths, getControlHeight, clampControlDimensions } from './utils/dimensionUtils';
import { convertExpressionToFormula } from './converters/expressionConverter';
import { migrateGridToEditableGrid } from './converters/gridMigrator';
import {
  migrateControlActionSets,
  buildControlIdMapping,
} from './converters/actionSetMigrator';

export class DesignerToCanvasMigration {
  private gridCols = GRID_COLUMNS;
  private currentY = 0;
  private layoutItems: LayoutItem[] = [];
  private migratedControls: { [oldId: string]: GridMigration } = {};
  private controlsLookup: { [key: string]: Record<string, unknown> } = {};
  private skippedControls: string[] = [];
  private errors: string[] = [];
  private controlIdMapping: ControlIdMapping = {};
  private eventIdMapping: EventIdMapping = {};
  private actionSetIdMapping: ActionSetIdMapping = {};
  private actionSetsMigratedCount = 0;

  /**
   * Execute migration from V3 Designer to V4 Canvas
   */
  public migrate(
    designerPayload: DesignerPayload,
    layoutV4Payload: LayoutV4Payload,
    versionId?: string
  ): MigrationResult {
    try {
      this.reset();

      const designerScreen = designerPayload.Data.screen;
      const designerLayout = designerScreen.layout;

      const containerIds = Object.keys(layoutV4Payload.LayoutV4 || {});
      const resolvedVersionId = versionId || containerIds[0] || designerScreen.versionId;

      if (!resolvedVersionId) {
        this.errors.push('Unable to determine versionId (container ID) - required for LayoutV4 structure');
        return this.createErrorResult(layoutV4Payload);
      }

      const containerId = resolvedVersionId;

      this.buildControlsLookup(layoutV4Payload, containerId);
      this.processDesignerLayout(designerLayout);
      this.updateLayoutV4(layoutV4Payload, containerId);
      this.convertExpressionsInControls(layoutV4Payload, containerId);
      this.migrateActionSets(designerPayload, layoutV4Payload, containerId);
      this.processMigratedGridControls(layoutV4Payload, containerId);

      return {
        success: true,
        layoutV4Payload,
        migratedControlsCount: Object.keys(this.migratedControls).length,
        skippedControlsCount: this.skippedControls.length,
        errors: [],
      };
    } catch (error) {
      this.errors.push(error instanceof Error ? error.message : String(error));
      return this.createErrorResult(layoutV4Payload);
    }
  }

  private reset(): void {
    this.currentY = 0;
    this.layoutItems = [];
    this.migratedControls = {};
    this.controlsLookup = {};
    this.skippedControls = [];
    this.errors = [];
    this.controlIdMapping = {};
    this.eventIdMapping = {};
    this.actionSetIdMapping = {};
    this.actionSetsMigratedCount = 0;
  }

  private buildControlsLookup(layoutV4Payload: LayoutV4Payload, containerId: string): void {
    const controlsData = layoutV4Payload.controls || {};
    if (containerId && controlsData[containerId] && typeof controlsData[containerId] === 'object') {
      this.controlsLookup = controlsData[containerId] as { [key: string]: Record<string, unknown> };
    } else if (controlsData) {
      this.controlsLookup = controlsData as { [key: string]: Record<string, unknown> };
    }
  }

  private processDesignerLayout(designerLayout: { Content?: DesignerControl[] }): void {
    if (designerLayout.Content && designerLayout.Content.length > 0) {
      this.processContentList(designerLayout.Content, {
        x: 0,
        y: 0,
        width: this.gridCols,
      });
    }
  }

  private processContentList(contentList: DesignerControl[], context: PositionContext): void {
    for (const item of contentList) {
      const itemType = item.Type || '';

      if (WIDGET_TYPES.SECTION.includes(itemType)) {
        this.processSection(item, context);
      } else if (itemType === WIDGET_TYPES.ROW) {
        this.processRow(item, context);
      } else if (itemType === WIDGET_TYPES.COLUMN) {
        this.processColumn(item, context);
      } else {
        this.addLayoutItem(item, context);
      }
    }
  }

  private processSection(section: DesignerControl, context: PositionContext): void {
    if (section.Content && section.Content.length > 0) {
      this.processContentList(section.Content, context);
    }
  }

  private processRow(row: DesignerControl, context: PositionContext): void {
    const rowStartY = this.currentY;
    const columns = row.Content || [];

    if (columns.length === 0) {
      return;
    }

    const colWidths = calculateColumnWidths(columns, context.width);

    let currentX = context.x;
    let maxColHeight = 0;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const colWidth = colWidths[i];
      const colStartY = this.currentY;

      const colContext: PositionContext = {
        x: currentX,
        y: rowStartY,
        width: colWidth,
      };
      this.processColumn(col, colContext);

      const colHeight = this.currentY - colStartY;
      maxColHeight = Math.max(maxColHeight, colHeight);

      currentX += colWidth;
      this.currentY = rowStartY;
    }

    this.currentY = rowStartY + Math.max(maxColHeight, 2);
  }

  private processColumn(col: DesignerControl, context: PositionContext): void {
    this.currentY = context.y;

    if (col.Content && col.Content.length > 0) {
      for (const item of col.Content) {
        const itemType = item.Type || '';

        if (WIDGET_TYPES.SECTION.includes(itemType)) {
          this.processSection(item, context);
        } else if (itemType === WIDGET_TYPES.ROW) {
          this.processRow(item, context);
        } else {
          this.addLayoutItem(item, context);
        }
      }
    }
  }

  private addLayoutItem(control: DesignerControl, context: PositionContext): void {
    const controlId = control.Id;
    const controlType = control.Type || control.TypeOverride || 'UNKNOWN';

    if (!controlId) {
      return;
    }

    if (this.shouldSkipControl(controlType, controlId)) {
      return;
    }

    let finalControlId = controlId;

    const fullControlData = this.controlsLookup[controlId] || control;
    const isComplexGrid = fullControlData.IsComplexType || fullControlData.isComplexType;

    if (controlType === WIDGET_TYPES.GRID && isComplexGrid) {
      const newId = Guid.create();
      const migratedGrid = migrateGridToEditableGrid(fullControlData, newId);

      if (migratedGrid) {
        this.migratedControls[controlId] = {
          newId,
          control: migratedGrid,
        };
        finalControlId = newId;
      }
    }

    const finalType = controlType === WIDGET_TYPES.GRID && isComplexGrid ? WIDGET_TYPES.EDITABLE_GRID : controlType;
    const height = getControlHeight(control, finalType);

    const legacyClass = control.LegacyClass || '';
    const isHidden = legacyClass.includes('controlHide');

    // Clamp dimensions to respect display restrictions
    const rawWidth = typeof context.width === 'number' ? context.width : 12;
    const { width: clampedWidth, height: clampedHeight } = clampControlDimensions(rawWidth, height, finalType);

    const layoutItem: LayoutItem = {
      id: finalControlId,
      containerId: null,
      desktop: {
        x: context.x,
        y: this.currentY,
        width: clampedWidth,
        height: clampedHeight,
        currentState: isHidden ? 1 : 0,
      },
      tabletOverride: null,
      mobileOverride: null,
      content: [],
    };

    this.layoutItems.push(layoutItem);
    this.currentY += clampedHeight;
  }

  private shouldSkipControl(controlType: string, controlId: string): boolean {
    if (WIDGET_TYPES.APP_RIBBON.includes(controlType)) {
      this.skippedControls.push(controlId);
      return true;
    }

    if (WIDGET_TYPES.ICON.includes(controlType)) {
      this.skippedControls.push(controlId);
      return true;
    }

    return false;
  }

  private updateLayoutV4(layoutV4Payload: LayoutV4Payload, containerId: string): void {
    if (!layoutV4Payload.LayoutV4) {
      layoutV4Payload.LayoutV4 = {};
    }

    if (!layoutV4Payload.LayoutV4[containerId]) {
      layoutV4Payload.LayoutV4[containerId] = {
        canvasId: containerId,
        type: 'Grid',
        size: this.gridCols,
        content: [],
      };
    }

    const originalContent = layoutV4Payload.LayoutV4[containerId].content || [];
    const designerIds = new Set(this.layoutItems.map((item) => item.id));
    const migratedGrdIds = new Set(Object.keys(this.migratedControls));

    for (const originalItem of originalContent) {
      const originalId = originalItem.id;
      if (!designerIds.has(originalId) && !migratedGrdIds.has(originalId)) {
        this.layoutItems.push(originalItem);
      }
    }

    layoutV4Payload.LayoutV4[containerId].content = this.layoutItems;
  }

  // eslint-disable-next-line class-methods-use-this
  private convertExpressionsInControls(layoutV4Payload: LayoutV4Payload, containerId: string): void {
    if (layoutV4Payload.controls && layoutV4Payload.controls[containerId]) {
      for (const [, controlData] of Object.entries(layoutV4Payload.controls[containerId])) {
        if (controlData.columns && Array.isArray(controlData.columns)) {
          const updatedColumns = [];

          for (const col of controlData.columns) {
            const columnType = col.columnType;
            const expression = col.expression || [];

            if (columnType === COLUMN_TYPES.EXPRESSION && expression.length > 0) {
              const formula = convertExpressionToFormula(expression);
              if (formula) {
                col.columnType = COLUMN_TYPES.FORMULA;
                col.fieldType = FIELD_TYPES.FORMULA;
                col.formula = formula;
                col.expression = null;
              }
            }

            updatedColumns.push(col);
          }

          controlData.columns = updatedColumns;
        }
      }
    }
  }

  private processMigratedGridControls(layoutV4Payload: LayoutV4Payload, containerId: string): void {
    if (Object.keys(this.migratedControls).length === 0) {
      return;
    }

    if (!layoutV4Payload.controls) {
      layoutV4Payload.controls = {};
    }

    const controlKeys = Object.keys(layoutV4Payload.controls);
    let isNestedStructure = false;

    if (controlKeys.length > 0) {
      const firstControl = layoutV4Payload.controls[controlKeys[0]];
      if (
        typeof firstControl === 'object' &&
        firstControl !== null &&
        !Object.prototype.hasOwnProperty.call(firstControl, 'Type') &&
        !Object.prototype.hasOwnProperty.call(firstControl, 'type')
      ) {
        isNestedStructure = true;
      }
    }

    if (isNestedStructure) {
      const versionId = containerId;
      if (!layoutV4Payload.controls[versionId]) {
        layoutV4Payload.controls[versionId] = {};
      }

      for (const [oldId, migration] of Object.entries(this.migratedControls)) {
        const oldControl = layoutV4Payload.controls[versionId][oldId];

        // Copy event properties from old control to new control (ActionSet migration updates old control)
        if (oldControl) {
          for (const eventProp of STANDARD_EVENT_PROPERTIES) {
            if (oldControl[eventProp] !== undefined) {
              migration.control[eventProp] = oldControl[eventProp];
            }
          }

          // Copy GRD-specific events (onActiveRowChange, column onClick)
          if (CONTROL_SPECIFIC_EVENTS.GRD) {
            for (const eventProp of CONTROL_SPECIFIC_EVENTS.GRD) {
              if (oldControl[eventProp] !== undefined) {
                migration.control[eventProp] = oldControl[eventProp];
              }
            }
          }

          delete layoutV4Payload.controls[versionId][oldId];
        }

        layoutV4Payload.controls[versionId][migration.newId] = migration.control;
      }
    } else {
      for (const [oldId, migration] of Object.entries(this.migratedControls)) {
        const oldControl = layoutV4Payload.controls[oldId];

        // Copy event properties from old control to new control (ActionSet migration updates old control)
        if (oldControl) {
          for (const eventProp of STANDARD_EVENT_PROPERTIES) {
            if (oldControl[eventProp] !== undefined) {
              migration.control[eventProp] = oldControl[eventProp];
            }
          }

          // Copy GRD-specific events (onActiveRowChange, column onClick)
          if (CONTROL_SPECIFIC_EVENTS.GRD) {
            for (const eventProp of CONTROL_SPECIFIC_EVENTS.GRD) {
              if (oldControl[eventProp] !== undefined) {
                migration.control[eventProp] = oldControl[eventProp];
              }
            }
          }

          delete layoutV4Payload.controls[oldId];
        }

        layoutV4Payload.controls[migration.newId] = migration.control;
      }
    }
  }

  /**
   * Migrates actionSets from designer payload to layout-v4 payload
   * Handles events for all control types (EDT, GRD, CHT, BGR, CAL, and standard controls)
   */
  private migrateActionSets(
    designerPayload: DesignerPayload,
    layoutV4Payload: LayoutV4Payload,
    containerId: string
  ): void {
    const designerScreen = designerPayload.Data.screen;
    const designerControls = designerScreen.controls || [];
    const designerEvents = designerScreen.events || {};
    const designerActionSets = designerScreen.actionSets || {};

    // Early return if no events or actionSets to migrate
    if (Object.keys(designerEvents).length === 0 || Object.keys(designerActionSets).length === 0) {
      return;
    }

    // Initialize actionSets and events structures if needed
    if (!layoutV4Payload.actionSets) {
      layoutV4Payload.actionSets = {};
    }
    if (!layoutV4Payload.actionSets[containerId]) {
      layoutV4Payload.actionSets[containerId] = {};
    }

    if (!layoutV4Payload.events) {
      layoutV4Payload.events = {};
    }
    if (!layoutV4Payload.events[containerId]) {
      layoutV4Payload.events[containerId] = {};
    }

    // Build control ID mapping by matching names
    let layoutV4Controls = layoutV4Payload.controls?.[containerId] || {};

    // If no controls under containerId, try root level (flat structure)
    if (Object.keys(layoutV4Controls).length === 0 && layoutV4Payload.controls) {
      const firstKey = Object.keys(layoutV4Payload.controls)[0];
      if (firstKey && typeof layoutV4Payload.controls[firstKey] === 'object' && 'Type' in layoutV4Payload.controls[firstKey]) {
        layoutV4Controls = layoutV4Payload.controls as Record<string, Record<string, unknown>>;
      }
    }

    this.controlIdMapping = buildControlIdMapping(designerControls, layoutV4Controls);

    // Process each control from designer
    for (const control of designerControls) {
      const controlId = control.Id || control.id;
      const controlType = control.Type || '';

      if (!controlId) {
        continue;
      }

      // Find the corresponding control in layout-v4
      const newControlId = this.controlIdMapping[controlId as string] || controlId;
      const newControl = layoutV4Controls[newControlId as string];

      if (!newControl) {
        continue;
      }

      // Migrate actionSets for this control
      const result = migrateControlActionSets(
        control,
        newControl,
        controlType,
        designerEvents,
        designerActionSets,
        this.eventIdMapping,
        this.actionSetIdMapping
      );

      // Add migrated actionSets and events to payload
      Object.assign(layoutV4Payload.actionSets[containerId], result.actionSets);
      Object.assign(layoutV4Payload.events[containerId], result.events);
      this.actionSetsMigratedCount += result.migratedCount;
    }
  }

  private createErrorResult(layoutV4Payload: LayoutV4Payload): MigrationResult {
    return {
      success: false,
      layoutV4Payload,
      migratedControlsCount: 0,
      skippedControlsCount: 0,
      errors: this.errors,
    };
  }
}

/**
 * Factory function for migration service
 */
export function createDesignerToCanvasMigration(): DesignerToCanvasMigration {
  return new DesignerToCanvasMigration();
}
