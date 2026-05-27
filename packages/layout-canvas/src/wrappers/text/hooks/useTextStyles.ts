/**
 * Custom hook for calculating text styles
 */

import { useMemo } from 'react';
import { colors } from '@m-next/styles';
import { combineTextStyleClasses } from '../../../../../../apps/app-builder/src/views/layout-designer/utils/textStyleUtils';
import { FONT_SIZE_MAP, DEFAULT_FONT_SIZE, DEFAULT_LINE_HEIGHT_MULTIPLIER } from '../constants';

interface Control {
  styles?: {
    fontColor?: string;
    fontWeight?: string;
    textAlignment?: string;
    fontSize?: keyof typeof FONT_SIZE_MAP;
  };
  color?: string;
  classes?: string;
  fontSize?: keyof typeof FONT_SIZE_MAP;
}

export function useTextStyles(control: Control | undefined) {
  const combinedClasses = useMemo(() => {
    if (!control) return '';
    return combineTextStyleClasses(control.classes || '', {
      textAlignment: control.styles?.textAlignment,
      fontWeight: control.styles?.fontWeight,
      fontColor: control.styles?.fontColor,
    });
  }, [control]);

  const effectiveStyles = useMemo(() => {
    if (!control) return {};

    const fontColor = control.styles?.fontColor
      ? colors[control.styles.fontColor]
      : control.color
        ? (colors[control.color] ?? control.color)
        : undefined;

    const fontWeight = control.styles?.fontWeight
      ? control.styles.fontWeight === 'bold'
        ? 600
        : 400
      : control.classes?.includes('bold')
        ? 'bold'
        : 'normal';

    const textAlignment = control.styles?.textAlignment ?? 'inherit';

    const fontSizeKey = control.styles?.fontSize ?? control.fontSize;
    const fontSizeConfig = fontSizeKey ? FONT_SIZE_MAP[fontSizeKey] : null;
    const fontSize = fontSizeConfig?.fontSize ?? DEFAULT_FONT_SIZE;
    const lineHeightMultiplier = fontSizeConfig?.lineHeightMultiplier ?? DEFAULT_LINE_HEIGHT_MULTIPLIER;

    return {
      fontColor,
      fontWeight,
      textAlignment,
      fontSize,
      lineHeightMultiplier,
    };
  }, [control]);

  const calculatedLineHeight = useMemo(() => {
    const fontSize = effectiveStyles.fontSize ? parseFloat(effectiveStyles.fontSize) || 14 : 14;

    return `${fontSize * (effectiveStyles.lineHeightMultiplier ?? DEFAULT_LINE_HEIGHT_MULTIPLIER)}px`;
  }, [effectiveStyles.fontSize, effectiveStyles.lineHeightMultiplier]);

  return {
    combinedClasses,
    effectiveStyles,
    calculatedLineHeight,
  };
}
