import React, { useMemo } from 'react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import type { RecurrenceControl } from '@m-next/runtime-interface';

import * as s from './recurrenceWidget.styles';
import { useRuntimeContext } from '../contexts/RuntimeContext';
import { useDesignerContext } from '../contexts/DesignerContext';

// Props interface
interface RecurrenceDesignerWrapperProps {
  id: string;
  className?: string;
  control: RecurrenceControl | undefined;
  mode: 'designer' | 'runtime';
}

const RecurrenceDesignerWrapper: React.FC<RecurrenceDesignerWrapperProps> = ({
  className = 'ui-draggable-handle control',
  id,
  control: controlProp,
  mode,
}) => {
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();

  // Use control from props if provided (runtime mode), otherwise fetch from Redux (designer mode)

  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const control = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? designerContext.selectControlById(id)
      : undefined;

  if (!control) {
    return null;
  }

  const isDisabled = control.disabled || control?.seriesModel?.isOccurrence === true;

  const handleClick = () => {
    if (isDisabled) {
      return;
    }

    if (isRuntimeMode) {
      runtimeContext?.openRecurrencePanel(id, control?.Pattern, control?.Template, control?.seriesModel);
    }
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // add postfix to Day of Month
  const getOrdinal = (i: number) => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) return `${i}st`;
    if (j === 2 && k !== 12) return `${i}nd`;
    if (j === 3 && k !== 13) return `${i}rd`;
    return `${i}th`;
  };

  const patternText = useMemo(() => {
    if (control.Pattern == null) {
      return 'Does Not Repeat';
    }
    if (control.Pattern.patternType === -1) {
      return 'Does Not Repeat';
    }
    let patternText = '';
    const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months: string[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    switch (control.Pattern.patternType) {
      case 0:
        patternText += 'Every day, until ';
        break;
      case 1:
        if (control.Pattern.interval > 1) {
          patternText += `Every ${control.Pattern.interval} weeks, on `;
        } else {
          patternText += 'Every week, on ';
        }
        control.Pattern.daysOfWeek.sort();

        control.Pattern.daysOfWeek.forEach((day: number) => {
          patternText += `${days[day]}, `;
        });
        patternText += 'until ';
        break;
      case 2:
        if (control.Pattern.interval > 1) {
          patternText += `Every ${control.Pattern.interval} months, on the `;
        } else {
          patternText += 'Every month, on the ';
        }
        switch (control.Pattern.ordinalWeek) {
          case 0:
            patternText += `${getOrdinal(control.Pattern.date)}, `;
            break;
          case 1:
            patternText += 'first ';
            break;
          case 2:
            patternText += 'second ';
            break;
          case 3:
            patternText += 'third ';
            break;
          case 4:
            patternText += 'fourth ';
            break;
          case 5:
            patternText += 'last ';
            break;
          default:
            break;
        }

        if (control.Pattern.ordinalWeek > 0) {
          patternText += `${days[control.Pattern.day]}, `;
        }
        patternText += 'until ';
        break;
      case 3:
        if (control.Pattern.interval > 1) {
          patternText += `Every ${control.Pattern.interval} years, on `;
        } else {
          patternText += 'Every year, on ';
        }
        patternText += `${months[control.Pattern.month]} ${getOrdinal(control.Pattern.date)}, until `;
        break;
      default:
        break;
    }
    patternText += new Date(control.Pattern.endDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return patternText;
  }, [control.Pattern, control.Template]);

  if (!control) {
    return null;
  }

  return (
    <s.RecContainerV2
      id={id}
      method_type='REC'
      className={className}
      widthType={control.widthType}
      width={control.width}
      disabled={isDisabled}
      visible
    >
      <s.RecurrenceLabel className='mi-caption mi-text-bold' title={control.caption} hideCaption={control.hideCaption}>
        {control.caption}
      </s.RecurrenceLabel>
      <s.RecurrenceWidgetDiv
        id={control.caption ? control.caption : 'Recurrence'}
        className='mi-recurrence mi-control-width-full'
        tabIndex={isDisabled ? -1 : 0}
        disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleContainerKeyDown}
      >
        <s.RecurrenceTitle
          className='mi-label'
          title={patternText}
          id={`${control.caption ? control.caption : 'Recurrence'}-PATTERN-SUMMARY`}
        >
          {patternText}
        </s.RecurrenceTitle>
        <s.RecurrenceIcon className={isDisabled ? 'aoda-visually-hidden' : undefined}>
          <SvgIcon
            name='edit'
            caption='Edit'
            size={14}
            color={colors.blue}
            id={`${control.caption ? control.caption : 'Recurrence'}-EDIT-ICON`}
          />
        </s.RecurrenceIcon>
      </s.RecurrenceWidgetDiv>
    </s.RecContainerV2>
  );
};

export default RecurrenceDesignerWrapper;
