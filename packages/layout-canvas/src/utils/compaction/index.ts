import { compact as _compact, type CompactionItemIn, type CompactionItem, type DynamicData } from './compact';
import { reverseMapToBase as _reverseMapToBase } from './reverseMapping';
import { simpleGrow as _simpleGrow } from './simpleGrow';
import type { ResponsiveComponent } from '../../rgl-integration/types';

export function compact(base: CompactionItemIn[], dynamic: DynamicData[]): CompactionItem[] {
  try {
    return _compact(base, dynamic);
  } catch (e) {
    console.warn('[layout-canvas] compact() failed, returning base layout.', e);
    return base.map(({ hidden: _h, ...item }) => item);
  }
}

export function reverseMap(
  newPresented: ResponsiveComponent[],
  oldPresented: ResponsiveComponent[],
  base: CompactionItemIn[],
): CompactionItemIn[] {
  try {
    return _reverseMapToBase(newPresented, oldPresented, base);
  } catch (e) {
    console.warn('[layout-canvas] reverseMap() failed, returning base.', e);
    return base;
  }
}

export function simpleGrow(base: CompactionItemIn[], dynamic: DynamicData[]): CompactionItem[] {
  try {
    return _simpleGrow(base, dynamic);
  } catch (e) {
    console.warn('[layout-canvas] simpleGrow() failed, returning base layout.', e);
    return base.map(({ hidden: _h, ...item }) => item);
  }
}
