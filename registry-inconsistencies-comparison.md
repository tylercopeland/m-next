# Registry Files Comparison - Inconsistencies Report

This document compares the values between:
- `packages/layout-canvas/src/registry/registryUtils.ts`
- `apps/app-builder/src/views/layout-designer/unified-control-registry/index.ts`

## 1. Widget to Control Type Mapping

| Widget Type | registryUtils.ts | unified-control-registry/index.ts | Status |
|-------------|------------------|-----------------------------------|--------|
| `SYNCWIDGET` | `'syncWidget'` | **MISSING** | ❌ Missing in unified registry |

## 2. Control Type Coverage

| Control Type | registryUtils.ts | unified-control-registry/index.ts | Status |
|--------------|------------------|-----------------------------------|--------|
| `addressLookup` | ✅ Complete | **MISSING** | ❌ Missing in unified registry |
| `screen` | ✅ Complete | **MISSING** | ❌ Missing in unified registry |

## 3. Display Restrictions Inconsistencies

| Control Type | Property | registryUtils.ts | unified-control-registry/index.ts | Impact |
|--------------|---------|------------------|-----------------------------------|--------|
| **attachments** | minWidth | 4 | 2 | ⚠️ Different minimum sizing |
| | minHeight | 3 | 10 | ⚠️ Significantly different minimum height |
| | maxHeight | 12 | 1000 | ⚠️ Vastly different maximum height |
| | defaultWidth | 6 | 3 | ⚠️ Different default sizing |
| | defaultHeight | 4 | 10 | ⚠️ Different default sizing |
| **input** | maxWidth | 12 | 8 | ⚠️ Different maximum width |
| | defaultWidth | 4 | 3 | ⚠️ Different default width |
| **textArea** | maxHeight | 12 | 16 | ⚠️ Different maximum height |
| | defaultWidth | 6 | 3 | ⚠️ Different default width |
| | defaultHeight | 4 | 16 | ⚠️ Significantly different default height |
| **dropdown** | maxWidth | 12 | 8 | ⚠️ Different maximum width |
| | defaultWidth | 4 | 3 | ⚠️ Different default width |
| **checkbox** | minWidth | 2 | 1 | ⚠️ Different minimum width |
| | maxWidth | 12 | 6 | ⚠️ Different maximum width |
| | minHeight | 1 | 3 | ⚠️ Different minimum height |
| | maxHeight | 1 | 3 | ⚠️ Different maximum height |
| | defaultWidth | 4 | 2 | ⚠️ Different default width |
| | defaultHeight | 1 | 3 | ⚠️ Different default height |
| **toggle** | minWidth | 2 | 1 | ⚠️ Different minimum width |
| | maxWidth | 12 | 4 | ⚠️ Different maximum width |
| | defaultWidth | 4 | 2 | ⚠️ Different default width |

## 4. Default Values Inconsistencies

| Control Type | Property | registryUtils.ts | unified-control-registry/index.ts | Impact |
|--------------|---------|------------------|-----------------------------------|--------|
| **buttonGroup** | buttons | `[]` (empty array) | `[...]` (pre-configured menu item) | ⚠️ Different initial state |
| **dropdown** | placeholder | `'Select an option'` | `'Select an option...'` | ⚠️ Different text |
| **input** | placeholder | `''` (empty) | `'Enter text...'` | ⚠️ Different placeholder |
| **textArea** | placeholder | `''` (empty) | `'Enter text...'` | ⚠️ Different placeholder |

## 5. Detailed Analysis

### Critical Missing Mappings
1. **SYNCWIDGET Mapping**: The unified registry is missing the mapping for `widgets.SYNCWIDGET` to `'syncWidget'`, which could cause the sync widget control to not be recognized properly.

### Missing Control Types
1. **addressLookup**: Fully implemented in registryUtils with complete defaults and display restrictions, but completely absent from unified registry.
2. **screen**: Fully implemented in registryUtils with complete defaults and display restrictions, but completely absent from unified registry.

### Sizing Inconsistencies Impact
- **Attachments**: Unified registry allows much larger components (max height 1000 vs 12) and different default positioning
- **Input/Dropdown**: Unified registry has more restrictive maximum widths (8 vs 12) and smaller default widths
- **TextArea**: Unified registry allows taller components and has significantly larger default height (16 vs 4)
- **Checkbox/Toggle**: Unified registry has more restrictive sizing overall with different minimum requirements

### User Experience Inconsistencies
- **Placeholder Text**: Unified registry provides more helpful placeholder text for inputs/textareas
- **Button Groups**: Unified registry pre-populates with a sample menu item, while registryUtils starts empty
- **Dropdown**: Minor text difference in placeholder ("Select an option" vs "Select an option...")

## Summary

- **Critical Issues**: 3 (Missing SYNCWIDGET mapping, missing addressLookup and screen control types)
- **Display Restriction Conflicts**: 6 control types with sizing inconsistencies  
- **Default Value Conflicts**: 4 control types with different defaults
- **Risk Level**: 🔴 **HIGH** - These inconsistencies will cause different behavior between systems using these registries

## Recommendations

1. **Immediate**: Add missing SYNCWIDGET mapping to unified registry
2. **High Priority**: Implement addressLookup and screen control types in unified registry
3. **Medium Priority**: Align display restrictions across both registries
4. **Low Priority**: Standardize default placeholder text and initial values

---

*Generated on: 2025-11-13*
*Files compared:*
- `packages/layout-canvas/src/registry/registryUtils.ts`
- `apps/app-builder/src/views/layout-designer/unified-control-registry/index.ts`
