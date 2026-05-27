# @m-next/runtime-interface

Runtime interface package for converting backend runtime models to frontend widget properties.

## Purpose

This package provides utilities and hooks for translating backend control configurations into frontend widget props, specifically handling the conversion from backend runtime models to the M-One component system.

## Features

- **Button Translation**: Convert backend button controls to frontend button widget props
- **Icon Processing**: Handle icon name conversion and positioning
- **Width Calculations**: Process width types and values
- **V4 Styling**: Translate backend color/variant styles to V4 design system
- **React Hook**: `useButtonTranslation` for easy integration in React components

## Usage

### Basic Translation

```typescript
import { translateButtonControl } from '@m-next/runtime-interface';

const backendControl = {
  id: 'btn-1',
  classes: 'save-btn',
  caption: 'Save',
  icon: 'mi-icon-save',
  iconAlign: 'Left',
  styles: {
    variant: 'primary',
    color: 'blue',
  },
};

const onControlClick = (id: string) => console.log('Clicked:', id);
const result = translateButtonControl(backendControl, onControlClick);

// result.widgetProps contains the translated properties
// result.v4Styling contains the V4 color styling
```

### React Hook

```typescript
import { useButtonTranslation } from '@m-next/runtime-interface';

const ButtonWrapper = ({ control, onControlClick }) => {
  const { widgetProps, v4Styling } = useButtonTranslation(control, onControlClick);
  
  return (
    <Button
      {...widgetProps}
      onClick={() => onControlClick(control.id)}
    />
  );
};
```

### Individual Utilities

```typescript
import { 
  translateIcon, 
  translateWidth, 
  translateV4Styling 
} from '@m-next/runtime-interface';

// Translate just the icon
const icon = translateIcon(control);

// Translate just the width
const width = translateWidth(control);

// Translate just the V4 styling
const styling = translateV4Styling(control);
```

## Types

The package exports comprehensive TypeScript types for both backend models and frontend widgets:

- `BackendControl` - Backend control configuration interface
- `ButtonWidgetProps` - Frontend button widget properties
- `WidgetColorStyling` - V4 color styling interface
- `ButtonTranslationResult` - Complete translation result

## Dependencies

- `@m-next/styles` - For color constants and theme values
- `react` (peer dependency) - For React hooks

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build

# Lint code
npm run lint
```