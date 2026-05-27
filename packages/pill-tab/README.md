# PillTab

A pill shaped tab that supports both buttons and links.

## Features

- Support for both buttons and links (with `<a>` tags)
- TypeScript generics for type-safe values


## Installation

```bash
npm install @m-next/pill-tab
```

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import PillTab from '@m-next/pill-tab';

function App() {
  const [selectedTab, setSelectedTab] = useState('plan');
  
  return (
    <PillTab
      options={[
        { value: 'plan', label: 'Plan' },
        { value: 'build', label: 'Build' }
      ]}
      value={selectedTab}
      onChange={setSelectedTab}
    />
  );
}