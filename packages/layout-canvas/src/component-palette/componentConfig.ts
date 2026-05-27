/* eslint-disable @typescript-eslint/no-explicit-any */
import { SvgIconName } from '@m-next/svg-icon';
import { WIDGETS } from '@m-next/runtime-interface';
import { AccountingTableViewsSupportedForSyncWidget } from '@m-next/sync-widget';

export type WidgetType = (typeof WIDGETS)[keyof typeof WIDGETS];

export interface ComponentConfig {
  /** Unique identifier for the component type */
  type: WidgetType;
  /** Icon name from the SvgIcon library */
  iconName: SvgIconName;
  /** Display name for the component */
  name: string;
  /** Brief description of the component's purpose */
  description: string;
  /** Whether this component is enabled/available */
  enabled: boolean;
  defaultProps?: Record<string, any>;
  /** Minimum size constraints */
  minSize?: {
    width: number;
    height: number;
  };
  /** Whether this component can contain other components */
  canContainChildren?: boolean;
  /** Whether this component has a south (bottom) resize handle in addition to east/west */
  hasSouthResizeHandle?: boolean;
  /** Tags for search and filtering */
  tags?: string[];
  /** Whether only one instance of this component can exist on the screen */
  singleInstance?: boolean;
}

export enum ComponentCategory {
  COMMONLY_USED = 'commonly_used',
  INPUTS = 'inputs',
  BUTTONS = 'buttons',
  SELECTORS = 'selectors',
  DISPLAY = 'display',
  DATA_VIEWS = 'data_views',
  LAYOUT = 'layout',
  SPECIALIZED = 'specialized',
}

export interface CategoryConfig {
  category: ComponentCategory;
  name: string;
  description: string;
  /** List of widget types that belong to this category */
  componentTypes: WidgetType[];
}

export interface ComponentPaletteConfig {
  /** List of component categories and their display order */
  categories: CategoryConfig[];
  /** Map of all available components (single source of truth) */
  components: Partial<Record<WidgetType, ComponentConfig>>;
}

/**
 * Single source of truth for all component definitions
 * Each component defines its appearance, behavior, and metadata for the palette
 */
const COMPONENT_DEFINITIONS: Partial<Record<WidgetType, ComponentConfig>> = {
  // Text Input
  [WIDGETS.TEXTBOX]: {
    type: WIDGETS.TEXTBOX,
    iconName: 'text-input-widget',
    name: 'Text input',
    description: 'Single line text input',
    enabled: true,
    defaultProps: {
      placeholder: '',
      required: false,
    },
    minSize: { width: 120, height: 36 },
    tags: ['input', 'text', 'form', 'textbox'],
  },

  // Dropdown
  [WIDGETS.DROPDOWN]: {
    type: WIDGETS.DROPDOWN,
    iconName: 'dropdown-widget',
    name: 'Dropdown',
    description: 'Select from options',
    enabled: true,
    defaultProps: {
      placeholder: 'Select option...',
      options: [],
    },
    minSize: { width: 150, height: 36 },
    tags: ['select', 'dropdown', 'options', 'form'],
  },

  // Button
  [WIDGETS.BUTTON]: {
    type: WIDGETS.BUTTON,
    iconName: 'button-widget',
    name: 'Button',
    description: 'Action button',
    enabled: true,
    defaultProps: {
      text: 'Button',
      variant: 'primary',
      size: 'medium',
    },
    minSize: { width: 80, height: 36 },
    tags: ['button', 'action', 'click', 'interactive'],
  },

  // Label
  [WIDGETS.LABEL]: {
    type: WIDGETS.LABEL,
    iconName: 'text-v4',
    name: 'Label',
    description: 'Text label',
    enabled: true,
    defaultProps: {
      text: 'Label text',
      fontSize: 14,
      fontWeight: 'normal',
    },
    minSize: { width: 50, height: 36 },
    tags: ['label', 'text', 'content', 'display'],
  },
  // Layout Container (new dedicated container widget)
  [WIDGETS.LAYOUT_CONTAINER]: {
    type: WIDGETS.LAYOUT_CONTAINER,
    iconName: 'container-widget',
    name: 'Container',
    description: 'Layout container',
    enabled: true,
    canContainChildren: true,
    defaultProps: {
      title: 'Container Title',
      collapsible: false,
    },
    minSize: { width: 200, height: 100 },
    tags: ['container', 'layout', 'wrapper'],
  },

  // Date Time Picker
  [WIDGETS.DATETIMEPICKER]: {
    type: WIDGETS.DATETIMEPICKER,
    iconName: 'date-time-picker-widget',
    name: 'Date time picker',
    description: 'Pick date and/or time',
    enabled: true,
    defaultProps: {
      format: 'MM/DD/YYYY HH:mm',
      showTime: true,
    },
    minSize: { width: 180, height: 36 },
    tags: ['date', 'datetime', 'calendar', 'time', 'form'],
  },

  // HTML Editor
  [WIDGETS.HTMLEDITOR]: {
    type: WIDGETS.HTMLEDITOR,
    iconName: 'html-editor-widget',
    name: 'HTML Editor',
    description: 'Rich text editor',
    enabled: true,
    defaultProps: {
      content: '',
      toolbar: 'basic',
    },
    minSize: { width: 400, height: 200 },
    tags: ['html', 'editor', 'rich-text', 'wysiwyg'],
  },

  // Text Area
  [WIDGETS.TEXTAREA]: {
    type: WIDGETS.TEXTAREA,
    iconName: 'text-area-widget',
    name: 'Text area',
    description: 'Multi-line text input',
    enabled: true,
    defaultProps: {
      placeholder: '',
      rows: 3,
    },
    minSize: { width: 200, height: 80 },
    hasSouthResizeHandle: true,
    tags: ['input', 'textarea', 'multiline', 'form'],
  },

  // Button Group
  [WIDGETS.BUTTONGROUP]: {
    type: WIDGETS.BUTTONGROUP,
    iconName: 'button-menu-widget',
    name: 'Button menu',
    description: 'Button with dropdown menu',
    enabled: true,
    defaultProps: {
      buttons: ['Button 1', 'Button 2'],
      orientation: 'horizontal',
    },
    minSize: { width: 160, height: 36 },
    tags: ['button', 'group', 'actions', 'menu'],
  },

  // Checkbox
  [WIDGETS.CHECKBOX]: {
    type: WIDGETS.CHECKBOX,
    iconName: 'checkbox-widget',
    name: 'Checkbox',
    description: 'True or false selection',
    enabled: true,
    defaultProps: {
      checked: false,
      label: 'Checkbox option',
    },
    minSize: { width: 100, height: 24 },
    tags: ['checkbox', 'boolean', 'form'],
  },

  // Radio Box
  [WIDGETS.RADIOBOX]: {
    type: WIDGETS.RADIOBOX,
    iconName: 'radio-button-widget',
    name: 'Radio group',
    description: 'Single choice selection',
    enabled: true,
    defaultProps: {
      options: ['Value 1', 'Value 2'],
      value: '',
    },
    minSize: { width: 120, height: 60 },
    tags: ['radio', 'selection', 'form'],
  },

  // Toggle
  [WIDGETS.TOGGLE]: {
    type: WIDGETS.TOGGLE,
    iconName: 'toggle-widget',
    name: 'Toggle',
    description: 'On/off switch',
    enabled: true,
    defaultProps: {
      checked: false,
      label: 'Toggle option',
    },
    minSize: { width: 80, height: 36 },
    tags: ['toggle', 'switch', 'boolean', 'form'],
  },

  // Picture
  [WIDGETS.PICTURE]: {
    type: WIDGETS.PICTURE,
    iconName: 'landscape-image',
    name: 'Image',
    description: 'Display images',
    enabled: true,
    defaultProps: {
      src: '',
      alt: 'Image',
      fit: 'cover',
    },
    minSize: { width: 100, height: 100 },
    hasSouthResizeHandle: true,
    tags: ['image', 'picture', 'media', 'graphic'],
  },

  // Calendar
  [WIDGETS.CALENDAR]: {
    type: WIDGETS.CALENDAR,
    iconName: 'calendar-rounded-corners-V4',
    name: 'Calendar',
    description: 'View or add events',
    enabled: true,
    defaultProps: {
      view: 'month',
      events: [],
      selectable: true,
    },
    minSize: { width: 400, height: 300 },
    tags: ['calendar', 'dates', 'events', 'schedule'],
  },

  // Chart
  [WIDGETS.CHART]: {
    type: WIDGETS.CHART,
    iconName: 'chart-widget',
    name: 'Chart',
    description: 'Graph of data values',
    enabled: true,
    defaultProps: {
      type: 'bar',
      data: [],
      title: 'Chart Title',
    },
    minSize: { width: 300, height: 200 },
    hasSouthResizeHandle: true,
    tags: ['chart', 'graph', 'data', 'visualization'],
  },

  // Address Lookup
  [WIDGETS.ADDRESSLOOKUP]: {
    type: WIDGETS.ADDRESSLOOKUP,
    iconName: 'address-lookup',
    name: 'Address lookup',
    description: 'Address search and selection',
    enabled: true,
    defaultProps: {
      placeholder: 'Enter address...',
      country: 'US',
    },
    minSize: { width: 200, height: 32 },
    tags: ['address', 'location', 'map', 'form'],
  },

  // Map
  [WIDGETS.MAP]: {
    type: WIDGETS.MAP,
    iconName: 'map-widget',
    name: 'Map',
    description: 'Show location on map',
    enabled: true,
    defaultProps: {
      zoom: 10,
      center: { lat: 0, lng: 0 },
      markers: [],
    },
    minSize: { width: 300, height: 200 },
    hasSouthResizeHandle: true,
    tags: ['map', 'location', 'geography', 'interactive'],
  },

  // Signature
  [WIDGETS.SIGNATURE]: {
    type: WIDGETS.SIGNATURE,
    iconName: 'signature-widget',
    name: 'Signature',
    description: 'Digital signature capture',
    enabled: true,
    defaultProps: {
      width: 300,
      height: 150,
      penColor: '#000000',
    },
    minSize: { width: 250, height: 120 },
    tags: ['signature', 'drawing', 'capture', 'digital'],
    singleInstance: true,
  },

  // Tag List
  [WIDGETS.TAGLIST]: {
    type: WIDGETS.TAGLIST,
    iconName: 'tag-widget',
    name: 'Tag list',
    description: 'Tag selection and display',
    enabled: true,
    defaultProps: {
      tags: [],
      editable: true,
      maxTags: 10,
    },
    minSize: { width: 200, height: 80 },
    tags: ['tags', 'labels', 'list', 'editable'],
    singleInstance: true,
  },

  [WIDGETS.DATATABLE]: {
    type: WIDGETS.DATATABLE,
    iconName: 'grid-widget',
    name: 'Editable grid',
    description: 'View or edit data records',
    enabled: true,
    tags: ['table', 'data', 'editable'],
  },

  [WIDGETS.DOCUMENTSWIDGET]: {
    type: WIDGETS.DOCUMENTSWIDGET,
    iconName: 'documents-widget',
    name: 'Attachments',
    description: 'File upload',
    enabled: true,
    tags: ['documents', 'files'],
    singleInstance: true,
  },

  [WIDGETS.RECURRENCE]: {
    type: WIDGETS.RECURRENCE,
    iconName: 'recurrence-widget',
    name: 'Recurrence',
    description: 'Recurring event settings',
    enabled: true,
    tags: ['recurrence', 'schedule'],
    singleInstance: true,
  },

  [WIDGETS.GALLERY]: {
    type: WIDGETS.GALLERY,
    iconName: 'gallery-widget',
    name: 'Gallery',
    description: 'Image gallery',
    enabled: true,
    tags: ['gallery', 'images'],
  },
  [WIDGETS.DIVIDER]: {
    type: WIDGETS.DIVIDER,
    iconName: 'divider-widget',
    name: 'Divider',
    description: 'Horizontal line',
    enabled: false,
    tags: ['divider', 'line', 'separator'],
  },

  [WIDGETS.SYNCWIDGET]: {
    type: WIDGETS.SYNCWIDGET,
    iconName: 'sync-widget',
    name: 'Sync widget',
    description: 'Account record status',
    enabled: true,
    tags: ['sync', 'data', 'widget'],
    singleInstance: true,
  },

  [WIDGETS.FORMULA]: {
    type: WIDGETS.FORMULA,
    iconName: 'formula-widget',
    name: 'Formula',
    description: 'Calculated field with formula',
    enabled: false,
    tags: ['formula', 'calculation', 'dynamic'],
  },
};

// Main configuration for all available components
export const COMPONENT_CONFIG: ComponentPaletteConfig = {
  categories: [
    {
      category: ComponentCategory.COMMONLY_USED,
      name: 'Commonly used',
      description: 'Most frequently used components',
      componentTypes: [WIDGETS.TEXTBOX, WIDGETS.DROPDOWN, WIDGETS.BUTTON, WIDGETS.DATATABLE, WIDGETS.LAYOUT_CONTAINER],
    },
    {
      category: ComponentCategory.INPUTS,
      name: 'Inputs',
      description: 'Form inputs and data entry components',
      componentTypes: [
        WIDGETS.DATETIMEPICKER,
        WIDGETS.DROPDOWN,
        WIDGETS.HTMLEDITOR,
        WIDGETS.TAGLIST,
        WIDGETS.TEXTAREA,
        WIDGETS.TEXTBOX,
      ],
    },
    {
      category: ComponentCategory.BUTTONS,
      name: 'Buttons',
      description: 'Button and action components',
      componentTypes: [WIDGETS.BUTTON, WIDGETS.BUTTONGROUP],
    },
    {
      category: ComponentCategory.SELECTORS,
      name: 'Selectors',
      description: 'Selection and choice components',
      componentTypes: [WIDGETS.CHECKBOX, WIDGETS.RADIOBOX, WIDGETS.TOGGLE],
    },
    {
      category: ComponentCategory.DISPLAY,
      name: 'Display',
      description: 'Text, images, and content display',
      componentTypes: [WIDGETS.GALLERY, WIDGETS.PICTURE, WIDGETS.MAP, WIDGETS.LABEL],
    },
    {
      category: ComponentCategory.DATA_VIEWS,
      name: 'Data views',
      description: 'Tables, charts, and data visualization',
      componentTypes: [WIDGETS.CALENDAR, WIDGETS.CHART, WIDGETS.DATATABLE],
    },
    {
      category: ComponentCategory.LAYOUT,
      name: 'Layout',
      description: 'Containers and layout components',
      componentTypes: [WIDGETS.LAYOUT_CONTAINER, WIDGETS.SECTION],
    },
    {
      category: ComponentCategory.SPECIALIZED,
      name: 'Specialized',
      description: 'Advanced and specialized components',
      componentTypes: [
        WIDGETS.ADDRESSLOOKUP,
        WIDGETS.DOCUMENTSWIDGET,
        WIDGETS.RECURRENCE,
        WIDGETS.SIGNATURE,
        WIDGETS.SYNCWIDGET,
      ],
    },
  ],
  components: COMPONENT_DEFINITIONS,
};

/**
 * Helper functions for working with the configuration
 */

/**
 * Gets all components that belong to a specific category
 * Filters out disabled components and applies search filtering if provided
 * Special handling for "Commonly Used" category during search (returns empty to avoid duplicates)
 */
export const getComponentsByCategory = (
  category: ComponentCategory,
  filteredComponents: ComponentConfig[],
): ComponentConfig[] => {
  const categoryConfig = COMPONENT_CONFIG.categories.find((cat) => cat.category === category);
  if (!categoryConfig) return [];

  let filtered = categoryConfig.componentTypes
    .map((type) => COMPONENT_CONFIG.components[type])
    .filter((component): component is ComponentConfig => component !== undefined && component.enabled);
  if (filteredComponents && filteredComponents.length > 0) {
    if (category === ComponentCategory.COMMONLY_USED) return [];
    filtered = filtered.filter((component) =>
      filteredComponents.some((filteredComponent) => filteredComponent.type === component.type),
    );
  }
  return filtered;
};

export const getComponentConfig = (type: WidgetType): ComponentConfig | undefined => {
  return COMPONENT_CONFIG.components[type];
};

export const getEnabledComponents = (): ComponentConfig[] => {
  return Object.values(COMPONENT_CONFIG.components).filter((component) => component.enabled);
};

/**
 * Searches components by name, description, or tags
 * Returns all enabled components that match the search query
 */
export const searchComponents = (query: string): ComponentConfig[] => {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(COMPONENT_CONFIG.components).filter(
    (component) =>
      component.enabled &&
      (component.name.toLowerCase().includes(lowercaseQuery) ||
        component.description.toLowerCase().includes(lowercaseQuery) ||
        component.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))),
  );
};

export const getAllCategories = (): CategoryConfig[] => {
  return COMPONENT_CONFIG.categories;
};

export const getCategoryConfig = (category: ComponentCategory): CategoryConfig | undefined => {
  return COMPONENT_CONFIG.categories.find((cat) => cat.category === category);
};

/**
 * Determines if a component type supports south (bottom) resize handle
 * Used by ComponentSelector to show appropriate resize handles
 */
export const hasSouthResizeHandle = (componentType: WidgetType): boolean => {
  const config = getComponentConfig(componentType);
  return config?.hasSouthResizeHandle === true;
};

/**
 * Filters out single-instance components that are already on the screen
 * Also filters out components that require specific base tables (e.g., Recurrence requires Activity table)
 * @param components - Array of component configs to filter
 * @param existingControlTypes - Array of widget types that already exist on the screen
 * @param baseModel - Base table/model name for the screen (optional)
 * @returns Filtered array of components
 */
export const filterAvailableComponents = (
  components: ComponentConfig[],
  existingControlTypes: string[],
  baseModel?: string,
): ComponentConfig[] => {
  return components.filter((component) => {
    // Special case: Recurrence widget requires Activity table
    if (component.type === WIDGETS.RECURRENCE) {
      // Only show Recurrence if baseModel is "Activity" (case-insensitive comparison)
      if (!baseModel || baseModel.toLowerCase() !== 'activity') {
        return false;
      }
    }

    // Special case: Sync widget only applies to supported accounting base tables
    if (component.type === WIDGETS.SYNCWIDGET) {
      if (!baseModel) return false;
      const supported = Object.values(AccountingTableViewsSupportedForSyncWidget ?? {}).some(
        (value) => Array.isArray(value) && value.includes(baseModel),
      );
      if (!supported) return false;
    }

    // If component is not single instance, always include it
    if (!component.singleInstance) {
      return true;
    }
    // If component is single instance, only include if it's not already on screen
    return !existingControlTypes.includes(component.type);
  });
};

/**
 * Gets the icon name for a specific widget type
 * @param type - The widget type
 * @returns The icon name string, or 'screens-V4' as fallback
 */
export const getWidgetIconName = (type: WidgetType): string => {
  const config = getComponentConfig(type);
  return config?.iconName || 'screens-V4';
};

export default COMPONENT_CONFIG;
