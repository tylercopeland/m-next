/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { colors } from '@m-next/styles';
import Pill from '@m-next/pill';
import SvgIcon from '@m-next/svg-icon';
import validator from 'validator';
import * as s from './MultiSelect.styles';
// types
const propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.instanceOf(Array),
  inputType: PropTypes.oneOf(['text', 'email']),
  existingEmails: PropTypes.instanceOf(Array),
  tenantEmails: PropTypes.instanceOf(Array),
  fullSize: PropTypes.bool,
  height: PropTypes.string,
  isMobile: PropTypes.bool,
  isDropdown: PropTypes.bool,
  dropdownOptions: PropTypes.instanceOf(Array),
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  onError: PropTypes.func,
  areAllPillsDeletable: PropTypes.bool,
};

const emailValidationErrors = ['_isInvalid', '_isDuplicate', '_isExisting', '_isTenant'];
const tagsToRemove = emailValidationErrors.concat('_isValid', '_valid');

function MultiSelect({
  className,
  placeholder,
  options,
  inputType = 'text',
  existingEmails,
  tenantEmails,
  fullSize,
  height,
  isMobile,
  isDropdown = false,
  dropdownOptions,
  onSelect,
  onDelete,
  onError,
  areAllPillsDeletable = false,
}) {
  const [values, setValues] = useState(options || []);
  const [filteredDropdownOptions, setFilteredDropdownOptions] = useState(
    dropdownOptions?.filter((option) => !values.includes(option)) || [],
  );
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isDropdown && dropdownOpen) {
      inputRef.current?.focus();
    }
  }, [isDropdown, dropdownOpen]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilteredDropdownOptions(dropdownOptions?.filter((option) => !values.includes(option)));
        setDropdownOpen(false);
      }
      setInputFocused(false);
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOptions, values]);

  const handleDropdownClick = (option) => {
    if (option) {
      setValues([...values, option]);
      setFilteredDropdownOptions(
        dropdownOptions.filter((dropdownOption) => dropdownOption !== option && !values.includes(dropdownOption)),
      );
      setSelectedDropdownOption(0);
      setDropdownOpen(false);
      setInputFocused(true);

      if (onSelect) onSelect(option);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  const getEmailValidationErrors = (emails) => {
    let errorMessage = '';
    if (emailValidationErrors.some((error) => emails.some((email) => email.includes(error)))) {
      errorMessage =
        'One or more email addresses are invalid or already associated with an existing user. Please remove the invalid addresses to proceed.\n';
    }
    return errorMessage;
  };

  const updateErrorMessage = (errorMessage) => {
    if (errorMessage) {
      onError && onError(errorMessage);
    } else {
      onError && onError('');
    }
  };

  const trimEmailValidation = (untrimmedEmail) =>
    tagsToRemove.reduce((result, tag) => result.replace(tag, ''), untrimmedEmail);

  const getEntries = (value) => value.split(',').filter((entry) => entry.trim() !== '');

  const getAllEmails = () => values.map((email) => trimEmailValidation(email).toLowerCase());

  const processEntries = (entries, allEmails) =>
    entries.map((email) => {
      let processedEmail = email.trim();
      if (!validator.isEmail(processedEmail)) {
        processedEmail += '_isInvalid';
        onError && onError('One or more of the email addresses was invalid.\n');
      } else if (allEmails.includes(processedEmail.toLowerCase())) {
        processedEmail += '_isDuplicate';
        onError && onError('One or more of the email addresses has already been added.\n');
      } else if (existingEmails && existingEmails.includes(processedEmail.toLowerCase())) {
        processedEmail += '_isExisting';
        onError && onError('One or more of the email addresses belongs to an existing user.\n');
      } else if (tenantEmails && tenantEmails.includes(processedEmail.toLowerCase())) {
        processedEmail += '_isTenant';
        onError && onError('One or more of the email addresses belongs to an existing tenant.\n');
      } else {
        processedEmail += '_isValid';
      }
      allEmails.push(processedEmail.replace(/_is(Invalid|Duplicate|Existing|Tenant|Valid)/, '').toLowerCase());
      return processedEmail;
    });

  const getValidEmails = (emails) =>
    emails
      .filter((email) => email.includes('_isValid') && !emailValidationErrors.some((error) => email.includes(error)))
      .map((email) => email.replace('_isValid', '_valid'));

  const handleProcessedEmails = (emails, validEmails) => {
    if (emails.length > 0) {
      setValues([...values, ...emails]);

      // update / clear error message
      const errorMessage = getEmailValidationErrors(values) || getEmailValidationErrors(emails);
      updateErrorMessage(errorMessage);

      // save all valid emails
      validEmails.forEach((email) => onSelect && onSelect(email.replace('_valid', '')));
    }
  };

  const processEmails = (value) => {
    const entries = getEntries(value);
    const allEmails = getAllEmails();
    const emails = processEntries(entries, allEmails);

    const validEmails = getValidEmails(emails);
    handleProcessedEmails(emails, validEmails);
  };

  const revalidateEmails = (emailsList) => {
    const emailCounts = {};
    emailsList.forEach((email) => {
      const cleanEmail = trimEmailValidation(email).toLowerCase();
      emailCounts[cleanEmail] = (emailCounts[cleanEmail] || 0) + 1;
    });

    return emailsList.map((email) => {
      if (!email.includes('_isDuplicate')) return email;

      const cleanEmail = trimEmailValidation(email).toLowerCase();
      if (emailCounts[cleanEmail] !== 1) return email;

      if (existingEmails?.includes(cleanEmail)) return email.replace('_isDuplicate', '_isExisting');
      if (tenantEmails?.includes(cleanEmail)) return email.replace('_isDuplicate', '_isTenant');
      return email.replace('_isDuplicate', '_isValid');
    });
  };

  const updateValuesAndHandleDelete = (newValues, value) => {
    const revalidatedValues = inputType === 'email' ? revalidateEmails(newValues) : newValues;

    setValues(revalidatedValues);
    let isValid = false;

    if (inputType === 'email') {
      isValid = !emailValidationErrors.some((error) => value.includes(error));

      const errorMessage = getEmailValidationErrors(revalidatedValues);
      updateErrorMessage(errorMessage);

      // eslint-disable-next-line no-param-reassign
      value = trimEmailValidation(value);

      // update newly validated emails
      revalidatedValues.forEach((email, index) => {
        if (email.includes('_isValid') && newValues[index]?.includes('_isDuplicate')) {
          onSelect && onSelect(trimEmailValidation(email));
        }
      });
    }

    if (onDelete) onDelete(value, isValid);
  };

  const isEnterOrBlur = (e, isBlur) => e.key === 'Enter' || e.keyCode === 13 || isBlur;

  const isCommaPressed = (e) => e.key === ',' || e.keyCode === 188;

  const isBackspacePressed = (e) => e.key === 'Backspace' || e.keyCode === 8;

  const handleValueInput = (value) => {
    if (inputType === 'email') {
      processEmails(value);
    } else {
      setValues([...values, value]);
      onSelect && onSelect(value);
    }
  };

  const handleCommaInput = (e, value) => {
    if (inputType === 'email') {
      processEmails(value);
      e.target.value = '';
      e.preventDefault();
    }
  };

  const handleBackspaceInput = () => {
    const newValues = values.slice(0, -1); // get all values except most recent
    const value = values[values.length - 1]; // most recent value to delete

    updateValuesAndHandleDelete(newValues, value);
  };

  const handleNonDropdownInput = (e, isBlur) => {
    const trimmedValue = e.target.value.trim();

    if (isEnterOrBlur(e, isBlur) && trimmedValue !== '') {
      handleValueInput(trimmedValue);
      e.target.value = '';
    } else if (isCommaPressed(e)) {
      handleCommaInput(e, trimmedValue);
    } else if (isBackspacePressed(e) && trimmedValue === '') {
      handleBackspaceInput();
    }
  };

  const navigateDropdown = (direction) => {
    setSelectedDropdownOption((prevIndex) => {
      if (direction === 'up') {
        return prevIndex > 0 ? prevIndex - 1 : filteredDropdownOptions.length - 1;
      }
      if (direction === 'down') {
        return prevIndex < filteredDropdownOptions.length - 1 ? prevIndex + 1 : 0;
      }
    });
  };

  const filterDropdownOptions = (inputValue) => {
    setFilteredDropdownOptions(
      dropdownOptions.filter(
        (option) => option.toLowerCase().includes(inputValue.toLowerCase()) && !values.includes(option),
      ),
    );
    setSelectedDropdownOption(0);
  };

  const handleDropdownInput = (e) => {
    setDropdownOpen(true);
    switch (e.key) {
      case 'ArrowUp':
        navigateDropdown('up');
        break;
      case 'ArrowDown':
        navigateDropdown('down');
        break;
      case 'Enter':
        handleDropdownClick(filteredDropdownOptions[selectedDropdownOption]);
        break;
      default:
        filterDropdownOptions(e.target.value);
        break;
    }
  };

  const handleDropdownChange = (e) => {
    if ((e.key === 'Backspace' || e.keyCode === 8) && e.target.value === '' && values.length > 1) {
      const newValues = [...values];
      const value = newValues.pop();
      setValues(newValues);

      if (onDelete) onDelete(value);
    }
  };

  const handleInputChange = (e, isBlur = false) => {
    if (!isDropdown) {
      handleNonDropdownInput(e, isBlur);
    } else {
      handleDropdownInput(e);
    }
  };

  const handleDelete = (index, value) => () => {
    const newValues = values.filter((_, i) => i !== index); // get all values except selected pill

    if (isDropdown) {
      setFilteredDropdownOptions(dropdownOptions.filter((option) => !newValues.includes(option)));
    }

    updateValuesAndHandleDelete(newValues, value);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
    if (isDropdown) {
      setDropdownOpen(!dropdownOpen);
    }
    setInputFocused(true);
  };

  // eslint-disable-next-line no-nested-ternary
  const wrapperHeight = height || (isMobile ? '340px' : fullSize ? '200px' : '100px');

  const determineLeadIcon = (value, displayVaidationPill) => {
    if (displayVaidationPill) {
      if (value) {
        if (value.includes('_isInvalid')) {
          return { name: 'warning-sign', label: 'Invalid email', color: colors['red'] };
        }
        if (value.includes('_isExisting')) {
          return { name: 'warning-sign', label: 'User already exists', color: colors['red'] };
        }
        if (value.includes('_isDuplicate')) {
          return { name: 'warning-sign', label: 'Duplicate email entry', color: colors['red'] };
        }
        if (value.includes('_isTenant')) {
          return { name: 'warning-sign', label: 'User already exists in another tenant', color: colors['red'] };
        }
        return null;
      }
    }
    return null;
  };

  const determineBorderStyle = (value, showValidation) => {
    if (showValidation) {
      if (emailValidationErrors.some((error) => value.includes(error))) {
        return { border: `1px solid ${colors['red']}` };
      }
    }
    return null;
  };

  const determineColorScheme = (value, index, deletable) => {
    if (emailValidationErrors.some((error) => value.includes(error))) {
      return 'red';
    }
    if (index === 0 && !deletable) {
      return 'grey';
    }
    return 'blue';
  };

  return (
    <s.MultiSelectWrapper isDropdown={isDropdown} isMobile={isMobile}>
      <s.OptionsWrapper
        className={`${className}-multi-select`}
        id='multi-select-wrapper'
        height={wrapperHeight}
        isDropdown={isDropdown}
        isMobile={isMobile}
        onClick={handleContainerClick}
      >
        {values.map((value, index) => {
          const pillValue = trimEmailValidation(value);
          return (
            <s.PillWrapper
              key={`pill-wrapper-${index}`}
              className={`${className}-input-pill-wrapper`}
              id='input-pill-wrapper'
              isMobile={isMobile}
              isDropdown={isDropdown}
            >
              <Pill
                key={`multi-select-pill-${index}`}
                className={`${className}-input-pill`}
                id='input-pill'
                isMobile={isMobile}
                colorScheme={determineColorScheme(value, index, areAllPillsDeletable)}
                onDelete={
                  (values.length === 1 && !areAllPillsDeletable) || (index === 0 && !areAllPillsDeletable)
                    ? null
                    : handleDelete(index, value)
                }
                style={determineBorderStyle(value, areAllPillsDeletable)}
                leadIcon={determineLeadIcon(value, areAllPillsDeletable)}
              >
                {pillValue}
              </Pill>
            </s.PillWrapper>
          );
        })}
        {(!isDropdown || (isDropdown && (dropdownOpen || inputFocused))) && (
          <s.MultiSelectInput
            className={`${className}-multi-select-input`}
            id='multi-select-input'
            ref={inputRef}
            type='text'
            placeholder={values.length === 0 ? placeholder : ''}
            onKeyUp={isDropdown ? handleInputChange : null}
            onKeyDown={isDropdown ? handleDropdownChange : handleInputChange}
            onBlur={!isDropdown ? (e) => handleInputChange(e, true) : null}
            isMobile={isMobile}
            isDropdown={isDropdown}
            autoComplete={isDropdown ? 'off' : 'on'}
          />
        )}
        {isDropdown && (
          <s.DropdownCaret isMobile={isMobile}>
            <SvgIcon
              className={`${className}-dropdown-icon`}
              name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
              color={colors['grey']}
              size={8}
            />
          </s.DropdownCaret>
        )}
      </s.OptionsWrapper>
      {isDropdown && dropdownOpen && (
        <s.DropdownWrapper
          className={`${className}-dropdown-wrapper`}
          id='dropdown-wrapper'
          ref={dropdownRef}
          hasOptions={filteredDropdownOptions.length > 0}
          isMobile={isMobile}
        >
          {filteredDropdownOptions.length > 0 ? (
            filteredDropdownOptions.map((option, index) => {
              const optionKey = `dropdown-option-${index}`;
              return (
                <s.DropdownOption
                  key={optionKey}
                  id='dropdown-option'
                  onClick={() => handleDropdownClick(option)}
                  selected={index === selectedDropdownOption}
                  hasOptions={filteredDropdownOptions.length > 0}
                >
                  {option}
                </s.DropdownOption>
              );
            })
          ) : (
            <s.DropdownOption>No Records Found</s.DropdownOption>
          )}
        </s.DropdownWrapper>
      )}
    </s.MultiSelectWrapper>
  );
}

MultiSelect.propTypes = propTypes;
export default MultiSelect;
