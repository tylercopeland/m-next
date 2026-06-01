import React, { forwardRef, useEffect, useRef } from 'react';
import { StatusNotifierProps } from '../../types';
import { VisuallyHidden } from '../VisuallyHidden';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set<string>();
  return (key: string, message: string) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

// Extended props — soft-shim layer in addition to StatusNotifierProps.
type ExtendedStatusNotifierProps = StatusNotifierProps & {
  /** Optional — auto-generated when omitted. */
  id?: string;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLDivElement> | null;
  // Silently ignored legacy ghosts
  isV4Design?: boolean;
  legacyClass?: string | null;
  displayAuto?: boolean;
  compactStyle?: boolean;
  hidden?: boolean;
};

/**
 * StatusNotifier — visually-hidden aria-live region that announces transitions
 * between idle/pending/done. Pair with any async surface to expose progress
 * to assistive technology.
 */
export const StatusNotifier = forwardRef<HTMLDivElement, ExtendedStatusNotifierProps>(
  function StatusNotifier(props, ref) {
    const {
      id: idProp,
      ariaLive = 'assertive',
      pending = false,
      messages,

      // Soft-shimmed legacy props
      forwardRef: legacyForwardRef,

      // Silently ignored legacy ghosts
      isV4Design: _isV4Design,
      legacyClass: _legacyClass,
      displayAuto: _displayAuto,
      compactStyle: _compactStyle,
      hidden: _hidden,
    } = props;

    // Auto-generate id if not provided.
    const internalIdRef = useRef<string | null>(null);
    if (internalIdRef.current === null) {
      // eslint-disable-next-line no-plusplus
      internalIdRef.current = `m-next-status-notifier-${++autoIdCounter}`;
    }
    const id = idProp ?? internalIdRef.current;

    if (legacyForwardRef) {
      warnOnce(
        'status-notifier-forwardRef-prop',
        '@m-next/attachments: `forwardRef` prop on StatusNotifier is deprecated. Use the React forwardRef API — pass `ref` directly.',
      );
    }

    // Chain modern ref + legacy forwardRef prop onto the rendered root element.
    const internalElRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const assign = (target: typeof ref | typeof legacyForwardRef) => {
        if (!target) return;
        if (typeof target === 'function') {
          target(internalElRef.current);
        } else {
          // eslint-disable-next-line no-param-reassign
          (target as React.MutableRefObject<HTMLDivElement | null>).current = internalElRef.current;
        }
      };
      assign(ref);
      assign(legacyForwardRef);
    }, [ref, legacyForwardRef]);

    const setRef = (node: HTMLDivElement | null) => {
      internalElRef.current = node;
    };

    const [status, setStatus] = React.useState<'idle' | 'pending' | 'done'>('idle');
    const prevPendingRef = React.useRef(pending);

    React.useEffect(() => {
      if (!prevPendingRef.current && pending) {
        setStatus('pending');
      } else if (prevPendingRef.current && !pending) {
        setStatus('done');
      }

      prevPendingRef.current = pending;
    }, [pending]);

    const message = messages[status] || '';

    return (
      <VisuallyHidden ref={setRef} id={id} aria-live={ariaLive}>
        {message}
      </VisuallyHidden>
    );
  },
);

StatusNotifier.displayName = 'StatusNotifier';
