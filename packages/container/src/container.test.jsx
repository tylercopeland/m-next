/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { matchers } from '@emotion/jest';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from '@m-next/styles';

import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Container from './container';

expect.extend(matchers);

describe('Container', () => {
  describe('Snapshots', () => {
    it('Child Node', async () => {
      const tree = render(
        <Container id='test'>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Dark Theme', async () => {
      const tree = render(
        <ThemeProvider theme={darkTheme}>
          <Container isVisible id='test'>
            <img src='catpic.jpg' alt='cat' />
          </Container>
        </ThemeProvider>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('borderless', async () => {
      const tree = render(
        <Container isVisible id='test' borderless>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('isRound', async () => {
      const tree = render(
        <Container isVisible id='test' isRound>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('not isRound', async () => {
      const tree = render(
        <Container isVisible id='test' isRound={false}>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Is loading', async () => {
      const tree = render(
        <Container isLoading isVisible id='test'>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Is loading scrollable', async () => {
      const tree = render(
        <Container isLoading isVisible id='test' scrollable>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Is hidden', async () => {
      const tree = render(
        <Container isVisible={false} id='test'>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Click Event', async () => {
      const mockPrimaryCallback = jest.fn();
      const { getByRole, container } = render(
        <Container onClick={mockPrimaryCallback} isVisible id='test'>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      );
      expect(container).toMatchSnapshot();
      const text = getByRole('img');
      expect(text).toBeDefined();
      fireEvent.click(text);
      expect(mockPrimaryCallback.mock.calls).toHaveLength(1);
    });

    it('Set width', async () => {
      const tree = render(
        <Container isVisible width='500px' id='test'>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('scrollable', async () => {
      const tree = render(
        <Container id='test' scrollable>
          <img src='catpic.jpg' alt='cat' />
        </Container>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });

  let simpleBarRef;
  let setRecalcTimer;

  beforeEach(() => {
    simpleBarRef = { current: { recalculate: jest.fn() } };
    setRecalcTimer = jest.fn((callback) => setTimeout(callback, 0));
    jest.spyOn(React, 'useRef').mockReturnValue(simpleBarRef);
    jest.spyOn(React, 'useState').mockReturnValue([null, setRecalcTimer]);
  });

  describe('Handle Resize', () => {
    it('should trigger recalculate on simpleBarRef when resize occurs', () => {
      jest.useFakeTimers();
      render(<Container />);
      fireEvent(window, new Event('resize'));
      act(() => {
        jest.runAllTimers();
      });
      expect(simpleBarRef.current.recalculate).toHaveBeenCalled();
    });
  });
});
