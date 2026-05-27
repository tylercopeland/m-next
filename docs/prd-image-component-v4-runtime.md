# PRD: Image Component V4 Runtime Implementation

> **Status:** Draft
> **Author:** Claude + Development Team
> **Last Updated:** January 2026
> **Reference Spec:** [Image Component Spec](https://method.atlassian.net/wiki/spaces/SD/pages/119996535/Image+Component+Spec)

---

## 1. Overview

### 1.1 Problem Statement
V4 runtime screens do not render image controls. Users cannot view or interact with images on V4 screens, blocking adoption of the next-generation rendering system.

### 1.2 Objective
Enable full image functionality in V4 runtime screens, matching the capabilities of V3 while leveraging the modern component architecture.

### 1.3 Success Criteria
- Images display correctly in all modes (Manual, Mapped, Mapped+Editable)
- Users can upload and delete images when "Allow Editing" is enabled
- Click events fire correctly (except when clicking the upload icon)
- Performance matches or exceeds V3 implementation

---

## 2. User Stories

### 2.1 End User (Runtime)
| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-1 | As a user, I want to view static images configured by the app builder | Image displays from `control.value` for unmapped images |
| US-2 | As a user, I want to view images from my record data | Image loads from the bound Picture field based on active record |
| US-3 | As a user, I want to upload a new image when editing is allowed | Plus icon visible, opens upload dialog, supports gif/jpg/jpeg/png/svg/bmp |
| US-4 | As a user, I want to replace an existing image | Can select new image, old image replaced on SaveAll |
| US-5 | As a user, I want to delete an image | Delete option available, image cleared on SaveAll |
| US-6 | As a user, I want to click an image to trigger an action | Click event fires when clicking image (not upload icon) |
| US-7 | As a user, I want to see a placeholder when no image exists | Landscape or Person placeholder shown based on config |

### 2.2 App Builder (Design Time)
| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-8 | As a customizer, I want to choose between Manual and Mapped modes | Toggle visible, switches between static upload and field binding |
| US-9 | As a customizer, I want to upload a static image (Manual mode) | Upload button visible, image stored with component definition |
| US-10 | As a customizer, I want to bind to a Picture field (Mapped mode) | Table/Field dropdowns visible, binds to selected field |
| US-11 | As a customizer, I want to enable runtime editing (Mapped mode) | "Allow Editing" toggle enables user uploads at runtime |
| US-12 | As a customizer, I want to choose a placeholder type | Landscape/Person options for when no image exists |

---

## 3. Functional Requirements

### 3.1 Display Modes

#### 3.1.1 Manual Mode (`isBound: false`)
| Requirement | Description |
|-------------|-------------|
| Data Source | Static image URL stored in `control.value` |
| Design Time | Image Upload button visible; required field |
| Runtime | Displays static image; no editing capability |
| Persistence | Image stored with component definition |

#### 3.1.2 Mapped Mode (`isBound: true`)
| Requirement | Description |
|-------------|-------------|
| Data Source | Picture-type field from bound table |
| Design Time | Table (disabled), Field dropdown, Placeholder selector |
| Runtime | Loads image from active record's field data |
| Persistence | Image read from and written to bound field |

#### 3.1.3 Mapped + Editable Mode (`isBound: true, isEditable: true`)
| Requirement | Description |
|-------------|-------------|
| Data Source | Same as Mapped |
| Runtime | Plus icon visible; user can upload/replace/delete |
| Save Behavior | Changes persisted on SaveAll action |

### 3.2 Interactions

| Interaction | Runtime | App Builder | Details |
|-------------|---------|-------------|---------|
| Hover | ✅ | ✅ | Shows hover state |
| Plus icon | ✅ | ✅ | Only if `isEditable: true`; opens upload menu |
| Upload image | ✅ | ❌ | Formats: gif, jpg, jpeg, png, svg, bmp |
| Delete image | ✅ | ❌ | Removes current image |
| Click event | ✅ | ❌ | Does NOT fire when clicking plus icon |

### 3.3 States

| State | Appearance | Plus Icon | Click Event |
|-------|------------|-----------|-------------|
| Regular | Normal | Visible (if editable) | Fires |
| Hidden | Not rendered | N/A | N/A |
| Disabled | Grayed out | Hidden | Fires (if configured) |

### 3.4 Special Cases

| Case | Behavior |
|------|----------|
| Contacts table | Automatic letter avatars for mapped fields with no image |
| No compatible fields | Tooltip: "No compatible fields left on the base table" |
| No image uploaded (Manual) | Error state: "Image required" warning |

---

## 4. Technical Requirements

### 4.1 Architecture

```
MethodUI Redux                    layout-canvas Redux
┌─────────────────┐              ┌─────────────────┐
│ controlReducer  │──sync──────▶│ controlsSlice   │
│ dataReducer     │──sync──────▶│ (+ image data)  │
└─────────────────┘              └─────────────────┘
                                         │
                                         ▼
                                 ImageWrapperRedux
                                 (reads from its own Redux)
```

### 4.2 Data Flow

#### Screen Load
```
Backend API → screen.actions.js (normalize) → dataReducer[screenKey][controlId]
                                                        │
                                                        ▼ controlDataSync middleware
                                            controlsSlice[controlId].runtimeImageData
                                                        │
                                                        ▼
                                            ImageWrapperRedux renders image
```

#### Runtime Upload
```
User selects file → POST /api/v1/image → updateControlValue action
                                                │
                                                ▼ controlDataSync middleware
                                    control.runtimeImageData updated → re-render
```

### 4.3 Control Properties

| Property | Type | Mode | Description |
|----------|------|------|-------------|
| `isBound` | boolean | All | `true` = Mapped, `false` = Manual |
| `value` | string | Manual | Static image URL |
| `name` | string | Mapped | Bound field name |
| `isEditable` | boolean | Mapped | Enables runtime upload |
| `unsetImage` | string | Mapped | Placeholder type: `'landscape'` or `'person'` |
| `onClick` | string | All | Click action event ID |
| `visible` | boolean | All | Component visibility |
| `disabled` | boolean | All | Component disabled state |
| `caption` | string | All | Label text |
| `hideCaption` | boolean | All | Hide/show label |

### 4.4 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/image` | POST | Upload image file |
| `/api/v1/image` | DELETE | Delete image |
| `/api/v1/image/web` | POST | Upload from URL |

**Upload Query Parameters:**
- `isImage`: boolean - Always `true` for images
- `isBound`: boolean - Whether image is bound to a field
- `height`: number - Image height
- `width`: number - Image width

### 4.5 Components

| Component | Package | Purpose |
|-----------|---------|---------|
| `ImageWrapperRedux` | `@m-next/layout-canvas` | Runtime/Designer wrapper |
| `Image` | `@m-next/image` | Display-only image component |
| `EditableImage` | `@m-next/image` | Image with upload capability |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Image loading should not block screen rendering
- Upload progress indicator required
- Support images up to 50MB

### 5.2 Compatibility
- Supported formats: gif, jpg, jpeg, png, svg, bmp
- V3 in legacy areas, V4 in next-gen areas
- Web, Mobile App, Mobile Web platforms

### 5.3 Accessibility
- Alt text from caption property
- Keyboard navigation for upload/delete
- Screen reader support for placeholder descriptions

---

## 6. Out of Scope

- Image carousel/scroll through attachments (FR-2473)
- Original size retrieval for uploaded photos (FR-1594)
- Image cropping/editing tools
- Multiple image selection

---

## 7. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `@m-next/image` package | Internal | Available |
| `controlDataSync` middleware | Internal | Needs extension |
| Runtime Core API | Backend | Available |
| `controlsSlice` in layout-canvas | Internal | Available |

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data sync timing issues | Images not displaying | Use Redux middleware for reliable sync |
| Large image uploads | Performance degradation | Existing 50MB limit; progress indicator |
| Breaking designer functionality | Regression | Maintain designer mode code paths |

---

## 9. Testing Requirements

### 9.1 Unit Tests
- `ImageWrapperRedux` runtime mode rendering
- `controlDataSync` image data sync
- Upload/delete handler callbacks

### 9.2 Integration Tests
- Screen load with image controls
- Upload flow end-to-end
- SaveAll persists image changes

### 9.3 Manual Test Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Manual image display | Load V4 screen with unmapped image | Static image displays |
| Mapped image display | Load V4 screen with bound image field | Image from record displays |
| Mapped no data | Load screen with empty image field | Placeholder displays |
| Upload new image | Click plus, select file | Image uploads, displays |
| Replace image | Upload when image exists | New image replaces old |
| Delete image | Click delete | Image removed |
| Click action | Click image with onClick configured | Action executes |
| Click plus icon | Click plus icon | Upload opens, no action fires |
| Disabled state | Image with disabled=true | Grayed out, no plus icon |

---

## 10. Implementation Plan

See [Implementation Plan](../../.claude/plans/golden-painting-rocket.md) for detailed technical steps.

### Summary of Changes
1. Extend `controlDataSync` middleware to sync image data
2. Update `ImageWrapperRedux` for runtime mode
3. Add PICTURE case to `ResponsiveEntry.jsx`
4. Add upload/delete handlers

---

## 11. Appendix

### A. Related Documentation
- [Image Component Spec](https://method.atlassian.net/wiki/spaces/SD/pages/119996535/Image+Component+Spec)
- [Picture Object](https://help.method.me) (Method Help Center)

### B. Known Bugs
- PL-42182: Picture - Unable to load image on clicking save & new button
- PL-34321: Mobile - Different UI for adding photos between User Profile and View contact

### C. Changelog
| Date | Version | Change | Author |
|------|---------|--------|--------|
| Jan 2026 | 1.0 | Initial PRD | Claude + Dev Team |
