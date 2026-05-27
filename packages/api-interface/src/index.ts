/**
 * @method-ai/api-interface
 *
 * API interface types for communication between chat assistants and UI packages.
 * This package defines the clean contract for how chat APIs and UIs communicate,
 * using structured messages with human/assistant roles and typed content blocks.
 *
 * @version 1.0.0
 */

// Re-export everything from modules
export * from './artifact';
export * from './artifacts/index';
export * from './content';
export * from './message';

// Re-export API and utilities
export * from './api';
export * from './utils';

// Re-export validation schemas and functions
export * from './validation';

export * from './agent-types';
// Package metadata
export const PACKAGE_VERSION = '1.0.0';
export const PACKAGE_NAME = '@method-ai/api-interface';
