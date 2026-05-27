import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const MainContainer = styled.div({
  width: '100%',
  display: 'flex',
  padding: '24px 64px 80px 64px',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'stretch',
  background: colors.white,
  borderRadius: '8px',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
  maxWidth: '1200px',
});

export const ContentWrapper = styled.div({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '800px',
});

export const HeaderSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '2rem',
  marginTop: '2rem',
});

export const HeaderTitle = styled.div({
  fontSize: '32px',
  lineHeight: '36px',
  color: colors['grey-darker'],
  fontWeight: 700,
  textAlign: 'center',
});

export const HeaderSubtitle = styled.div({
  color: colors['grey-dark'],
  textAlign: 'center',
  fontSize: '20px',
  lineHeight: '24px',
});

export const MethodAITextWrapper = styled.span({
  display: 'inline-block',
  margin: '0 4px',
  position: 'relative',
});

export const MethodAIText = styled.span({
  background: 'linear-gradient(152deg, #ff6b3d 32.4%, #7b2ff7 79.36%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 600,
});

export const AIIconWrapper = styled.div({
  position: 'absolute',
  top: '-4px',
  right: '-8px',
});

export const PromptWrapper = styled.div({
  marginBottom: 8,
  width: '100%',
});

export const PromptSubtext = styled.div({
  fontSize: '14px',
  lineHeight: '16px',
  color: colors['grey-dark'],
  textAlign: 'center',
  marginTop: '12px',
});

export const HelpSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  alignSelf: 'stretch',
  borderRadius: '16px',
  background: colors['blue-lighter'],
  border: `1px solid ${colors['blue-light']}`,
  marginTop: '80px',
});

export const HelpContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  paddingRight: '16px',
});

export const HelpTitle = styled.h2({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '20px',
  lineHeight: '24px',
  fontWeight: 600,
  color: colors['grey-darker'],
});

export const HelpDescription = styled.p({
  fontSize: '16px',
  lineHeight: '24px',
  color: colors['grey-dark'],
  textAlign: 'left',
});

// Card Styles
export const AppsSection = styled.div`
  background: #f5f2ff;
  display: flex;
  padding: 24px;
  flex-direction: column;
  gap: 16px;
  align-self: stretch;
  border-radius: 16px;
  margin-top: 80px;
`;

export const AppsSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    color: #7b2ff7;
    border: none;
    background: none;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      color: #4d169c;
    }
  }
`;

export const AppsListTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Card = styled.div`
  display: flex;
  gap: 12px;
  background: ${colors.white};
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #dfe9ed;
  cursor: pointer;
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border: 1px solid var(--Grey-Grey-Light, #bacad0);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }
`;

export const CardIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors['grey-lighter']};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardContent = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardContentTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const CardTitle = styled.div`
  color: ${colors['grey-darker']};
  text-overflow: ellipsis;
  font-size: 18px;
  font-weight: 600;
  line-height: 20px;
`;

export const CardSubtitle = styled.div`
  font-family: 'Source Sans Pro';
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: ${colors['grey']};
  margin-top: 8px;
`;
export const InvalidScreenContainer = styled.div`
  display: flex;
  padding: 48px 24px 24px 24px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export const InvalidScreenContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    color: ${colors['grey-darker']};
  }

  p {
    color: ${colors['grey-dark']};
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
`;
