import React, { useEffect } from 'react';
import { colors } from '@m-next/tokens';

const STYLES_ID = 'm-next-link-styles';
const STYLES_CSS = `
.m-next-link:focus-visible {
  outline: 2px solid ${colors.blue.base};
  outline-offset: 2px;
}
.m-next-link-primary {
  color: ${colors.blue.base};
  text-decoration: underline;
}
.m-next-link-primary:visited {
  color: ${colors.blue.base};
}
.m-next-link-primary:hover {
  color: ${colors.blue.dark};
}
.m-next-link-subtle {
  color: inherit;
  text-decoration: none;
}
.m-next-link-subtle:hover {
  color: ${colors.blue.base};
  text-decoration: underline;
}
.m-next-link-button {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  color: ${colors.grey.dark};
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid transparent;
  background: transparent;
}
.m-next-link-button:hover {
  background: ${colors.grey.lighter};
  border-color: ${colors.grey.light};
}
`;

const ensureStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLES_ID)) return;
  const style = document.createElement('style');
  style.id = STYLES_ID;
  style.textContent = STYLES_CSS;
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

const Link = ({
  href,
  variant = 'primary',
  external = false,
  children,
  className,
  target,
  rel,
  ...rest
}) => {
  useEffect(ensureStyles, []);

  const variantClass =
    variant === 'subtle'
      ? 'm-next-link-subtle'
      : variant === 'button'
        ? 'm-next-link-button'
        : 'm-next-link-primary';

  const composedClassName = ['m-next-link', variantClass, className].filter(Boolean).join(' ');

  const finalTarget = external ? target || '_blank' : target;
  const finalRel = external ? rel || 'noopener noreferrer' : rel;

  return (
    <a
      href={href}
      className={composedClassName}
      target={finalTarget}
      rel={finalRel}
      {...rest}
    >
      {children}
      {external && (
        <>
          <span aria-hidden="true" style={{ fontSize: '0.8em', marginLeft: 2 }}>
            ↗
          </span>
          <span style={visuallyHidden}>(opens in new tab)</span>
        </>
      )}
    </a>
  );
};

export default Link;
