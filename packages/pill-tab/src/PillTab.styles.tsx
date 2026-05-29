import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

export type SegmentedSize = 'sm' | 'md';

type SizeSpec = { container: string; tab: string; font: string; minWidth: string };

const SIZE_HEIGHTS: Record<SegmentedSize, SizeSpec> = {
  sm: { container: '28px', tab: '20px', font: '14px', minWidth: '56px' },
  md: { container: '32px', tab: '24px', font: '16px', minWidth: '64px' },
};

const sizeSpec = (s: SegmentedSize | undefined): SizeSpec => SIZE_HEIGHTS[s ?? 'md'];

export const PillTabContainer = styled.div<{ sizeVariant?: SegmentedSize }>(
  ({ sizeVariant }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px',
    background: 'rgba(223, 233, 237, 1)',
    borderRadius: '8px',
    boxShadow: 'inset -1px 1px 6px 0px rgba(0, 0, 0, 0.12)',
    width: 'fit-content',
    height: sizeSpec(sizeVariant).container,
  }),
);

const baseTabStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 8px',
  borderRadius: '4px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none',
};

export const PillTabButton = styled.button<{
  isSelected: boolean;
  disabled?: boolean;
  sizeVariant?: SegmentedSize;
}>(
  baseTabStyles,
  ({ sizeVariant }) => ({
    height: sizeSpec(sizeVariant).tab,
    minWidth: sizeSpec(sizeVariant).minWidth,
    fontSize: sizeSpec(sizeVariant).font,
  }),
  ({ isSelected, disabled }) => ({
    background: isSelected ? colors.white : 'transparent',
    color: disabled ? colors.grey.light : colors.grey.dark,
    boxShadow: isSelected ? '0px 1px 2px rgba(0, 0, 0, 0.1)' : 'none',
    pointerEvents: disabled ? 'none' : 'auto',
    opacity: disabled ? 0.5 : 1,

    '&:hover': (!disabled && !isSelected) && {
      background: colors.grey.light,
    },

    '&:active': (!disabled && !isSelected) && {
      background: colors.white,
    },

    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${colors.blue.lighter}, 0 0 0 3px ${colors.blue.base}`,
    },
  }),
);

export const PillTabLink = styled(PillTabButton.withComponent('a'))({
  textDecoration: 'none',
});
