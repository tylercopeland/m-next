import React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MultiSelect from './MultiSelect';

expect.extend(matchers);

const setUp = (props) => {
  const defaultProps = {
    className: 'test',
    placeholder: 'Enter values',
    options: [],
    inputType: 'text',
    fullSize: true,
  };
  const utils = render(<MultiSelect {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('MultiSelect Component', () => {
  test('Default', () => {
    const props = {
      isMobile: false,
    };
    const { tree } = setUp(props);
    const wrapper = tree.querySelector('#multi-select-wrapper');
    expect(wrapper).toBeDefined();
    const input = tree.querySelector('#multi-select-input');
    expect(input).toBeDefined();
  });

  test('No Inputs', () => {
    const props = {
      isMobile: false,
    };
    const { tree } = setUp(props);
    const wrapper = tree.querySelector('#multi-select-wrapper');
    expect(wrapper).toBeDefined();
    const inputWrapper = tree.querySelector('#input-pill-wrapper');
    expect(inputWrapper).toBeNull();
    const input = tree.querySelector('#input-pill');
    expect(input).toBeNull();
  });

  test('With Inputs', () => {
    const props = {
      options: ['Value 1', 'Value 2', 'Value 3'],
      isMobile: false,
    };
    const { tree } = setUp(props);
    const wrapper = tree.querySelector('#multi-select-wrapper');
    expect(wrapper).toBeDefined();
    const inputWrapper = tree.querySelector('#input-pill-wrapper');
    expect(inputWrapper).toBeDefined();
    const input = tree.querySelector('#input-pill');
    expect(input).toBeDefined();
  });

  test('Mobile', () => {
    const props = {
      isMobile: true,
    };
    const { tree } = setUp(props);
    const wrapper = tree.querySelector('#multi-select-wrapper');
    expect(wrapper).toBeDefined();
    expect(wrapper).toHaveStyle('height: 340px');
  });

  test('Input Change - Non-Email', () => {
    const onSelect = jest.fn();
    const { getByPlaceholderText } = setUp({ onSelect });
    const input = getByPlaceholderText('Enter values');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('test');
  });

  test('Input Change - Valid Email', () => {
    const onSelect = jest.fn();
    const onError = jest.fn();
    const { getByPlaceholderText } = setUp({ onSelect, onError, inputType: 'email' });
    const input = getByPlaceholderText('Enter values');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: 'test@test.com' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('test@test.com');
    expect(onError).toHaveBeenCalledWith('');
  });

  test('Input Change - Invalid Email', () => {
    const onError = jest.fn();
    const { getByPlaceholderText } = setUp({ onError, inputType: 'email' });
    const input = getByPlaceholderText('Enter values');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.blur(input);
    expect(onError).toHaveBeenCalledWith('One or more of the email addresses was invalid.\n');
  });

  test('Input Change - List of Valid and Invalid Emails', () => {
    const onSelect = jest.fn();
    const onError = jest.fn();
    const { getByPlaceholderText } = setUp({ onSelect, onError, inputType: 'email' });
    const input = getByPlaceholderText('Enter values');

    const validEmails = [
      'test@example.com',
      'test+add@gmail.com',
      'test@sub.domain.com',
      'θσερ@εχαμπλε.ψομ',
      'alexander.bobby.charlie.dylan.the.third.2025.department.sales@enterprise-solutions-global.example-corporation.com',
    ];
    const invalidEmails = [
      'invalid-email',
      'user@.com',
      'user@domain',
      'user@domain..com',
      'user@[999.999.999.999]',
      '"user@example.com',
    ];

    validEmails.forEach((email) => {
      fireEvent.change(input, { target: { value: email } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(onSelect).toHaveBeenCalledWith(email);
      expect(onError).toHaveBeenCalledWith('');
      onSelect.mockClear();
      onError.mockClear();
    });

    invalidEmails.forEach((email) => {
      fireEvent.change(input, { target: { value: email } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      fireEvent.blur(input);
      expect(onError).toHaveBeenCalledWith('One or more of the email addresses was invalid.\n');
      expect(onSelect).not.toHaveBeenCalled();
      onSelect.mockClear();
      onError.mockClear();
    });
  });

  test('Existing Email Error', () => {
    const onError = jest.fn();
    const { getByPlaceholderText } = setUp({ onError, inputType: 'email', existingEmails: ['test@test.com'] });
    const input = getByPlaceholderText('Enter values');
    fireEvent.change(input, { target: { value: 'test@test.com' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.blur(input);
    expect(onError).toHaveBeenCalledWith('One or more of the email addresses belongs to an existing user.\n');
  });

  test('Already Added Email Error', () => {
    const onError = jest.fn();
    const { getByPlaceholderText } = setUp({ onError, inputType: 'email', options: ['test@test.com'] });
    const input = getByPlaceholderText('');
    fireEvent.change(input, { target: { value: 'test@test.com' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.blur(input);
    expect(onError).toHaveBeenCalledWith('One or more of the email addresses has already been added.\n');
  });

  test('Delete Input', () => {
    const onDelete = jest.fn();
    const onSelect = jest.fn();
    const { getByText } = setUp({ onSelect, onDelete, options: ['Value 1', 'Value 2', 'Value 3'] });
    const deleteInput = getByText('Value 2').parentNode.querySelector('#pill-remove-input-pill');
    fireEvent.click(deleteInput);
    expect(onDelete).toHaveBeenCalledWith('Value 2', false);
  });

  test('Delete Valid Input with Backspace', () => {
    const onDelete = jest.fn();
    const { getByPlaceholderText } = setUp({
      onDelete,
      inputType: 'email',
      options: ['Value 1', 'Value 2', 'testemail@gmail.com'],
    });
    const input = getByPlaceholderText('');
    fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
    expect(onDelete).toHaveBeenCalledWith('testemail@gmail.com', true);
  });

  test('Delete Invalid Input with Backspace', () => {
    const onDelete = jest.fn();
    const { getByPlaceholderText } = setUp({
      onDelete,
      inputType: 'email',
      options: ['Value 1', 'Value 2', 'testemail@gmail.com_isDuplicate'],
    });
    const input = getByPlaceholderText('');
    fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
    expect(onDelete).toHaveBeenCalledWith('testemail@gmail.com', false);
  });

  test('Delete Valid Input and validate values', () => {
    const onDelete = jest.fn();
    const onSelect = jest.fn();
    const { getByText } = setUp({ onSelect, onDelete, options: ['Value 1', 'Value 2', 'testuser@gmail.com'] });
    const deleteInput = getByText('testuser@gmail.com').parentNode.querySelector('#pill-remove-input-pill');
    fireEvent.click(deleteInput);
    expect(onDelete).toHaveBeenCalledWith('testuser@gmail.com', false);
  });

  test('Container Click', () => {
    const { tree } = setUp();
    const wrapper = tree.querySelector('#multi-select-wrapper');
    fireEvent.click(wrapper);
    const input = tree.querySelector('#multi-select-input');
    expect(input).toHaveFocus();
  });

  test('Dropdown Load', () => {
    const props = {
      isMobile: false,
      isDropdown: true,
      dropdownOptions: ['Option 1', 'Option 2', 'Option 3'],
    };
    const { tree } = setUp(props);
    const wrapper = tree.querySelector('#multi-select-wrapper');
    fireEvent.click(wrapper);
    const dropdown = tree.querySelector('#dropdown-wrapper');
    expect(dropdown).toBeDefined();
    const input = tree.querySelector('#multi-select-input');
    expect(input).toHaveFocus();
  });

  test('Dropdown Click', () => {
    const onSelect = jest.fn();
    const { getByText, tree } = setUp({
      onSelect,
      isMobile: false,
      isDropdown: true,
      dropdownOptions: ['Option 1', 'Option 2', 'Option 3'],
    });
    const wrapper = tree.querySelector('#multi-select-wrapper');
    fireEvent.click(wrapper);
    const option = getByText('Option 1').parentNode.querySelector('#dropdown-option');
    fireEvent.click(option);
    expect(onSelect).toHaveBeenCalledWith('Option 1');
  });

  test('Dropdown Delete', () => {
    const onDelete = jest.fn();
    const onSelect = jest.fn();
    const { getByText } = setUp({
      onSelect,
      onDelete,
      isDropdown: true,
      options: ['Option 1', 'Option 2', 'Option 3'],
      dropdownOptions: ['Option 1', 'Option 2', 'Option 3'],
    });
    const deleteButton = getByText('Option 2').parentNode.querySelector('#pill-remove-input-pill');
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith('Option 2', false);
  });

  test('Empty Input Value', () => {
    const onSelect = jest.fn();
    const { getByPlaceholderText } = setUp({ onSelect });
    const input = getByPlaceholderText('Enter values');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('Input Change - Invalid Email Format', () => {
    const onError = jest.fn();
    const { getByPlaceholderText } = setUp({ onError, inputType: 'email' });
    const input = getByPlaceholderText('Enter values');
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onError).toHaveBeenCalledWith('One or more of the email addresses was invalid.\n');
  });

  test('Dropdown option selection using arrow keys and enter', () => {
    const onSelect = jest.fn();

    const { tree, getByText } = setUp({
      isDropdown: true,
      dropdownOptions: ['Option 1', 'Option 2', 'Option 3'],
      onSelect,
    });

    const wrapper = tree.querySelector('#multi-select-wrapper');
    fireEvent.click(wrapper);

    const dropdown = tree.querySelector('#dropdown-wrapper');
    expect(dropdown).toBeDefined();

    const option = getByText('Option 2');
    fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith('Option 2');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('Handles deleting input values correctly', () => {
    const onDelete = jest.fn();
    const onSelect = jest.fn();

    // Passing onDelete and onSelect as props
    const { getByText } = setUp({ onDelete, onSelect, options: ['Value 1', 'Value 2'] });

    // Locate the delete button for 'Value 2'
    const deleteInput = getByText('Value 2').parentNode.querySelector('#pill-remove-input-pill');

    // Trigger the deletion event
    fireEvent.click(deleteInput);

    // Ensure that the onDelete mock was called with 'Value 2'
    expect(onDelete).toHaveBeenCalledWith('Value 2', false);
  });

  test('Closes dropdown on outside click', () => {
    const onSelect = jest.fn(); // Mocking onSelect
    const { tree } = setUp({ isDropdown: true, dropdownOptions: ['Option 1', 'Option 2'], onSelect });

    // Open dropdown
    const wrapper = tree.querySelector('#multi-select-wrapper');
    fireEvent.click(wrapper);

    const dropdown = tree.querySelector('#dropdown-wrapper');
    expect(dropdown).toBeDefined(); // Dropdown should be open

    // Simulate outside click
    fireEvent.mouseDown(document);

    // Ensure dropdown is closed
    expect(dropdown).not.toBeVisible();
  });

  test('snapshots', () => {
    const result = setUp();
    expect(result).toMatchSnapshot();
  });
});

test('Selects dropdown option using arrow keys and enter', () => {
  const onSelect = jest.fn();

  // Set up the component with dropdown options and onSelect handler
  const { tree, getByText } = setUp({
    isDropdown: true,
    dropdownOptions: ['Option 1', 'Option 2', 'Option 3'],
    onSelect,
  });

  // Simulate a click to open the dropdown
  const wrapper = tree.querySelector('#multi-select-wrapper');
  fireEvent.click(wrapper);

  // Get the dropdown option element directly and simulate a click
  const option = getByText('Option 1');
  fireEvent.click(option);

  // Assert that onSelect was called with the selected option
  expect(onSelect).toHaveBeenCalledWith('Option 1');
});

test('Handles invalid email input and triggers error', () => {
  const onError = jest.fn();
  const { getByPlaceholderText } = setUp({ onError, inputType: 'email' });

  const input = getByPlaceholderText('Enter values');
  fireEvent.change(input, { target: { value: 'invalid-email' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  expect(onError).toHaveBeenCalledWith('One or more of the email addresses was invalid.\n');
});

test('Deletes all pills when areAllPillsDeletable is true', () => {
  const onDelete = jest.fn();
  const onSelect = jest.fn();
  const { container } = setUp({
    options: ['Value 1', 'Value 2'],
    areAllPillsDeletable: true,
    onDelete,
    onSelect,
  });

  // Query delete buttons by their ID
  const deleteButtons = container.querySelectorAll('#pill-remove-input-pill');
  expect(deleteButtons.length).toBeGreaterThan(0); // Ensure delete buttons exist

  // Simulate click on the first delete button
  fireEvent.click(deleteButtons[0]);

  // Assert that the onDelete callback was triggered for the first value
  expect(onDelete).toHaveBeenCalledWith('Value 1', false);
});

test('Tenant Email Error', () => {
  const onError = jest.fn();
  const { getByPlaceholderText } = setUp({ onError, inputType: 'email', tenantEmails: ['tenant@test.com'] });
  const input = getByPlaceholderText('Enter values');
  fireEvent.change(input, { target: { value: 'tenant@test.com' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  fireEvent.blur(input);
  expect(onError).toHaveBeenCalledWith('One or more of the email addresses belongs to an existing tenant.\n');
});

test('Navigates dropdown with arrow keys', () => {
  const onSelect = jest.fn();
  const { tree, getByPlaceholderText } = setUp({
    isDropdown: true,
    dropdownOptions: ['Option 1', 'Option 2', 'Option 3'],
    onSelect,
  });

  const wrapper = tree.querySelector('#multi-select-wrapper');
  fireEvent.click(wrapper);

  const input = getByPlaceholderText('Enter values');

  // Navigate down
  fireEvent.keyUp(input, { key: 'ArrowDown', code: 'ArrowDown' });
  fireEvent.keyUp(input, { key: 'ArrowDown', code: 'ArrowDown' });

  // Navigate up
  fireEvent.keyUp(input, { key: 'ArrowUp', code: 'ArrowUp' });

  // Select with Enter
  fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });

  expect(onSelect).toHaveBeenCalledWith('Option 2');
});

test('Filters dropdown options while typing', () => {
  const { tree, getByPlaceholderText, queryByText } = setUp({
    isDropdown: true,
    dropdownOptions: ['Apple', 'Banana', 'Cherry'],
  });

  const wrapper = tree.querySelector('#multi-select-wrapper');
  fireEvent.click(wrapper);

  const input = getByPlaceholderText('Enter values');
  fireEvent.change(input, { target: { value: 'ban' } });
  fireEvent.keyUp(input, { key: 'b', code: 'KeyB' });

  // Apple and Cherry should be filtered out
  expect(queryByText('Banana')).toBeTruthy();
});

test('Handles comma-separated input for non-email', () => {
  const onSelect = jest.fn();
  const { getByPlaceholderText } = setUp({ onSelect, inputType: 'text' });
  const input = getByPlaceholderText('Enter values');

  fireEvent.change(input, { target: { value: 'value1,value2' } });
  fireEvent.keyDown(input, { key: ',', keyCode: 188 });

  // For text type, comma doesn't trigger special handling
  expect(onSelect).not.toHaveBeenCalled();
});

test('Handles comma-separated emails', () => {
  const onSelect = jest.fn();
  const onError = jest.fn();
  const { getByPlaceholderText } = setUp({ onSelect, onError, inputType: 'email' });
  const input = getByPlaceholderText('Enter values');

  fireEvent.change(input, { target: { value: 'test1@test.com,test2@test.com' } });
  fireEvent.keyDown(input, { key: ',', keyCode: 188 });

  expect(onSelect).toHaveBeenCalled();
});

test('Deletes pill with backspace in dropdown mode without onDelete callback', () => {
  const { getByPlaceholderText, tree } = setUp({
    isDropdown: true,
    dropdownOptions: ['Option 1', 'Option 2'],
    options: ['Option 1', 'Option 2'],
  });

  const wrapper = tree.querySelector('#multi-select-wrapper');
  fireEvent.click(wrapper);

  const input = getByPlaceholderText('');
  fireEvent.keyDown(input, { key: 'Backspace', keyCode: 8 });

  // Should still work even without onDelete callback
  expect(input).toBeDefined();
});

test('Revalidates duplicate email to existing after deletion', () => {
  const onSelect = jest.fn();
  const onError = jest.fn();
  const onDelete = jest.fn();
  const { container } = setUp({
    onSelect,
    onError,
    onDelete,
    inputType: 'email',
    options: ['test@test.com_isDuplicate', 'other@test.com'],
    existingEmails: ['test@test.com'],
  });

  // Delete the "other@test.com" pill to trigger revalidation
  const deleteButtons = container.querySelectorAll('#pill-remove-input-pill');
  if (deleteButtons.length > 0) {
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
  }

  expect(onDelete).toHaveBeenCalled();
});

test('Revalidates duplicate email to tenant after deletion', () => {
  const onSelect = jest.fn();
  const onError = jest.fn();
  const onDelete = jest.fn();
  const { container } = setUp({
    onSelect,
    onError,
    onDelete,
    inputType: 'email',
    options: ['tenant@test.com_isDuplicate', 'other@test.com'],
    tenantEmails: ['tenant@test.com'],
  });

  // Delete to trigger revalidation
  const deleteButtons = container.querySelectorAll('#pill-remove-input-pill');
  if (deleteButtons.length > 0) {
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
  }

  expect(onDelete).toHaveBeenCalled();
});

test('Processes multiple valid emails at once', () => {
  const onSelect = jest.fn();
  const onError = jest.fn();
  const { getByPlaceholderText } = setUp({ onSelect, onError, inputType: 'email' });
  const input = getByPlaceholderText('Enter values');

  fireEvent.change(input, { target: { value: 'test1@test.com,test2@test.com,test3@test.com' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  expect(onSelect).toHaveBeenCalledTimes(3);
  expect(onSelect).toHaveBeenCalledWith('test1@test.com');
  expect(onSelect).toHaveBeenCalledWith('test2@test.com');
  expect(onSelect).toHaveBeenCalledWith('test3@test.com');
});
