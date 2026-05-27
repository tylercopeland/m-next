/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from '@m-next/styles';
import Typeography from './Typeography';
import TextLine from './TextLine';
import Text from './Text';
import Header from './Header';
import TextDiv from './TextDiv';

expect.extend(matchers);

describe('Typeography', () => {
  describe('functional', () => {
    it('throws error when heading is nested inside another heading', () => {
      // Suppress console.error for this test since we expect an error
      const consoleError = jest.spyOn(console, 'error');
      consoleError.mockImplementation(() => {});
      render(
        <Header id='test' variant='h2'>
          Parent Header
          <Header id='test2' variant='h2'>
            This should be and error
          </Header>
        </Header>,
      );
      expect(consoleError).toHaveBeenCalled();

      // Clean up console mock
      consoleError.mockRestore();
    });

    it('allows non-header elements to be nested in headers', () => {
      expect(() => {
        render(
          <Header id='test' variant='h2'>
            Parent Header
            <Text id='test2'>This is allowed</Text>
          </Header>,
        );
      }).not.toThrow();
    });
  });
  describe('Snapshots', () => {
    it('TextLine', async () => {
      const tree = render(
        <TextLine id='test' gutterBottom={0}>
          This is only a test
        </TextLine>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('TextLine mobile', async () => {
      const tree = render(
        <TextLine id='test' gutterBottom={0} isMobile>
          This is only a test
        </TextLine>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('TextLine mobile v4', async () => {
      const tree = render(
        <TextLine id='test' gutterBottom={0} isMobile v4>
          This is only a test
        </TextLine>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Text', async () => {
      const tree = render(
        <Text id='test' gutterBottom={0}>
          This is only a test
        </Text>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Text mobile', async () => {
      const tree = render(
        <Text id='test' gutterBottom={0} isMobile>
          This is only a test
        </Text>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Text mobile v4', async () => {
      const tree = render(
        <Text id='test' gutterBottom={0} isMobile isV4>
          This is only a test
        </Text>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Div', async () => {
      const tree = render(
        <TextDiv id='test' gutterBottom={0}>
          This is only a test
        </TextDiv>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Default', async () => {
      const tree = render(<Typeography id='test'>This is only a test</Typeography>).container;
      expect(tree).toMatchSnapshot();
    });
    it('V4', async () => {
      const tree = render(
        <Typeography id='test' isV4>
          This is only a test
        </Typeography>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('body2', async () => {
      const tree = render(
        <Typeography id='test' variant='body2'>
          This is only a test
        </Typeography>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h1', async () => {
      let tree = render(<Header id='test'>This is only a test</Header>).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Header id='test' variant='h1' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h2', async () => {
      let tree = render(
        <Header id='test' variant='h2'>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Header id='test' variant='h2' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h3', async () => {
      let tree = render(
        <Header id='test' variant='h3'>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Header id='test' variant='h3' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h4', async () => {
      let tree = render(
        <Header id='test' variant='h4'>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
      tree = render(
        <Header id='test' variant='h4' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Themed hq', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Header id='test'>This is only a test</Header>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Themed h2', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Header id='test' variant='h2'>
            This is only a test
          </Header>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Themed h3', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Header id='test' variant='h3'>
            This is only a test
          </Header>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Themed h4', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Header id='test' variant='h4'>
            This is only a test
          </Header>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Themed h5', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Header id='test' variant='h5'>
            This is only a test
          </Header>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Themed h6', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Header id='test' variant='h6'>
            This is only a test
          </Header>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Themed Text', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Text id='test'>This is only a test</Text>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Themed TextLine', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <TextLine id='test'>This is only a test</TextLine>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('TextLine highlight', async () => {
      const tree = render(
        <TextLine id='test' gutterBottom={0} tooltipHighlighting>
          This is only a test
        </TextLine>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Text highlight', async () => {
      const tree = render(
        <Text id='test' gutterBottom={0} tooltipHighlighting>
          This is only a test
        </Text>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Div  highlight', async () => {
      const tree = render(
        <TextDiv id='test' gutterBottom={0} tooltipHighlighting>
          This is only a test
        </TextDiv>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Default  highlight', async () => {
      const tree = render(
        <Typeography id='test' tooltipHighlighting>
          This is only a test
        </Typeography>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('body2  highlight', async () => {
      const tree = render(
        <Typeography id='test' variant='body2' tooltipHighlighting>
          This is only a test
        </Typeography>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h1  highlight', async () => {
      let tree = render(
        <Header id='test' tooltipHighlighting>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Header id='test' variant='h1' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h2  highlight', async () => {
      let tree = render(
        <Header id='test' variant='h2' tooltipHighlighting>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Header id='test' variant='h2' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h3  highlight', async () => {
      let tree = render(
        <Header id='test' variant='h3' tooltipHighlighting>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Header id='test' variant='h3' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h4  highlight', async () => {
      let tree = render(
        <Header id='test' variant='h4' tooltipHighlighting>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();

      tree = render(
        <Header id='test' variant='h4' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('h5  highlight', async () => {
      let tree = render(
        <Header id='test' variant='h5' tooltipHighlighting>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
      tree = render(
        <Header id='test' variant='h5' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('h6  highlight', async () => {
      let tree = render(
        <Header id='test' variant='h6' tooltipHighlighting>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
      tree = render(
        <Header id='test' variant='h6' gutterBottom={4}>
          This is only a test
        </Header>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Themed h5 highlight', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Header id='test' variant='h5' tooltipHighlighting>
            This is only a test
          </Header>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Themed h6 highlight', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Header id='test' variant='h6' tooltipHighlighting>
            This is only a test
          </Header>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Themed Text highlight', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Text id='test' tooltipHighlighting>
            This is only a test
          </Text>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Themed TextLine highlight', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <TextLine id='test' tooltipHighlighting>
            This is only a test
          </TextLine>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Functional', () => {
    test('Default', async () => {
      const { getByText } = render(<Typeography id='test'>This is only a test</Typeography>);
      await waitFor(() => {
        const text = getByText('This is only a test');
        expect(text).toBeInTheDocument();
      });
    });

    test('With tooltip', async () => {
      const { getByText } = render(
        <Typeography id='test' tooltip='Tooltip text'>
          This is only a test
        </Typeography>,
      );
      await waitFor(() => {
        const text = getByText('This is only a test');
        expect(text).toBeInTheDocument();
        expect(text).toHaveAttribute('data-tooltip-html', 'Tooltip text');
      });
    });

    test('With ref', async () => {
      const { getByText } = render(
        <Typeography id='test' ref={React.createRef()}>
          This is only a test
        </Typeography>,
      );
      await waitFor(() => {
        const text = getByText('This is only a test');
        expect(text).toBeInTheDocument();
      });
    });

    test('With ref passed as function', async () => {
      let refNode = null;
      const refCallback = (node) => {
        refNode = node;
      };

      const { getByText } = render(
        <Typeography id='test' ref={refCallback}>
          This is only a test
        </Typeography>,
      );

      await waitFor(() => {
        const text = getByText('This is only a test');
        expect(text).toBeInTheDocument();
        expect(refNode).toBe(text); // Verify the ref callback was called with the DOM node
      });
    });

    test('With onClick', async () => {
      const handleClick = jest.fn();
      const { getByText } = render(
        <Typeography id='test' onClick={handleClick}>
          This is only a test
        </Typeography>,
      );
      const text = getByText('This is only a test');
      text.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
