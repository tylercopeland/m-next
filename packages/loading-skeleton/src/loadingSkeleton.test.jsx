/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { render } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import '@testing-library/jest-dom/extend-expect';
import LoadingSkeleton from './loadingSkeleton';

expect.extend(matchers);

describe('LoadingSkeleton', () => {
  describe('Functional', () => {});

  describe('Snapshots', () => {
    test('Defaults', async () => {
      const tree = render(<LoadingSkeleton />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Single Cirlce', async () => {
      const tree = render(<LoadingSkeleton circle count={1} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('3 fat lines', async () => {
      const tree = render(<LoadingSkeleton count={3} height={48} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Multiple Loaders', async () => {
      const tree = render(
        <div>
          <LoadingSkeleton circle count={1} /> <LoadingSkeleton count={3} height={48} />
        </div>,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });
});
