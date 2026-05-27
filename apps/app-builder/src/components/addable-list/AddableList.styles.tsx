import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Wrapper = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column' as const,
  border: `1px solid ${colors['grey-light']}`,
  borderRadius: 4,
}));

export const Line = styled.div(() => ({
  alignItems: 'center',
  display: 'flex',
  flex: 1,
}));

export const Cell = styled.div(() => ({
  padding: 8,
  borderRight: `1px solid ${colors['grey-lighter']}`,
  alignItems: 'center',
  alignContent: 'center',
  flexBasis: '50%',
}));

interface LabelCellProps {
  fullWidth?: boolean;
}

export const LabelCell = styled.div<LabelCellProps>(({ fullWidth }) => ({
  padding: '0px 16px',
  borderRight: `1px solid ${colors['grey-lighter']}`,
  alignItems: 'center',
  height: 40,
  alignContent: 'center',
  flexBasis: fullWidth ? '100%' : '50%',
  minWidth: 108,
}));

export const Divider = styled.div(() => ({
  borderBottom: `1px solid ${colors['grey-light']}`,
}));
