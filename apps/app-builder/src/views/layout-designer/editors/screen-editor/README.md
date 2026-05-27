# ScreenEditor Component

The ScreenEditor component provides a comprehensive interface for editing screen-level properties in the App Builder. It allows users to configure various aspects of a screen including its data source, default behaviors, events, functions, and version notes.

## Features

### 📊 **Table Selection**
- Dropdown to select the primary table/data model for the screen
- Dynamically updates available options based on the application context

### ⚙️ **Configuration**
- **Default Control Focus**: Set which control receives focus when the screen loads
- **App Ribbon**: Choose between different ribbon configurations (None, 1/3, 2/3)

### 🎯 **Events Management**
- Add and manage screen-level events (Load, Save, Delete, Validate)
- Visual indication of applied events
- Prevents duplicate event types

### 🔧 **Screen Functions**
- Create reusable sets of actions that can be used with components
- Replaces the old "hidden buttons" pattern
- Add, edit, and delete functions with descriptions

### 📝 **Version Notes**
- Multi-line text area for documenting changes and functionality
- Supports up to 500 characters
- Helpful for tracking screen evolution

## Usage

```tsx
import ScreenEditor from './ScreenEditor';
import { ScreenProperties } from './types';

const screenProperties: ScreenProperties = {
  id: 'screen-1',
  name: 'CustomerScreen',
  caption: 'Customer Management',
  baseModel: 'Customer',
  defaultControlFocus: 'input-1',
  appRibbonType: '1/3',
  events: [],
  functions: [],
  versionNote: 'Initial screen setup',
};

<ScreenEditor
  screenProperties={screenProperties}
  onChange={(properties) => {
    // Handle screen properties changes
    console.log('Screen properties updated:', properties);
  }}
  onAddAction={(eventType) => {
    // Handle adding new screen event
    console.log('Adding event:', eventType);
  }}
  onAddFunction={() => {
    // Handle adding new screen function
    console.log('Adding new function');
  }}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `screenProperties` | `ScreenProperties` | Current screen configuration |
| `onChange` | `(properties: ScreenProperties) => void` | Callback when any property changes |
| `onAddAction` | `(eventType: string) => void` | Callback when adding a new event |
| `onAddFunction` | `() => void` | Callback when adding a new function |

## Types

```typescript
interface ScreenProperties {
  id: string;
  name: string;
  caption: string;
  baseModel: string;
  defaultControlFocus: string | null;
  appRibbonType: 'none' | '1/3' | '2/3';
  events: ScreenEvent[];
  functions: ScreenFunction[];
  versionNote: string;
}

interface ScreenEvent {
  id: string;
  name: string;
  type: 'Load' | 'Save' | 'Delete' | 'Validate';
}

interface ScreenFunction {
  id: string;
  name: string;
  description: string;
  actions: ScreenAction[];
}
```

## Design System

The component follows the established design patterns from other editors in the system:

- **Accordion Layout**: Organized sections with collapsible content
- **Consistent Spacing**: Uses standard 16px padding and gaps
- **Button Groups**: For mutually exclusive options (App Ribbon)
- **Dropdowns**: For single selection from multiple options
- **Styled Components**: Custom styling with emotion for consistent theming

## Testing

The component includes comprehensive tests covering:
- ✅ Basic rendering and structure
- ✅ Property changes and callbacks
- ✅ Event management
- ✅ Function management
- ✅ Edge cases and error scenarios
- ✅ Accessibility features

Run tests with:
```bash
npm test ScreenEditor.test.tsx
```

## Integration with Redux

The component integrates with the Redux store to access:
- `selectScreenFields`: Available fields from the current screen
- `selectControls`: All controls on the screen (for default focus)
- `selectBaseModel`: Current base model/table

## Accessibility

- **ARIA Labels**: Proper labeling for all interactive elements
- **Keyboard Navigation**: Full keyboard support for all controls
- **Screen Reader Support**: Semantic HTML structure
- **Focus Management**: Logical tab order and focus indicators

## Future Enhancements

- [ ] Drag and drop reordering for functions
- [ ] Advanced function editor with action builder
- [ ] Screen templates and presets
- [ ] Validation rules for screen properties
- [ ] Export/import screen configurations

## Files

- `ScreenEditor.tsx` - Main component
- `ScreenEditor.styles.tsx` - Styled components
- `ScreenEditor.test.tsx` - Unit tests
- `types.ts` - TypeScript definitions
- `index.js` - Export file
- `README.md` - This documentation