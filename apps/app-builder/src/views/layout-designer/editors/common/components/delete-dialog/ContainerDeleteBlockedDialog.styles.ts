import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { Z_MODAL } from '@m-next/layout-canvas';

export const modalStyles = {
    content: {
        padding: 0,
        position: 'relative' as const,
        border: 'none',
        background: 'transparent',
        overflow: 'visible',
        width: 'auto',
        height: 'auto',
        inset: 'auto',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '200px',
        zIndex: Z_MODAL.DIALOG,
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
};

export const DialogWrapper = styled.div({
    display: 'flex',
    width: '592px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '16px',
    borderRadius: '4px',
    background: colors.white,
    boxShadow: '0 2px 40px 0 rgba(0, 0, 0, 0.50)',
});

export const DialogHeaderWrapper = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
});

export const DialogHeaderTitle = styled.div({
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    padding: '16px',
    alignSelf: 'stretch',
    boxSizing: 'border-box',
});

export const DialogHeaderText = styled.p({
    fontFamily: '"Source Sans Pro"',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '24px',
    color: colors['grey-darker'],
    margin: 0,
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 0,
    minHeight: '1px',
});

export const Divider = styled.div({
    height: 0,
    width: '100%',
    borderTop: `1px solid ${colors['grey-light']}`,
    flexShrink: 0,
});

export const DialogContent = styled.div({
    display: 'flex',
    padding: '0 16px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '8px',
    alignSelf: 'stretch',
});

export const DialogText = styled.p({
    alignSelf: 'stretch',
    color: colors['grey-dark'],
    fontFeatureSettings: '"liga" off, "clig" off',
    fontFamily: '"Source Sans Pro"',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px',
    margin: 0,
});

export const ComponentList = styled.ul({
    color: colors.blue,
    fontFeatureSettings: '"liga" off, "clig" off',
    fontFamily: '"Source Sans Pro"',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px',
    listStyleType: 'disc',
    margin: 0,
    padding: 0,
    paddingLeft: '21px',
    flexShrink: 0,
    whiteSpace: 'nowrap',
});

export const ComponentListItem = styled.li({
    lineHeight: '16px',
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
    },
    '&::marker': {
        fontSize: '10px',
    },
});

export const DialogFooter = styled.div({
    width: '592px',
    height: '56px',
    flexShrink: 0,
    borderRadius: '0 0 4px 4px',
    background: colors['grey-lighter'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 16px',
    gap: '8px',
});
