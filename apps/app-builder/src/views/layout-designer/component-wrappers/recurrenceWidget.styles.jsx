import styled from '@emotion/styled';
import { customOffsetFocusOutline } from '@m-next/styles';

export const RecurrenceWidgetDiv = styled.div((props) => {
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

export const RecurrenceLabel = styled.label((props) => {
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

export const RecContainer = styled.div((props) => {
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
