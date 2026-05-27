import styled from '@emotion/styled';
import { colors, device } from '@m-next/styles';
import designTokens from '@m-next/styles/src/design-tokens';

export const Caption = styled.label`
  display: block;
  line-height: 1em;
  font-size: ${(p) => (p.size ? p.size : '14px')};
  font-weight: ${(p) => (p.weight ? p.weight : 500)};
  color: ${(p) => (p.color ? p.color : colors['grey-dark'])};
  text-align: ${(p) => (p.align ? p.align : 'left')};
  margin: 16px;
  @media ${device.tablet} {
    margin-bottom: 16px;
  }
`;

export const Container = styled.div`
  display: ${(p) => (p.fillParentHeight ? 'flex' : 'block')};
  flex-direction: ${(p) => (p.fillParentHeight ? 'column' : null)};
  width: ${(p) => p.width};
  height: ${(p) => {
    // fillParentHeight takes precedence over explicit height
    if (p.fillParentHeight) return '100%';
    if (p.height) return typeof p.height === 'number' ? `${p.height}px` : p.height;
    return 'auto';
  }};
  position: relative;
  box-sizing: border-box;
  margin-bottom: ${(p) => (p.compact ? null : '16px')};
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  // min-width: 320px;
`;

export const TableWrapper = styled.div`
  // position: relative;
  ${(_) => {
    if (_.fillParentHeight) {
      return `
     //   flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      `;
    }
    return _.height ? `height: ${_.height};` : '';
  }}

  ${(_) =>
    _.tableWrapperHoverState
      ? `
    &:hover{
        transition: box-shadow 0.25s ease-in-out;
        box-shadow: inset 0 0 6px .1px ${colors['blue']};
    }
  `
      : ''}

  /* Modern variant styles - only apply when variant="modern" */
  ${(p) =>
    p.variant === 'modern' &&
    `
    /* Table styles */
    table {
      border-collapse: separate;
      border: none;
      box-shadow: ${designTokens.boxShadow};
      border-radius: 8px;
    }

    /* Header styles */
    th {
      color: #0f1b31;
      background: ${p.highlightColumn ? colors.concrete : '#F8F8F8'};
      border: none;
      border-top: ${designTokens.border};
      border-bottom: ${designTokens.border};
    }

    th:first-of-type {
      border-left: ${designTokens.border};
      border-top-left-radius: 8px;
    }

    th:last-of-type {
      border-right: ${designTokens.border};
      border-top-right-radius: 8px;
    }

    /* Row styles */
    tbody:last-child tr:last-child td:first-of-type {
      border-bottom-left-radius: 8px;
    }

    tbody:last-child tr:last-child td:last-of-type {
      border-bottom-right-radius: 8px;
    }

    /* Cell styles */
    td {
      border-right: ${p.isDragging || !p.showVerticalDividers ? 'none' : designTokens.border} !important;
      border-bottom: ${designTokens.border};
    }

    td:first-of-type {
      border-left: ${designTokens.border};
    }

    td:last-of-type {
      border-right: ${designTokens.border} !important;
    }

    /* Footer styles */
    tfoot td {
      color: #0f1b31;
      font-weight: 600;
      background: #f8f8f8;
      border: none;
      border-bottom: ${designTokens.border};

      &:first-of-type {
        border-left: ${designTokens.border};
        border-bottom-left-radius: 8px;
      }

      &:last-of-type {
        border-right: ${designTokens.border};
        border-bottom-right-radius: 8px;
      }
    }
  `}
`;

export const Scroller = styled.div`
  width: ${(p) => p.width};
  ${(p) => {
    // Handle fill-parent mode first
    if (p.fillParentHeight) {
      return `
      //  flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
      `;
    }
    // Only apply height constraint and vertical scrolling for componentVersion >= 1.0.0
    const version = p.componentVersion || '0.0.0';
    const [major] = version.split('.').map(Number);
    return major >= 1
      ? `
      height: 100%;
      overflow-y: auto;
    `
      : '';
  }}
  box-sizing: border-box;
  overflow-x: ${(p) => (p.visibleOverflow ? 'visible' : 'auto')};
  padding-right: 1px;
  padding-bottom: 0px;
  margin-bottom: ${(p) => (p.showPaginationFooter && !p.fillParentHeight ? '8px' : '0px')};
  // Visible scrollbar for Macs + custom scrollbar
  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:horizontal {
    height: 15px;
  }
  ${(p) => {
    // Show vertical scrollbar styling for fillParentHeight or componentVersion >= 1.0.0
    if (p.fillParentHeight) {
      return `
        &::-webkit-scrollbar:vertical {
          width: 15px;
        }
      `;
    }
    const version = p.componentVersion || '0.0.0';
    const [major] = version.split('.').map(Number);
    return major >= 1
      ? `
      &::-webkit-scrollbar:vertical {
        width: 15px;
      }
    `
      : '';
  }}
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 4px solid white;
    background-color: rgba(178, 187, 194, 0.7);
    &:hover {
      background-color: rgba(178, 187, 194);
    }
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }
`;

export const HeaderWrapper = styled.div`
  ${(p) => (p.fillParentHeight ? 'flex-shrink: 0;' : '')}
`;

export const PaginationRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  ${(p) => (p.fillParentHeight ? 'flex-shrink: 0;' : '')}
`;

export const AddRowCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(p) => {
    let justify = 'flex-start';
    if (p.centered) justify = 'center';
    if (!p.centered && p.end) justify = 'flex-end';
    return justify;
  }};
`;
export const PaginationCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(p) => {
    let justify = 'flex-start';
    if (p.centered) justify = 'center';
    if (!p.centered && p.end) justify = 'flex-end';
    return justify;
  }};
  ${(p) => (p.isMobile ? 'width: 100%; justify-content: space-between; margin-top: 4px;' : '')}
`;

export const ImageEditerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 16px;
  background-color: ${colors.concrete};
`;

export const ImageEditorFooter = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  flex-direction: row;
  justify-content: flex-end;
`;

export const AdvancedSearchDrawer = styled.div(({ open }) => ({
  display: open ? 'block' : 'none',
  border: `1px solid ${colors['grey-light']}`,
  borderRadius: 8,
  marginTop: 8,
  marginBottom: 8,
}));
