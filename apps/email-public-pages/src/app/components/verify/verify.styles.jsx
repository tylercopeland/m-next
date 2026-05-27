import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const InnerContentWrapper = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: '#F6FAFB',
    minHeight: '100vh',
    alignItems: 'center',
  },
]);

export const Button = css`
  width: min(380px, 80vw);
  // background-color: #0d71c8;
  border-radius: 70px !important;
  padding: 12px 24px;
  font-family: 'Source Sans Pro';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  border: none;
  line-height: 24px; /* 150% */
`;

export const H1 = styled.h1(() => [
  {
    fontSize: 28,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '36px',
  },
]);

export const H4 = styled.h4`
  flex: 1 0 0;
  color: var(--Grey-Grey-Darker, #0f1b31);
  font-feature-settings:
    'liga' off,
    'clig' off;

  /* Heading / H4 */
  font-family: 'Source Sans Pro';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 133.333% */
`;

export const VerifyMainDiv = styled.div(() => [
  {
    display: 'flex',
    paddingTop: '15.36vh',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 24,
    flex: 1,
    width: 'min(444px, 90vw)',
    paddingBottom: '10vh',
  },
]);

export const VerifyWrapperDiv = styled.div(() => [
  {
    display: 'flex',
    padding: '32px',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 32,
    background: '#FFF',
    borderRadius: 4,
    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.10)',
  },
]);

export const VerifyCTA = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const VerifyContentDiv = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'min(381px, 80vw)',
    gap: 16,
  },
]);

export const StatusWrapper = styled.div`
  display: flex;
  padding: 16px 24px 16px 16px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 2px;
  background: ${(props) => (props.isSuccess ? `var(--Green-Green-Lighter, #E7F5F0);` : `var(--Red-Red-Lighter, #fff3f0);`)}
  
  /* Elevation/Main container */
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

export const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
`;

export const StatusText = styled.p`
  align-self: stretch;
  color: ${(props) => (props.isSuccess ? `var(--Red-Red-Darker, #540009);` : `var(--Green-Green-Darker, #053023);`)}
  font-feature-settings:
    'liga' off,
    'clig' off;

  /* UI Mobile / Base */
  font-family: 'Source Sans Pro';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;

export const VerifyText = styled.p(() => [
  {
    textAlign: 'center',
    lineHeight: '24px',
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    fontStyle: 'normal',
    fontWeight: 400,
  },
]);

export const Footer = styled.div(() => [
  {
    height: 56,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 'none',
    paddingLeft: 10,
    paddingRight: 10,
  },
]);

export const FooterContent = styled.div(() => [
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 32,
  },
]);

export const CopyrightText = styled.p(() => [
  {
    textAlign: 'center',
    lineHeight: '16px',
    fontSize: 14,
    fontFamily: 'Source Sans Pro',
    fontStyle: 'normal',
    fontWeight: 400,
  },
]);
