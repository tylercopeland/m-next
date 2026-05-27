import PhoneInput from '../src';

export default {
  component: PhoneInput,
  title: 'm-one/phone-input',
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
      url: 'https://www.figma.com/file/mnmtYew8goUUtnyZN32LQT/Portal?node-id=1586%3A21731&t=OGnVDaJqHm3RAF41-0',
    },
  },
};

/*
const Template: ComponentStory<typeof PhoneInput> = function Template(args: PhoneInputProps) {
  return <PhoneInput {...args} />;
}
*/

export const Empty = {
  args: {},
};

export const DefaultCountry = {
  args: {
    defaultCountry: 'us',
  },
};

export const WithPhone = {
  args: {
    value: '+14372207682',
  },
};

export const DisableSearch = {
  args: {
    enableSearch: false,
  },
};

