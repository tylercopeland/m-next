/**
 * TypeScript declarations for complex-value-utils.js
 */

/**
 * Extracts value from a control based on its properties
 * @param controlId - ID of the control
 * @param controlList - List of all controls
 * @returns Extracted value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function getValueFromControl(controlId: string, controlList: Record<string, any>): string;

/**
 * Extracts value from a session key
 * @param sessionKey - Session key
 * @returns Extracted value
 */
export declare function getValueFromSession(sessionKey: string): string;

/**
 * Extracts value from a complex value object
 * @param complexValue - Complex value object
 * @param controlList - List of all controls
 * @returns Extracted value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function getValueFromComplexValue(complexValue: any, controlList: Record<string, any>): string;
