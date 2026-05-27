import React from 'react';
import Pill from '../src';

export default {
  component: Pill,
  title: 'm-one/Pill',
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
    },
  },
};

function Template(args) {
  return <Pill {...args} />;
}
export const PillWithoutDot = Template.bind({});
PillWithoutDot.args = {
  size: 'narrow',
  colorScheme: 'blue',
  isMobile: false,
  children: 'Hello',
  onDelete: () => {},
};

export const PillWithDot = Template.bind({});
PillWithDot.args = {
  size: 'narrow',
  colorScheme: 'grey',
  isMobile: false,
  children: 'Hello',
  leadIcon: {
    name: 'dot',
  },
  onDelete: () => {},
};

export const PillWithProfileIcon = Template.bind({});
PillWithProfileIcon.args = {
  size: 'regular',
  colorScheme: 'transparent',
  variant: 'ghost',
  isMobile: false,
  children: 'John Doe',
  textStyle: { fontWeight: '400' },
  profileIcon: {
    name: 'JD-5.mci',
  },
  onDelete: () => {},
};

const colors = ['blue', 'green', 'fuchsia', 'grey', 'yellow', 'red', 'purple', 'orange', 'teal', 'transparent'];

export function Colors() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {colors.map((variant) => (
        <Pill key={variant} id={`color-${variant}`} colorScheme={variant} size='narrow'>
          {variant}
        </Pill>
      ))}
    </div>
  );
}

const variants = ['subtle', 'solid', 'ghost'];

export function Variants() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {variants.map((variant) => (
        <Pill
          key={variant}
          id={`color-${variant}`}
          variant={variant}
          size='narrow'
          colorScheme={variant === 'ghost' ? 'transparent' : 'blue'}
        >
          {variant}
        </Pill>
      ))}
    </div>
  );
}

export const PillWithTrailingPlus = Template.bind({});
PillWithTrailingPlus.args = {
  colorScheme: 'transparent',
  variant: 'ghost',
  isMobile: false,
  children: 'Add filter',
  bold: false,
  trailIcon: {
    name: 'plus',
    size: 12,
  },
  fontSize: 14,
  onDelete: null,
};
