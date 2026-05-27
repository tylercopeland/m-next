# Hero Banner Component

A flexible hero banner component for the M-One design system that supports configurable background colors, icons or images, and up to two action buttons.

## Features

- **Flexible Image Slot**: Supports both SVG icons and images
- **Smart Icon Colors**: Automatically maps icon colors based on background theme
- **Configurable Backgrounds**: Blue, orange, and green theme variants
- **Responsive Design**: Adapts to container width
- **Accessibility**: Full keyboard navigation and screen reader support
- **Action Buttons**: Up to two buttons with distinct styling

## Usage

```jsx
import HeroBanner from '@m-next/hero-banner';

// Basic usage
<HeroBanner
  title="Welcome to Method"
  description="Get started with our platform"
  primaryButton="Get Started"
  backgroundColor="blue-lighter"
/>

// With icon
<HeroBanner
  title="Schedule Demo"
  description="Book your personalized demo"
  icon="mi-icon-calendar-V4"
  primaryButton="Book Now"
  backgroundColor="blue-lighter"
/>

// With image
<HeroBanner
  title="Welcome"
  description="Get started today"
  imageSrc="/path/to/image.png"
  primaryButton="Start"
  secondaryButton="Learn More"
  backgroundColor="green-lighter"
/>

// Mobile layout
<HeroBanner
  title="Welcome to Method"
  description="In just a few minutes, you'll learn how Method can help you save time, stay organized, and win more work — all from one place."
  imageSrc="/path/to/mobile-image.png"
  primaryButton="Watch get started video"
  backgroundColor="blue-lighter"
  isMobile={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | `''` | Unique identifier for the component |
| `title` | string | `''` | Main heading text |
| `description` | string | `''` | Supporting description text |
| `icon` | string | `''` | SVG icon name (takes priority over image) |
| `iconContainerStyle` | object | `null` | Custom styles for icon container |
| `imageSrc` | string | `''` | Image source URL |
| `imgStyle` | object | `{}` | Custom styles for image |
| `primaryButton` | string | `null` | Primary button text |
| `onPrimaryButtonClick` | function | `null` | Primary button click handler |
| `secondaryButton` | string | `null` | Secondary button text |
| `onSecondaryButtonClick` | function | `null` | Secondary button click handler |
| `backgroundColor` | enum | `'blue-lighter'` | Theme variant: `'blue-lighter'`, `'orange-lighter'`, `'green-lighter'` |
| `className` | string | `''` | Additional CSS classes |
| `style` | object | `{}` | Custom inline styles |
| `testId` | string | `''` | Test identifier |
| `isMobile` | boolean | `false` | Enables mobile-optimized layout with vertical stacking, centered image (max 286×160px), and full-width content |

## Background Themes

- **Blue Lighter** (#E5F7FF): Default theme with blue icons (#0D71C8)
- **Orange Lighter** (#FFFAF0): Active/warning theme with orange icons (#E05D2A)
- **Green Lighter** (#E7F5F0): Success/payment theme with green icons (#007B4A)

## Icon Color Mapping

Icons automatically receive appropriate colors based on the selected background:
- Blue backgrounds → Blue icons
- Orange backgrounds → Orange icons  
- Green backgrounds → Green icons

## Accessibility

- Proper semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## Testing

```bash
npm run test          # Run unit tests
npm run test-snapshot # Update snapshots
npm run lint          # Run linting
npm run build         # Build for production
```

## Figma Design

This component implements the hero banner design from Figma:
https://www.figma.com/design/RtDzRM5HX6nK9EdPdydDEb/Growth---BigBet-Build?node-id=1207-3019&m=dev