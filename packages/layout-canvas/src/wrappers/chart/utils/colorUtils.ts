/**
 * Color utility functions for chart color mapping
 */

import { colors } from '@m-next/styles';
import { v3Colors } from './constants';

/**
 * Maps V3 colors to V4 color palette
 * @param colorList - Array of color hex codes
 * @returns Array of mapped color hex codes
 */
export function mapV3ColorsToV4(colorList: string[]): string[] {
  const result = colorList.map((color) => color.toUpperCase());

  // Check if color list contains a v3 color
  const v3ColorsList = [
    v3Colors.pink,
    v3Colors.blue,
    v3Colors.aqua,
    v3Colors.purple,
    v3Colors.green,
    v3Colors.yellow,
    v3Colors.orange,
    v3Colors.red,
  ];
  const isV3ColorPresent = result.some((x) => v3ColorsList.indexOf(x) >= 0);

  // Map v3 colors to v4 color palette if applicable
  if (isV3ColorPresent) {
    for (let i = 0; i < result.length; i++) {
      const currentColor = result[i];
      if (!currentColor) continue;
      switch (currentColor) {
        case v3Colors.pink:
          result[i] = colors['fuchsia'] || currentColor;
          break;
        case v3Colors.blue:
          result[i] = colors['blue'] || currentColor;
          break;
        case v3Colors.aqua:
          result[i] = colors['teal'] || currentColor;
          break;
        case v3Colors.purple:
          result[i] = colors['purple'] || currentColor;
          break;
        case v3Colors.green:
          result[i] = colors['green'] || currentColor;
          break;
        case v3Colors.yellow:
          result[i] = colors['yellow'] || currentColor;
          break;
        case v3Colors.orange:
          result[i] = colors['orange'] || currentColor;
          break;
        case v3Colors.red:
          result[i] = colors['red'] || currentColor;
          break;
        default:
          break;
      }
    }
  }

  return result;
}
