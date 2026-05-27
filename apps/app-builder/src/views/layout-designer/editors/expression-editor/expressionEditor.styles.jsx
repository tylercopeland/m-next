import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

export const Wrapper = styled.div((props) => [
  {
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
    border: `1px solid ${lightTheme.content.border} `,
    height: props.isOpen ? 'auto' : 48,
    color: lightTheme.content.primary,
    borderRadius: 2,
    ':focus-visible': {
      outline: 'none',
      boxShadow: '#0d71c8 0px 0px 0px 2.5px',
    },
  },
]);

export const Header = styled.div(() => [
  {
    display: 'flex',
    padding: '8px 8px 8px 0px',
    gap: 8,
    cursor: 'pointer',
    color: lightTheme.content.primary,
    fontSize: '14px',
    lineHeight: '16px',
  },
]);

export const TextContent = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    cursor: 'pointer',
    color: lightTheme.content.primary,
    fontSize: '14px',
    lineHeight: '16px',
    alignItems: 'center',
  },
]);

export const Content = styled.div((props) => [
  {
    display: props.isOpen ? 'flex' : 'none',
    visibility: props.isOpen ? 'visible' : 'collapse',
    maxHeight: props.isOpen ? 400 : 0,
    //   overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    flexDirection: 'column',
    gap: 8,
    color: lightTheme.content.primary,
  },
]);

export const FieldWrapper = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
  },
]);

export const DeleteWraper = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'flex-end',
  },
]);

export const Divider = styled.div(() => [
  {
    borderBottom: `1px solid ${lightTheme.content.border}`,
    marginBottom: 16,
  },
]);

export const Footer = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
  },
]);

export const Spacer = styled.div(() => [
  {
    paddingBottom: 8,
  },
]);
