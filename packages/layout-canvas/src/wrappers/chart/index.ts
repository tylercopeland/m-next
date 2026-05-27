/**
 * Chart wrapper module exports
 *
 * This module provides a refactored chart wrapper following SOLID principles:
 * - Single Responsibility: Each hook handles one concern
 * - Open/Closed: Extensible through hooks and interfaces
 * - Liskov Substitution: Runtime and designer modes are interchangeable
 * - Interface Segregation: Focused interfaces for each concern
 * - Dependency Inversion: Depends on abstractions (hooks) not concretions
 */

// Types
export * from './types';

// Hooks
export { useChartControl } from './hooks/useChartControl';
export { useChartValidation } from './hooks/useChartValidation';
export { useChartSize } from './hooks/useChartSize';
export { useChartConfiguration } from './hooks/useChartConfiguration';
export { useChartData } from './hooks/useChartData';
export { useChartDrilldown } from './hooks/useChartDrilldown';
export { useChartEventHandlers } from './hooks/useChartEventHandlers';

// Utils
export { chartTypes, v3Colors, monthNumbers } from './utils/constants';
export { mapV3ColorsToV4 } from './utils/colorUtils';
export { buildDateFilter, buildSelectedPointFilter } from './utils/filterUtils';
