# Editor Refactoring Todo List - Prioritized by Work Required

## Summary
**Total Editors Analyzed**: 26  
**JSX Editors Needing TS Conversion**: 15  
**Missing Test Coverage**: 12  
**Broken Tests**: 2  
**High Refactoring Priority**: 8  

---

## 🟢 **PHASE 1: Quick Wins (1-3 hours each)**

### 1. `map-block-editor` - **LOWEST EFFORT**
- **File**: `index.js` (24 lines, just exports Gallery editor)
- **Issues**: No main component, just re-exports
- **Work**: Remove entirely, update imports to use gallery-block-editor directly
- **Effort**: 30 minutes

### 2. `legacy-section-editor` - **MINIMAL EFFORT** 
- **File**: JSX only, no tests
- **Issues**: Simple component, missing tests
- **Work**: Add tests, convert to TypeScript
- **Effort**: 2-3 hours

### 3. `measurement-block-editor` - **LOW EFFORT**
- **File**: JSX only, no tests  
- **Issues**: Simple form editor, missing validation
- **Work**: Add tests, convert to TypeScript, add ValidationRulesList
- **Effort**: 3-4 hours

### 4. `radio-group-editor` - **LOW EFFORT**
- **File**: JSX only, no tests
- **Issues**: Simple component, standard patterns needed  
- **Work**: Add tests, convert to TypeScript, standardize property handlers
- **Effort**: 3-4 hours

### 5. `toggle-block-editor` - **LOW EFFORT**
- **File**: JSX only, no tests
- **Issues**: Missing validation, simple structure
- **Work**: Add tests, convert to TypeScript, add ValidationRulesList  
- **Effort**: 3-4 hours

---

## 🟡 **PHASE 2: Medium Effort (4-8 hours each)**

### 6. `address-lookup-block-editor` - **MEDIUM EFFORT**
- **File**: JSX only, no tests
- **Issues**: Custom property handlers, missing validation
- **Work**: Convert to TypeScript, add tests, standardize handlers, add validation
- **Effort**: 5-6 hours

### 7. `attachments-widget-editor` - **MEDIUM EFFORT**
- **File**: JSX only, no tests
- **Issues**: Standard patterns, missing ActionListSection usage
- **Work**: Convert to TypeScript, add tests, implement standard action handling
- **Effort**: 5-6 hours

### 8. `checkbox-block-editor` - **MEDIUM EFFORT**  
- **File**: JSX + test file, but simple structure
- **Issues**: Missing validation, custom handlers  
- **Work**: Convert to TypeScript, add ValidationRulesList, standardize patterns
- **Effort**: 4-5 hours

### 9. `button-menu-editor` - **MEDIUM EFFORT**
- **File**: JSX + TypeScript mixed, no tests
- **Issues**: Complex quickedit functionality, mixed patterns
- **Work**: Full TypeScript conversion, add comprehensive tests
- **Effort**: 6-7 hours

### 10. `text-panel-editor` - **MEDIUM EFFORT** 
- **File**: JSX only, no tests
- **Issues**: Rich text editor complexity, missing standard components
- **Work**: Convert to TypeScript, add tests, standardize structure  
- **Effort**: 6-8 hours

### 11. `image-block-editor` - **MEDIUM EFFORT**
- **File**: TypeScript but no tests  
- **Issues**: File upload complexity, missing test coverage
- **Work**: Add comprehensive tests, validate patterns
- **Effort**: 6-8 hours

---

## 🔴 **PHASE 3: High Effort (8-16 hours each)**

### 12. `recurrence-editor` - **HIGH EFFORT**
- **File**: JSX only, no tests
- **Issues**: Complex recurrence patterns, custom logic throughout
- **Work**: Major refactoring, TypeScript conversion, comprehensive testing
- **Effort**: 12-15 hours

### 13. `related-records-editor` - **HIGH EFFORT**  
- **File**: JSX only, no tests
- **Issues**: Complex relationship management, custom implementations  
- **Work**: TypeScript conversion, test suite, standardize patterns
- **Effort**: 12-16 hours

### 14. `calendar-editor` - **HIGH EFFORT**
- **File**: Mixed JSX/TypeScript, no tests
- **Issues**: Complex calendar logic, missing standard patterns
- **Work**: Full TypeScript conversion, comprehensive test suite  
- **Effort**: 10-14 hours

### 15. `gallery-block-editor` - **HIGH EFFORT**
- **File**: JSX only, no tests
- **Issues**: Complex sorting/filtering, custom view management
- **Work**: TypeScript conversion, test coverage, refactor view logic
- **Effort**: 10-14 hours

---

## 🔥 **PHASE 4: Major Refactoring (16+ hours each)**

### 16. `field-block-editor` - **MAJOR REFACTORING** ⚠️
- **File**: JSX only, **BROKEN TESTS** 
- **Issues**: 
  - Custom styles file (fieldBlockEditor.styles.jsx)
  - Tab-based instead of accordion structure  
  - Uses DebouncedInput instead of EditorInput
  - Complex data model integration
- **Work**: Complete architectural overhaul
- **Effort**: 20-25 hours

### 17. `dropdown-block-editor` - **MAJOR REFACTORING** ⚠️  
- **File**: JSX only, **BROKEN TESTS**
- **Issues**:
  - 997 lines - needs decomposition
  - Complex criteria builder integration
  - Mixed validation patterns
  - Custom sorting/filtering logic
- **Work**: Split into multiple components, full modernization
- **Effort**: 25-30 hours

### 18. `chart-block-editor` - **MAJOR REFACTORING** ⚠️
- **File**: JSX only, no tests
- **Issues**:
  - Multiple tab structure (DataTab, DisplayTab, InteractionsTab)
  - Complex chart configuration
  - Custom action handling for row clicks
  - Series editor complexity  
- **Work**: Multi-component refactoring, TypeScript, full test suite
- **Effort**: 30-35 hours

### 19. `grid-block-editor` - **MAJOR REFACTORING** ⚠️
- **File**: JSX only, broken tests  
- **Issues**:
  - Multi-tab navigation (Grid → View → Column)
  - Complex state management
  - Custom column/view editors
  - Advanced sorting and filtering
- **Work**: Architectural redesign, TypeScript conversion, test infrastructure
- **Effort**: 35-40 hours

---

## 📋 **Completed/Good State**

### ✅ **Already in Good Shape** 
- `button-editor` - JSX with tests, standard patterns
- `input-editor` - TypeScript with tests  
- `screen-editor` - TypeScript with tests
- `date-time-picker-editor` - TypeScript with tests
- `signature-block-editor` - TypeScript, good patterns
- `tag-widget-editor` - TypeScript, modern implementation

---

## 🎯 **Recommended Sprint Planning**

### Sprint 1 (Week 1): Quick Wins
- Items 1-5: Remove map-block-editor, refactor 4 simple editors
- **Goal**: 5 editors modernized, build momentum

### Sprint 2 (Week 2-3): Medium Effort  
- Items 6-11: 6 medium-complexity editors
- **Goal**: Establish consistent patterns, create templates

### Sprint 3 (Week 4-5): High Effort
- Items 12-15: 4 complex editors requiring significant work
- **Goal**: Tackle complex business logic, maintain functionality

### Sprint 4 (Week 6-8): Major Refactoring
- Items 16-19: The "big four" problematic editors  
- **Goal**: Architectural improvements, eliminate technical debt

---

## ⚠️ **Priority Alerts**

### **Immediate Attention Required:**
1. **`field-block-editor`** - Broken tests, custom styles, architectural issues
2. **`dropdown-block-editor`** - 997 lines, broken tests, needs decomposition  

### **High Business Risk:**
- `grid-block-editor` - Core functionality, complex state management
- `chart-block-editor` - Data visualization, complex configuration

### **Low-Hanging Fruit:**
- `map-block-editor` - 30 minutes to remove entirely
- `legacy-section-editor` - Simple component, easy TypeScript conversion

---

## 📊 **Success Metrics**

**Phase 1 Completion**:
- 5 editors modernized  
- TypeScript coverage: +19%
- Test coverage: +20%

**Full Project Completion**:
- 15 editors converted to TypeScript
- 12 editors with new test coverage  
- 2 broken test files fixed
- Technical debt reduced by ~60%
- Consistent patterns across all editors

**Estimated Total Effort**: 200-300 developer hours (6-8 weeks for 2 developers)