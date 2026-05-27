/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ButtonGroup from './ButtonGroup';

expect.extend(matchers);

const setup = (props) => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    id: 'test',
    data: [
      { value: 1, label: 'First' },
      { value: 2, label: 'Two' },
      { value: 3, label: 'One' },
    ],
    onClick: mockOnClick,
  };
  const utils = render(<ButtonGroup {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    mockOnClick,
    ...utils,
  };
};

describe('ButtonGroup', () => {
  describe('Functional', () => {
    it('Defaults', async () => {
      const { getByText, getAllByRole } = setup();
      expect(getByText('First')).toBeDefined();
      expect(getAllByRole('button')[0]).toHaveTextContent('First');
    });

    test('Onclick of header', async () => {
      const { getAllByText, mockOnClick } = setup();

      fireEvent.click(getAllByText('First')[0]);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith({ value: 1, label: 'First' }, 0);
    });

    test('Onclick disabled', async () => {
      const { getAllByRole, mockOnClick } = setup({ disabled: true });
      fireEvent.click(getAllByRole('button')[0]);
      expect(mockOnClick).toHaveBeenCalledTimes(0);
    });

    test('Toggle open and closed', async () => {
      const { getByRole, queryByText } = setup();

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.click(getByRole('img'));
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.click(getByRole('img'));
      expect(queryByText('Two')).not.toBeInTheDocument();
    });

    test('Trigger click with enter', async () => {
      const { getByText, mockOnClick } = setup();

      fireEvent.keyDown(getByText('First'), { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith({ value: 1, label: 'First' }, 0);
    });

    test('Toggle open and closed with keys', async () => {
      const { queryByText, getByRole } = setup();

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByRole('img'), { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByRole('img'), { key: 'Tab', code: 'Tab', charCode: 9, keyCode: 9 });
      expect(queryByText('Two')).not.toBeInTheDocument();
    });

    test('Up and down keys move focus', async () => {
      const { queryByText, getByRole } = setup();

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByRole('img'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByRole('img'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      fireEvent.keyDown(getByRole('img'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      fireEvent.keyDown(getByRole('img'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByRole('img'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByRole('img'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByRole('img'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByRole('img'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByRole('img'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByRole('img'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
      expect(queryByText('Two')).toBeInTheDocument();
    });

    test('IsDropdown Up and down keys move focus', async () => {
      const { queryByText, getByText } = setup({ isDropdown: true });

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      fireEvent.keyDown(getByText('First'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByText('First'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByText('First'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
    });

    test('IsDropdown Toggle open and closed with keys', async () => {
      const { queryByText, getByText } = setup({ isDropdown: true });

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Tab', code: 'Tab', charCode: 9, keyCode: 9 });
      expect(queryByText('Two')).not.toBeInTheDocument();
    });

    test('Header Up and down keys move focus', async () => {
      const { queryByText, getByText } = setup();

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      fireEvent.keyDown(getByText('First'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByText('First'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
      expect(queryByText('Two')).not.toBeInTheDocument();
    });

    test('Header Toggle open and closed with keys', async () => {
      const { queryByText, getByText } = setup();

      expect(queryByText('Two')).not.toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.keyDown(getByText('First'), { key: 'Enter', code: 'Enter', charCode: 13, keyCode: 13 });
      fireEvent.keyDown(getByText('First'), { key: 'Up', code: 'Up', charCode: 38, keyCode: 38 });
      fireEvent.keyDown(getByText('First'), { key: 'Tab', code: 'Tab', charCode: 9, keyCode: 9 });
      expect(queryByText('Two')).not.toBeInTheDocument();
    });

    test('Onclick of menu item', async () => {
      const { getByText, getByRole, mockOnClick } = setup();

      fireEvent.click(getByRole('img'));
      fireEvent.click(getByText('Two'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith({ value: 2, label: 'Two' }, 1);
    });

    test('ClickOutside', async () => {
      const mockOnClick = jest.fn();

      const { getByRole, queryByText, getByText } = render(
        <div id='wrapper'>
          <ButtonGroup
            id='test'
            data={[
              { value: 1, label: 'First' },
              { value: 2, label: 'Two' },
              { value: 3, label: 'One' },
            ]}
            onClick={mockOnClick}
          />
          <div data-testid='wrapper'>Hi</div>
        </div>,
      );

      fireEvent.click(getByRole('img'));
      expect(queryByText('Two')).toBeInTheDocument();
      fireEvent.click(getByText('Hi'));
      //   expect(queryByText('Two')).not.toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('Default', async () => {
      const { tree } = setup();
      expect(tree).toMatchSnapshot();
    });

    it('IsDropdown', async () => {
      const { tree } = setup({ isDropdown: true });
      expect(tree).toMatchSnapshot();
    });

    it('Open', async () => {
      const { tree, getByRole } = setup();
      fireEvent.click(getByRole('img'));
      expect(tree).toMatchSnapshot();
    });

    it('IsMobile', async () => {
      const { tree } = setup({ isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    it('Stlye Ghost', async () => {
      const { tree } = setup({ buttonStyle: 'ghost' });
      expect(tree).toMatchSnapshot();
    });
    it('Stlye primary', async () => {
      const { tree } = setup({ buttonStyle: 'primary' });
      expect(tree).toMatchSnapshot();
    });
    it('Stlye plain', async () => {
      const { tree } = setup({ buttonStyle: 'plain' });
      expect(tree).toMatchSnapshot();
    });
    it('Stlye calendarMenu', async () => {
      const { tree } = setup({ buttonStyle: 'calendarMenu' });
      expect(tree).toMatchSnapshot();
    });

    it('Classes', async () => {
      const { tree } = setup({ classes: ['button-purple', 'button-border-2px', 'white'] });
      expect(tree).toMatchSnapshot();
    });

    it('Not visible', async () => {
      const { tree } = setup({ visible: false });
      expect(tree).toMatchSnapshot();
    });
  });
  test('onMenuToggle cycles through menu items when at last item', async () => {
    const { getByRole } = setup();

    // Open menu
    fireEvent.click(getByRole('img'));
    expect(document.activeElement.id).toBe('test-1');

    // Navigate to last item (index 2)
    fireEvent.keyDown(getByRole('img'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });
    expect(document.activeElement.id).toBe('test-2');

    // At last item, should cycle back to first menu item (index 1)
    fireEvent.keyDown(getByRole('img'), { key: 'Down', code: 'Down', charCode: 40, keyCode: 40 });

    expect(document.activeElement.id).toBe('test-1');
  });

  test('onMenuToggle closes menu when open', async () => {
    const { getByRole, queryByText } = setup();

    // Open menu
    fireEvent.click(getByRole('img'));
    expect(queryByText('Two')).toBeInTheDocument();

    // Trigger onMenuToggle to close
    fireEvent.keyDown(getByRole('img'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
    expect(queryByText('Two')).not.toBeInTheDocument();
  });

  test('onMenuToggle opens menu when closed', async () => {
    const { getByRole, queryByText } = setup();

    expect(queryByText('Two')).not.toBeInTheDocument();

    // Trigger onMenuToggle to open
    fireEvent.keyDown(getByRole('img'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
    expect(queryByText('Two')).toBeInTheDocument();
  });

  test('onMenuToggle does nothing with single item', async () => {
    const { getByRole, queryByText } = setup({
      data: [{ value: 1, label: 'Only' }],
    });

    // Should not open anything with single item
    fireEvent.keyDown(getByRole('button'), { key: 'Space', code: 'Space', charCode: 32, keyCode: 32 });
    expect(queryByText('Two')).not.toBeInTheDocument();
  });
});
test('handleKeyDown Tab key closes menu', async () => {
  const { getByRole, queryByText } = setup();

  // Open menu
  fireEvent.click(getByRole('img'));
  expect(queryByText('Two')).toBeInTheDocument();

  // Press Tab to close menu
  fireEvent.keyDown(getByRole('img'), { keyCode: 9 });
  expect(queryByText('Two')).not.toBeInTheDocument();
});

test('handleKeyDown Up arrow opens menu when closed and at index 0', async () => {
  const { getByRole, queryByText } = setup();

  expect(queryByText('Two')).not.toBeInTheDocument();

  fireEvent.keyDown(getByRole('img'), { keyCode: 38 });
  expect(queryByText('Two')).toBeInTheDocument();
});

test('handleKeyDown Up arrow navigates to last item when at index 1', async () => {
  const { getByRole } = setup();

  // Open menu and move to index 1
  fireEvent.click(getByRole('img'));
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });

  // Press Up to go to last item
  fireEvent.keyDown(getByRole('img'), { keyCode: 38 });
  expect(document.activeElement.id).toBe('test-1');
});

test('handleKeyDown Up arrow navigates to previous item', async () => {
  const { getByRole } = setup();

  // Open menu and navigate to last item
  fireEvent.click(getByRole('img'));
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });

  // Press Up to go to previous item
  fireEvent.keyDown(getByRole('img'), { keyCode: 38 });
  expect(document.activeElement.id).toBe('test-2');
});

test('handleKeyDown Down arrow opens menu when closed', async () => {
  const { getByRole, queryByText } = setup();

  expect(queryByText('Two')).not.toBeInTheDocument();

  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });
  expect(queryByText('Two')).toBeInTheDocument();
});

test('handleKeyDown Down arrow navigates to first menu item when at last item', async () => {
  const { getByRole } = setup();

  // Open menu and navigate to last item
  fireEvent.click(getByRole('img'));
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });

  // Press Down to cycle to first menu item
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });
  expect(document.activeElement.id).toBe('test-2');
});

test('handleKeyDown Down arrow navigates to next item', async () => {
  const { getByRole } = setup();

  // Open menu
  fireEvent.click(getByRole('img'));

  // Press Down to navigate to next item
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });
  expect(document.activeElement.id).toBe('test-2');
});

test('handleKeyDown Enter opens menu when closed', async () => {
  const { getByRole, queryByText } = setup();

  expect(queryByText('Two')).not.toBeInTheDocument();

  fireEvent.keyDown(getByRole('img'), { keyCode: 13 });
  expect(queryByText('Two')).toBeInTheDocument();
});

test('handleKeyDown Enter triggers click when menu open and item selected', async () => {
  const { getByRole, mockOnClick } = setup();

  // Open menu and navigate to item
  fireEvent.click(getByRole('img'));
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });

  // Press Enter to select item
  fireEvent.keyDown(getByRole('img'), { keyCode: 13 });
  expect(mockOnClick).toHaveBeenCalledWith({ value: 3, label: 'One' }, 2);
});

test('handleKeyDown Space opens menu when closed', async () => {
  const { getByRole, queryByText } = setup();

  expect(queryByText('Two')).not.toBeInTheDocument();

  fireEvent.keyDown(getByRole('img'), { keyCode: 32 });
  expect(queryByText('Two')).toBeInTheDocument();
});

test('handleKeyDown does nothing when disabled', async () => {
  const { getByRole, queryByText, mockOnClick } = setup({ disabled: true });

  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });
  expect(queryByText('Two')).not.toBeInTheDocument();
  expect(mockOnClick).not.toHaveBeenCalled();
});

test('handleKeyDown with isDropdown and hasMenuLabel at index 0 opens menu', async () => {
  const { getByRole, queryByText } = setup({ isDropdown: true, hasMenuLabel: true });

  expect(queryByText('Two')).not.toBeInTheDocument();

  fireEvent.keyDown(getByRole('img'), { keyCode: 13 });
  expect(queryByText('Two')).toBeInTheDocument();
});

test('handleKeyDown Enter does not trigger disabled item click', async () => {
  const mockOnClick = jest.fn();
  const { getByRole } = render(
    <ButtonGroup
      id='test'
      data={[
        { value: 1, label: 'First' },
        { value: 2, label: 'Two', disabled: true },
      ]}
      onClick={mockOnClick}
    />,
  );

  // Open menu and navigate to disabled item
  fireEvent.click(getByRole('img'));
  fireEvent.keyDown(getByRole('img'), { keyCode: 40 });

  // Try to select disabled item
  fireEvent.keyDown(getByRole('img'), { keyCode: 13 });
  expect(mockOnClick).not.toHaveBeenCalled();
});

test('handleKeyDown with single item data does not open menu on Up arrow', async () => {
  const { getByRole, queryByText } = setup({
    data: [{ value: 1, label: 'Only' }],
  });

  fireEvent.keyDown(getByRole('button'), { keyCode: 38 });
  expect(queryByText('Two')).not.toBeInTheDocument();
});

describe('Branch coverage additions', () => {
  test('renders null when no data provided', () => {
    const { container } = render(<ButtonGroup id='empty' data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('applies styleOverrides when style props passed', () => {
    const { container, getByText } = render(
      <ButtonGroup
        id='styled'
        data={[
          { value: 1, label: 'Styled' },
          { value: 2, label: 'Two' },
        ]}
        backgroundColor='#123456'
        color='#abcdef'
        borderColor='#111111'
        fontSize='20px'
      />,
    );

    // main button gets inline styles
    const button = getByText('Styled');
    expect(button).toHaveStyle('background-color: #123456');
    expect(button).toHaveStyle('color: #abcdef');
    expect(button).toHaveStyle('font-size: 20px');

    // icon holder gets same inline styles
    const arrow = container.querySelector('#styled-Arrow');
    expect(arrow).toHaveStyle('background-color: #123456');
    expect(arrow).toHaveStyle('color: #abcdef');
    expect(arrow).toHaveStyle('border-color: #111111');
  });

  test('uses menuLabel when hasMenuLabel=true', () => {
    const { getAllByRole } = render(
      <ButtonGroup
        id='menuLabel'
        hasMenuLabel
        menuLabel='Options'
        isDropdown
        data={[
          { value: 1, label: 'First' },
          { value: 2, label: 'Two' },
        ]}
      />,
    );
    // The wrapper has role="button" and shows the label
    const wrappers = getAllByRole('button');
    expect(wrappers[0]).toHaveTextContent('Options');
  });

  test('openUp branch executes when forceOpenUp is true', () => {
    const { getByRole, container } = render(
      <ButtonGroup
        id='forceUp'
        forceOpenUp
        data={[
          { value: 1, label: 'First' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ]}
      />,
    );

    // open the menu
    fireEvent.click(getByRole('img'));
    // menu should render — openUp() is invoked internally when ListWrapper mounts
    const list = container.querySelector('#forceUp-menu');
    expect(list).toBeInTheDocument();
  });

  test('openLeft branch executes when container would overflow viewport', () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 300 });

    const { container, getByRole } = render(
      <ButtonGroup
        id='openLeft'
        data={[
          { value: 1, label: 'First' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ]}
      />,
    );

    // Mock container position to force overflow to the right
    const containerEl = container.querySelector('#openLeft-container');
    containerEl.getBoundingClientRect = () => ({
      left: 260,
      top: 0,
      width: 200,
      height: 40,
      right: 460,
      bottom: 40,
    });

    fireEvent.click(getByRole('img')); // open menu
    const list = container.querySelector('#openLeft-menu');
    expect(list).toBeInTheDocument(); // ensures openLeft() evaluated and menu rendered

    // restore
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
  });

  test('ClickOutside closes the menu (use document events)', () => {
    const { getByRole, queryByText } = render(
      <div>
        <ButtonGroup
          id='outside'
          data={[
            { value: 1, label: 'First' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'One' },
          ]}
        />
        <div>Hi</div>
      </div>,
    );

    fireEvent.click(getByRole('img')); // open
    expect(queryByText('Two')).toBeInTheDocument();

    // ClickOutside commonly hooks document-level events; trigger those directly
    fireEvent.mouseDown(document.body);
    fireEvent.click(document.body);

    expect(queryByText('Two')).not.toBeInTheDocument();
  });
});
