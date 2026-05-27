/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Address from './Address';

expect.extend(matchers);

describe('Address Block', () => {
  describe('Snapshots', () => {
    it('All Fields', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Loading', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isLoading
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line1', async () => {
      const tree = render(
        <Address
          id='test'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line2', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line3', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line4', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line5', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('City', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing state', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing PostCode', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing country', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          State='Ontario'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing State and Postcode', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing City and State', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          Country='Canada'
          PostalCode='90210'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing City and Postcode', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          Country='Canada'
          State='Ontario'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Missing City, State and Postcode', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          Country='Canada'
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('All Fields editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Loading editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isLoading
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line1 editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line2 editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line3 editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line4 editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing Line5 editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('City editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing state editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing PostCode  editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing country  editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          State='Ontario'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing State and Postcode  editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing City and State  editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          Country='Canada'
          PostalCode='90210'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Missing City and Postcode  editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          Country='Canada'
          State='Ontario'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Missing City, State and Postcode  editable', async () => {
      const tree = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          Country='Canada'
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Functional', () => {
    it('Default', async () => {
      const { getByText } = render(
        <Address
          id='test'
          Line1='123 Fake St'
          Line2='APRT 2222'
          Line3='Box 4'
          Line4='Whatever goes here'
          Line5='Left over'
          City='Toronto'
          Country='Canada'
          State='Ontario'
          PostalCode='90210'
        />,
      );
      const text = getByText('Toronto, Ontario, 90210');
      expect(text).toBeDefined();
    });

    it('Editing', async () => {
      const onChangeMock = jest.fn();
      const { getAllByRole } = render(<Address id='test' isEditable onChange={onChangeMock} />);
      const inputs = getAllByRole('textbox');
      const line1 = '123 Fake St';
      const line2 = 'APRT 2222';
      const line3 = 'Box 4';
      const line4 = 'Whatever goes here';
      const line5 = 'Left over';
      const city = 'Toronto';
      const country = 'Canada';
      const state = 'Ontario';
      const postalCode = '90210';
      act(() => {
        fireEvent.blur(inputs[0], { target: { value: line1 } });
      });

      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: null,
        Line3: null,
        Line4: null,
        Line5: null,
        City: undefined,
        State: undefined,
        PostalCode: undefined,
        Country: undefined,
      });

      act(() => {
        fireEvent.change(inputs[0], { target: { value: `${line1}\n${line2}` } });
        fireEvent.blur(inputs[0], { target: { value: `${line1}\n${line2}` } });
      });

      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: line2,
        Line3: null,
        Line4: null,
        Line5: null,
        City: undefined,
        State: undefined,
        PostalCode: undefined,
        Country: undefined,
      });

      act(() => {
        fireEvent.blur(inputs[0], { target: { value: `${line1}\n${line2}\n${line3}` } });
      });

      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: line2,
        Line3: line3,
        Line4: null,
        Line5: null,
        City: undefined,
        State: undefined,
        PostalCode: undefined,
        Country: undefined,
      });

      act(() => {
        fireEvent.blur(inputs[0], { target: { value: `${line1}\n${line2}\n${line3}\n${line4}` } });
      });

      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: line2,
        Line3: line3,
        Line4: line4,
        Line5: null,
        City: undefined,
        State: undefined,
        PostalCode: undefined,
        Country: undefined,
      });

      act(() => {
        fireEvent.blur(inputs[0], { target: { value: `${line1}\n${line2}\n${line3}\n${line4}\n${line5}` } });
      });

      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: line2,
        Line3: line3,
        Line4: line4,
        Line5: line5,
        City: undefined,
        State: undefined,
        PostalCode: undefined,
        Country: undefined,
      });
      act(() => {
        fireEvent.change(inputs[1], { target: { value: city } });
      });

      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: line2,
        Line3: line3,
        Line4: line4,
        Line5: line5,
        City: city,
        State: undefined,
        PostalCode: undefined,
        Country: undefined,
      });

      act(() => {
        fireEvent.change(inputs[2], { target: { value: state } });
      });
      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: line2,
        Line3: line3,
        Line4: line4,
        Line5: line5,
        City: city,
        State: state,
        PostalCode: undefined,
        Country: undefined,
      });
      act(() => {
        fireEvent.change(inputs[3], { target: { value: postalCode } });
      });
      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: line2,
        Line3: line3,
        Line4: line4,
        Line5: line5,
        City: city,
        State: state,
        PostalCode: postalCode,
        Country: undefined,
      });
      act(() => {});
      fireEvent.change(inputs[4], { target: { value: country } });

      expect(onChangeMock).toHaveBeenCalledWith({
        Line1: line1,
        Line2: line2,
        Line3: line3,
        Line4: line4,
        Line5: line5,
        City: city,
        State: state,
        PostalCode: postalCode,
        Country: country,
      });
    });
  });
});
