# `Pill`

### Example

```js
import { Pill } from 'm-one/pill';

<Pill
  size='regular' // default
  variant='subtle' // default
  colorScheme='blue' // default
  isMobile={false} // default
  maxWidth='100%' // default
  leadIcon={{ name: 'dot', label: 'status' }}
  // id
  // className
  // forwardRef
  // style
  // children // optional, unless building a custom version.
  // ...otherProps  - any other props
/>;
```

<br>
<br>

### Props

Basic props:

- **id** : `string` | required
- **className** : `string` | optional
- **forwardRef** : `React.RefObject<any>` | optional
- **style** : `React.CSSProperties` | optional
  <br>

**children**

- `String` | Required
- Text that appears inside the pill
  <br>

**size**

- `"regular"`, `"narrow"` | defaults to "regular"
- "_narrow_" is usually 16px height with no padding. "_regular_" is 16px height with 4px padding around in Desktop.
  <br>

**colorScheme**

- `"blue"` , `"green"` , `"fuchsia"` , `"grey"` , `"yellow"` , `"red"` , `"purple"` , `"orange"` , `"teal"` | defaults to `"blue"`
- Background color of the pill
  <br>

**variant**

- `"subtle"`, `"solid"` | defaults to "subtle".
- "_subtle_" is _lighter_ color palette and "_subtle_" is the _light_ palette.
  <br>

**maxWidth**

- `"String"` | Optional, defaults to "100%"
- If the text gets too long, change the _maxWidth_ value to a fixed size.
  <br>

**avatar**

- `{src: String; label: String;}` | Optional, defaults to `null`
- "_avatar_" will appear at the front if provided. It must be an object of shape "_src_" (avatar image file path), and "_label_" which is the caption for AODA.
  <br>

**leadIcon**

- `{name: String; label: String;}` | Optional, defaults to `null`
- "_leadIcon_" is the icon that optionally appears at the front. It must be an object of shape "_name_" (icon name), and "_label_" which is the caption for AODA.
- set icon name to "_dot_" to get the status badge design.
  <br>

**trailIcon**

- `{name: String; onClick: function; label: String;}` | Optional, defaults to `null`
- "_trailIcon_" is the icon that optionally appears at the end. It must be an object of shape "_name_" (icon name), "_onClick_" (icon click callback), and "_label_" which is the caption for AODA.
  <br>

**cssOverrides** : - `string` | Optional, defaults to `''` - Add any additional styling or override existing styling by passing a css string here. - The syntax should be based on _styled-components_ css styles.
<br/>

**...otherProps** - any other props
