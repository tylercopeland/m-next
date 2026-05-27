# App Activation Overlay

A full-screen modal overlay component for app activation and onboarding flows. Features a centered banner card with icon, title, description, bullet points, and call-to-action buttons.

## Usage

```tsx
import AppActivationOverlay from '@m-next/app-activation-overlay';

function MyComponent() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <AppActivationOverlay
      iconName="opportunity-icon"
      title="Turn opportunities into closed deals"
      description="Opportunities helps you track potential revenue, understand deal progress, and focus your efforts where they'll have the biggest impact."
      sectionTitle="Why use Opportunities?"
      bulletPoints={[
        { id: '1', text: 'Track deals through every stage of your sales pipeline' },
        { id: '2', text: 'Forecast revenue with close dates and deal values' },
        { id: '3', text: 'Prioritize the right opportunities with clear deal details' },
        { id: '4', text: 'Assign owners and track activity across your team' },
      ]}
      primaryCTA={{
        id: 'create-opportunity',
        text: 'Create your first opportunity',
        onClick: () => console.log('Primary action'),
      }}
      secondaryCTA={{
        id: 'learn-more',
        text: 'Learn more',
        onClick: () => console.log('Secondary action'),
      }}
      onClose={() => setIsVisible(false)}
      dismissible={true}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `'app-activation-overlay'` | Unique identifier for the overlay |
| `iconName` | `SvgIconName` | `undefined` | Optional icon to display at the top |
| `title` | `string` | **required** | Main heading text |
| `description` | `string` | **required** | Description text below the title |
| `sectionTitle` | `string` | `undefined` | Optional section heading for bullet points |
| `bulletPoints` | `AppActivationOverlayBulletPoint[]` | `[]` | Array of bullet point items |
| `primaryCTA` | `AppActivationOverlayCTA` | `undefined` | Primary call-to-action button |
| `secondaryCTA` | `AppActivationOverlayCTA` | `undefined` | Secondary call-to-action button |
| `showPrimaryCTA` | `boolean` | `true` | Controls visibility of primary CTA |
| `showSecondaryCTA` | `boolean` | `true` | Controls visibility of secondary CTA |
| `dismissible` | `boolean` | `true` | Shows/hides the close button |
| `onClose` | `() => void` | `undefined` | Callback function when overlay is closed |
| `image` | `React.ReactNode` | `undefined` | Optional mockup/illustration element for the right side |

## Types

```typescript
interface AppActivationOverlayCTA {
  id: string;
  text: string;
  onClick: () => void;
}

interface AppActivationOverlayBulletPoint {
  id: string;
  text: string;
}
```

## Features

- Full-screen backdrop overlay with semi-transparent background
- Centered white card with shadow and rounded corners
- Optional icon at the top
- Title and description text
- Optional section title for bullet points
- Bullet points with green checkmark indicators
- Primary and secondary CTA buttons
- Close button (can be hidden)
- Optional mockup/illustration area on the right
- Responsive design
- Keyboard accessible (close button has proper aria-label)

## Design

Based on Figma design: [Growth 2026 Projects - Banner](https://www.figma.com/design/sQcN725aGMAha5BuRFqZJh/Growth-2026-Projects?node-id=71-4037&m=dev)
