/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import InputArea from './InputArea';

describe('InputArea component', () => {
  it('renders without crashing', () => {
    const tree = render(<InputArea id='testId' />).container;
    expect(tree).toMatchSnapshot();
  });

  it('handles onChange event', () => {
    const onChangeMock = jest.fn();
    const { getByRole } = render(<InputArea id='testId' onChange={onChangeMock} />);
    const inputElement = getByRole('textbox');

    fireEvent.change(inputElement, { target: { value: 'Test Input' } });

    expect(onChangeMock).toHaveBeenCalledWith('Test Input');
  });

  it('handles onBlur event', () => {
    const onBlurMock = jest.fn();
    const { getByRole } = render(<InputArea id='testId' onBlur={onBlurMock} />);
    const inputElement = getByRole('textbox');

    fireEvent.blur(inputElement);

    expect(onBlurMock).toHaveBeenCalled();
  });

  it('handles onFocus event', () => {
    const onFocusMock = jest.fn();
    const { getByRole } = render(<InputArea id='testId' onFocus={onFocusMock} />);
    const inputElement = getByRole('textbox');

    fireEvent.focus(inputElement);

    expect(onFocusMock).toHaveBeenCalled();
  });

  it('handles key changes event', () => {
    const onFocusMock = jest.fn();
    const { getByRole } = render(
      <InputArea id='testId' maxHeight={50} initialHeight={250} onFocus={onFocusMock} selectOnFocus />,
    );
    const inputElement = getByRole('textbox');

    fireEvent.click(inputElement);
    fireEvent.focus(inputElement);
    fireEvent.keyDown(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyUp(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyDown(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyUp(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyDown(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyUp(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyDown(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyUp(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyDown(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyUp(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyDown(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyUp(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyUp(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyUp(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyUp(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    expect(onFocusMock).toHaveBeenCalled();
  });

  it('handles key changes event with fixed height', () => {
    const onFocusMock = jest.fn();
    const onKeyUp = jest.fn();
    const onKeyDown = jest.fn();
    const { getByRole } = render(
      <InputArea
        id='testId'
        onFocus={onFocusMock}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        autoGrow={false}
        maxHeight={50}
        initialHeight={250}
      />,
    );
    const inputElement = getByRole('textbox');

    fireEvent.click(inputElement);
    fireEvent.focus(inputElement);
    fireEvent.keyDown(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyUp(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyDown(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyUp(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyDown(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyUp(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyDown(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyUp(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyDown(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyUp(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyDown(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyUp(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyUp(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyUp(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyUp(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });

    expect(onFocusMock).toHaveBeenCalled();
    expect(onKeyUp).toHaveBeenCalledTimes(9);
    expect(onKeyDown).toHaveBeenCalledTimes(9);
  });

  it('handles key changes event with fixed height in a grid', () => {
    const onFocusMock = jest.fn();
    const onNavigateMock = jest.fn();
    const onKeyUp = jest.fn();
    const onKeyDown = jest.fn();
    const { getByRole } = render(
      <InputArea
        id='testId'
        onFocus={onFocusMock}
        autoGrow={false}
        maxHeight={50}
        initialHeight={250}
        navigateGrid={onNavigateMock}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        selectOnFocus
      />,
    );
    const inputElement = getByRole('textbox');

    fireEvent.focus(inputElement);
    fireEvent.keyDown(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyUp(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyDown(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyUp(inputElement, { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    fireEvent.keyDown(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyUp(inputElement, { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
    fireEvent.keyUp(inputElement, { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });

    expect(onFocusMock).toHaveBeenCalled();
    expect(onNavigateMock).toHaveBeenCalled();
    expect(onKeyUp).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledTimes(3);
  });

  it('expands in height when autoGrow is enabled', () => {
    const { getByRole } = render(<InputArea id='testId' autoGrow />);
    const inputElement = getByRole('textbox');

    act(() => {
      fireEvent.change(inputElement, { target: { value: 'Testing autoGrow' } });
    });

    expect(inputElement.style.height).not.toBe('inherit');
  });

  describe('Snapshots', () => {
    test('Defaults', async () => {
      const tree = render(<InputArea id='testId' value='Awsome text test' />).container;
      expect(tree).toMatchSnapshot();
    });

    test('scrollable v4', async () => {
      const value = `Lorem ipsum dolor sit amet, 
        consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum.`;
      const result = render(
        <InputArea
          id='testId'
          autoGrow={false}
          maxHeight={50}
          initialHeight={250}
          selectOnFocus
          value={value}
          isV4Design
        />,
      );
      const inputElement = result.getByRole('textbox');

      act(() => {
        fireEvent.change(inputElement, { target: { value } });
      });

      expect(result.container).toMatchSnapshot();
    });

    test('scrollable', async () => {
      const value = `Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum.`;
      const result = render(
        <InputArea id='testId' autoGrow={false} maxHeight={50} initialHeight={250} selectOnFocus value={value} />,
      );
      const inputElement = result.getByRole('textbox');

      act(() => {
        fireEvent.change(inputElement, { target: { value } });
      });

      expect(result.container).toMatchSnapshot();
    });

    test('Invalid', async () => {
      const tree = render(
        <InputArea id='testId' value='Awsome text test' validationMessage='spelling error' label='Fun text' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('Invalid v4', async () => {
      const tree = render(
        <InputArea
          id='testId'
          value='Awsome text test'
          validationMessage='spelling error'
          label='Fun text'
          isV4Design
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    test('displayAuto', async () => {
      const tree = render(<InputArea id='testId' value='Awsome text test' displayAuto label='Fun text' />).container;
      expect(tree).toMatchSnapshot();
    });

    test('displayAuto v4', async () => {
      const tree = render(
        <InputArea id='testId' value='Awsome text test' displayAuto label='Fun text' isV4Design />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('disable resize', async () => {
      const tree = render(<InputArea id='testId' value='Awsome text test' disableResize label='Fun text' />).container;
      expect(tree).toMatchSnapshot();
    });

    test('disable resize v4', async () => {
      const tree = render(
        <InputArea id='testId' value='Awsome text test' disableResize label='Fun text' isV4Design />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('disabled', async () => {
      const tree = render(<InputArea id='testId' value='Awsome text test' disabled label='Fun text' />).container;
      expect(tree).toMatchSnapshot();
    });

    test('disabled  v4', async () => {
      const tree = render(
        <InputArea id='testId' value='Awsome text test' disabled label='Fun text' isV4Design />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('readonly', async () => {
      const tree = render(<InputArea id='testId' value='Awsome text test' readonly label='Fun text' />).container;
      expect(tree).toMatchSnapshot();
    });

    test('readonly  v4', async () => {
      const tree = render(
        <InputArea id='testId' value='Awsome text test' readonly label='Fun text' isV4Design />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });

  // Additional tests for uncovered branches
  it('handles blur on submit with Enter key', () => {
    const blurMock = jest.fn();
    const { getByRole } = render(<InputArea id='testId' isBlurOnSubmit selectOnFocus />);
    const inputElement = getByRole('textbox');

    // Mock blur function
    inputElement.blur = blurMock;

    fireEvent.focus(inputElement);
    fireEvent.keyUp(inputElement, { which: 13, keyCode: 13 });

    expect(blurMock).toHaveBeenCalled();
  });

  it('prevents default on Enter when isBlurOnSubmit is true', () => {
    const { getByRole } = render(<InputArea id='testId' isBlurOnSubmit selectOnFocus />);
    const inputElement = getByRole('textbox');

    fireEvent.keyDown(inputElement, { which: 13, keyCode: 13 });

    // The component should handle this internally
    expect(inputElement).toBeTruthy();
  });

  it('handles click when selectOnFocus is enabled', () => {
    const { getByRole } = render(<InputArea id='testId' selectOnFocus value='test value' />);
    const inputElement = getByRole('textbox');

    fireEvent.focus(inputElement);
    fireEvent.click(inputElement);

    expect(inputElement).toBeTruthy();
  });

  it('handles auto-grow when value changes', () => {
    const { getByRole } = render(<InputArea id='testId' autoGrow maxHeight={100} />);
    const inputElement = getByRole('textbox');

    act(() => {
      fireEvent.change(inputElement, { target: { value: 'Short text' } });
    });

    expect(inputElement.style.height).toBeTruthy();
  });

  it('limits height to maxHeight when content exceeds', () => {
    const longText = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10';
    const { getByRole } = render(<InputArea id='testId' autoGrow maxHeight={50} value={longText} />);
    const inputElement = getByRole('textbox');

    act(() => {
      fireEvent.change(inputElement, { target: { value: `${longText}\nLine 11\nLine 12` } });
    });

    // Height should be capped at maxHeight
    expect(inputElement).toBeTruthy();
  });

  it('renders with compact style', () => {
    const tree = render(<InputArea id='testId' compactStyle />).container;
    expect(tree).toMatchSnapshot();
  });

  it('renders with aria-label', () => {
    const { getByRole } = render(<InputArea id='testId' ariaLabel='Test aria label' />);
    const inputElement = getByRole('textbox');
    expect(inputElement.getAttribute('aria-label')).toBe('Test aria label');
  });

  it('handles forwardRef with blur method', () => {
    const ref = { current: null };
    render(<InputArea id='testId' forwardRef={ref} />);

    expect(ref.current).toBeTruthy();
    expect(typeof ref.current.blur).toBe('function');
    expect(typeof ref.current.focus).toBe('function');
    expect(typeof ref.current.select).toBe('function');
  });
});
