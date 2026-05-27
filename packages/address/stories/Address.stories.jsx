import Address from '../src';

export default {
  component: Address,
  title: 'm-one/Address',
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
      url: 'https://www.figma.com/file/5aK6YZifVq9fBtj7mlUTsi/Customization-V2?node-id=2224%3A52561',
    },
  },
};

export const ReadOnly = {
  args: {
    id: 'test',
    Line1: '123 Fake St',
    Line2: 'APRT 2222',
    Line3: 'Box 4',
    Line4: 'Whatever goes here',
    Line5: 'Left over',
    City: 'Toronto',
    Country: 'Canada',
    State: 'Ontario',
    PostalCode: '90210',
    isLoading: false,
  },
};

export const Editable = {
  args: {
    id: 'test',
    Line1: '123 Fake St',
    Line2: 'APRT 2222',
    Line3: 'Box 4',
    Line4: 'Whatever goes here',
    Line5: 'Left over',
    City: 'Toronto',
    Country: 'Canada',
    State: 'Ontario',
    PostalCode: '90210',
    isLoading: false,
    isEditable: true,
  },
};
