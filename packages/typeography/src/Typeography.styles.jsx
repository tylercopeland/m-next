import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

export const Paragraph = styled.p((props) => {
  const { color, bold, gutterBottom, fontSize, theme, onClick, opacity, tooltipHighlighting, isMobile, style, isV4 } =
    props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.primary : lightTheme.content.primary;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;

  let defaultFontSize = defaultFontSizes.medium;
  let defaultLineHeight = null;
  let defaultMinHeight = null;

  if (isV4) {
    if (fontSize == null) {
      defaultLineHeight = isMobile ? '24px' : '20px';
      defaultMinHeight = isMobile ? 24 : 20;
      defaultFontSize = isMobile ? defaultFontSizes.mediumLarge : defaultFontSizes.medium;
    }
  }

  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      marginBottom: gutterBottom,
      fontWeight: bold ? 600 : 400,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSize,
      cursor: onClick ? 'pointer' : 'text',
      lineHeight: style?.lineHeight ?? defaultLineHeight,
      minHeight: style?.minHeight ?? defaultMinHeight,
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
    },
  ];
});

export const Span = styled.span((props) => {
  const {
    color,
    bold,
    gutterBottom,
    fontSize,
    theme,
    onClick,
    opacity,
    tooltipHighlighting,
    isMobile,
    style,
    isV4,
    ellipsis,
  } = props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.primary : lightTheme.content.primary;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;

  let defaultFontSize = defaultFontSizes.medium;
  let defaultLineHeight = null;
  let defaultMinHeight = null;

  if (isV4) {
    if (fontSize == null) {
      defaultLineHeight = isMobile ? '24px' : '20px';
      defaultMinHeight = isMobile ? 24 : 20;
      defaultFontSize = isMobile ? defaultFontSizes.mediumLarge : defaultFontSizes.medium;
    }
  } else {
    defaultLineHeight = '16px';
    defaultMinHeight = 16;
  }

  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      marginBottom: gutterBottom,
      fontWeight: bold ? 600 : 400,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSize,
      lineHeight: style?.lineHeight ?? defaultLineHeight,
      minHeight: style?.minHeight ?? defaultMinHeight,
      cursor: onClick ? 'pointer' : 'text',
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
      ...(ellipsis && {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block',
        lineHeight: 1.3,
      }),
    },
  ];
});

export const Div = styled.div((props) => {
  const { color, bold, gutterBottom, fontSize, theme, onClick, opacity, tooltipHighlighting } = props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.primary : lightTheme.content.primary;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;
  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      marginBottom: gutterBottom,
      fontWeight: bold ? 600 : 400,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSizes.medium,
      cursor: onClick ? 'pointer' : 'default',
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
    },
  ];
});

export const H1 = styled.h1((props) => {
  const { color, gutterBottom, fontSize, theme, onClick, opacity, tooltipHighlighting } = props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.emphasize : lightTheme.content.emphasize;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;

  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      fontWeight: 600,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSizes.xlarge,
      lineHeight: '24px',
      marginTop: '0.2rem',
      marginBottom: gutterBottom || '0.5rem',
      minHeight: 24,
      cursor: onClick ? 'pointer' : 'text',
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
    },
  ];
});

export const H2 = styled.h2((props) => {
  const { color, gutterBottom, fontSize, theme, onClick, opacity, tooltipHighlighting } = props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.emphasize : lightTheme.content.emphasize;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;

  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      fontWeight: 600,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSizes.xlarge,
      lineHeight: '24px',
      marginTop: '0.2rem',
      marginBottom: gutterBottom || '0.5rem',
      minHeight: 24,
      cursor: onClick ? 'pointer' : 'text',
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
    },
  ];
});

export const H3 = styled.h3((props) => {
  const { color, gutterBottom, fontSize, theme, onClick, opacity, tooltipHighlighting } = props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.emphasize : lightTheme.content.emphasize;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;

  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      fontWeight: 600,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSizes.xlarge,
      lineHeight: '24px',
      marginTop: '0.2rem',
      marginBottom: gutterBottom || '0.5rem',
      minHeight: 24,
      cursor: onClick ? 'pointer' : 'text',
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
    },
  ];
});

export const H4 = styled.h4((props) => {
  const { color, gutterBottom, fontSize, theme, onClick, opacity, tooltipHighlighting } = props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.emphasize : lightTheme.content.emphasize;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;

  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      fontWeight: 600,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSizes.xlarge,
      lineHeight: '24px',
      marginTop: '0.2rem',
      marginBottom: gutterBottom || '0.5rem',
      minHeight: 24,
      cursor: onClick ? 'pointer' : 'text',
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
    },
  ];
});

export const H5 = styled.h5((props) => {
  const { color, gutterBottom, fontSize, theme, onClick, opacity, tooltipHighlighting } = props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.emphasize : lightTheme.content.emphasize;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;

  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      fontWeight: 600,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSizes.xlarge,
      lineHeight: '24px',
      marginTop: '0.2rem',
      marginBottom: gutterBottom || '0.5rem',
      minHeight: 24,
      cursor: onClick ? 'pointer' : 'default',
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
    },
  ];
});

export const H6 = styled.h6((props) => {
  const { color, gutterBottom, fontSize, theme, onClick, opacity, tooltipHighlighting } = props;
  const { content, fontFamily, fontSizes } = theme;
  const defaultColor = content ? content.emphasize : lightTheme.content.emphasize;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;
  const borderColor = content ? content.border : lightTheme.content.border;

  return [
    {
      margin: 0,
      padding: 0,
      fontFamily: fontFamily || lightTheme.fontFamily,
      color: color || defaultColor,
      fontWeight: 600,
      fontSize: fontSize ? defaultFontSizes[fontSize] : defaultFontSizes.xlarge,
      lineHeight: '24px',
      marginTop: '0.2rem',
      marginBottom: gutterBottom || '0.5rem',
      minHeight: 24,
      cursor: onClick ? 'pointer' : 'default',
      opacity,
      borderBottom: tooltipHighlighting ? `1px dashed ${borderColor}` : null,
    },
  ];
});
