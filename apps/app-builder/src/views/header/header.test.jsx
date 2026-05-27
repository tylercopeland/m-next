 
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { matchers } from '@emotion/jest';
import { act } from '@testing-library/react';
import { render } from '../../../testing/TestUtils';
import '@testing-library/jest-dom/extend-expect';
import matchMediaPolyfill from 'mq-polyfill';
import { colors, lightTheme } from '@m-next/styles';
import Header from './header';

expect.extend(matchers);

const setup = (props) => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    id: 'test ',
    appName: 'Contacts',
    screenName: 'View Contacts',
    versionNumber: 27,
    accountingPackage: 'All',
    isDeveloper: false,
    showAppInfo: true,
  };
  const theme = createTheme(lightTheme);
  const utils = render(
    <MemoryRouter
      initialEntries={[
        '/6b954cef-25dd-46f3-aca1-cce46e5834cf/layout/f918170f-33a5-40a3-b1e8-bd1cb35b22ee/f918170f-33a5-40a3-b1e8-bd1cb35b22ee',
      ]}
    >
      <ThemeProvider theme={theme}>
        <Header {...{ ...defaultProps, ...props }} />
      </ThemeProvider>
    </MemoryRouter>,
  );
  return {
    mockOnChange,
    tree: utils.container,
    ...utils,
  };
};

describe('Header', () => {
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    matchMediaPolyfill(window);
    window.resizeTo = function resizeTo(width, height) {
      Object.assign(this, {
        innerWidth: width,
        innerHeight: height,
        outerWidth: width,
        outerHeight: height,
      }).dispatchEvent(new this.Event('resize'));
    };
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    act(() => {
      window.resizeTo(1000, 1000);
    });
    jest.restoreAllMocks();
  });
 
  describe('Functional', () => {
    it('Developer', async () => {
      const { getByRole } = setup({ isDeveloper: true });
      const header = getByRole('heading');
      expect(header).toBeDefined();
      expect(header).toHaveTextContent('Contacts');
      expect(header).toHaveTextContent('/');
      expect(header).toHaveTextContent('View Contacts');
    });

    it('Not Developer', async () => {
      const { getByRole } = setup();

      const header = getByRole('heading');
      expect(header).toBeDefined();
      expect(header).toHaveTextContent('Contacts');
      expect(header).toHaveTextContent('/');
      expect(header).toHaveTextContent('View Contacts');
    });

    it('Draft', async () => {
      const result = setup({ publishStatus: 'Draft' });
      const header = result.getByRole('heading');
      expect(header).toHaveTextContent('Contacts');
      expect(header).toHaveTextContent('/');
      expect(header).toHaveTextContent('View Contacts');

      const text = result.getByText('Draft');
      expect(text).toBeDefined();

      const dot = result.container.querySelector('#pill-dot-header-version-state');
      expect(dot).toBeDefined();
      expect(dot).toHaveStyleRule('background-color', colors.orange);
    });

    it('Published', async () => {
      const result = setup({ publishStatus: 'Published' });
      const header = result.getByRole('heading');
      expect(header).toHaveTextContent('Contacts');
      expect(header).toHaveTextContent('/');
      expect(header).toHaveTextContent('View Contacts');

      const text = result.getByText('Published (Read-only)');
      expect(text).toBeDefined();

      const dot = result.container.querySelector('#pill-dot-header-version-state');
      expect(dot).toBeDefined();
      expect(dot).toHaveStyleRule('background-color', colors.green);
    });

    it('Archived', async () => {
      const result = setup({ publishStatus: 'Archived' });
      const header = result.getByRole('heading');
      expect(header).toHaveTextContent('Contacts');
      expect(header).toHaveTextContent('/');
      expect(header).toHaveTextContent('View Contacts');
      
      const text = result.getByText('Archived (Read-only)');
      expect(text).toBeDefined();

      const dot = result.container.querySelector('#pill-dot-header-version-state');
      expect(dot).toBeDefined();
      expect(dot).toHaveStyleRule('background-color', colors.grey);
    });
  });
});
