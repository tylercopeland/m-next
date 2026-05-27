/**
 * Custom hook for calculating line-clamp based on container height
 */

import { useEffect, useState, RefObject } from 'react';
import { DEFAULT_LINE_CLAMP, DESCENDER_PADDING_MULTIPLIER, LINE_CLAMP_BUFFER, MAX_LINE_CLAMP } from '../constants';

interface UseLineClampParams {
  containerRef: RefObject<HTMLDivElement>;
  textRef: RefObject<HTMLDivElement>;
  calculatedLineHeight: string;
  effectiveStyles: {
    fontSize?: string;
  };
}

export function useLineClamp({
  containerRef,
  textRef,
  calculatedLineHeight,
  effectiveStyles,
}: UseLineClampParams): number | undefined {
  const [lineClamp, setLineClamp] = useState<number | undefined>(undefined);

  useEffect(() => {
    const calculateLineClamp = () => {
      if (!containerRef.current || !textRef.current) return;

      const container = containerRef.current;
      const textElement = textRef.current;

      const containerHeight = container.clientHeight;
      if (containerHeight === 0) {
        setLineClamp(DEFAULT_LINE_CLAMP);
        return;
      }

      const lineHeight = parseFloat(calculatedLineHeight) || 20;
      const textElementHeight = textElement.clientHeight;

      const fontSize = effectiveStyles.fontSize ? parseFloat(effectiveStyles.fontSize) || 14 : 14;
      const descenderPadding = fontSize * DESCENDER_PADDING_MULTIPLIER;
      const availableHeight =
        Math.min(containerHeight, textElementHeight > 0 ? textElementHeight : containerHeight) -
        descenderPadding -
        LINE_CLAMP_BUFFER;

      const rawLines = availableHeight / lineHeight;
      const linesThatFit = Math.max(1, Math.floor(rawLines));

      if (linesThatFit > 0 && linesThatFit < MAX_LINE_CLAMP) {
        setLineClamp(linesThatFit);
      } else {
        setLineClamp(DEFAULT_LINE_CLAMP);
      }
    };

    const timeoutId = setTimeout(() => {
      calculateLineClamp();
    }, 0);

    const resizeObserver = new ResizeObserver(() => {
      calculateLineClamp();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [containerRef, textRef, calculatedLineHeight, effectiveStyles.fontSize]);

  return lineClamp;
}
