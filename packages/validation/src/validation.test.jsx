/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { matchers } from '@emotion/jest';
import Validation from './validation';
import ValidationMessage from './validationMessage';

expect.extend(matchers);
it('Validation defaults', async () => {
  const result = render(<Validation> </Validation>);
  expect(result.container.innerHTML).toHaveLength(0);
});

it('ValidationMessage defaults', async () => {
  const result = render(<ValidationMessage> </ValidationMessage>);
  expect(result.container.innerHTML).toHaveLength(0);
});

it('Displays message', async () => {
  const { getByText } = render(<Validation message='Its broken' />);
  const text = getByText('Its broken');
  expect(text).toBeDefined();
});

it('Displays message v4', async () => {
  const { getByText, getByRole } = render(<Validation message='Its broken' isV4Design />);
  const text = getByText('Its broken');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Required Passes', async () => {
  const result = render(<Validation isV4Design value='Hi' rules={[{ type: 'isRequired' }]} />);
  expect(result.container.innerHTML).toHaveLength(0);
});

it('Is Required Fails', async () => {
  const mockCallback = jest.fn();

  const { getByText, getByRole } = render(
    <Validation isV4Design value='' rules={[{ type: 'isRequired' }]} onValidation={mockCallback} />,
  );
  const text = getByText('Field is required.');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
  expect(mockCallback.mock.calls).toHaveLength(1);
});

it('Is Required Fails with Custom message', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design value={null} rules={[{ type: 'isRequired', customMessage: 'Its broken' }]} />,
  );
  const text = getByText('Its broken');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Email Passes', async () => {
  const result = render(<Validation isV4Design value='sugar@candy.ca' rules={[{ type: 'isValidEmail' }]} />);
  expect(result.container.innerHTML).toHaveLength(0);
});

it('Is Valid Email Empty Fails', async () => {
  const { getByText, getByRole } = render(<Validation isV4Design value='' rules={[{ type: 'isValidEmail' }]} />);
  const text = getByText('Invalid email address.');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Email Fails', async () => {
  const { getByText, getByRole } = render(<Validation isV4Design value='donkey' rules={[{ type: 'isValidEmail' }]} />);
  const text = getByText('Invalid email address.');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Email Fails with Custom message', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design value='supper.me' rules={[{ type: 'isValidEmail', customMessage: 'Its broken' }]} />,
  );
  const text = getByText('Its broken');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Email empty Fails with Custom message', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design value={null} rules={[{ type: 'isValidEmail', customMessage: 'Its broken' }]} />,
  );
  const text = getByText('Its broken');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Length Passes', async () => {
  const result = render(
    <Validation isV4Design value='sugar@candy.ca' rules={[{ type: 'isValidLength', minLength: 1, maxLength: 30 }]} />,
  );
  expect(result.container.innerHTML).toHaveLength(0);
});

it('Is Valid Length Empty Fails', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design value={null} rules={[{ type: 'isValidLength', minLength: 1, maxLength: 30 }]} />,
  );
  const text = getByText('Must be between 1 and 30 characters.');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Length Fails', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design value='donkey' rules={[{ type: 'isValidLength', minLength: 1, maxLength: 5 }]} />,
  );
  const text = getByText('Must be between 1 and 5 characters.');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Length Fails for min', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design value='donkey' rules={[{ type: 'isValidLength', minLength: 10 }]} />,
  );
  const text = getByText('Must be at least 10 characters.');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Length Empty Fails for min', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design value={null} rules={[{ type: 'isValidLength', minLength: 10 }]} />,
  );
  const text = getByText('Must be at least 10 characters.');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Length Empty Fails for min Custom', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design rules={[{ type: 'isValidLength', minLength: 10, customMessage: 'Its broken' }]} />,
  );
  const text = getByText('Its broken');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Length Fails for max', async () => {
  const { getByText, getByRole } = render(
    <Validation isV4Design value='donkey' rules={[{ type: 'isValidLength', maxLength: 5 }]} />,
  );
  const text = getByText('Must be at most 5 characters.');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Length Fails with Custom message', async () => {
  const { getByText, getByRole } = render(
    <Validation
      isV4Design
      value='supper.me'
      rules={[
        {
          type: 'isValidLength',
          minLength: 1,
          maxLength: 5,
          customMessage: 'Its broken',
        },
      ]}
    />,
  );
  const text = getByText('Its broken');
  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Multi Rule', async () => {
  const { getByText, getByRole } = render(
    <Validation
      isV4Design
      value='donkey'
      rules={[{ type: 'isValidLength', minLength: 1, maxLength: 5 }, { type: 'isValidEmail' }]}
    />,
  );
  const text = getByText('Must be between 1 and 5 characters.');

  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});
it('Multi Rule 2', async () => {
  const { getByText, getByRole } = render(
    <Validation
      isV4Design
      value='donkey'
      rules={[{ type: 'isValidEmail' }, { type: 'isValidLength', minLength: 1, maxLength: 5 }]}
    />,
  );
  const text = getByText('Invalid email address.');

  expect(text).toBeDefined();
  const img = getByRole('img');
  expect(img).toBeDefined();
});

it('Is Valid Range Passes', async () => {
  const result = render(
    <Validation isV4Design value={3} rules={[{ type: 'isValidRange', minValue: 1, maxValue: 5 }]} />,
  );
  expect(result.container.innerHTML).toHaveLength(0);
});

it('Is Valid Range Fails', async () => {
  const { getByText } = render(
    <Validation isV4Design value={8} rules={[{ type: 'isValidRange', minValue: 1, maxValue: 5 }]} />,
  );
  const text = getByText('Must be between 1 and 5.');
  expect(text).toBeDefined();
});

it('Is Valid Range Fails for min', async () => {
  const { getByText } = render(<Validation isV4Design value={0} rules={[{ type: 'isValidRange', minValue: 1 }]} />);
  const text = getByText('Must be at least 1.');
  expect(text).toBeDefined();
});

it('Is Valid Range Empty Fails for min', async () => {
  const { getByText } = render(<Validation isV4Design rules={[{ type: 'isValidRange', minValue: 1 }]} />);
  const text = getByText('Must be at least 1.');
  expect(text).toBeDefined();
});

it('Is Valid Range Empty Fails for min Custom', async () => {
  const { getByText } = render(
    <Validation isV4Design rules={[{ type: 'isValidRange', minValue: 1, customMessage: 'Its broken' }]} />,
  );
  const text = getByText('Its broken');
  expect(text).toBeDefined();
});

it('Is Valid Range Fails for max', async () => {
  const { getByText } = render(<Validation isV4Design value='7' rules={[{ type: 'isValidRange', maxValue: 5 }]} />);
  const text = getByText('Must be at most 5.');
  expect(text).toBeDefined();
});

it('Is Valid Range Fails with Custom message', async () => {
  const { getByText } = render(
    <Validation
      isV4Design
      value='9'
      rules={[
        {
          type: 'isValidRange',
          minValue: 1,
          maxValue: 5,
          customMessage: 'Its broken',
        },
      ]}
    />,
  );
  const text = getByText('Its broken');
  expect(text).toBeDefined();
});

it('Is Valid Range Empty Fails with Custom message', async () => {
  const { getByText } = render(
    <Validation
      isV4Design
      compactStyle
      rules={[
        {
          type: 'isValidRange',
          minValue: 1,
          maxValue: 5,
          customMessage: 'Its broken',
        },
      ]}
    />,
  );
  const text = getByText('Its broken');
  expect(text).toBeDefined();
});
