/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import { matchers } from '@emotion/jest';

import Gallery from './gallery';

expect.extend(matchers);
let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('Gallery', () => {
  it('should perform action (only) on actionable item click', () => {
    const action1 = jest.fn();
    const action2 = jest.fn();

    const sut = render(
      <Gallery items={[{ id: '01', action: action1 }, { id: '02', action: action2 }, { id: '03' }]} />,
    );

    act(() => {
      fireEvent.click(sut.getAllByRole('figure')[0]);
    });
    act(() => {
      fireEvent.click(sut.getAllByRole('figure')[2]);
    });

    expect(action1).toHaveBeenCalledTimes(1);
    expect(action2).toHaveBeenCalledTimes(0);
  });

  it('should not perform action on actionable item click when disabled', () => {
    const action1 = jest.fn();
    const action2 = jest.fn();

    const sut = render(
      <Gallery disabled items={[{ id: '01', action: action1 }, { id: '02', action: action2 }, { id: '03' }]} />,
    );

    act(() => {
      fireEvent.click(sut.getAllByRole('figure')[0]);
    });
    act(() => {
      fireEvent.click(sut.getAllByRole('figure')[2]);
    });

    expect(action1).toHaveBeenCalledTimes(0);
    expect(action2).toHaveBeenCalledTimes(0);
  });

  describe('should render correctly when', () => {
    it('is empty', () => {
      act(() => {
        render(<Gallery />, container);
      });

      expect(container.innerHTML).toMatchSnapshot();
    });

    describe('has items', () => {
      it('without urls', () => {
        act(() => {
          render(<Gallery items={[{ id: '01' }, { id: '02' }, { id: '03' }]} />, container);
        });

        expect(container.innerHTML).toMatchSnapshot();
      });

      it('without urls and with modified empty image text', () => {
        act(() => {
          render(
            <Gallery missingImageText='no url provided' items={[{ id: '01' }, { id: '02' }, { id: '03' }]} />,
            container,
          );
        });

        expect(container.innerHTML).toMatchSnapshot();
      });

      it('with urls', () => {
        act(() => {
          render(
            <Gallery
              items={[
                { id: '01', imageURL: 'http://www.example.com/image1.jpg' },
                { id: '02', imageURL: 'http://www.example.com/image2.jpg' },
                { id: '03', imageURL: 'http://www.example.com/image3.jpg' },
              ]}
            />,
            container,
          );
        });

        expect(container.innerHTML).toMatchSnapshot();
      });

      it('with urls and with captions', () => {
        act(() => {
          render(
            <Gallery
              items={[
                { id: '01', imageURL: 'http://www.example.com/image1.jpg', caption: 'Image 1' },
                { id: '02', imageURL: 'http://www.example.com/image2.jpg', caption: 'Image 2' },
                { id: '03', imageURL: 'http://www.example.com/image3.jpg', caption: 'Image 3' },
              ]}
            />,
            container,
          );
        });

        expect(container.innerHTML).toMatchSnapshot();
      });

      it('with different size', () => {
        act(() => {
          render(
            <Gallery
              size={256}
              items={[
                { id: '01', imageURL: 'http://www.example.com/image1.jpg', caption: 'Image 1' },
                { id: '02', imageURL: 'http://www.example.com/image2.jpg', caption: 'Image 2' },
                { id: '03', imageURL: 'http://www.example.com/image3.jpg', caption: 'Image 3' },
              ]}
            />,
            container,
          );
        });

        expect(container.innerHTML).toMatchSnapshot();
      });
    });

    it('is loading', () => {
      act(() => {
        render(<Gallery isLoading />, container);
      });

      expect(container.innerHTML).toMatchSnapshot();
    });

    it('is loading with custom skeleton item count', () => {
      act(() => {
        render(<Gallery isLoading loadingItemCount={10} />, container);
      });

      expect(container.innerHTML).toMatchSnapshot();
    });

    it('with tiff files', () => {
      act(() => {
        render(
          <Gallery
            items={[
              { id: '01', imageURL: 'http://www.example.com/image1.tiff' },
              { id: '02', imageURL: 'http://www.example.com/image2.jpg' },
              { id: '03', imageURL: 'http://www.example.com/image3.jpg' },
            ]}
          />,
          container,
        );
      });

      expect(container.innerHTML).toMatchSnapshot();
    });
  });
});
