import styled from '@emotion/styled';
import { breakpointNames, customFocusOutline } from '@m-next/styles';

export const SearchHeaderWrapper = styled.div((props) => {
  const { size } = props;
  return [
    {
      display: 'flex',
      gap: '4px 8px',
      alignItems: 'center',
      flexWrap: size === breakpointNames.xs ? 'wrap' : 'nowrap',
      margin: size === breakpointNames.xs ? '0px 16px' : null,
      marginBottom: 8,
    },
  ];
});

export const FilterWrapper = styled.div((props) => [
  {
    flexGrow: props.searchable ? 1 : 0,

    display: 'flex',
    gap: 16,
    justifyContent: props.size === breakpointNames.xs ? 'space-between' : 'flex-start',
  },
]);

export const SelectedWrapper = styled.div((props) => [
  {
    flexDirection: 'start',
    alignSelf: 'center',
    flexGrow: props.searchable ? 1 : 2,
  },
]);

export const SearchWrapper = styled.div((props) => {
  const { size } = props;
  return [
    {
      flexGrow: size === breakpointNames.xs ? 1 : 0,
    },
  ];
});

export const SortWrapper = styled.div(() => [{}]);

export const MenuWrapper = styled.div(() => [{}]);

export const MobileBreak = styled.div((props) => {
  const { size } = props;
  return [
    {
      height: 0,
      flexBasis: size === breakpointNames.xs ? '100%' : 0,
    },
  ];
});

export const SelectedHeader = styled.div(() => [
  {
    color: '#545f67',
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: '16px',
    padding: '0 16px',
    textAlign: 'center',
    width: '100%',
  },
]);

export const SelectAllLink = styled.a`
  color: #0d71c8;
  outline: none;
  body.user-is-tabbing &:focus {
    ${customFocusOutline};
  }
  &:hover {
    text-decoration: underline;
  }
`;
export const ActionButtonWrapper = styled.div`
  margin: 0 0 8px 0;
`;

// Small Screen Styling css (Less Then 500px)
export const SmallHeaderWrapper = styled.div((props) => [
  {
    display: 'flex',
    maxWidth: `${props.parentMaxWidth}px`,
    flexWrap: 'wrap',
    rowGap: '4px',
    marginBottom: 8,
  },
]);

export const SmallFilterWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  flex: 1 100%;
  overflow: hidden;
  gap: 4px 8px;
  span {
    border: none;
  }
`;

export const SmallSearchBarWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  flex: 1 100%;
  gap: 4px 8px;
  & > form {
    min-width: unset;
  }
`;

export const FillerSpacer = styled.div`
  flex-grow: 1;
`;
