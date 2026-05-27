import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

export const TabContainer = styled.div(({ width, containerMargin, fullHeight }) => [
  {
    flex: 'auto',
    width,
    height: fullHeight ? '100%' : null,
    boxSizing: 'border-box',
    verticalAlign: 'top',
    margin: containerMargin,
  },
]);

export const TabHeaderContainer = styled.div(({ theme, fullWidthTabs, initialVisibility }) => {
  const { content } = theme;
  const defaultColor = content ? content.border : lightTheme.content.border;

  return [
    {
      display: 'inline-flex',
      alignItems: 'flex-start',
      justifyContent: fullWidthTabs ? 'space-evenly' : 'flex-start',
      flexDirection: 'row',
      boxSizing: 'border-box',
      verticalAlign: 'top',
      width: '100%',
      opacity: initialVisibility,
      borderBottom: `1px solid ${defaultColor}`,
      paddingTop: '16px',
    },
  ];
});

export const TabHeaderDroppableContainer = styled.div(({ fullWidthTabs, initialVisibility }) => [
  {
    display: 'inline-flex',
    alignItems: 'flex-start',
    justifyContent: fullWidthTabs ? 'space-evenly' : 'flex-start',
    flexDirection: 'row',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    width: '100%',
    opacity: initialVisibility,
    position: 'relative',
  },
]);

export const TabHeader = styled.div(({ theme, fullWidthTabs, selected, isDragging, disabled }) => {
  const { content } = theme;
  const defaultColor = content ? content.secondary : lightTheme.content.secondary;
  const primaryColor = content ? content.primary : lightTheme.content.primary;
  const disabledColor = content ? content.disabled : colors['grey-darkest'];

  // Determine color based on state
  let textColor = primaryColor;
  if (disabled) {
    textColor = disabledColor;
  } else if (selected && !isDragging) {
    textColor = defaultColor;
  }

  const styles = [
    {
      height: '32px',
      fontWeight: '600',
      marginRight: isDragging ? 0 : 24,
      fontSize: '14px',
      lineHeight: '16px',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      flexGrow: fullWidthTabs ? 1 : null,
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderBottom: selected && !isDragging ? `4px solid ${defaultColor}` : null,
      color: textColor,
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
      '&:hover': {
        color: disabled ? disabledColor : defaultColor,
      },
      '&:focus': {
        outline: disabled ? 'none' : undefined,
      },
    },
  ];

  return styles;
});

export const MoreSection = styled.div({
  flexDirection: 'column',
});

export const Menu = styled.div({
  flexDirection: 'column',
});

export const MenuHeader = styled.div(({ theme, selected }) => {
  const { content } = theme;
  const defaultColor = content ? content.secondary : lightTheme.content.secondary;
  const primaryColor = content ? content.primary : lightTheme.content.primary;

  return [
    {
      height: '32px',
      fontWeight: '600',
      fontSize: '14px',
      lineHeight: '16px',
      textAlign: 'center',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      borderBottom: selected ? `4px solid ${defaultColor}` : null,
      color: selected ? defaultColor : primaryColor,
      '&:hover': {
        cursor: 'pointer',
      },
    },
  ];
});

export const MoreLabel = styled.span({
  verticalAlign: 'top',
});

export const IconHolder = styled.div(({ theme, disabled }) => {
  const { content } = theme;
  const defaultColor = content ? content.emphasize : lightTheme.content.emphasize;
  return [
    {
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer',
      userSelect: 'none',
      color: defaultColor,
      display: 'inline-block',
      paddingLeft: '8px',
    },
  ];
});

export const MenuList = styled.div(({ legacyPadding }) => [
  {
    position: 'absolute',
    background: '#fff',
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.15)',
    borderRadius: '4px',
    padding: '8px',
    zIndex: '176',
    marginLeft: 'auto',
    top: legacyPadding ? '24px' : null,
    right: legacyPadding ? '12px' : '0px',
  },
]);

export const MenuItem = styled.div(({ theme, disabled }) => {
  const { content } = theme;
  const defaultColor = content ? content.secondary : lightTheme.content.secondary;
  const disabledColor = content ? content.disabled : colors['grey-darkest'];

  return [
    {
      fontSize: '14px',
      lineHeight: '16px',
      padding: '8px',
      textAlign: 'left',
      flexGrow: 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      color: disabled ? disabledColor : undefined,
      pointerEvents: disabled ? 'none' : 'auto',
      '&:hover': {
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? 'transparent' : colors['grey-lightest'],
        color: disabled ? disabledColor : defaultColor,
      },
    },
  ];
});

export const TabPanel = styled.div(({ theme, borderless, dyanmicHeight, calMenuHeight }) => {
  let border = `1px solid  ${colors['grey-lighter']}`;
  if (borderless) border = null;
  const { background } = theme;
  const defaultColor = background ? background.primary : lightTheme.background.primary;

  return {
    backgroundColor: defaultColor,
    border,
    display: 'flex',
    width: '100%',
    minHeight: dyanmicHeight ? null : '809px',
    height: calMenuHeight ? 'calc(100% - 65px)' : '100%',
  };
});

export const RibbonDivider = styled.div({
  borderBottom: `1px ${colors['grey-lighter']} solid`,
});

export const RibbonListMobile = styled.div({
  display: 'flex',
  paddingBottom: '56px',
  flexDirection: 'column',
  width: '100%',
  zIndex: '150',
});
