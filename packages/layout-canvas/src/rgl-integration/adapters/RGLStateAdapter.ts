import { ResponsiveComponent, RGLLayoutItem, RGLResponsiveLayouts, RGLStateAdapter, BreakpointConfig } from '../types';
import { CurrentState } from '@m-next/types';

/**
 * Default breakpoint configuration
 */
const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

/**
 * State adapter for converting between ResponsiveComponent and RGL format
 */
export class RGLStateAdapterImpl implements RGLStateAdapter {
  constructor(breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS) {
    this.breakpoints = breakpoints;
  }

  breakpoints: BreakpointConfig;

  /**
   * Convert ResponsiveComponent to RGL layout item
   */
  componentToLayoutItem = (component: ResponsiveComponent): RGLLayoutItem => {
    // 🔧 DIMENSION CONSTRAINTS: Use restrictions from component if available
    const restrictions = component.displayRestrictions;

    // Apply restrictions with fallback to defaults
    const minW = restrictions?.minWidth ?? 1;
    const maxW = restrictions?.maxWidth ?? 12;

    // 🆕 HIDDEN COMPONENT FIX: Allow height=0 for collapsed hidden components
    // If component has height=0, it's a collapsed hidden component in designer mode
    // Don't enforce minimum height constraint in this case
    const minH = component.height === 0 ? 0 : (restrictions?.minHeight ?? 2);
    const maxH = restrictions?.maxHeight; // undefined = no limit

    return {
      i: component.id,
      // Ensure numeric values (control data may have strings)
      x: Number(component.x) || 0,
      y: Number(component.y) || 0,
      w: Number(component.width) || 2,
      h: Number(component.height) || 0, // Allow h=0 for hidden components
      componentType: component.type,
      content: component.content,
      containerId: component.containerId,
      container: component.container,
      static: component.static,
      isDraggable: true,
      isResizable: minW !== maxW || minH !== maxH, // Only resizable if there is a range of allowed sizes
      minW,
      minH,
      maxW,
      maxH,
    };
  };

  /**
   * Convert RGL layout item to ResponsiveComponent
   */
  layoutItemToComponent = (item: RGLLayoutItem): ResponsiveComponent => {
    return {
      id: item.i,
      type: item.componentType,
      x: item.x,
      y: item.y,
      width: item.w,
      height: item.h,
      currentState: CurrentState.REGULAR,
      content: item.content,
      containerId: item.containerId,
      container: item.container,
      // Default responsive behavior
      flowBehavior: 'wrap',
      responsive: {
        desktop: {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          id: item.i,
          type: item.componentType,
          content: item.content,
          currentState: CurrentState.REGULAR,
          containerId: item.containerId,
          static: item.static ?? false,
        },
      },
      static: item.static || false,
    };
  };

  /**
   * Convert component array to RGL layouts for all breakpoints
   * Updated to use named breakpoint properties (desktop, tabletOverride, mobileOverride)
   */
  componentsToLayouts = (components: ResponsiveComponent[]): RGLResponsiveLayouts => {
    const layouts: RGLResponsiveLayouts = {
      mobile: [],
      tablet: [],
      desktop: [],
    };

    // Generate layouts for each breakpoint using named properties
    layouts.desktop = components.map((component) => {
      const responsiveOverrides = component.responsive?.desktop || {};
      const breakpointComponent: ResponsiveComponent = {
        ...component,
        ...responsiveOverrides,
      };
      return this.componentToLayoutItem(breakpointComponent);
    });

    layouts.tablet = components.map((component) => {
      const responsiveOverrides = component.responsive?.tabletOverride || component.responsive?.desktop || {};
      const breakpointComponent: ResponsiveComponent = {
        ...component,
        ...responsiveOverrides,
      };
      return this.componentToLayoutItem(breakpointComponent);
    });

    layouts.mobile = components.map((component) => {
      const responsiveOverrides = component.responsive?.mobileOverride || component.responsive?.desktop || {};
      const breakpointComponent: ResponsiveComponent = {
        ...component,
        ...responsiveOverrides,
      };
      return this.componentToLayoutItem(breakpointComponent);
    });

    return layouts;
  };

  /**
   * Convert RGL layouts to component array
   */
  layoutsToComponents = (
    layouts: RGLResponsiveLayouts,
    currentBreakpoint: string = 'desktop',
  ): ResponsiveComponent[] => {
    // Use current breakpoint layout as base
    const currentLayout = layouts[currentBreakpoint as keyof RGLResponsiveLayouts] || layouts.desktop;

    // Convert layout items to components (ensure they are RGLLayoutItems)
    const components = currentLayout.map((item) => this.layoutItemToComponent(item as RGLLayoutItem));

    // Add responsive overrides from other breakpoints
    // Add responsive overrides from other breakpoints using named properties
    components.forEach((component) => {
      const desktopItem = layouts.desktop.find((item) => item.i === component.id);
      const tabletItem = layouts.tablet.find((item) => item.i === component.id);
      const mobileItem = layouts.mobile.find((item) => item.i === component.id);

      if (desktopItem || tabletItem || mobileItem) {
        component.responsive = {
          desktop: desktopItem
            ? {
                id: component.id,
                type: component.type,
                x: desktopItem.x,
                y: desktopItem.y,
                width: desktopItem.w,
                height: desktopItem.h,
                content: component.content,
                currentState: component.currentState,
                containerId: component.containerId,
                static: component.static,
              }
            : component,
        };

        // Add tabletOverride if different from desktop
        if (
          tabletItem &&
          desktopItem &&
          (tabletItem.x !== desktopItem.x ||
            tabletItem.y !== desktopItem.y ||
            tabletItem.w !== desktopItem.w ||
            tabletItem.h !== desktopItem.h)
        ) {
          component.responsive.tabletOverride = {
            id: component.id,
            type: component.type,
            x: tabletItem.x,
            y: tabletItem.y,
            width: tabletItem.w,
            height: tabletItem.h,
            content: component.content,
            currentState: component.currentState,
            containerId: component.containerId,
            static: component.static,
          };
        }

        // Add mobileOverride if different from desktop
        if (
          mobileItem &&
          desktopItem &&
          (mobileItem.x !== desktopItem.x ||
            mobileItem.y !== desktopItem.y ||
            mobileItem.w !== desktopItem.w ||
            mobileItem.h !== desktopItem.h)
        ) {
          component.responsive.mobileOverride = {
            id: component.id,
            type: component.type,
            x: mobileItem.x,
            y: mobileItem.y,
            width: mobileItem.w,
            height: mobileItem.h,
            content: component.content,
            currentState: component.currentState,
            containerId: component.containerId,
            static: component.static,
          };
        }
      }
    });

    return components;
  };

  /**
   * Update component positions from RGL layout change
   */
  updateComponentsFromLayout = (
    components: ResponsiveComponent[],
    newLayout: RGLLayoutItem[],
    breakpoint: string = 'desktop',
  ): ResponsiveComponent[] => {
    return components.map((component) => {
      const layoutItem = newLayout.find((item) => item.i === component.id);
      if (layoutItem) {
        const updatedComponent = { ...component };
        // fresh RGL data
        updatedComponent.x = layoutItem.x;
        updatedComponent.y = layoutItem.y;
        updatedComponent.width = layoutItem.w;
        updatedComponent.height = layoutItem.h;

        if (breakpoint === 'desktop') {
          if (!updatedComponent.responsive) {
            updatedComponent.responsive = { desktop: component };
          }
          updatedComponent.responsive.desktop = {
            id: component.id,
            type: component.type,
            x: layoutItem.x,
            y: layoutItem.y,
            width: layoutItem.w,
            height: layoutItem.h,
            content: component.content,
            currentState: component.currentState,
            containerId: component.containerId,
            static: component.static,
          };
        }
        if (breakpoint === 'tablet') {
          if (!updatedComponent.responsive) {
            updatedComponent.responsive = { desktop: component };
          }
          updatedComponent.responsive.tabletOverride = {
            id: component.id,
            type: component.type,
            x: layoutItem.x,
            y: layoutItem.y,
            width: layoutItem.w,
            height: layoutItem.h,
            content: component.content,
            currentState: component.currentState,
            containerId: component.containerId,
            static: component.static,
          };
        }
        if (breakpoint === 'mobile') {
          if (!updatedComponent.responsive) {
            updatedComponent.responsive = { desktop: component };
          }
          updatedComponent.responsive.mobileOverride = {
            id: component.id,
            type: component.type,
            x: layoutItem.x,
            y: layoutItem.y,
            width: layoutItem.w,
            height: layoutItem.h,
            content: component.content,
            currentState: component.currentState,
            containerId: component.containerId,
            static: component.static,
          };
        }

        return updatedComponent;
      }
      return component;
    });
  };

  /**
   * Get effective component properties for a specific breakpoint
   */
  getComponentForBreakpoint = (component: ResponsiveComponent, breakpoint: string): ResponsiveComponent => {
    let responsiveOverrides = {};
    switch (breakpoint) {
      case 'tablet':
        responsiveOverrides = component.responsive?.tabletOverride || component.responsive?.desktop || {};
        break;
      case 'mobile':
        responsiveOverrides = component.responsive?.mobileOverride || component.responsive?.desktop || {};
        break;
      default:
        responsiveOverrides = component.responsive?.desktop || {};
    }

    return {
      ...component,
      ...responsiveOverrides,
    };
  };

  /**
   * Calculate canvas height needed for given components
   */
  calculateCanvasHeight = (components: ResponsiveComponent[], rowHeight: number): number => {
    if (components.length === 0) {
      return 400; // Minimum height for empty canvas
    }

    const maxY = Math.max(...components.map((c) => c.y + c.height));
    return Math.max(400, maxY * rowHeight + 40); // Add some padding
  };

  /**
   * Generate unique component ID
   */
  generateComponentId = (): string => {
    return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Validate RGL layout item
   */
  validateLayoutItem = (item: RGLLayoutItem): boolean => {
    return (
      typeof item.i === 'string' &&
      typeof item.x === 'number' &&
      typeof item.y === 'number' &&
      typeof item.w === 'number' &&
      typeof item.h === 'number' &&
      item.x >= 0 &&
      item.y >= 0 &&
      item.w > 0 &&
      item.h >= 0 && // Allow h=0 for collapsed hidden components
      item.w <= 12
    );
  };

  /**
   * Clean invalid layout items
   */
  cleanLayout = (layout: RGLLayoutItem[]): RGLLayoutItem[] => {
    return layout.filter(this.validateLayoutItem);
  };
}

// Export singleton instance
export const rglStateAdapter = new RGLStateAdapterImpl();
