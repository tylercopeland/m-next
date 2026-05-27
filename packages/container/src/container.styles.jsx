import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

export const Container = styled.div((props) => {
  const { isVisible, width, theme, onClick, isRound, borderless, padding, height, hoverStyle, maxHeight } = props;
  const { content, background } = theme;
  let shadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';
  if (borderless) {
    shadow = null;
  }
  return [
    {
      display: isVisible ? 'flex' : 'none',
      boxSizing: 'border-box',
      padding: padding || '16px',
      backgroundColor: background ? background.primary : lightTheme.background.primary,
      color: content ? content.color : null,
      borderRadius: isRound ? '4px' : null,
      boxShadow: shadow,
      flexDirection: 'column',
      width,
      height,
      cursor: onClick ? 'pointer' : 'default',
      ':hover': hoverStyle,
      maxHeight,
    },
  ];
});

export default Container;
