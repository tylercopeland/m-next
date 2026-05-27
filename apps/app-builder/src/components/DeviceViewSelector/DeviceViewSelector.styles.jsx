import styled from '@emotion/styled';

export const Container = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: '2px 4px',
    background: '#F6FAFB',
    boxShadow: 'inset -1px 1px 6px 0px rgba(0, 0, 0, 0.12)',
    height: 32,
  },
]);

export const DeviceButton = styled.div(() => [
  {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    background: 'transparent',

    '&:hover': {
      opacity: 0.8,
    },

    '&:focus': {
      outline: 'none',
      opacity: 0.8,
    },
  },
]);

export const DeviceButtonWrapper = styled.div(() => [
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
]);

export const IconWrapper = styled.div(({ selected }) => [
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    color: selected ? '#0D71C8' : '#BACAD0',
    transition: 'color 0.2s ease-in-out',

    '&:hover': {
      color: selected ? '#0D71C8' : '#0F1B31',
    },
  },
]);
