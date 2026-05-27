import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const ModelCardWrapper = styled.div(() => [
  {
    border: `2px solid ${colors.blue}`,
    borderRadius: 4,
    background: colors.white,
    padding: 8,
    cursor: 'pointer',
    display: 'flex',
    gap: 8,
    width: 240,
  },
]);

export const ModelCardContent = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
]);

export const ModelCardFooter = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
]);

export const ModelFieldWrapper = styled.div((props) => {
  const { theme } = props;
  const { content, background } = theme;
  return [
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      border: `2px solid ${content.border}`,
      borderRadius: 4,
      padding: 16,
      background: background.primary,
    },
  ];
});

export const ModelFieldSummary = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
]);
export const ModelFieldContent = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
  },
]);

export const ModelFieldPropertiesWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
]);

export const ModelFieldDisplayOptions = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    flexDirection: 'column',
  },
]);

export const ModelFieldDisplayOptionsContent = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
  },
]);
