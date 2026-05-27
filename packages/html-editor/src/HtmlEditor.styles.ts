import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

interface EditorWrapperProps {
  width?: string;
  disabled?: boolean;
  isValid?: boolean;
  isEditorActive?: boolean;
  isV4Design?: boolean;
}

// TODO: apply v4 style to disable margin-bottom
export const EditorWrapper = styled.div<EditorWrapperProps>`
  width: ${(props) => props.width || '100%'};
  position: relative;
  margin-bottom: ${(props) => (props.isV4Design ? '0px' : '20px')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  /* Increase z-index when editor is active to ensure dropdowns appear above other elements */
  z-index: ${(props) => (props.isEditorActive ? 100 : 1)};

  /* Add a red border when the editor is invalid */
  .fr-box {
    border: ${(props) => (!props.isValid ? '1px solid #dc3545' : 'none')};
  }

  /* Style for the Froala editor */
  .fr-toolbar {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .fr-wrapper {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  /* Placeholder text color */
  .fr-placeholder {
    color: ${colors['grey-dark']} !important;
    opacity: 0.6 !important;
  }
`;
