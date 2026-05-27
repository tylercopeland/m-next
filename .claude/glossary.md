# Method Platform Glossary

## Widget Type Codes

Backend controls use 3-letter codes. Map to M-One packages:

| Code | Widget Name | M-One Package | Notes |
|------|-------------|---------------|-------|
| ADR | Address Lookup | @m-next/address-lookup | |
| APR | App Ribbon | - | Related records tabs |
| BTN | Button | @m-next/button | |
| BGR | Button Group | @m-next/button-group | |
| BGI | Button Group Item | @m-next/button-group | Child of BGR |
| CAL | Calendar | @m-next/calendar | |
| CARD | Card | @m-next/card | |
| CRD | Card Column | @m-next/card | Legacy |
| CHT | Chart | @m-next/chart | |
| CHK | Checkbox | @m-next/checkbox | |
| COL | Grid Column | @m-next/grid | Child of GRD |
| DOC | Documents Widget | @m-next/attachments | |
| DRP | Dropdown | @m-next/dropdown | |
| DTP | DateTime Picker | @m-next/datepicker | |
| EDT | DataTable | @m-next/grid | Editable grid |
| F-BLOCK | Field Block | @m-next/field-block | |
| FIL | File Attachment | @m-next/attachments | |
| FLT | Filter | @m-next/chips-filter | |
| GAL | Gallery | @m-next/gallery | |
| GRD | Grid | @m-next/grid | Read-only grid |
| HLP | Help Note | @m-next/caption | |
| HTM | HTML Editor | @m-next/html-editor | |
| ICO | Icon | @m-next/svg-icon | |
| LBL | Label | @m-next/caption | |
| MAP | Map | @m-next/map | |
| PAY | Payment Widget | - | Custom |
| PIC | Picture | @m-next/image | |
| PNV | Portal Navigation | - | Portal only |
| RAD | Radio Box | @m-next/radio-button | |
| REC | Recurrence | - | Custom |
| ROW | Grid Row | @m-next/grid | Child of GRD |
| SEC | Section | @m-next/container | |
| SIG | Signature | @m-next/signature | |
| SYW | Sync Widget | @m-next/sync-widget | |
| TAG | Tag List | @m-next/tag-widget | |
| TEM | Team Widget | - | Custom |
| TGL | Toggle | @m-next/toggle | |
| TMP | Template Builder | - | Custom |
| TXT | Textbox | @m-next/input | |
| TXA | Textarea | @m-next/input-area | |
| WAL | Wallet | - | Custom |

## Layout Codes (Designer Internal)

| Code | Purpose |
|------|---------|
| L-SEC | Layout Section |
| L-ROW | Layout Row |
| L-COL | Layout Column |
| L-CON | Layout Container |
| SCR | Screen Runtime |
| SCL | Screen Load |
| SCD | Screen Design |

## Domain Terms

| Term | Meaning |
|------|---------|
| Control | Backend widget definition (has type code) |
| Widget | Frontend M-One component |
| Customizer | App designer (not end user) |
| Bound Control | Control connected to a data field |
| Ribbon | Related records tab (one-to-many) |
| V4 Styles | Current design system (variant + color) |

## Environments

| Domain | Environment |
|--------|-------------|
| methodlocal.com | Local development |
| methoddev.com | Development/staging |
| method.com | Production |
