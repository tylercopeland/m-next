/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';

import Stepper from './stepper';

expect.extend(matchers);

describe('StepperItem', () => {
  describe('Snapshots', () => {
    it('Default', async () => {
      const tree = render(<Stepper steps={4} activeStep={1} displayLabel />).container;
      expect(tree).toMatchSnapshot();
    });
    it('displayLabel completed step', async () => {
      const tree = render(<Stepper steps={1} activeStep={1} displayLabel />).container;
      expect(tree).toMatchSnapshot();
    });
    it('displayLabel two steps', async () => {
      const tree = render(<Stepper steps={2} activeStep={1} displayLabel />).container;
      expect(tree).toMatchSnapshot();
    });
    it('displayLabel three steps', async () => {
      const tree = render(<Stepper steps={3} activeStep={1} displayLabel />).container;
      expect(tree).toMatchSnapshot();
    });
    it('alternativeLabel', async () => {
      const tree = render(<Stepper steps={4} activeStep={1} displayLabel alternativeLabel />).container;
      expect(tree).toMatchSnapshot();
    });
    it('not displayLabel alternativeLabel', async () => {
      const tree = render(<Stepper steps={4} activeStep={1} alternativeLabel />).container;
      expect(tree).toMatchSnapshot();
    });
    it('not displayLabel not alternativeLabel', async () => {
      const tree = render(<Stepper steps={4} activeStep={1} />).container;
      expect(tree).toMatchSnapshot();
    });
    it('displayLabel customIcon', async () => {
      const tree = render(<Stepper steps={4} activeStep={1} displayLabel iconName='user' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('not displayLabel not alternativeLabel customIcon', async () => {
      const tree = render(<Stepper steps={4} activeStep={1} iconName='user' />).container;
      expect(tree).toMatchSnapshot();
    });
  });
});
