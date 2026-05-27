import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Wrapper = styled.div(({ padding = null, gap = 24, gutter = null }) => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap,
    flexGrow: 1,
    minHeight: 400,
    padding,
    position: 'relative',
    paddingBottom: gutter,
  },
]);

export const ContentWrapper = styled.div((props) => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flexGrow: 1,
    padding: props.padding,
    position: 'relative',
  },
]);

export const WrapperInteractions = styled.div((props) => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    flexGrow: 1,
    minHeight: 400,
    padding: props.padding,
  },
]);

export const LineWrapper = styled.div(({ align, gap = 16 }) => [
  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: align || 'center',
    gap,
  },
]);

export const Divider = styled.div((props) => [
  {
    borderBottom: `1px solid ${colors['grey-light']}`,
    marginBottom: 16,
    margin: props.margin,
  },
]);

export const StateWrapper = styled.div((props) => [
  {
    border: `2px solid ${props.selected ? colors.blue : colors['grey-light']}`,
    backgroundColor: props.selected ? '#EFF8FF' : null,
    display: 'flex',
    padding: 8,
    gap: 16,
    width: '100%',
    cursor: 'pointer',
  },
]);

export const SettingDivider = styled.div(() => [
  {
    borderBottom: `1px solid ${colors['grey-lighter']}`,
  },
]);

export const HeaderIconWrapper = styled.div(({ align, gap = 8 }) => [
  {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: align || 'center',
    gap,
  },
]);

export const HeaderWrapper = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '0px 8px',
  },
]);

export const SampleOutput = styled.div(() => ({
  backgroundColor: colors['blue-light'],
  padding: 8,
  borderRadius: 4,
}));

export const CopilotQuerySectionExplanationContainer = styled.div(() => ({
  padding: '8px 16px',
  borderRadius: 2,
  backgroundColor: colors['grey-lighter'],
}));

export const CopilotQuerySectionExplanationList = styled.ol(() => ({
  paddingLeft: 13,
}));

export const EmptyContent = styled.div(() => ({
  padding: 8,
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'column',
  gap: 8,
}));
