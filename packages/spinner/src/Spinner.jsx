import React, { useEffect } from 'react';
import { colors } from '@m-next/tokens';

const SIZE_PX = { sm: 16, md: 24, lg: 32 };
const KEYFRAMES_ID = 'm-next-spinner-keyframes';
const KEYFRAMES_CSS = `
@keyframes m-next-spinner-rotate { to { transform: rotate(360deg); } }
`;

const ensureKeyframes = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = KEYFRAMES_CSS;
  document.head.appendChild(style);
};

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const Spinner = ({
  size = 'md',
  color = colors.blue.base,
  thickness = 2.5,
  label = 'Loading',
  style,
  ...rest
}) => {
  useEffect(ensureKeyframes, []);
  const px = typeof size === 'number' ? size : SIZE_PX[size] ?? SIZE_PX.md;

  return (
    <span
      role="status"
      aria-live="polite"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        width={px}
        height={px}
        aria-hidden="true"
        focusable="false"
        style={{ animation: 'm-next-spinner-rotate 0.8s linear infinite' }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="44"
          strokeDashoffset="14"
          opacity="0.9"
        />
      </svg>
      <span style={visuallyHidden}>{label}</span>
    </span>
  );
};

export default Spinner;
