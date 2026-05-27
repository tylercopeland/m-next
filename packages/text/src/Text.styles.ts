/* eslint-disable */
// @ts-nocheck
import styled from '@emotion/styled';

export interface TextStyleProps {
  textStyles?: Record<string, string | number | undefined>;
  iconAlign?: string;
  forwardRef?: React.Ref<HTMLElement>;
}

export const ParagraphText = styled.p<TextStyleProps>`
  ${(props) => props.textStyles}

  ::after {
    margin-left: ${(p) => (p.iconAlign && p.iconAlign === 'Right' ? '4px' : '0')};
  }

  ::before {
    margin-right: ${(p) => (p.iconAlign && p.iconAlign === 'Left' ? '4px' : '0')};
  }
`;

export const TitleText = styled.h1<TextStyleProps>`
  ${(props) => props.textStyles}

  ::after {
    margin-left: ${(p) => (p.iconAlign && p.iconAlign === 'Right' ? '4px' : '0')};
  }

  ::before {
    margin-right: ${(p) => (p.iconAlign && p.iconAlign === 'Left' ? '4px' : '0')};
  }
`;

// New styled component for DIV variant to replace Box from reflexbox
export const DivText = styled.div<TextStyleProps>`
  ${(props) => props.textStyles}

  ::after {
    margin-left: ${(p) => (p.iconAlign && p.iconAlign === 'Right' ? '4px' : '0')};
  }

  ::before {
    margin-right: ${(p) => (p.iconAlign && p.iconAlign === 'Left' ? '4px' : '0')};
  }
`;
