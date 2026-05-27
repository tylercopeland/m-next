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

export const TabHeaderContainer = styled.div(({ fullWidthTabs, initialVisibility }) => [
  {
    display: 'flex',
    padding: fullWidthTabs ? '0' : '4px',
    alignItems: 'center',
    borderRadius: fullWidthTabs ? '0' : '8px',
    background: fullWidthTabs ? 'transparent' : '#EEF5F7',
    justifyContent: fullWidthTabs ? 'space-evenly' : 'flex-start',
    flexDirection: 'row',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    width: fullWidthTabs ? '100%' : 'fit-content',
    maxWidth: '100%',
    opacity: initialVisibility,
    // V2 styling - removed old border-bottom and paddingTop
  },
]);

export const TabHeaderDroppableContainer = styled.div(({ fullWidthTabs, initialVisibility }) => [
  {
    display: 'inline-flex',
    alignItems: 'flex-start',
    justifyContent: fullWidthTabs ? 'space-evenly' : 'flex-start',
    flexDirection: 'row',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    width: fullWidthTabs ? '100%' : 'fit-content',
    opacity: initialVisibility,
    position: 'relative',
  },
]);

// Helper function to determine tab text color based on state
const getTabTextColor = (disabled, selected, isDragging, disabledColor) => {
  if (disabled) return disabledColor;
  if (selected && !isDragging) return '#2A394A'; // V2 active tab color
  return '#545F67'; // V2 non-active tab color
};

// Helper function to get theme colors with fallbacks
const getThemeColors = (theme) => ({
  defaultColor: theme.content?.secondary ?? lightTheme.content.secondary,
  disabledColor: theme.content?.disabled ?? colors['grey-darkest'],
});

// Base styles that apply to all tabs
const getBaseTabStyles = () => ({
  height: '32px',
  fontWeight: '600',
  marginRight: 0,
  fontSize: '14px',
  lineHeight: '16px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  display: 'flex',
  padding: '8px 16px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  borderRadius: '8px',
});

// Dynamic styles based on component state
const getDynamicTabStyles = (props) => {
  const { fullWidthTabs, disabled, selected, isDragging } = props;
  const { defaultColor, disabledColor } = getThemeColors(props.theme);
  const textColor = getTabTextColor(disabled, selected, isDragging, disabledColor);

  return {
    flexGrow: fullWidthTabs ? 1 : null,
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: textColor,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    background: selected && !isDragging ? '#FFF' : undefined,
    fontFamily: !disabled ? '"Source Sans Pro"' : undefined,
    fontStyle: !disabled ? 'normal' : undefined,
    fontFeatureSettings: !disabled ? "'liga' off, 'clig' off" : undefined,
    '&:hover': {
      color: disabled ? disabledColor : defaultColor,
    },
    '&:focus': {
      outline: disabled ? 'none' : undefined,
    },
  };
};

export const TabHeader = styled.div((props) => [getBaseTabStyles(), getDynamicTabStyles(props)]);

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 16px',
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

export const TabPanel = styled.div(({ theme, borderless, dynamicHeight, calMenuHeight }) => {
  let border = `1px solid  ${colors['grey-lighter']}`;
  if (borderless) border = null;
  const { background } = theme;
  const defaultColor = background ? background.primary : lightTheme.background.primary;

  return {
    backgroundColor: defaultColor,
    border,
    display: 'flex',
    width: '100%',
    minHeight: dynamicHeight ? null : '809px',
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
