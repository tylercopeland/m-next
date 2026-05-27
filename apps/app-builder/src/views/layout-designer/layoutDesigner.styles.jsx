import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { Z_UI } from '@m-next/layout-canvas';

export const Wrapper = styled.div(() => [{}]);

export const LegacyLeftPanelWrapper = styled.div(() => [
  {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    minWidth: '0px', // Ensures will shrink on screen resize
  }
])

export const LegacyRightPanelWrapper = styled.div(({ theme }) => [
  {
    backgroundColor: theme.background.primary,
    display: 'flex',
    flexDirection: 'row',
    width: 380,
    zIndex: Z_UI.RIGHT_PANEL,
  },
]);


export const RightPanelWrapper = styled.div(() => [
  {
    display: 'flex',
    width: 384,
    height: '100%',
    paddingBottom: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    background: '#FFF',
    boxShadow: '0 10px 10px 0 rgba(0, 0, 0, 0.25)',
    position: 'absolute',
    right: 0,
    zIndex: Z_UI.RIGHT_PANEL,
    overflow: 'auto',
  },
]);

export const LegacyCanvasWrapper = styled.div(({ appRibbonType, selectedControlId }) => [
  {
    backgroundColor: colors.white,
    margin: '8px 0px',
    overflow: 'hidden',
    flexGrow: 1,
    marginTop: appRibbonType === 2 ? 8 : 16,
    background: colors.white,
    border: selectedControlId ? 'none' : `2px solid ${colors['blue']}28`,
    boxShadow: selectedControlId ? '' : `0px 0px 5px 0px ${colors.blue}`,
  },
]);

export const ControlPanelWrapper = styled.div(({ theme }) => [
  {
    backgroundColor: theme.background.primary,

    position: 'absolute',
    top: -24,
    bottom: -28,
    left: 0,
    display: 'flex',
    flexDirection: 'row',
    width: 180,
    zIndex: Z_UI.RIGHT_PANEL,
  },
]);

export const LeftPanelWrapper = styled.div(() => [
  {
    display: 'flex',
    flexShrink: 0,
    marginRight: '14px'
  },
]);

export const ResizeableWrapper = styled.div(({ isPaletteOpen }) => [
  {
    display: 'flex',
    flexDirection: 'column',
    width: isPaletteOpen
      ? 'calc(100% - 254px - 16px)' // When palette is open, shrink by palette width + 16px margin
      : 'calc(100vw - 384px - 48px)', // When palette is closed, account for 16px left margin
    height: 'calc(100% - 14px)', // Account for the margin
    boxSizing: 'border-box',
    overflow: 'hidden',
    overflowX: 'auto',
    position: 'relative',
    zIndex: 0, // Creates stacking context so canvas z-index values don't escape and overlap the right panel
    marginLeft: isPaletteOpen ? 16 : 0, // Add left margin when palette is open
    marginTop: '14px', // 14px gap from top header
  },
]);

export const MainContentWrapper = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
]);

export const LegacyLayoutWrapper = styled.div(({ showBanner }) => [
  {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: colors.concrete,
    position: 'relative',
    ...(showBanner && {
      top: -4,
      paddingTop: 14,
    }),
  },
]);

export const LegacyContentRow = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
  },
]);
