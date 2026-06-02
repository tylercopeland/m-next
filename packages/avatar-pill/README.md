# @m-next/avatar-pill

Entity-reference chip. Pairs an avatar circle with a label and optional lead/trail icons. The chip you reach for when the entity is a USER, CUSTOMER, or any other thing that has a visual identity (initials or photo).

## Quick start

```jsx
import AvatarPill from '@m-next/avatar-pill';

// Initials avatar derived from the label
<AvatarPill colorScheme='blue'>Tyler Copeland</AvatarPill>;

// Photo avatar
<AvatarPill avatar={{ src: '/me.jpg', alt: 'Tyler' }}>Tyler Copeland</AvatarPill>;

// Dismissible (default × glyph)
<AvatarPill
  avatar={{ initials: 'TC' }}
  onTrailingIconClick={(e) => removeTag(e)}
  trailingIconLabel='Remove Tyler'
>
  Tyler Copeland
</AvatarPill>;

// Whole chip is clickable
<AvatarPill onClick={openProfile} avatar={{ initials: 'BR' }}>
  Ben Robinson
</AvatarPill>;
```

See `stories/avatarpill.mdx` for the full intent contract.

## API

| Prop                   | Type                                   | Default    | Notes                                                              |
| ---------------------- | -------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `avatar`               | `ReactNode \| {src?, initials?, alt?}` | auto       | Object form is the common case; ReactNode is an escape hatch.       |
| `children` / `label`   | `ReactNode`                            | —          | Displayed text. Initials derived from this when `avatar` is empty. |
| `colorScheme`          | 10-family palette                      | `'blue'`   | `blue green fuchsia grey yellow red purple orange teal`             |
| `variant`              | `'subtle' \| 'solid'`                  | `'subtle'` | `subtle` = lighter bg, `solid` = light bg                           |
| `size`                 | `'sm' \| 'md' \| 'lg'`                 | `'md'`     | Matches MethodUI's narrow/regular + a new mobile/touch tier         |
| `leadingIcon`          | `ReactNode`                            | —          | Rendered before the avatar                                          |
| `trailingIcon`         | `ReactNode \| true`                    | —          | Pass `true` for the default × glyph                                 |
| `onTrailingIconClick`  | `(e) => void`                          | —          | Promotes the trailing icon to a real `<button>`                     |
| `trailingIconLabel`    | `string`                               | `'Remove'` | aria-label for the trailing button                                  |
| `onClick`              | `(e) => void`                          | —          | Whole chip becomes clickable when set                               |
| `maxWidth`             | `string \| number`                     | `'100%'`   | Truncates the label with ellipsis                                   |

## Related primitives

- `@m-next/pill` — text-only chip (no avatar)
- `@m-next/badge` — non-interactive status indicator
- `@m-next/chips-filter` — multi-select filter chip pattern
