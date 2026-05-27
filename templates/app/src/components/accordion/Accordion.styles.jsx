import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

export const Wrapper = styled.div((props) => [
  {
    display: 'flex',
    flexDirection: 'column',
    padding: props.isSelected ? 7 : 8,
    border: props.isSelected ? `1px solid ${colors.blue}` : `1px solid ${lightTheme.content.border}`,
    boxShadow: props.isSelected ? '0px 0px 0px 2px rgba(13, 113, 200, 0.2)' : null,
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
    maxHeight: props.isOpen ? null : 0,
    //   overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    flexDirection: 'column',
    gap: 12,
    color: lightTheme.content.primary,
  },
]);

export const Spacer = styled.div(() => [
  {
    paddingBottom: 0,
  },
]);
