/**
 * Shared Wrapper Utilities
 *
 * Common utility functions and components used across all wrappers.
 *
 * @module wrappers/shared/utils
 */

import React from 'react';
import type { LoadingPlaceholderStyle } from './types';

/**
 * Loading placeholder component
 * Displayed when control doesn't exist in Redux
 *
 * @param props - Component props
 * @param props.id - Component ID
 * @param props.message - Optional custom message
 */
export const LoadingPlaceholder: React.FC<{
  id?: string;
  message?: string;
}> = ({ id, message = 'Loading control...' }) => {
  const style: LoadingPlaceholderStyle = {
    padding: '8px 16px',
    border: '1px dashed #ccc',
    backgroundColor: '#f5f5f5',
    color: '#666',
    fontSize: '12px',
    textAlign: 'center',
  };

  return (
    <div style={style}>
      {message}
      {id && <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.6 }}>ID: {id}</div>}
    </div>
  );
};

/**
 * Error boundary fallback component
 * Displayed when wrapper throws an error
 */
export const ErrorFallback: React.FC<{
  id?: string;
  error?: Error;
}> = ({ id, error }) => {
  return (
    <div
      style={{
        padding: '8px 16px',
        border: '1px solid #ff4444',
        backgroundColor: '#fff0f0',
        color: '#cc0000',
        fontSize: '12px',
        borderRadius: '4px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>⚠️ Component Error</div>
      {id && <div style={{ fontSize: '10px', opacity: 0.8 }}>Component ID: {id}</div>}
      {error && <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>{error.message}</div>}
    </div>
  );
};

/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safely access a property from an object
 * Returns undefined if property doesn't exist
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj?.[key];
}

/**
 * Merge multiple style objects
 * Later styles override earlier ones
 */
export function mergeStyles(...styles: Array<React.CSSProperties | undefined>): React.CSSProperties {
  return Object.assign({}, ...styles.filter(isDefined));
}

/**
 * Create a debounced version of a function
 * Useful for onChange handlers that trigger actions
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T;
}

/**
 * Create a throttled version of a function
 * Ensures function is called at most once per interval
 *
 * @param fn - Function to throttle
 * @param interval - Interval in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, interval: number): T {
  let lastCall = 0;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}

/**
 * Type guard to check if a control has a specific property
 */
export function hasProperty<T, K extends string>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return obj !== null && typeof obj === 'object' && prop in obj;
}

/**
 * Convert backend property names to camelCase
 * Some controls use PascalCase (Type, TypeOverride) from backend
 */
export function normalizeControlProperty<T>(control: T, backendProp: string, frontendProp: string): unknown {
  if (hasProperty(control, backendProp)) {
    return control[backendProp];
  }
  if (hasProperty(control, frontendProp)) {
    return control[frontendProp];
  }
  return undefined;
}

/**
 * Get control type, checking both 'type' and 'Type' properties
 * Backend sometimes sends 'Type', new controls have 'type'
 */
export function getControlType(control: unknown): string | undefined {
  if (control === null || typeof control !== 'object') {
    return undefined;
  }

  return (normalizeControlProperty(control, 'Type', 'type') as string) || undefined;
}

/**
 * Get control typeOverride, checking both cases
 */
export function getControlTypeOverride(control: unknown): string | undefined {
  if (control === null || typeof control !== 'object') {
    return undefined;
  }

  return (normalizeControlProperty(control, 'TypeOverride', 'typeOverride') as string) || undefined;
}
