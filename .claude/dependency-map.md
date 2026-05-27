# M-One Monorepo Dependency Analysis

## Overview

The M-One monorepo follows a clear hierarchical dependency architecture with well-defined foundational packages that provide core functionality to higher-level UI components. All packages follow the `@m-next/[component-name]` scoped naming convention.

## Foundational Packages (Core Dependencies)

These packages form the foundation of the component system and are depended upon by most other packages:

### 1. **@m-next/types** (Root Foundation)
- **Description**: Shared TypeScript types and interfaces
- **Internal Dependencies**: None
- **External Dependencies**: `@babel/runtime`
- **Role**: Provides type definitions used across the entire system

### 2. **@m-next/styles** (Primary Foundation)
- **Description**: Shared styling system and theme utilities
- **Internal Dependencies**: `@m-next/types`
- **External Dependencies**: `@babel/runtime`
- **Role**: Core styling foundation using Emotion CSS-in-JS

### 3. **@m-next/utilities** (Secondary Foundation)
- **Description**: Common tools and utility functions
- **Internal Dependencies**: `@m-next/styles`, `@m-next/types`
- **External Dependencies**: None
- **Role**: Shared utility functions and helper methods

### 4. **@m-next/svg-icon** (Icon Foundation)
- **Description**: SVG icon component system based on icomoon
- **Internal Dependencies**: `@m-next/styles`
- **External Dependencies**: None
- **Role**: Icon rendering foundation for UI components

### 5. **@m-next/loading-skeleton** (Loading Foundation)
- **Description**: Skeleton loading component
- **Internal Dependencies**: None
- **External Dependencies**: `react-loading-skeleton`
- **Role**: Loading state foundation for components

## Primary UI Components (Medium Complexity)

These components build on foundational packages and provide core UI functionality:

### **@m-next/button**
- **Internal Dependencies**: `@m-next/styles`, `@m-next/svg-icon`, `@m-next/utilities`
- **Role**: Primary interactive element used by many other components

### **@m-next/validation**
- **Internal Dependencies**: `@m-next/styles`, `@m-next/svg-icon`
- **Role**: Form validation messaging system

### **@m-next/caption**
- **Internal Dependencies**: `@m-next/styles`
- **Role**: Text caption component

### **@m-next/typeography**
- **Internal Dependencies**: `@m-next/styles`, `@m-next/loading-skeleton`
- **Role**: Text rendering and typography system

### **@m-next/container**
- **Internal Dependencies**: `@m-next/styles`, `@m-next/utilities`, `@m-next/loading-skeleton`
- **External Dependencies**: `simplebar-react`
- **Role**: Layout container with scrolling capabilities

## Form Components (Moderate Complexity)

### **@m-next/input**
- **Internal Dependencies**: `@m-next/styles`, `@m-next/svg-icon`, `@m-next/caption`, `@m-next/validation`, `@m-next/typeography`, `@m-next/utilities`
- **Role**: Primary text input component

### **@m-next/dropdown**
- **Internal Dependencies**: `@m-next/button`, `@m-next/caption`, `@m-next/loading-skeleton`, `@m-next/pill`, `@m-next/styles`, `@m-next/svg-icon`, `@m-next/typeography`, `@m-next/utilities`, `@m-next/validation`
- **External Dependencies**: `@mui/material`, `react-select`, `react-virtualized`
- **Role**: Select/dropdown form component

## Dialog and Modal Components

### **@m-next/dialog**
- **Internal Dependencies**: `@m-next/styles`, `@m-next/svg-icon`, `@m-next/button`
- **External Dependencies**: `react-modal`
- **Role**: Modal dialog system

## Complex Visualization Components

### **@m-next/chart**
- **Internal Dependencies**: `@m-next/button`, `@m-next/container`, `@m-next/loading-skeleton`, `@m-next/styles`, `@m-next/svg-icon`, `@m-next/typeography`, `@m-next/utilities`
- **External Dependencies**: `highcharts`, `highcharts-react-official`, `react-modal`, `react-resize-detector`
- **Role**: Data visualization component

### **@m-next/grid** (Highest Complexity)
- **Internal Dependencies**: 
  - `@m-next/button`, `@m-next/caption`, `@m-next/card`, `@m-next/checkbox`
  - `@m-next/chips-filter`, `@m-next/container`, `@m-next/datepicker`, `@m-next/dialog`
  - `@m-next/dropdown`, `@m-next/image`, `@m-next/input`, `@m-next/input-area`
  - `@m-next/loading-skeleton`, `@m-next/menu`, `@m-next/pill`, `@m-next/popover`
  - `@m-next/radio-button`, `@m-next/styles`, `@m-next/svg-icon`, `@m-next/tag-widget`
  - `@m-next/typeography`, `@m-next/search-input`, `@m-next/types`, `@m-next/utilities`
- **External Dependencies**: `@syncfusion/ej2-base`, `dompurify`, `react-beautiful-dnd`, `react-modal`, `react-resize-detector`, `simplebar-react`, `xss`
- **Role**: Complex data grid component - most feature-rich component in the system

## Dependency Hierarchy Visualization

```
Level 0 (Foundation):
├── @m-next/types
├── @m-next/loading-skeleton

Level 1 (Core Styling):
├── @m-next/styles ──→ types

Level 2 (Utilities & Icons):
├── @m-next/utilities ──→ styles, types
├── @m-next/svg-icon ──→ styles

Level 3 (Basic Components):
├── @m-next/caption ──→ styles
├── @m-next/validation ──→ styles, svg-icon
├── @m-next/typeography ──→ styles, loading-skeleton
├── @m-next/container ──→ styles, utilities, loading-skeleton

Level 4 (Primary Components):
├── @m-next/button ──→ styles, svg-icon, utilities
├── @m-next/dialog ──→ styles, svg-icon, button

Level 5 (Form Components):
├── @m-next/input ──→ styles, svg-icon, caption, validation, typeography, utilities
├── @m-next/dropdown ──→ button, caption, loading-skeleton, pill, styles, svg-icon, typeography, utilities, validation

Level 6 (Complex Components):
├── @m-next/chart ──→ button, container, loading-skeleton, styles, svg-icon, typeography, utilities
├── @m-next/grid ──→ [22 internal dependencies - most complex component]
```

## Key Patterns Identified

1. **Universal Dependencies**: Almost all components depend on `@m-next/styles` for theming
2. **Common UI Dependencies**: `@m-next/svg-icon` and `@m-next/utilities` are frequently used
3. **Form Pattern**: Form components typically depend on `@m-next/validation`, `@m-next/caption`, and `@m-next/typeography`
4. **Peer Dependencies**: All packages share common peer dependencies: `@emotion/react`, `@emotion/styled`, `react`, `react-dom`, `prop-types`
5. **Build Consistency**: All packages use identical build tooling and scripts

## Dependency Impact Analysis

- **High Impact Changes**: Modifications to `@m-next/styles`, `@m-next/utilities`, or `@m-next/svg-icon` would affect most components
- **Cascade Risk**: The `@m-next/grid` component has the highest dependency count (22 internal deps), making it most vulnerable to upstream changes
- **Safe Changes**: Components like `@m-next/types`, `@m-next/loading-skeleton`, and `@m-next/caption` have minimal dependencies

## Recommended Maintenance Strategy

1. **Foundation First**: Prioritize stability and backward compatibility for foundational packages
2. **Versioning Strategy**: Consider semantic versioning with careful consideration of breaking changes in core packages
3. **Testing Strategy**: Focus integration testing on packages with high dependency counts
4. **Refactoring Opportunities**: Consider breaking down `@m-next/grid` dependencies to reduce coupling

This dependency mapping provides a clear understanding of the component relationships and can guide development, testing, and maintenance decisions for the M-One component library.