/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import { colors } from '@m-next/styles';
import '@testing-library/jest-dom/extend-expect';
import Button from './button';

expect.extend(matchers);

describe('Button', () => {
  describe('Functional', () => {
    it('Defaults', async () => {
      const { getByText, getByRole } = render(<Button id='test' value='Test' />);
      expect(getByText('Test')).toBeDefined();
      expect(getByRole('button')).toHaveTextContent('Test');
    });

    test('Onclick', async () => {
      const onClick = jest.fn();
      const img = render(<Button id='test' value='Test' onClick={onClick} />);

      fireEvent.click(img.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
      img.rerender(<Button id='test' value='Test' onClick={onClick} disabled />);
      fireEvent.click(img.getByRole('button'));
      img.rerender(<Button id='test' value='Test' />);
      fireEvent.click(img.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
  describe('Snapshots', () => {
    it('Default', async () => {
      const tree = render(<Button id='test' value='Test' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('IsMobile', async () => {
      const tree = render(<Button id='test' value='Test' isMobile />).container;
      expect(tree).toMatchSnapshot();
    });
    it('IsMobile not isV4Design', async () => {
      const tree = render(<Button id='test' value='Test' isMobile={false} />).container;
      expect(tree).toMatchSnapshot();
    });
    it('not isV4Design', async () => {
      const tree = render(<Button id='test' value='Test' isV4Design={false} width={128} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Icon only', async () => {
      const tree = render(<Button id='test' icon={{ name: 'caret-down', size: 24, position: 'right' }} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Icon Right', async () => {
      const tree = render(
        <Button id='test' value='Test' icon={{ name: 'caret-down', size: 24, position: 'right' }} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Icon Left', async () => {
      const tree = render(
        <Button id='test' value='Test' icon={{ name: 'caret-down', size: 24, position: 'left' }} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Icon Right not isV4Design', async () => {
      const tree = render(
        <Button id='test' value='Test' isV4Design={false} icon={{ name: 'caret-down', size: 24, position: 'right' }} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Icon Left not isV4Design', async () => {
      const tree = render(
        <Button id='test' value='Test' isV4Design={false} icon={{ name: 'caret-down', size: 24, position: 'left' }} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Style Ghost', async () => {
      const tree = render(<Button id='test' value='Test' buttonStyle='ghost' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Style plain', async () => {
      const tree = render(<Button id='test' value='Test' buttonStyle='plain' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Style link', async () => {
      const tree = render(<Button id='test' value='Test' buttonStyle='link' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Style link V3', async () => {
      const tree = render(<Button id='test' value='Test' buttonStyle='link' isV4Design={false} />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Style v4-primary', async () => {
      const tree = render(<Button id='test' value='Test' buttonStyle='v4-primary' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Style radio', async () => {
      const tree = render(<Button id='test' value='Test' buttonStyle='radio' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Style radio-selected', async () => {
      const tree = render(<Button id='test' value='Test' buttonStyle='radio-selected' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Classes', async () => {
      const tree = render(
        <Button
          id='test'
          value='Test'
          width={128}
          classes={['button-purple', 'button-border-2px', 'white']}
          isV4Design={false}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Width Fixed', async () => {
      const tree = render(<Button id='test' value='Test' width={64} widthType='fixed' isV4Design={false} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Width Full', async () => {
      const tree = render(<Button id='test' value='Test' width={64} widthType='full' isV4Design={false} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Width Full v4', async () => {
      const tree = render(<Button id='test' value='Test' width={64} widthType='full' isV4Design />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Custom style', async () => {
      const tree = render(
        <Button
          id='test'
          value='Test'
          width={64}
          widthType='fixed'
          isV4Design
          backgroundColor={colors.green}
          color={colors.red}
          borderColor={colors.blue}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Visible', async () => {
      const tree = render(<Button id='test' value='Test' visible={false} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Visible not isV4Design', async () => {
      const tree = render(<Button id='test' value='Test' visible={false} isV4Design={false} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Small', async () => {
      const tree = render(<Button id='test' value='Test' size='small' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('isDangerous with isV4Design', async () => {
      const tree = render(<Button id='test' value='Test' isDangerous isV4Design />).container;
      expect(tree).toMatchSnapshot();
    });

    it('isDangerous without isV4Design', async () => {
      const tree = render(<Button id='test' value='Test' isDangerous isV4Design={false} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('with tooltip', async () => {
      const tree = render(<Button id='test' value='Test' tooltip='Tooltip text' tooltipId='tooltip-id' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('with font size', async () => {
      const tree = render(<Button id='test' value='Test' fontSize='16px' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('with forwardRef', async () => {
      const ref = React.createRef();
      const tree = render(<Button id='test' value='Test' forwardRef={ref} />).container;
      expect(tree).toMatchSnapshot();
      expect(ref.current).not.toBeNull();
    });

    it('with color name from colors object', async () => {
      const tree = render(<Button id='test' value='Test' color='green' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('with backgroundColor as direct color value', async () => {
      const tree = render(<Button id='test' value='Test' backgroundColor='#ff0000' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('with custom style prop', async () => {
      const customStyle = { margin: '10px', padding: '5px' };
      const tree = render(<Button id='test' value='Test' style={customStyle} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('with hover color when color is set', async () => {
      const tree = render(<Button id='test' value='Test' color={colors.blue} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('with hover background color when backgroundColor is set and buttonStyle is primary', async () => {
      const tree = render(
        <Button id='test' value='Test' backgroundColor={colors.green} buttonStyle='primary' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('with hover colors for custom color values', async () => {
      const tree = render(
        <Button id='test' value='Test' color='#ff5733' backgroundColor='#33ff57' buttonStyle='primary' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('with hover background color excluded for white background', async () => {
      const tree = render(<Button id='test' value='Test' backgroundColor='white' buttonStyle='primary' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('with hover background color excluded for non-primary button style', async () => {
      const tree = render(<Button id='test' value='Test' backgroundColor={colors.red} buttonStyle='ghost' />).container;
      expect(tree).toMatchSnapshot();
    });
  });
});
