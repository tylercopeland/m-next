import React, { CSSProperties } from 'react';
import { PillTabOption } from './types';
import { PillTabContainer, PillTabButton, PillTabLink } from './PillTab.styles';

export interface PillTabProps<T = string> {
  options: PillTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

function PillTab<T = string>({
  options,
  value,
  onChange,
  className,
  style,
  'data-testid': dataTestId = 'pill-tab',
}: PillTabProps<T>) {
  const handleTabClick = (option: PillTabOption<T>) => {
    if (option.disabled) return;
    
    // For links, let the browser handle navigation
    if (option.href) return;
    
    onChange(option.value);
  };

  return (
    <PillTabContainer className={className} style={style} data-testid={dataTestId}>
      {options.map((option) => {
        const isSelected = option.value === value;
        const commonProps = {
          key: String(option.value),
          isSelected,
          disabled: option.disabled,
          onClick: () => handleTabClick(option),
          'aria-selected': isSelected,
          'aria-disabled': option.disabled,
          role: 'tab',
          'data-testid': `pill-tab-option-${String(option.value)}`,
        };

        // Render as link if href is provided
        if (option.href) {
          return (
            <PillTabLink
              {...commonProps}
              as="a"
              href={option.href}
              target={option.target}
              rel={option.rel}
            >
              {option.label}
            </PillTabLink>
          );
        }

        // Render as button
        return (
          <PillTabButton {...commonProps} type="button">
            {option.label}
          </PillTabButton>
        );
      })}
    </PillTabContainer>
  );
}

export default PillTab;
