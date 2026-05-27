import ContentCard from '../src/ContentCard';

export default {
  component: ContentCard,
  title: 'm-one/ContentCard',
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
  return <ContentCard {...args} />;
}

export const Complete = Template.bind({});
Complete.args = {
  id: 'demo-card-1',
  title: 'Getting Started',
  description: 'Preview and launch media within your app using this card.',
  timeToComplete: '5',
  buttonText: 'Launch Demo',
  icon: 'CircleCheck',
  isComplete: true,
  iconSize: 16,
  iconColor: 'green',
};

export const WithLongDescription = Template.bind({});
WithLongDescription.args = {
  id: 'demo-card-2',
  title: 'Advanced Media',
  description:
    'This card demonstrates a longer description for advanced media preview and launching. You can use this to showcase more details about the content.',
  timeToComplete: '10',
  buttonText: 'Preview Media',
};

export const WithoutTime = Template.bind({});
WithoutTime.args = {
  id: 'demo-card-3',
  title: 'No Time Estimate',
  description: 'A card without a time to complete value.',
  buttonText: 'Open',
};

export const WithThumbnail = Template.bind({});
WithThumbnail.args = {
  id: 'demo-card-4',
  title: 'With Thumbnail',
  description: 'This card displays a custom thumbnail image.',
  timeToComplete: '7',
  buttonText: 'View',
  thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  icon: 'CircleCheck',
  iconSize: 16,
  iconColor: 'green',
  isComplete: true,
};
