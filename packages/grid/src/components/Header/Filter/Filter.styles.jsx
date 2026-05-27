import styled from '@emotion/styled';
import { customOffsetFocusOutline } from '@m-next/styles';
import { MenuItem } from '@m-next/menu';
import SvgIcon from '@m-next/svg-icon';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
  outline: none;
  overflow: hidden;
  padding: 0px 4px 0px 0px;
  border-radius: 2px;

  ${(props) =>
    props.isCustomViewEnabled &&
    `
    &:hover {
      background-color: ${props.backgroundHoverColor || 'transparent'};
      
      /* Override SvgIcon hover behavior - only for menu icon */
      [id$="-menu-icon"],
      [data-testid$="-menu-icon"] {
        background-color: ${props.backgroundHoverColor || 'transparent'} !important;
      }
    }

    /* Also override the SvgIcon's own hover state - only for menu icon */
    [id$="-menu-icon"]:hover,
    [data-testid$="-menu-icon"]:hover {
      background-color: ${props.backgroundHoverColor || 'transparent'} !important;
    }
  `}

  body.user-is-tabbing &:focus {
    ${customOffsetFocusOutline}
  }
`;

export const FilterName = styled.div`
  display: block;
  color: rgb(27, 48, 71);
  font-size: 18px;
  font-weight: 600;
  height: 24px;
  line-height: 24px;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const GroupHeader = styled.div`
  display: flex;
  height: 32px;
  padding: 8px;
  align-items: center;
  gap: 120px;
  align-self: stretch;
  color: var(--Grey-Grey-Darker, #0f1b31);
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: 'Source Sans Pro';
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
  user-select: none;
`;

export const GroupDivider = styled.div`
  height: 1px;
  background: #bacad0;
  min-height: 1px;
  margin: 0 0 8px 0;
`;

export const StyledMenuItem = styled(MenuItem)`
  position: relative;
  display: flex !important;
  min-height: 32px;
  padding: ${(props) => (props.isOnlyStandardViews ? '0px 8px' : '0px 8px 0px 32px')} !important;
  margin-bottom: 0 !important;
  align-items: center !important;
  gap: 120px !important;
  align-self: stretch !important;
  color: var(--Grey-Grey-Dark, #2a394a) !important;
  font-size: 14px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 16px !important; /* 114.286% */

  /* Disable grey highlight and inherit cursor in edit mode */
  ${(props) =>
    props.editMode &&
    `
    cursor: inherit !important;
    border-radius: 4px;
    background-color: transparent !important;
    &:hover {
      background-color: transparent !important;
    }
    &[data-selected="true"],
    &[aria-selected="true"] {
      background-color: transparent !important;
    }
  `}
`;

export const ManageViewsContainer = styled.div`
  display: flex;
  padding: 8px 8px;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  flex: 1 0 0;
`;

export const ManageViewsLink = styled.a`
  font-weight: 600;
  line-height: 16px;
  text-decoration: none;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};

  &,
  &:hover,
  &:visited,
  &:active {
    color: ${(props) => (props.disabled ? 'var(--Blue-Blue-Light, #98b7df)' : 'var(--Blue-Blue-Primary, #0d71c8)')};
  }

  &:hover {
    text-decoration: ${(props) => (props.disabled ? 'none' : 'underline')};
  }
`;

export const EmptyStateMessage = styled.div`
  padding: 8px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;

export const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const MenuItemText = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${(props) => (props.editMode ? '180px' : '260px')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: visible;
  min-width: 96px;
`;

export const StyledIcon = styled(SvgIcon)`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')} !important;
  position: relative;
  overflow: visible;
  padding: 10px;
`;

export const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  overflow: visible;
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.15s ease-in-out,
    visibility 0.15s ease-in-out;
  z-index: 99999;
  pointer-events: none;
  white-space: pre-line;

  ${TooltipWrapper}:hover & {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.3s;
  }

  ${TooltipWrapper}:not(:hover) & {
    transition-delay: 0s;
  }
`;

export const TooltipContent = styled.div`
  position: relative;
  display: inline-flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 2px;
  background: var(--Grey-Grey-Darker, #0f1b31);
  color: white;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid var(--Grey-Grey-Darker, #0f1b31);
  }
`;

export const ViewsList = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ViewsDivider = styled.div`
  border-bottom: 1px solid #bacad0;
  margin: 8px;
`;

export const DragHandleIcon = styled(SvgIcon)`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-40%);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  cursor: inherit;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
`;

export const DraggableViewItem = styled.div`
  border-radius: 4px;
  overflow: hidden;
  border: ${(props) => (props.isDragging ? '1px solid #0d71c8' : '1px solid transparent')};
  box-shadow: ${(props) => (props.isDragging ? '0px 0px 14px 0px rgba(44, 143, 229, 0.25)' : 'none')};
  background-color: ${(props) => (props.isDragging ? '#fff' : 'transparent')};
  margin-bottom: 8px;
  cursor: ${(props) => {
    if (props.isDragging) return 'grabbing !important';
    if (props.isDragDisabled) return 'default';
    return 'grab';
  }};

  ${(props) =>
    props.isDragging &&
    `
    * {
      cursor: grabbing !important;
    }
  `}
  transition: ${(props) =>
    props.isDragging ? 'none' : 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'};

  &:hover {
    border-color: ${(props) => (props.isDragDisabled ? 'transparent' : 'rgba(13, 113, 200, 0.50)')};
    box-shadow: ${(props) => (props.isDragDisabled ? 'none' : '0px 0px 14px 0px rgba(44, 143, 229, 0.25)')};
    background-color: ${(props) => (props.isDragDisabled ? 'transparent' : '#fff')};

    ${DragHandleIcon} {
      opacity: ${(props) => (props.isDragDisabled ? 0 : 0.7)};
    }
  }
`;

export const DropPlaceholder = styled.div`
  position: absolute;
  background: #e5f7ff;
  border-radius: 4px;
  pointer-events: none;
  transition: top 0.1s ease-out;
`;
