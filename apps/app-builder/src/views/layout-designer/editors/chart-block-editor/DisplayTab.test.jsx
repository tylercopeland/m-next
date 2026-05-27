 
import * as React from 'react';
import { matchers } from '@emotion/jest';
 
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { registerLicense } from '@syncfusion/ej2-base';
import { colors } from '@m-next/styles';

import DisplayTab from './DisplayTab';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXdfeHVdQ2ZdWUx+W0Q=');

expect.extend(matchers);

// Mock window.getComputedStyle globally for this test file
beforeAll(() => {
  global.getComputedStyle = jest.fn().mockImplementation((/* elt, pseudoElt */) => (
    {
      'getPropertyValue': (prop) => {
        switch(prop) {
          case 'display':
            return 'block';
          case 'color':
            return 'rgb(0, 0, 0)';
          default:
            return '';
        }
      }
    }
  ));
});

const setup = (props) => {
  const mockChangeChartCallback = jest.fn();
  const defaultProps = {
    chart: 1,
    titles: {
      caption: '',
      yAxis: '',
      xAxis: '',
      series: '',
    },
    color: colors.blue,
    showDataPoints: false,
    expandAll: true,
    onChangeChart: mockChangeChartCallback,
    // onChangeTitles: mockChangeTitlesCallback,
  };

  const utils = render(<DisplayTab {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  Array.from(document.getElementsByClassName('e-slider-input')).forEach((element) => {
    element.setAttribute('name', 'santized');
  });
  return {
    tree,
    mockChangeChartCallback,
    ...utils,
  };
};

describe('DisplayTab', () => {
/*
  describe('Snapshots', () => {
    test('Collapsed', async () => {
      const { tree, getAllByRole } = setup();
      const headers = getAllByRole('img');
      userEvent.click(headers[0]);
      userEvent.click(headers[1]);
      expect(tree).toMatchSnapshot();
    });

    test('Expanded', async () => {
      const { tree,  } = setup();

      expect(tree).toMatchSnapshot();
    });
  }); */
  describe('Functional', () => {
    test('Chart Change', async () => {
      const { getAllByRole, mockChangeChartCallback } = setup();

      // open header
      //   userEvent.click(getAllByRole('img')[0]);

      userEvent.click(getAllByRole('img')[4]);

      expect(mockChangeChartCallback).toHaveBeenCalledWith(4);
      expect(mockChangeChartCallback).toHaveBeenCalledTimes(1);
    });
  });
});
