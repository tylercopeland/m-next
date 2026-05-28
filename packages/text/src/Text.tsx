// vendors
import React, { forwardRef, useEffect, useRef } from 'react';

// internal
import convertClass from './classConverter';
import warnOnce from './_warnOnce';
import * as s from './Text.styles';
import type { TextProps, TextWrapperType } from './types';

const textWrapperType: Record<'div' | 'paragraph' | 'title', TextWrapperType> = {
  div: 'DIV',
  paragraph: 'P',
  title: 'H1',
};

let autoIdCounter = 0;

/**
 * Text — typography primitive. Renders one of <p>, <div>, or <h1> with an
 * inline-style-driven set of typography props (fontSize, fontColor, lineHeight,
 * margins, etc.). Supports the React forwardRef API.
 */
const Text = forwardRef<HTMLElement, TextProps>(function Text(props, ref) {
  const {
    id: idProp,
    as = textWrapperType.paragraph,
    fontSize,
    fontColor,
    lineHeight = '20px',
    fontWeight = 'normal',
    mt,
    mb,
    mr,
    ml,
    center,
    wordBreak,
    whiteSpace = 'normal',
    overflow = 'visible',
    children,
    inlineStyling,
    sx: reflexboxSXProp = {},
    tabIndex = -1,
    overrideFontSize,
    legacyClasses = '',
    iconAlign,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    ...otherProps
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef<string | null>(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-text-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  if (legacyForwardRef) {
    warnOnce(
      'text-forwardRef-prop',
      '@m-next/text: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Ref chaining ============
  // Expose the rendered element through both the React forwardRef API and the
  // legacy `forwardRef` prop.
  const internalElRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const assign = (target: typeof ref | typeof legacyForwardRef) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(internalElRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        (target as React.MutableRefObject<HTMLElement | null>).current = internalElRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  }, [ref, legacyForwardRef]);

  const setRef = (node: HTMLElement | null) => {
    internalElRef.current = node;
  };

  // ============ Style assembly ============

  const textStyles: Record<string, string | number | undefined> = {
    color: fontColor,
    fontSize,
    lineHeight,
    fontWeight,
    marginTop: mt,
    marginBottom: mb,
    marginLeft: ml,
    marginRight: mr,
    overflow,
    textOverflow: 'ellipsis',
    wordBreak,
    whiteSpace,
    textAlign: center ? 'center' : 'inherit',
  };

  const textStylesTitle: Record<string, string | number | undefined> = {
    color: fontColor,
    lineHeight,
    marginTop: mt,
    marginBottom: mb,
    marginLeft: ml,
    marginRight: mr,
    wordBreak,
    whiteSpace,
    textAlign: center ? 'center' : 'inherit',
  };

  // Inline-style builder that handles the overrideFontSize !important escape hatch.
  const createInlineStyle = (
    baseStyles?: Record<string, unknown> | null,
    additionalStyles?: Record<string, unknown>,
  ): Record<string, unknown> => {
    const fontSizeWithImportant =
      overrideFontSize && fontSize ? `${fontSize}!important` : fontSize;

    const styleObj = {
      ...(legacyClasses ? convertClass(legacyClasses) : null),
      ...baseStyles,
      ...additionalStyles,
    };

    return {
      ...styleObj,
      fontSize: fontSizeWithImportant,
      // Also exposed as a CSS custom property so Emotion's toHaveStyleRule picks it up.
      '--fontSize': fontSizeWithImportant,
    };
  };

  switch (as?.toUpperCase()) {
    case textWrapperType.div:
      return (
        <s.DivText
          id={id}
          data-testid={id ? `text-${id}--div` : undefined}
          ref={(node: HTMLDivElement | null) => setRef(node)}
          textStyles={textStyles}
          tabIndex={tabIndex}
          iconAlign={iconAlign}
          style={createInlineStyle(inlineStyling, reflexboxSXProp) as React.CSSProperties}
          {...otherProps}
        >
          {children}
        </s.DivText>
      );
    case textWrapperType.title:
      return (
        <s.TitleText
          id={id}
          data-testid={id ? `text-${id}--title` : undefined}
          ref={(node: HTMLHeadingElement | null) => setRef(node)}
          textStyles={textStylesTitle}
          tabIndex={tabIndex}
          iconAlign={iconAlign}
          style={
            {
              ...(legacyClasses ? convertClass(legacyClasses) : null),
              ...inlineStyling,
            } as React.CSSProperties
          }
          {...otherProps}
        >
          {children}
        </s.TitleText>
      );
    case textWrapperType.paragraph:
    default:
      return (
        <s.ParagraphText
          id={id}
          ref={(node: HTMLParagraphElement | null) => setRef(node)}
          data-testid={id ? `text-${id}--paragraph` : undefined}
          textStyles={textStyles}
          tabIndex={tabIndex}
          iconAlign={iconAlign}
          style={
            {
              ...(legacyClasses ? convertClass(legacyClasses) : null),
              ...inlineStyling,
            } as React.CSSProperties
          }
          {...otherProps}
        >
          {children}
        </s.ParagraphText>
      );
  }
});

Text.displayName = 'Text';

export default Text;
export type { TextProps, TextWrapperType };
