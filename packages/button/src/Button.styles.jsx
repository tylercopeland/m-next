import styled from '@emotion/styled';

const COLORS = {
  blue: '#0D71C8',
  blueDark: '#0a5a9c',
  blueDarker: '#084680',
  greyBorder: '#d1d5db',
  greyHover: '#f3f4f6',
  greyText: '#374151',
};

const SIZE_STYLES = {
  sm: { height: 24, padding: '0 12px', fontSize: 13, borderRadius: 12 },
  md: { height: 32, padding: '0 16px', fontSize: 14, borderRadius: 17 },
  lg: { height: 40, padding: '0 20px', fontSize: 15, borderRadius: 20 },
};

const VARIANT_STYLES = {
  primary: {
    background: COLORS.blue,
    color: '#fff',
    border: `1px solid ${COLORS.blue}`,
    ':hover:not(:disabled)': { background: COLORS.blueDark, borderColor: COLORS.blueDark },
    ':active:not(:disabled)': { background: COLORS.blueDarker, borderColor: COLORS.blueDarker },
  },
  secondary: {
    background: '#fff',
    color: COLORS.blue,
    border: `1px solid ${COLORS.greyBorder}`,
    ':hover:not(:disabled)': { background: COLORS.greyHover, borderColor: COLORS.blue },
    ':active:not(:disabled)': { background: COLORS.greyBorder },
  },
  ghost: {
    background: 'transparent',
    color: COLORS.greyText,
    border: '1px solid transparent',
    ':hover:not(:disabled)': { background: COLORS.greyHover, color: '#111827' },
    ':active:not(:disabled)': { background: COLORS.greyBorder },
  },
  link: {
    background: 'transparent',
    color: COLORS.blue,
    border: 'none',
    padding: 0,
    height: 'auto',
    minHeight: 0,
    borderRadius: 0,
    textDecoration: 'underline',
    ':hover:not(:disabled)': { color: COLORS.blueDark },
    ':active:not(:disabled)': { color: COLORS.blueDarker },
  },
};

export const ButtonStyled = styled.button(({ variant = 'primary', size = 'md', fullWidth }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  width: fullWidth ? '100%' : 'auto',
  fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 120ms ease, border-color 120ms ease, color 120ms ease',
  ...SIZE_STYLES[size],
  ...VARIANT_STYLES[variant],
  ':focus-visible': {
    outline: `2px solid ${COLORS.blue}`,
    outlineOffset: 2,
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

export default ButtonStyled;
