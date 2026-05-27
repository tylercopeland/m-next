import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const ButtonGroupRowWrapper = styled.div(({ width }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '-1px',
  flex: '1 0 0',
  maxWidth: width,
}));

export const ButtonGroupRowButton = styled.div(({ selected, index, length, disabled = false }) => ({
  display: 'flex',
  height: 32,
  width: 74,
  padding: '8px 4px',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '1 0 0',
  borderRadius: '4px 0px 0px 4px',
  borderTopLeftRadius: index === 0 ? '4px' : '0px',
  borderBottomLeftRadius: index === 0 ? '4px' : '0px',
  borderTopRightRadius: index === length - 1 ? '4px' : '0px',
  borderBottomRightRadius: index === length - 1 ? '4px' : '0px',
  border: '1px solid',
  borderColor: selected ? colors.blue : colors['grey-light'],
  background: selected ? colors['blue-lighter'] : colors.white,
  cursor: disabled ? 'not-allowed' : 'pointer',
  // Remove borderRightWidth override to maintain consistent 1px borders
  // Add z-index to ensure selected button's borders are visible
  zIndex: selected ? 1 : 0,
  position: 'relative', // Required for z-index to work
  marginLeft: index !== 0 ? '-1px' : '0', // Compensate for border overlap
  color: selected ? colors.blue : colors.grey,
  ':hover': disabled
    ? null
    : {
        borderColor: colors.blue,
        color: colors.blue,
      },
  opacity: disabled ? 0.5 : 1,
}));
