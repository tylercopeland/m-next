import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

interface WrapperProps {
  padding?: string | number | null;
  gap?: number;
  gutter?: number | string | null;
}

interface LineWrapperProps {
  align?: string;
  gap?: number;
}

interface StateWrapperProps {
  selected?: boolean;
  margin?: string;
}

interface HeaderIconWrapperProps {
  align?: string;
  gap?: number;
}

export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 24 }) => gap}px;
  flex-grow: 1;
  min-height: 400px;
  padding: ${({ padding }) => padding}px;
  position: relative;
  padding-bottom: ${({ gutter }) => gutter};
`;

export const ContentWrapper = styled.div<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
  padding: ${({ padding }) => padding}px;
  position: relative;
`;

export const WrapperInteractions = styled.div<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  min-height: 400px;
  padding: ${({ padding }) => padding}px;
`;

export const LineWrapper = styled.div<LineWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: ${({ align = 'center' }) => align};
  gap: ${({ gap = 16 }) => gap}px;
`;

export const Divider = styled.div<{ margin?: string }>`
  border-bottom: 1px solid ${colors['grey-light']};
  margin-bottom: 16px;
  margin: ${({ margin }) => margin};
`;

export const StateWrapper = styled.div<StateWrapperProps>`
  border: 2px solid ${({ selected }) => (selected ? colors.blue : colors['grey-light'])};
  background-color: ${({ selected }) => (selected ? '#EFF8FF' : 'transparent')};
  display: flex;
  padding: 8px;
  gap: 16px;
  width: 100%;
  cursor: pointer;
`;

export const SettingDivider = styled.div`
  border-bottom: 1px solid ${colors['grey-lighter']};
`;

export const HeaderIconWrapper = styled.div<HeaderIconWrapperProps>`
  display: flex;
  justify-content: flex-start;
  align-items: ${({ align = 'center' }) => align};
  gap: ${({ gap = 8 }) => gap}px;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0px 8px;
`;

export const SampleOutput = styled.div`
  background-color: ${colors['blue-light']};
  padding: 8px;
  border-radius: 4px;
`;

export const EmptyContent = styled.div`
  padding: 8px;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 8px;
`;

export const CopilotQuerySectionExplanationContainer = styled.div(() => ({
  padding: '8px 16px',
  borderRadius: 2,
  backgroundColor: colors['grey-lighter'],
}));

export const CopilotQuerySectionExplanationList = styled.ol(() => ({
  paddingLeft: 13,
}));
