import type { DropdownOption } from '@m-next/dropdown';

interface ParseDropdownDataResult {
  options: DropdownOption[];
  hasMultiLine: boolean;
}

/**
 * Parses raw dropdown data rows into DropdownOption objects.
 * Column 0 = value, column 1 = label, columns 2+ = lines[].
 * Single-column rows use value as label.
 */
export function parseDropdownData(data: Record<string, string>[] | null | undefined): ParseDropdownDataResult {
  if (!data || data.length === 0) {
    return { options: [], hasMultiLine: false };
  }

  const options: DropdownOption[] = [];
  let hasMultiLine = false;

  data.forEach((item: Record<string, string>) => {
    let value = '';
    let label = '';
    const multi: string[] = [];
    let totalDropdownColumns = 0;

    Object.keys(item).forEach((key) => {
      if (totalDropdownColumns === 0) {
        value = item[key] || '';
      } else if (totalDropdownColumns === 1) {
        label = item[key] || '';
      } else {
        multi.push(item[key] || '');
      }
      totalDropdownColumns += 1;
    });

    if (totalDropdownColumns === 1) {
      label = value;
    }

    if (totalDropdownColumns > 2) {
      hasMultiLine = true;
    }

    options.push({
      label,
      value,
      lines: multi.length > 0 ? multi : undefined,
    });
  });

  return { options, hasMultiLine };
}
