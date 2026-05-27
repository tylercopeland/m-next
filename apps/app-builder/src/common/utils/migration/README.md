# V3 Designer to V4 Canvas Migration

Senior-level refactored migration utilities for converting V3 Designer layouts to V4 Canvas layouts.

## Architecture

```
migration/
├── designerToCanvasMigration.ts  # Main migration service
├── types.ts                       # TypeScript type definitions
├── constants.ts                   # Configuration constants
├── converters/
│   ├── expressionConverter.ts    # Expression → Formula conversion
│   ├── gridMigrator.ts           # GRD → EDT migration
│   └── actionSetMigrator.ts      # ActionSet & Event migration
└── utils/
    ├── dimensionUtils.ts         # Width/height calculations
    └── textUtils.ts              # HTML stripping utilities
```

## Usage

### Basic Migration

```typescript
import { createDesignerToCanvasMigration } from '@common/utils/migration';

const migration = createDesignerToCanvasMigration();

const result = migration.migrate(
  designerPayload,  // V3 Designer layout
  layoutV4Payload,  // V4 Canvas layout
  versionId         // Optional version ID
);

if (result.success) {
  console.log(`Migrated ${result.migratedControlsCount} controls`);
  console.log(`Skipped ${result.skippedControlsCount} legacy widgets`);
} else {
  console.error('Migration failed:', result.errors);
}
```

### Backwards Compatibility

Existing code using `LayoutPositionPorter` will continue to work:

```typescript
import { LayoutPositionPorter } from '@common/utils/layoutPositionPorter';

const porter = new LayoutPositionPorter();
const updated = porter.portPositions(designerPayload, layoutV4Payload, versionId);
```

## Features

### Grid Migration (GRD → EDT)

- Converts legacy read-only grids to editable grids
- Generates new GUIDs for migrated controls
- Preserves all grid configuration (views, columns, filters)
- Maintains column formatting and display options

### Expression Conversion

- Converts legacy expression arrays to formula strings
- Supports arithmetic operations (+, -, *, /)
- Handles field references, text, numbers, and booleans
- Strips HTML from text values

### ActionSet Migration

- Migrates events and actionSets from designer to V4 layout
- **Preserves original event IDs and actionSet IDs** (idempotent)
- Handles all control types: EDT, GRD, CHT, BGR, CAL, and standard controls
- Auto-detects control ID mappings by matching names
- Supports:
  - EDT: `onActiveRowChange`, column `onChangeEvent`
  - GRD: `onActiveRowChange`, column `onClick`
  - CHT: column `onClick` (first column only)
  - BGR/CAL: button `onClick`
  - Standard controls: `onClick`, `onChange`, `onBlur`, `onFocus`, etc.

### Layout Preservation

- Maintains control positioning and sizing
- Preserves visibility states
- Handles nested layouts (sections, rows, columns)
- Calculates responsive column widths

### Legacy Widget Handling

Excludes the following widgets from V4 canvas (preserves in controls):
- **App Ribbon Widget** (APR/APPRIBBON) - Legacy widget
- **ICON Widget** (ICO/ICON) - Legacy widget

Payment (PAY) and File Attachment (FIL) widgets are blocked at the UI level via `MigrationBanner`.

## Design Principles

### Separation of Concerns

Each module has a single responsibility:
- **designerToCanvasMigration.ts**: Orchestration and state management
- **gridMigrator.ts**: Grid-specific migration logic
- **expressionConverter.ts**: Expression parsing and formula generation
- **dimensionUtils.ts**: Layout calculations
- **textUtils.ts**: String manipulation

### No Side Effects

- No console.log statements
- No external dependencies beyond utilities
- Pure functions where possible
- Errors returned via result object

### Type Safety

- Full TypeScript type coverage
- Explicit interfaces for all data structures
- Const assertions for enums
- Strict null checks

### Testability

- Factory pattern for service instantiation
- Dependency injection ready
- State reset between migrations
- Error collection for debugging

## Migration Flow

1. **Initialize**: Reset state, build controls lookup
2. **Process Layout**: Walk designer layout tree
3. **Transform Controls**: Migrate grids, skip legacy widgets
4. **Update Canvas**: Merge with existing V4 layout
5. **Convert Expressions**: Transform formulas in all controls
6. **Migrate ActionSets**: Migrate events and actionSets (preserving original IDs)
7. **Finalize Grids**: Replace old GRD with new EDT controls
8. **Return Result**: Success status, counts, errors

## Error Handling

All errors are collected and returned in the result object:

```typescript
interface MigrationResult {
  success: boolean;
  layoutV4Payload: LayoutV4Payload;
  migratedControlsCount: number;
  skippedControlsCount: number;
  errors: string[];
}
```

No exceptions are thrown - check `result.success` and `result.errors`.

## Performance

- Single-pass layout processing
- Efficient Set-based lookups for ID comparisons
- Minimal object cloning
- No unnecessary re-processing

## Future Enhancements

- [ ] Add progress callbacks for long migrations
- [ ] Support for incremental migrations
- [ ] Validation before migration
- [ ] Migration rollback support
- [ ] Performance metrics collection
