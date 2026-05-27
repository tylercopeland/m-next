/**
 * Declaration file so the default export is typed as ComponentType<ToggleProps>.
 * Without this, TypeScript infers the default as the whole module when named exports exist.
 */
import type { ComponentType } from 'react';
import type { ToggleProps, ToggleTextOpt, ToggleSize } from './types';

declare const Toggle: ComponentType<ToggleProps>;

export default Toggle;
export type { ToggleProps, ToggleTextOpt, ToggleSize };
export declare function getOnText(textOpt: ToggleTextOpt): string | null;
export declare function getOffText(textOpt: ToggleTextOpt): string | null;
