import React from 'react';
import SvgIcon from '../src';
import iconPaths from '../src/icon-paths';

export default {
  component: SvgIcon,
  title: 'm-one/SvgIcon',
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
      url: 'https://www.figma.com/file/xnh6ZMW6oZ1pwWgKzfROqJ/Version-Managment?node-id=11%3A4',
    },
  },
};

const additionalIcons = [
  'count-of',
  'settings',
  'settings2',
  'filter-group',
  'expand-V4',
  'circle-plus-V4',
  'arrow-right-alt',
  'arrow-left-alt',
  'compare',
  'check-circle',
  'check-circle-filled',
  'grid-V4',
  'arrow-up-down',
  'arrow-up-V4',
  'arrow-down-V4',
  'drag-V4',
  'filter-V4',
  'eye-open-V4',
  'eye-closed-V4',
  'tabs-V4',
  'tabs-condensed-V4',
  'link-2',
  'plus-V4',
  'screens-V4',
  'screen-V4',
  'font-color',
  'align-left',
  'align-center',
  'align-right',
  'text-align-left',
  'text-align-center',
  'text-align-right',
  'font-weight-regular',
  'font-weight-bold',
  'font-weight-xbold',
  'trash-V4',
  'edit-V4',
  'reset-V4',
  'fill-color',
  'horizontal',
  'vertical',
  'portrait-image',
  'landscape-image',
  'checklist',
  'user',
  'calendar-V4',
  'mission-graphic',
  'palette',
  'back',
  'book',
  'ai-icon',
  'ai-gradient-icon',
  'files-folder',
  'home',
  'pages',
  'ai-chat',
  'box-rounded',
  'close-compact',
  'edit-pen',
  'target-V4',
];

function Template(args) {
  return <SvgIcon {...args} />;
}
export const SimpleIcon = Template.bind({});
SimpleIcon.args = {
  name: 'count-of',
  size: 24,
};

function TemplateMap() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, overflow: 'scroll', height: 400 }}>
      {iconPaths.icons.map((icon) => (
        <>
          {icon.properties.name.split(',').map((name) => (
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexDirection: 'column',
                width: 64,
                alignItems: 'center',
              }}
            >
              <SvgIcon key={name} name={name} size={24} />
              <div style={{ wordBreak: ' break-word', textAlign: 'center' }}>{name}</div>
            </div>
          ))}
        </>
      ))}

      {additionalIcons.map((name) => (
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexDirection: 'column',
            width: 64,
            alignItems: 'center',
          }}
        >
          <SvgIcon key={name} name={name} size={24} />
          <div style={{ wordBreak: ' break-word', textAlign: 'center' }}>{name}</div>
        </div>
      ))}
    </div>
  );
}
export const IconList = TemplateMap.bind({});
