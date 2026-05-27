import styled from '@emotion/styled';
import { customOffsetFocusOutline } from '@m-next/styles';
import { WidthType } from '@m-next/runtime-interface';

// Props interfaces for styled components
interface RecurrenceWidgetDivProps {
  disabled?: boolean | null;
}

interface RecurrenceLabelProps {
  hideCaption?: boolean;
}

interface RecContainerProps {
  widthType?: WidthType;
  width?: number | string | null;
  visible?: boolean;
  method_type?: string;
  disabled?: boolean;
}

export const RecurrenceWidgetDiv = styled.div<RecurrenceWidgetDivProps>((props) => {
  let output = `
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        outline: none;
    `;
  if (!props.disabled) {
    output += `
            cursor: pointer;
            &:focus {
                outline: none;
            }
            body.user-is-tabbing &:focus {
                outline: none;
                ${customOffsetFocusOutline}
            }
        `;
  }
  return output;
});

export const RecurrenceTitle = styled.p`
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const RecurrenceLabel = styled.label<RecurrenceLabelProps>((props) => {
  let output = `
        &:hover {
            cursor: default;
        }
    `;
  if (props.hideCaption)
    output += `
            display: none !important;
        `;
  return output;
});

export const RecurrenceIcon = styled.div`
  padding-left: 5px;
`;

export const RecContainer = styled.div<RecContainerProps>((props) => {
  let output = `
        padding-bottom: 10px;
    `;
  if (props.widthType === 'full')
    output += `
            width: 100%;
        `;
  else if (props.widthType === 'fixed')
    output += `
            width: ${props.width}px;
        `;
  if (!props.visible)
    output += `
            display: none !important;
        `;
  return output;
});

export const RecContainerV2 = styled.div<RecContainerProps>((props) => {
  let output = `
        padding: 8px;
    `;
  if (props.widthType === 'full')
    output += `
            width: 100%;
        `;
  else if (props.widthType === 'fixed')
    output += `
            width: ${props.width}px;
        `;
  if (!props.visible)
    output += `
            display: none !important;
        `;
  return output;
});
