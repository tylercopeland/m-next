import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatter } from '@m-next/utilities';
import { Field, FieldTypeNames } from '@m-next/types';
import { DebouncedInput } from '@m-next/input';
import SvgIcon from '@m-next/svg-icon';

import * as s from '../fieldBlock.styles';

const propTypes = {
  id: PropTypes.string,
  field: Field,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  displayPreferences: PropTypes.instanceOf(Object),
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  mode: PropTypes.number,
  onChange: PropTypes.func,
  validationError: PropTypes.string,
};

function TextIconField({ id, field, value, displayPreferences, onSelect, selected, mode, onChange, validationError }) {
  const [clicked, setClicked] = useState(false);
  const [clickTimer, setClickTimer] = useState(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [queuedChange, setQueuedChange] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeout(clickTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetClick = useCallback(() => {
    clearTimeout(clickTimer);
    setClickTimer(
      setTimeout(() => {
        if (isMounted.current) {
          setClicked(false);
        }
      }, 100),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setClicked, isMounted]);

  const handleClick = (e) => {
    if (onSelect) {
      setClicked(true);
      resetClick();
      onSelect(e, id, field.name);
    }
  };

  useEffect(() => {
    setClicked(true);
    resetClick();
  }, [selected, resetClick]);

  const formattedValue = useMemo(
    () => formatter.formatFieldValue(field.type, field.displayOptions, value, displayPreferences),
    [field.type, field.displayOptions, value, displayPreferences],
  );
  const iconName = useMemo(() => {
    if (field.type === FieldTypeNames.Phone) return 'phone';
    if (field.type === FieldTypeNames.Email) return 'email';
    return '';
  }, [field.type]);

  const inputType = useMemo(() => {
    if (field.type === FieldTypeNames.Phone) return 'tel';
    if (field.type === FieldTypeNames.Email) return 'email';
    return 'text';
  }, [field.type]);

  const handleChange = (val) => {
    onChange(field.name, val);
  };

  const handleQueuedChange = (val) => {
    if (hasFocus) {
      setQueuedChange(val);
    } else {
      handleChange(val);
    }
  };

  const handleOnFocus = () => {
    setHasFocus(true);
  };
  const handleBlur = () => {
    setHasFocus(false);
    if (queuedChange) {
      handleChange(queuedChange);
      setQueuedChange(null);
    }
  };

  return (
    <s.ReadOnlyLine
      data-testid={`${id}-data-block-line-${field.name}`}
      selected={field.name === selected}
      initial={clicked}
      onClick={handleClick}
    >
      {mode === 1 && (
        <DebouncedInput
          id={`${id}-data-block-line-${field.name}`}
          isV4Design
          value={formattedValue}
          caption={field.caption}
          hideCaption={false}
          compactStyle
          required={field.isRequired}
          onChange={handleQueuedChange}
          onFocus={handleOnFocus}
          onBlur={handleBlur}
          validationMessage={validationError}
          useValidation
          type={inputType}
        />
      )}
      {mode === 0 && (
        <s.ReadonlyLabel id={`${id}-data-block-line-${field.name}-caption`}>{field.caption}</s.ReadonlyLabel>
      )}
      {mode === 0 && (
        <s.ReadOnlyIconValue>
          <SvgIcon size={16} name={iconName} color='#9BAAB0'>
            {field.type === FieldTypeNames.Website && (
              <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} viewBox='0 0 16 16' fill='none'>
                <path
                  d='M11.3381 9.58183L11.3175 9.75104H11.488H14.192H14.3099L14.3385 9.63663C14.4689 9.11503 14.551 8.56658 14.551 8C14.551 7.43342 14.4689 6.88497 14.3385 6.36337L14.3099 6.24896H14.192H11.488H11.3175L11.3381 6.41818C11.4017 6.94346 11.449 7.46468 11.449 8C11.449 8.53531 11.4017 9.05655 11.3381 9.58183ZM9.93913 13.9762L9.75496 14.3169L10.1212 14.1908C11.6148 13.6766 12.8733 12.6419 13.6666 11.2759L13.7984 11.049H13.536H11.176H11.0588L11.0297 11.1625C10.7765 12.1514 10.4129 13.0998 9.93913 13.9762ZM9.872 9.75104H10.0038L10.0217 9.62041C10.094 9.08985 10.151 8.55405 10.151 8C10.151 7.44604 10.094 6.9023 10.0216 6.37928L10.0036 6.24896H9.872H6.128H5.99842L5.97871 6.37703C5.89773 6.90341 5.84896 7.44717 5.84896 8C5.84896 8.55298 5.89776 9.08867 5.97866 9.62263L5.99812 9.75104H6.128H9.872ZM7.87578 14.4539L8 14.6335L8.12422 14.4539C8.79618 13.4824 9.34003 12.4036 9.67319 11.2416L9.72843 11.049H9.528H6.472H6.27157L6.32681 11.2416C6.65997 12.4036 7.20382 13.4824 7.87578 14.4539ZM4.8 4.95104H4.91456L4.94545 4.84073C5.22321 3.84871 5.57944 2.89968 6.05287 2.02382L6.23613 1.6848L5.87131 1.80902C4.37636 2.31806 3.11832 3.35477 2.33296 4.72489L2.20333 4.95104H2.464H4.8ZM2.464 11.049H2.20212L2.33326 11.2756C3.12334 12.6413 4.37929 13.6763 5.87074 14.1908L6.23721 14.3172L6.05287 13.9762C5.57944 13.1003 5.22321 12.1513 4.94545 11.1593L4.91456 11.049H4.8H2.464ZM1.66147 9.63663L1.69007 9.75104H1.808H4.512H4.68246L4.66194 9.58183C4.59827 9.05655 4.55104 8.53531 4.55104 8C4.55104 7.46469 4.59827 6.94346 4.66194 6.41818L4.68246 6.24896H4.512H1.808H1.69007L1.66147 6.36337C1.53107 6.88497 1.44896 7.43342 1.44896 8C1.44896 8.56658 1.53107 9.11503 1.66147 9.63663ZM8.12422 1.53808L8 1.35848L7.87578 1.53808C7.20363 2.50985 6.65989 3.59664 6.32681 4.75837L6.27157 4.95104H6.472H9.528H9.72843L9.67319 4.75837C9.34011 3.59664 8.79637 2.50985 8.12422 1.53808ZM13.536 4.95104H13.7978L13.6668 4.72438C12.8806 3.36503 11.6277 2.325 10.1209 1.8091L9.75727 1.68459L9.93888 2.02336C10.4159 2.91321 10.7822 3.85812 11.0296 4.83701L11.0584 4.95104H11.176H13.536ZM0.151042 8C0.151042 3.68312 3.65971 0.151042 8 0.151042C9.03074 0.151042 10.0514 0.354061 11.0037 0.748508C11.9559 1.14296 12.8212 1.72111 13.5501 2.44995C14.2789 3.17879 14.857 4.04405 15.2515 4.99633C15.6459 5.94861 15.849 6.96926 15.849 8C15.849 10.0817 15.022 12.0781 13.5501 13.5501C12.0781 15.022 10.0817 15.849 8 15.849C6.96926 15.849 5.94861 15.6459 4.99633 15.2515C4.04405 14.857 3.17879 14.2789 2.44995 13.5501C0.977983 12.0781 0.151042 10.0817 0.151042 8Z'
                  fill='#9BAAB0'
                  stroke='white'
                  strokeWidth={0.302083}
                />
              </svg>
            )}
          </SvgIcon>
          <s.ReadonlyValue id={`${id}-data-block-line-${field.name}-value`}>{formattedValue}</s.ReadonlyValue>
        </s.ReadOnlyIconValue>
      )}
    </s.ReadOnlyLine>
  );
}

TextIconField.propTypes = propTypes;
export default TextIconField;
