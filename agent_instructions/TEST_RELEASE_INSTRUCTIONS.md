# Test Instructions and Release Notes Generator

## Purpose
This document provides instructions for AI assistants to generate comprehensive test instructions and release notes by comparing the current branch against the master branch, with special emphasis on identifying affected areas and downstream component impacts.

## Process Overview

### 1. Verify Latest Changes
Before generating test instructions:
- Ensure the current branch has the latest changes from master
- Run `git fetch origin master` to get latest master updates
- Check merge status with `git log --oneline master..HEAD` to see commits ahead of master
- Review `git diff master...HEAD --stat` for file change summary

### 2. Analyze and Summarize Changes

#### Focus Areas
When analyzing changes, focus on **functionality, user impact, and dependency ripple effects** rather than code implementation details:

##### Component Changes (packages/*)
- **Breaking Changes**: Identify any API changes, prop removals, or behavior modifications
- **New Features**: Document new props, methods, or capabilities added
- **Bug Fixes**: Note corrected behaviors that may affect existing usage
- **Visual Changes**: Highlight styling, layout, or UI updates
- **Dependencies**: Note if peer dependencies or internal dependencies changed
- **Downstream Impact**: Identify which components depend on the changed component

##### Application Changes (apps/*)
- **Editor Changes**: Specify which editors were modified (e.g., action-editor, app-builder)
- **Screen Changes**: Identify affected screens and their functional areas
- **Workflow Impact**: Document changes to user workflows or processes
- **Integration Points**: Note changes affecting communication between components
- **Component Usage**: Identify which packages/components are used by the modified applications

##### Infrastructure Changes
- **Build System**: Document changes to webpack, babel, or build scripts
- **Testing**: Note test coverage changes or new test requirements
- **Performance**: Highlight optimizations or potential performance impacts

### 3. Generate Test Instructions and Release Notes

#### Format Template

```markdown
# Release Notes - [Branch Name]
Date: [Current Date]
Comparison: [Branch] vs master

## Summary of Changes
[2-3 sentence high-level summary of the release]

## Component Changes
### Breaking Changes ⚠️
- [ ] [Component]: [Description of breaking change]
- [ ] [Impact]: [What users need to update]

### New Features ✨
- [ ] [Component/Feature]: [Description]
- [ ] [Usage]: [How to use or test]

### Bug Fixes 🐛
- [ ] [Component]: [Issue fixed]
- [ ] [Verification]: [How to verify the fix]

## Application Changes
### [App Name] Updates
- [ ] [Screen/Editor]: [Change description]
- [ ] [Test Steps]: [Specific testing instructions]

## Testing Checklist

### Regression Testing
- [ ] All existing [component] functionality works as before
- [ ] No console errors in development mode
- [ ] No console warnings in production build

### Feature Testing
- [ ] [New Feature 1]: Steps to test
  1. Navigate to [location]
  2. Perform [action]
  3. Verify [expected result]

- [ ] [New Feature 2]: Steps to test
  1. [Step 1]
  2. [Step 2]
  3. [Expected outcome]

### Integration Testing
- [ ] Component integration in app-builder
- [ ] Cross-package dependencies working
- [ ] Build process completes successfully
- [ ] Tests pass with coverage requirements met

### Visual/UI Testing
- [ ] Components render correctly in Storybook
- [ ] No visual regressions in existing screens
- [ ] Responsive behavior maintained
- [ ] Theme consistency preserved

## Affected Areas Matrix

### Primary Changes
| Component/Area | Change Type | Risk Level | Testing Priority | Dependent Components | Impact Scope |
|---------------|-------------|------------|------------------|---------------------|--------------|
| [Component]   | [New/Modified/Fixed] | [Low/Medium/High] | [P1/P2/P3] | [List of @m-next/* components] | [Localized/Moderate/Wide] |

### Downstream Impact Analysis
| Affected Component | Change Reason | Required Testing | Notes |
|-------------------|---------------|------------------|-------|
| [Dependent Component] | Uses changed [Primary Component] | [Specific test areas] | [Special considerations] |

### Risk Assessment Guidelines

**High Risk (P1 Priority):**
- Foundation packages: `@m-next/styles`, `@m-next/utilities`, `@m-next/types`
- Core form components: `@m-next/input`, `@m-next/dropdown`, `@m-next/button`
- Complex components with many dependencies: `@m-next/grid`, `@m-next/chart`
- Breaking API changes to any component
- Changes affecting applications: `app-builder`, `action-editor`

**Medium Risk (P2 Priority):**
- Components with 3-10 dependents
- New features that extend existing APIs
- Visual/styling changes that might affect layout
- Components used in multiple applications

**Low Risk (P3 Priority):**
- Components with 0-2 dependents
- Internal refactoring without API changes
- Documentation or configuration updates
- Bug fixes with limited scope

### Impact Scope Definitions

**Wide Impact:** Changes to foundation packages (styles, utilities, types) affecting 15+ components
**Moderate Impact:** Changes to common UI components affecting 5-15 components  
**Localized Impact:** Changes affecting 1-4 components or isolated functionality

## Dependencies and Requirements
- [ ] Node version: [Required version]
- [ ] New npm packages: [List any new dependencies]
- [ ] Environment variables: [Any new configs needed]

## Deployment Notes
- [ ] Database migrations required: [Yes/No]
- [ ] Feature flags: [List any feature flags]
- [ ] Rollback plan: [Brief rollback strategy]

## Known Issues/Limitations
- [Issue 1]: [Description and workaround if any]
- [Issue 2]: [Description and impact]
```

## Instructions for AI Assistant

When asked to generate test instructions:

1. **Always start by checking branch status and identifying affected areas:**
   ```bash
   git status
   git log --oneline -10 master..HEAD
   git diff master...HEAD --stat
   
   # Identify changed components
   changed_components=$(git diff master...HEAD --name-only | grep "packages/" | cut -d'/' -f2 | sort -u)
   echo "Changed components: $changed_components"
   
   # For each changed component, find dependents
   for component in $changed_components; do
     echo "=== Finding dependents of @m-next/$component ==="
     grep -r "@m-next/$component" packages/*/package.json | grep -v "packages/$component/package.json"
   done
   ```

2. **Analyze changes by category with dependency impact:**
   - Group changes by packages vs apps
   - Identify functional areas affected
   - **Crucial:** Map downstream dependencies using the dependency analysis commands
   - Note any breaking changes prominently
   - Assess impact scope (wide/moderate/localized)

3. **Generate output using the enhanced template:**
   - Fill in the Downstream Impact Analysis table
   - Use the Risk Assessment Guidelines to prioritize testing
   - Include the full Affected Areas Matrix with dependent components listed
   - Remove sections that don't apply
   - Use checkboxes for actionable items

4. **Prioritize based on dependency hierarchy:**
   - P1: Foundation changes (@m-next/styles, utilities, types), breaking changes, core functionality
   - P2: Components with 3+ dependents, new features, visual changes
   - P3: Isolated components, minor fixes, documentation

5. **Be specific about testing with component relationships:**
   - Include exact navigation paths
   - Specify expected behaviors for both changed and dependent components
   - Note integration testing between related components
   - Include Storybook testing for component isolation
   - Test in actual applications that use the components

## Component Change Patterns and Testing Focus

### Foundation Package Changes (@m-next/styles, @m-next/utilities, @m-next/types)
**Impact:** Wide - affects most/all components
**Testing Focus:**
- Visual regression testing across all components in Storybook
- Theme consistency verification
- Build process validation
- Integration testing in all applications

### Core UI Component Changes (@m-next/button, @m-next/input, @m-next/dropdown)
**Impact:** Moderate to Wide - affects many components and applications
**Testing Focus:**
- Direct component functionality testing
- Integration testing with dependent components (especially @m-next/grid)
- Form workflow testing in applications
- Accessibility compliance validation

### Complex Component Changes (@m-next/grid, @m-next/chart)
**Impact:** Moderate - affects applications primarily
**Testing Focus:**
- Full feature testing within applications
- Data handling and performance testing
- User workflow validation
- Integration with external data sources

### Specialized Component Changes (@m-next/datepicker, @m-next/color-picker, etc.)
**Impact:** Localized - limited dependencies
**Testing Focus:**
- Isolated component functionality
- Integration points where used
- Edge case and validation testing

### Application Changes (apps/app-builder, apps/action-editor)
**Impact:** Application-specific but may reveal component issues
**Testing Focus:**
- End-to-end user workflows
- Component integration within application context
- Performance and user experience validation
- Cross-browser compatibility testing

## Example Testing Scenarios

### Scenario 1: @m-next/button component modified
```markdown
**Primary Testing:**
- [ ] Button renders correctly in all variants (primary, secondary, danger, etc.)
- [ ] Click handlers function properly
- [ ] Icon integration works

**Downstream Testing (High Priority - Multiple Dependents):**
- [ ] @m-next/dialog - Modal buttons function correctly
- [ ] @m-next/grid - Action buttons in grid headers and cells work
- [ ] @m-next/dropdown - Dropdown trigger button functions
- [ ] apps/app-builder - Form submission and navigation buttons
- [ ] apps/action-editor - Action builder interface buttons

**Integration Testing:**
- [ ] Button theming consistent across applications
- [ ] No visual regressions in complex layouts
```

### Scenario 2: @m-next/styles foundation change
```markdown
**Primary Testing:**
- [ ] Core theme variables applied correctly
- [ ] CSS-in-JS compilation successful

**Downstream Testing (Wide Impact - Most Components Affected):**
- [ ] All components in Storybook render without errors
- [ ] Theme consistency maintained across component library
- [ ] No visual regressions in applications
- [ ] Responsive design integrity preserved

**Critical Path Testing:**
- [ ] Build process completes successfully
- [ ] No console errors in development mode
- [ ] Production builds optimize correctly
```

## Example Commands for Analysis

### Basic Change Detection
```bash
# Get list of modified components
git diff master...HEAD --name-only | grep "packages/" | cut -d'/' -f2 | sort -u

# Get list of modified apps
git diff master...HEAD --name-only | grep "apps/" | cut -d'/' -f2 | sort -u

# Check for breaking changes in package.json files
git diff master...HEAD -- "**/package.json"

# Review test file changes
git diff master...HEAD -- "**/*.test.jsx" "**/*.test.js"

# Check for new dependencies
git diff master...HEAD package-lock.json | grep "^\+" | grep -E '"[^"]+":' | head -20
```

### Dependency Impact Analysis
```bash
# Find which components depend on a specific changed component (e.g., @m-next/button)
grep -r "@m-next/button" packages/*/package.json | grep -v "packages/button/package.json"

# Find all components that use a changed component in their source code
grep -r "from '@m-next/button'" packages/*/src/ apps/*/src/ | cut -d':' -f1 | sort -u

# Search for imports of changed component across all packages
find packages/ apps/ -name "*.jsx" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "@m-next/CHANGED_COMPONENT"

# Get dependency tree for a specific component (requires jq)
cat packages/COMPONENT/package.json | jq '.dependencies | keys[] | select(startswith("@m-next/"))'

# Find components that are likely affected by foundational changes (@m-next/styles, @m-next/utilities)
if [[ "$(git diff master...HEAD --name-only | grep 'packages/styles\|packages/utilities\|packages/types')" ]]; then
  echo "Foundation change detected - most components will be affected"
  find packages/ -name package.json -exec grep -l "@m-next/styles\|@m-next/utilities\|@m-next/types" {} \; | cut -d'/' -f2
fi

# Check which apps use a specific changed component
find apps/ -name "*.jsx" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "CHANGED_COMPONENT" | cut -d'/' -f2 | sort -u
```

### Comprehensive Impact Assessment
```bash
# Create a comprehensive dependency impact report
echo "=== DEPENDENCY IMPACT ANALYSIS ===" > impact_report.txt
echo "Changed Components:" >> impact_report.txt
git diff master...HEAD --name-only | grep "packages/" | cut -d'/' -f2 | sort -u >> impact_report.txt
echo "" >> impact_report.txt

# For each changed component, find its dependents
for component in $(git diff master...HEAD --name-only | grep "packages/" | cut -d'/' -f2 | sort -u); do
  echo "=== Components depending on @m-next/$component ===" >> impact_report.txt
  grep -r "@m-next/$component" packages/*/package.json | grep -v "packages/$component/package.json" | cut -d':' -f1 | cut -d'/' -f2 >> impact_report.txt
  echo "" >> impact_report.txt
done
```

### Storybook and Test Impact
```bash
# Find Storybook stories that might be affected
find packages/ apps/ -name "*.stories.jsx" -o -name "*.stories.js" | xargs grep -l "CHANGED_COMPONENT"

# Check for test files that import changed components
find packages/ apps/ -name "*.test.jsx" -o -name "*.test.js" | xargs grep -l "@m-next/CHANGED_COMPONENT"

# Find snapshot tests that might need updating
find packages/ apps/ -name "__snapshots__" -type d | xargs find | grep "\.snap$"
```

## Key Principles

1. **User-Focused**: Describe changes in terms of user impact, not code changes
2. **Actionable**: Every item should be testable with clear steps
3. **Comprehensive**: Cover all changed areas but avoid redundancy
4. **Risk-Aware**: Highlight breaking changes and high-risk areas prominently
5. **Traceable**: Link changes to specific components/screens for easy verification

## Output Requirements

- Use markdown format for easy reading and copying
- Include checkboxes for tracking test completion
- Provide specific version numbers and dates
- Group related changes together logically
- Always include a summary section at the top
- End with any known issues or limitations