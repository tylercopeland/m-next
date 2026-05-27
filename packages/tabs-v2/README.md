# `@m-next/tabs-v2`

TabsV2 component with improved styling and enhanced functionality based on the original @m-next/tabs package.

## Package Setup

This package provides a modern tabs component with the following features:
- Drag and drop tab reordering
- Responsive overflow handling with "More" menu
- Mobile and desktop rendering modes
- Full-width tabs option
- Accessibility features (ARIA labels, keyboard navigation)
- TypeScript support

## Code Configuration

The package is configured to use the index.js file located in the src folder. All components are exported via the index.js file:

- `TabsV2` - Main tabs component
- `TabHeaderV2` - Tab header with advanced features

## Usage

```jsx
import { TabsV2 } from '@m-next/tabs-v2';

const MyTabs = () => {
  const [selectedTab, setSelectedTab] = useState('tab1');
  
  const tabList = [
    { id: 'tab1', caption: 'First Tab' },
    { id: 'tab2', caption: 'Second Tab' },
  ];

  return (
    <TabsV2
      id="my-tabs"
      tabList={tabList}
      selectedTab={selectedTab}
      onChange={(tabId) => setSelectedTab(tabId)}
      onRenderTabContent={() => <div>Tab Content</div>}
    />
  );
};
```
