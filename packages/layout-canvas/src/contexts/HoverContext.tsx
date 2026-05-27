/**
 * HoverStore — event-based hover state that avoids Redux re-renders on every mouse-over.
 *
 * Problem: setting hoveredComponentId in Redux causes every CanvasItem to re-render on
 * every mouse move. With 50+ components on screen this is a significant performance hit.
 *
 * Solution: an in-memory store with targeted subscriptions. Only the previously-hovered
 * and newly-hovered component re-render — all others are unaffected.
 */

import React, { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';

type HoverListener = (isHovered: boolean) => void;

export class HoverStore {
  private current: string | null = null;
  private readonly listeners = new Map<string, Set<HoverListener>>();
  private clearTimeoutId: ReturnType<typeof setTimeout> | null = null;

  isHovered(id: string): boolean {
    return this.current === id;
  }

  setHovered(id: string | null): void {
    this._cancelClear();
    this._notify(id);
  }

  scheduleUnhover(delayMs = 50): void {
    this._cancelClear();
    this.clearTimeoutId = setTimeout(() => this._notify(null), delayMs);
  }

  subscribe(id: string, listener: HoverListener): () => void {
    if (!this.listeners.has(id)) this.listeners.set(id, new Set());
    this.listeners.get(id)!.add(listener);
    return () => this.listeners.get(id)?.delete(listener);
  }

  private _cancelClear() {
    if (this.clearTimeoutId !== null) {
      clearTimeout(this.clearTimeoutId);
      this.clearTimeoutId = null;
    }
  }

  private _notify(id: string | null) {
    const prev = this.current;
    if (prev === id) return;
    this.current = id;
    if (prev) this.listeners.get(prev)?.forEach((l) => l(false));
    if (id) this.listeners.get(id)?.forEach((l) => l(true));
  }
}

const HoverContext = createContext<HoverStore | null>(null);

export function HoverContext_Provider({ children }: { children: React.ReactNode }) {
  // Stable store instance — created once per provider mount
  const storeRef = useRef<HoverStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = new HoverStore();
  }
  return <HoverContext.Provider value={storeRef.current}>{children}</HoverContext.Provider>;
}

export function useHoverStore(): HoverStore {
  const store = useContext(HoverContext);
  if (!store) throw new Error('useHoverStore must be used inside HoverContext_Provider');
  return store;
}

/**
 * Returns whether the given component is currently hovered.
 * Subscribes to the HoverStore — only re-renders when this component's hover state changes.
 */
export function useIsHovered(componentId: string): boolean {
  const store = useHoverStore();
  const [isHovered, setIsHovered] = useState(() => store.isHovered(componentId));
  useLayoutEffect(() => store.subscribe(componentId, setIsHovered), [store, componentId]);
  return isHovered;
}
