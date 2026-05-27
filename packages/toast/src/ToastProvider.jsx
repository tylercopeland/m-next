import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { zIndex } from '@m-next/tokens';
import Toast from './Toast';

export const ToastContext = createContext(null);

const KEYFRAMES_ID = 'm-next-toast-keyframes';
const KEYFRAMES_CSS = `
@keyframes m-next-toast-slide-in-right {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes m-next-toast-slide-in-left {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes m-next-toast-slide-in-top {
  from { opacity: 0; transform: translateY(-24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes m-next-toast-slide-in-bottom {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes m-next-toast-slide-out-right {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(24px); }
}
@keyframes m-next-toast-slide-out-left {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-24px); }
}
@keyframes m-next-toast-slide-out-top {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-24px); }
}
@keyframes m-next-toast-slide-out-bottom {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(24px); }
}
`;

const ensureKeyframes = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = KEYFRAMES_CSS;
  document.head.appendChild(style);
};

let toastIdCounter = 0;
const nextToastId = () => {
  toastIdCounter += 1;
  return `m-next-toast-${toastIdCounter}`;
};

const VALID_POSITIONS = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
];

// Translates a position string into an absolute-positioning offset rule and
// a flex column-direction so newer toasts appear closer to the closest edge.
const stackStyleForPosition = (position) => {
  const base = {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 16,
    pointerEvents: 'none',
    zIndex: (zIndex && zIndex.toast) || 1500,
    maxWidth: '100vw',
    boxSizing: 'border-box',
  };

  switch (position) {
    case 'top-left':
      return { ...base, top: 0, left: 0, alignItems: 'flex-start' };
    case 'top-center':
      return {
        ...base,
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
      };
    case 'bottom-right':
      return { ...base, bottom: 0, right: 0, alignItems: 'flex-end', flexDirection: 'column-reverse' };
    case 'bottom-left':
      return { ...base, bottom: 0, left: 0, alignItems: 'flex-start', flexDirection: 'column-reverse' };
    case 'bottom-center':
      return {
        ...base,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
        flexDirection: 'column-reverse',
      };
    case 'top-right':
    default:
      return { ...base, top: 0, right: 0, alignItems: 'flex-end' };
  }
};

const ToastProvider = ({
  position = 'top-right',
  defaultDuration = 5000,
  maxToasts = 5,
  children,
}) => {
  useEffect(ensureKeyframes, []);

  const safePosition = VALID_POSITIONS.includes(position) ? position : 'top-right';

  // Two stacks split by ARIA politeness so a single `aria-live` value can sit
  // statically on each container — cleanest pattern per WAI-ARIA Authoring
  // Practices for live region announcers.
  const [politeToasts, setPoliteToasts] = useState([]);
  const [assertiveToasts, setAssertiveToasts] = useState([]);

  // Track mount state to suppress DOM operations after unmount.
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  // Live mirrors of both stacks. We mutate these refs *synchronously* inside
  // `pushToast` so rapid-fire calls within a single tick see each other's
  // updates — otherwise the maxToasts cap would only catch the first overflow
  // per render flush.
  const politeRef = useRef([]);
  const assertiveRef = useRef([]);

  const removeToast = useCallback((id) => {
    if (!mountedRef.current) return;
    politeRef.current = politeRef.current.filter((t) => t.id !== id);
    assertiveRef.current = assertiveRef.current.filter((t) => t.id !== id);
    setPoliteToasts(politeRef.current);
    setAssertiveToasts(assertiveRef.current);
  }, []);

  // Push a new toast, enforcing maxToasts across BOTH stacks combined.
  const pushToast = useCallback(
    (status, message, options) => {
      const id = nextToastId();
      const duration =
        options && Object.prototype.hasOwnProperty.call(options, 'duration')
          ? options.duration
          : defaultDuration;
      const toast = {
        id,
        status,
        message,
        title: options ? options.title : undefined,
        action: options ? options.action : undefined,
        duration,
      };

      const isAssertive = status === 'error';

      // Enforce the combined cap by dropping the single oldest entry across
      // both stacks. Toast ids are monotonically increasing, so we can sort
      // by their numeric suffix to find the oldest.
      const idx = (t) => parseInt(t.id.replace('m-next-toast-', ''), 10) || 0;
      const combined = [...politeRef.current, ...assertiveRef.current];
      if (combined.length + 1 > maxToasts) {
        const oldest = combined.reduce(
          (min, t) => (idx(t) < idx(min) ? t : min),
          combined[0]
        );
        if (oldest) {
          if (politeRef.current.some((t) => t.id === oldest.id)) {
            politeRef.current = politeRef.current.filter((t) => t.id !== oldest.id);
            setPoliteToasts(politeRef.current);
          } else {
            assertiveRef.current = assertiveRef.current.filter((t) => t.id !== oldest.id);
            setAssertiveToasts(assertiveRef.current);
          }
        }
      }

      if (isAssertive) {
        assertiveRef.current = [...assertiveRef.current, toast];
        setAssertiveToasts(assertiveRef.current);
      } else {
        politeRef.current = [...politeRef.current, toast];
        setPoliteToasts(politeRef.current);
      }
      return id;
    },
    [defaultDuration, maxToasts]
  );

  const info = useCallback((message, options) => pushToast('info', message, options), [pushToast]);
  const success = useCallback((message, options) => pushToast('success', message, options), [pushToast]);
  const warning = useCallback((message, options) => pushToast('warning', message, options), [pushToast]);
  const error = useCallback((message, options) => pushToast('error', message, options), [pushToast]);

  const dismiss = useCallback((id) => {
    removeToast(id);
  }, [removeToast]);

  const dismissAll = useCallback(() => {
    if (!mountedRef.current) return;
    politeRef.current = [];
    assertiveRef.current = [];
    setPoliteToasts([]);
    setAssertiveToasts([]);
  }, []);

  const contextValue = useMemo(
    () => ({ info, success, warning, error, dismiss, dismissAll }),
    [info, success, warning, error, dismiss, dismissAll]
  );

  const stackStyle = stackStyleForPosition(safePosition);

  const renderToasts = (list) =>
    list.map((t) => (
      <Toast
        key={t.id}
        id={t.id}
        status={t.status}
        title={t.title}
        message={t.message}
        action={t.action}
        duration={t.duration}
        position={safePosition}
        onDismiss={removeToast}
      />
    ));

  const portal =
    typeof document !== 'undefined'
      ? ReactDOM.createPortal(
          <>
            <div
              data-m-next-toast-stack="polite"
              aria-live="polite"
              aria-atomic="false"
              style={stackStyle}
            >
              {renderToasts(politeToasts)}
            </div>
            <div
              data-m-next-toast-stack="assertive"
              aria-live="assertive"
              aria-atomic="false"
              role="region"
              style={stackStyle}
            >
              {renderToasts(assertiveToasts)}
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
