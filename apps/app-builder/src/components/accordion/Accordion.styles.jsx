import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

export const Wrapper = styled.div((props) => {
  const { isSelected, isValid, isOpen, borderless } = props;
  let border = `1px solid ${lightTheme.content.border}`;
  let padding = isSelected ? 7 : 8;
  if (!isValid) border = `1px solid ${lightTheme.negative.secondary}`;
  if (isSelected) border = `1px solid ${colors.blue}`;
  if (borderless) {
    border = 'none';
    padding = 0;
  }

  return [
    {
      display: 'flex',
      flexDirection: 'column',
      padding,
      border,
      overflow: isOpen ? null : 'hidden',
      boxShadow: isSelected ? '0px 0px 0px 2px rgba(13, 113, 200, 0.2)' : null,
      height: isOpen || borderless ? 'auto' : 48,
      color: lightTheme.content.primary,
      transition: 'max-height 300ms ease-in-out, opacity 300ms ease-in-out',

      borderRadius: 2,
      ':focus-visible': {
        outline: 'none',
        boxShadow: '#0d71c8 0px 0px 0px 2.5px',
      },
    },
  ];
});

export const Header = styled.div(({ height }) => [
  {
    display: 'flex',
    gap: 8,
    cursor: 'pointer',
    color: lightTheme.content.primary,
    fontSize: '14px',
    lineHeight: '16px',
    alignItems: 'center',
    fontWeight: 600,
    height,
  },
]);

export const Content = styled.div((props) => [
  {
    display: 'flex', // Always flex to allow animation
    visibility: props.isOpen ? 'visible' : 'hidden',
    maxHeight: props.isOpen ? '10000px' : '0', // Use specific height instead of null
    opacity: props.isOpen ? 1 : 0,
    transition: 'max-height 300ms ease-in-out, opacity 300ms ease-in-out',
    flexDirection: 'column',
    gap: 16,
    color: lightTheme.content.primary,
    overflow: props.isOpen ? null : 'hidden',
  },
]);

export const Spacer = styled.div(() => [
  {
    paddingBottom: 0,
  },
]);

export const CaptionWrapper = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
]);

export const EmptyContent = styled.div(() => ({
  padding: 16,
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 4,
  border: `1px solid ${colors['grey-lighter']}`,
  background: colors.white,
}));
