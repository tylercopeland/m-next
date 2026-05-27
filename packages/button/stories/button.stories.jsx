import React from 'react';
import Button from '../src';

export default {
  component: Button,
  title: 'm-one/Button',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/OxikbbciwluLzZ4hTdUTWr/Design-System?type=design&node-id=21%3A86&t=9PD8SbHk2QC8A4EN-1',
    },
  },
};

const variants = ['primary', 'link', 'ghost', 'plain', 'radio', 'radio-selected'];

export function ButtonVariants() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {variants.map((variant) => (
        <Button key={variant} id={`variant-${variant}`} buttonStyle={variant} value={variant} />
      ))}
    </div>
  );
}

export function DisabledButton() {
  return <Button id='disabled-button' disabled value='Disabled' />;
}

export function ButtonWithIcon() {
  return (
    <div>
      <Button
        id='left-icon-button'
        icon={{ name: 'email', size: 16, color: 'white', position: 'left' }}
        value='Left Icon'
      />

      <Button
        id='right-icon-button'
        icon={{ name: 'email', size: 16, color: 'white', position: 'right' }}
        value='Right Icon'
      />
    </div>
  );
}

export function DangerousHTMLButton() {
  return <Button id='dangerous-button' isDangerous value='<strong>Dangerous HTML</strong>' />;
}

export function CustomStylingButton() {
  return (
    <Button id='custom-styling-button' style={{ backgroundColor: 'purple', color: 'white' }} value='Custom Styling' />
  );
}
