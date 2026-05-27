import { UnifiedControlRegistryType } from '@m-next/runtime-interface';

// This should compile without errors if the types are properly set up
const _testRegistry: Partial<UnifiedControlRegistryType> = {
  button: {
    editorName: 'test',
    rumRoute: '/test',
    editor: () => null,
    wrapper: () => null,
    widgetConstants: [],
    getHeader: () => null,
    getProps: () => ({}),
    displayRestrictions: {},
    defaultValues: {},
  },
};

// Reference the registry to satisfy TypeScript's unused variable checks
void _testRegistry;
