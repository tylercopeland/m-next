# Standard Editor Implementation Guide

## Overview
This guide provides the definitive template and checklist for implementing editor components in the M-One application builder. All new editors should follow this standard, and existing editors should be refactored to match these patterns.

---

## 📋 **Quick Checklist for New Editors**

### ✅ **Required Elements**
- [ ] TypeScript implementation (`.tsx` extension)
- [ ] RUM component context provider
- [ ] Standard props interface
- [ ] Common BlockEditor.styles usage
- [ ] Comprehensive test file
- [ ] Standard accordion structure
- [ ] ActionListSection for events
- [ ] Proper accessibility attributes

### ✅ **Standard Components to Use**
- [ ] `EditorInput` instead of direct `@m-next/input`
- [ ] `CaptionInput` for control labels
- [ ] `DefaultStateSelector` for visibility/enabled state
- [ ] `ValidationRulesList` for form controls
- [ ] `MappedFieldSelector` for data-bound controls
- [ ] `ActionListSection` for event handling

---

## 🏗️ **File Structure Template**

```
/your-editor-name/
├── YourEditorName.tsx          # Main component (TypeScript)
├── YourEditorName.test.tsx     # Comprehensive tests
└── index.js                    # Clean export
```

---

## 🎯 **Standard Implementation Template**

### **1. Standard Imports**
```typescript
// React and TypeScript
import React, { useMemo, useState } from 'react';

// M-One UI Components (consistent order)
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import Dropdown from '@m-next/dropdown';
import Toggle from '@m-next/toggle';
import { colors } from '@m-next/styles';
import { Guid, toCamelCase } from '@m-next/utilities';
import { Tooltip } from 'react-tooltip';

// Internal Components
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import Accordion from '../../../../components/accordion/Accordion';

// Common Editor Components (use these!)
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import EditorInput from '../common/components/editor-input/EditorInput';
import ValidationRulesList from '../common/components/validation-rules-list/ValidationRulesList';
import MappedFieldSelector from '../common/components/mapped-field-selector/MappedFieldSelector';

// Styles (ALWAYS use common styles)
import * as s from '../common/BlockEditor.styles';

// Control Classes
import { migrateYourControl } from '../../control-classes';

// Redux/API
import { useSelector } from 'react-redux';
import { selectScreenFields, selectControls, selectBaseModel } from '../../../../common/services/screenLayoutSlice';
```

### **2. TypeScript Interfaces**
```typescript
// Standard control interface extending BaseControl
interface YourControl extends BaseControl {
  // Control-specific properties
  someProperty?: string;
  enabled?: boolean;
  placeholder?: string;
  
  // Standard event properties (as needed)
  onFocus?: string | null;
  onChange?: string | null;
  onBlur?: string | null;
  onClick?: string | null;
}

// Standard editor props interface
interface YourEditorProps {
  rawControl: YourControl;
  onChange: (control: YourControl) => void;
  onAddAction: (control: YourControl, eventName: string) => void;
}
```

### **3. Standard Component Structure**
```typescript
const YourEditor: React.FC<YourEditorProps> = ({ rawControl, onChange, onAddAction }) => {
  // 1. CONTROL MEMOIZATION (Standard Pattern)
  const control = useMemo(() => {
    const defaultControl: YourControl = {
      id: '',
      caption: 'Default Caption',
      name: '',
      visible: true,
      disabled: false,
      // ... your specific defaults
    };

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    const migrated = migrateYourControl?.(merged);
    return migrated ?? merged;
  }, [rawControl]);

  // 2. REDUX SELECTORS (as needed)
  const fieldList = useSelector(selectScreenFields);
  const controlList = useSelector(selectControls);
  const screenBaseModel = useSelector(selectBaseModel);

  // 3. STANDARD EVENT HANDLERS
  const handlePropertyChange = (property: keyof YourControl, value: any) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handleChildPropertyChange = (property: keyof YourControl, child: string, value: any) => {
    const updated = { 
      ...control, 
      [property]: { ...control[property], [child]: value } 
    };
    onChange(updated);
  };

  // 4. CAPTION CHANGE HANDLER (Standard for CaptionInput)
  const handleCaptionChange = (newCaption: string, newName: string) => {
    const updated = { ...control, caption: newCaption, name: newName };
    onChange(updated);
  };

  // 5. ACTION HANDLING (Standard Pattern)
  const actions = [
    { value: 'Focus', label: 'Focus', source: 'onFocus' },
    { value: 'Change', label: 'Change', source: 'onChange' },
    { value: 'Blur', label: 'Blur', source: 'onBlur' },
  ];

  const events = useMemo(() => {
    const eventList = [];
    if (control.onFocus) {
      eventList.push({ id: control.onFocus, value: 'Focus', label: 'Focus' });
    }
    if (control.onChange) {
      eventList.push({ id: control.onChange, value: 'Change', label: 'Change' });
    }
    if (control.onBlur) {
      eventList.push({ id: control.onBlur, value: 'Blur', label: 'Blur' });
    }
    return eventList;
  }, [control.onFocus, control.onChange, control.onBlur]);

  const filteredActions = useMemo(
    () => actions.filter((action) => !events.some((item) => item.value === action.value)),
    [events],
  );

  const handleAddAction = (source: string, value: string): void => {
    const updated = { ...control, [source]: Guid.create() };
    onAddAction(updated, value);
  };

  // 6. STANDARD JSX STRUCTURE
  return (
    <RumComponentContextProvider componentName='YourEditor'>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: 9999, maxWidth: '240px', wordBreak: 'break-word' }} />
      <s.Wrapper padding={16}>
        <TextLine>Editing the base configuration and styles of the component.</TextLine>
        
        {/* Field Mapping Section (for data-bound controls) */}
        <MappedFieldSelector
          control={control}
          onChange={handleMappedFieldChange}
          fieldTypes={[FieldTypeIds.Text, FieldTypeIds.Integer]} // Specify allowed types
        />
        <s.SettingDivider />
        
        {/* Display Section - ALWAYS USE ACCORDION STRUCTURE */}
        <Accordion id='display' caption='Display' variant='left' open borderless>
          <CaptionInput
            id='label'
            label='Label'
            controlId={control.id}
            value={control.caption}
            onChange={handleCaptionChange}
            maxLength={40}
          />

          {/* Standard property inputs using EditorInput */}
          <EditorInput
            id='placeholder'
            label='Placeholder'
            value={control.placeholder || ''}
            onChange={(value) => handlePropertyChange('placeholder', value)}
            controlId={control.id}
            maxLength={100}
          />

          {/* Standard dropdowns/toggles using LineWrapper */}
          <s.LineWrapper>
            <Text>Some Property</Text>
            <Dropdown
              id='some-property'
              isV4Design
              options={someOptions}
              value={selectedValue}
              width={184} // STANDARD WIDTH
              onChange={(option) => handlePropertyChange('someProperty', option?.value)}
              ariaLabel='Some property description'
            />
          </s.LineWrapper>

          <s.LineWrapper>
            <Text>Enable Feature</Text>
            <Toggle
              id='enable-feature'
              checked={control.enabled}
              onChange={(checked) => handlePropertyChange('enabled', checked)}
              label='Enable this feature'
              width={184} // STANDARD WIDTH
            />
          </s.LineWrapper>

          {/* ALWAYS include DefaultStateSelector */}
          <DefaultStateSelector control={control} onChange={onChange} />
        </Accordion>

        <s.SettingDivider />

        {/* Validation Section (for form controls) */}
        <ValidationRulesList
          standardOptions={[
            ValidationRuleTypes.Required,
            ValidationRuleTypes.MinLength,
            ValidationRuleTypes.MaxLength,
          ]}
          values={control.validationRules || []}
          onChange={(rules) => handlePropertyChange('validationRules', rules)}
        />

        <s.SettingDivider />

        {/* Events Section - ALWAYS USE ActionListSection */}
        <ActionListSection
          caption='Events'
          values={events}
          emptyMessage='No events applied'
          canAdd={filteredActions.length > 0}
          actions={filteredActions}
          addLabel='Add'
          onAddAction={handleAddAction}
          control={control}
          optionKey='value'
        />
      </s.Wrapper>
    </RumComponentContextProvider>
  );
};

export default YourEditor;
```

---

## 🧪 **Standard Test Template**

### **Test File Structure**
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import YourEditor from './YourEditor';

// Standard mocks
jest.mock('../../../../common/rum/RumComponentContext', () => ({
  RumComponentContextProvider: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="rum-provider">{children}</div>,
}));

jest.mock('../common/components/action-list-section/ActionListSection', () => 
  function MockActionListSection({ caption, onAddAction, canAdd }: any) {
    return (
      <div data-testid="action-list-section">
        <div>{caption}</div>
        {canAdd && <button onClick={() => onAddAction('onChange', 'Change')}>Add Action</button>}
      </div>
    );
  }
);

describe('YourEditor', () => {
  const defaultControl = {
    id: 'test-control',
    caption: 'Test Control',
    name: 'testControl',
    visible: true,
    disabled: false,
  };

  const defaultProps = {
    rawControl: defaultControl,
    onChange: jest.fn(),
    onAddAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<YourEditor {...defaultProps} />);
      expect(screen.getByTestId('rum-provider')).toBeInTheDocument();
    });

    it('displays component description', () => {
      render(<YourEditor {...defaultProps} />);
      expect(screen.getByText(/Editing the base configuration/)).toBeInTheDocument();
    });
  });

  describe('Property Changes', () => {
    it('calls onChange when properties are modified', () => {
      render(<YourEditor {...defaultProps} />);
      
      // Test property change interactions
      // ... add specific tests for your component
    });
  });

  describe('Event Handling', () => {
    it('handles adding new actions', () => {
      render(<YourEditor {...defaultProps} />);
      
      const addButton = screen.getByText('Add Action');
      fireEvent.click(addButton);
      
      expect(defaultProps.onAddAction).toHaveBeenCalledWith(
        expect.objectContaining({ onChange: expect.any(String) }),
        'Change'
      );
    });
  });
});
```

---

## 🎨 **Styling Standards**

### **Always Use Common Styles**
```typescript
// ✅ CORRECT - Use common styles
import * as s from '../common/BlockEditor.styles';

<s.Wrapper padding={16}>
  <s.LineWrapper>
    <s.SettingDivider />
  </s.LineWrapper>
</s.Wrapper>

// ❌ WRONG - Custom styles
import * as s from './MyCustomStyles'; // DON'T DO THIS
```

### **Standard Spacing**
- **Component wrapper**: `padding={16}`
- **Line wrapper gap**: `gap={16}` (default) or `gap={8}` (nested)
- **Form control width**: `width={184}` (standard)
- **Icon sizes**: `size={12}` (small), `size={16}` (medium), `size={20}` (large)

---

## 🏗️ **Component Architecture Patterns**

### **1. Simple Form Control (Input, Button, Checkbox, etc.)**
```
- Display Accordion (Caption, Properties, DefaultStateSelector)
- ValidationRulesList (if applicable)  
- ActionListSection (Events)
```

### **2. Data-Bound Control (Dropdown, Grid Column, etc.)**
```
- MappedFieldSelector (Field Binding)
- Display Accordion
- Data/Filtering Accordion (if complex)
- ValidationRulesList
- ActionListSection
```

### **3. Complex Control (Grid, Chart, Calendar, etc.)**
```
- Display Accordion (Basic properties)
- Data Accordion (Data source configuration)
- Advanced Accordion (Complex settings)
- ActionListSection (Multiple events)
```

---

## 🔄 **Migration and Refactoring Checklist**

### **Converting Existing JSX to TypeScript**
1. [ ] Rename `.jsx` → `.tsx`
2. [ ] Add TypeScript interfaces
3. [ ] Remove PropTypes (use TypeScript instead)
4. [ ] Update component props with typing
5. [ ] Fix any type errors

### **Standardizing Existing Editors**
1. [ ] Replace custom styles with `BlockEditor.styles`
2. [ ] Replace direct `@m-next/input` with `EditorInput`
3. [ ] Replace custom property handlers with standard pattern
4. [ ] Convert tabs to accordion structure
5. [ ] Add `ActionListSection` for events
6. [ ] Add missing `ValidationRulesList`
7. [ ] Add comprehensive test coverage

---

## 📝 **Development Workflow**

### **Creating a New Editor**
1. Copy this template and replace `YourEditor` with your component name
2. Define your control interface extending `BaseControl`
3. Implement the standard component structure
4. Add control-specific properties and logic
5. Create comprehensive test file
6. Test with both empty/default and complex control objects

### **Testing Your Editor**
```bash
# Run tests
npm test -- --testPathPattern=YourEditor.test.tsx

# Run type checking
npx tsc --noEmit src/path/to/YourEditor.tsx

# Visual testing in Storybook (if applicable)
npm run storybook
```

---

## ⚡ **Performance Best Practices**

1. **Memoize expensive calculations**:
   ```typescript
   const expensiveValue = useMemo(() => calculateSomething(control), [control]);
   ```

2. **Use callback memoization for handlers**:
   ```typescript
   const handleChange = useCallback((value) => {
     handlePropertyChange('property', value);
   }, [handlePropertyChange]);
   ```

3. **Avoid inline object creation**:
   ```typescript
   // ❌ Bad - creates new object on every render
   <Component style={{ width: 184 }} />
   
   // ✅ Good - use constants
   const componentStyle = { width: 184 };
   <Component style={componentStyle} />
   ```

---

## 🚨 **Common Pitfalls to Avoid**

1. **DON'T** create custom styles files - use `BlockEditor.styles`
2. **DON'T** use direct `@m-next/input` - use `EditorInput`
3. **DON'T** implement custom action handling - use `ActionListSection`
4. **DON'T** mix PropTypes with TypeScript - choose one
5. **DON'T** forget the RUM context provider
6. **DON'T** use inline styles - use styled components
7. **DON'T** forget to test edge cases and error states

---

## ✅ **Quality Gates**

Before submitting a new or refactored editor:

### **Code Quality**
- [ ] TypeScript compilation passes with no errors
- [ ] ESLint passes with no warnings
- [ ] All tests pass with >80% coverage
- [ ] Component renders without console errors

### **Functionality**  
- [ ] All standard props are handled correctly
- [ ] Property changes trigger `onChange` callback
- [ ] Action adding triggers `onAddAction` callback
- [ ] Component works with empty/null control objects
- [ ] Validation rules work correctly (if applicable)

### **Standards Compliance**
- [ ] Uses standard component structure
- [ ] Uses common reusable components
- [ ] Follows TypeScript interface patterns
- [ ] Has comprehensive test coverage
- [ ] Includes proper accessibility attributes

---

## 📚 **Reference Examples**

### **Best Practice Examples (Follow These)**
- `input-editor/InputEditor.tsx` - Full TypeScript implementation
- `button-editor/ButtonEditor.jsx` - Standard JSX patterns
- `address-lookup-block-editor/AddressLookupBlockEditor.jsx` - Simple clean structure

### **Anti-Pattern Examples (Don't Follow These)**
- `field-block-editor/fieldBlockEditor.jsx` - Custom styles, broken tests
- `dropdown-block-editor/DropdownBlockEditor.jsx` - Too large, inconsistent patterns

---

This guide ensures all editors maintain consistency, quality, and maintainability across the M-One application builder platform.