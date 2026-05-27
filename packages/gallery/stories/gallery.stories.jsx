import React from 'react';
import Gallery from '../src';

export default {
  component: Gallery,
  title: 'm-one/Gallery',
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
      url: 'https://www.figma.com/file/KWoAro4s1GLTA5RSoB1FUK/Email-Campaigns?node-id=833%3A23482',
    },
  },
};

function Template(args) {
  return <Gallery {...args} />;
}

export const WithCaptions = Template.bind({});
WithCaptions.args = {
  items: [
    {
      id: '001',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/8fe04df45a22b63156ebabbb064fcd5e.jpg',
      caption: 'Burke',
    },
    {
      id: '002',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/7501e5d4da87ac39d782741cd794002d.jpg',
      caption: 'Crusher',
    },
    {
      id: '003',
      imageURL: 'https://pbs.twimg.com/media/FY1VHAlX0AAj5ZA.jpg',
      caption: 'Crusher',
    },
    {
      id: '004',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/5705e1164a8394aace6018e27d20d237.jpg',
      caption: 'Data',
    },
    {
      id: '005',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/aa169b49b583a2b5af89203c2b78c67c.jpg',
      caption: 'La Forge',
    },
    {
      id: '006',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/1aa48fc4880bb0c9b8a3bf979d3b917e.jpg',
      caption: "O'Brien",
    },
    {
      id: '007',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/ae5e3ce40e0404a45ecacaaf05e5f735.jpg',
      caption: 'Picard',
    },
    {
      id: '008',
      imageURL: 'https://pbs.twimg.com/media/E9HZtfiXsAISn7-.jpg',
      caption: 'Pulaski',
    },
    {
      id: '009',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/18ead4c77c3f40dabf9735432ac9d97a.jpg',
      caption: 'Riker',
    },
    {
      id: '010',
      imageURL: 'https://pbs.twimg.com/media/FQ6Q8n_XsAA4zUZ.jpg',
      caption: 'Ro',
    },
    {
      id: '011',
      imageURL: 'https://pbs.twimg.com/media/E1b7EWSXMAgrPLc.jpg',
      caption: 'Shelby',
    },
    {
      id: '012',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/31857b449c407203749ae32dd0e7d64a.jpg',
      caption: 'Troi',
    },
    {
      id: '013',
      imageURL: 'https://pbs.twimg.com/media/FejYjw6XgAESL46.jpg',
      caption: 'Worf',
    },
    {
      id: '014',
      imageURL: 'https://pbs.twimg.com/media/FhNsPOZWYAceiwM.jpg',
      caption: 'Yar',
    },
  ],
};

export const WithTooltips = Template.bind({});
WithTooltips.args = {
  items: [
    {
      id: '001',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/8fe04df45a22b63156ebabbb064fcd5e.jpg',
      tooltip: 'Burke',
    },
    {
      id: '002',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/7501e5d4da87ac39d782741cd794002d.jpg',
      tooltip: 'Crusher',
    },
    {
      id: '003',
      imageURL: 'https://pbs.twimg.com/media/FY1VHAlX0AAj5ZA.jpg',
      tooltip: 'Crusher',
    },
    {
      id: '004',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/5705e1164a8394aace6018e27d20d237.jpg',
      tooltip: 'Data',
    },
    {
      id: '005',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/aa169b49b583a2b5af89203c2b78c67c.jpg',
      tooltip: 'La Forge',
    },
    {
      id: '006',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/1aa48fc4880bb0c9b8a3bf979d3b917e.jpg',
      tooltip: "O'Brien",
    },
    {
      id: '007',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/ae5e3ce40e0404a45ecacaaf05e5f735.jpg',
      tooltip: 'Picard',
    },
    {
      id: '008',
      imageURL: 'https://pbs.twimg.com/media/E9HZtfiXsAISn7-.jpg',
      tooltip: 'Pulaski',
    },
    {
      id: '009',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/18ead4c77c3f40dabf9735432ac9d97a.jpg',
      tooltip: 'Riker',
    },
    {
      id: '010',
      imageURL: 'https://pbs.twimg.com/media/FQ6Q8n_XsAA4zUZ.jpg',
      tooltip: 'Ro',
    },
    {
      id: '011',
      imageURL: 'https://pbs.twimg.com/media/E1b7EWSXMAgrPLc.jpg',
      tooltip: 'Shelby',
    },
    {
      id: '012',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/31857b449c407203749ae32dd0e7d64a.jpg',
      tooltip: 'Troi',
    },
    {
      id: '013',
      imageURL: 'https://pbs.twimg.com/media/FejYjw6XgAESL46.jpg',
      tooltip: 'Worf',
    },
    {
      id: '014',
      imageURL: 'https://pbs.twimg.com/media/FhNsPOZWYAceiwM.jpg',
      tooltip: 'Yar',
    },
  ],
};

export const WithActions = Template.bind({});
WithActions.args = {
  disabled: false,
  items: [
    {
      id: '001',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/8fe04df45a22b63156ebabbb064fcd5e.jpg',
      caption: 'Burke',
      action: () => alert('Burke'),
    },
    {
      id: '002',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/7501e5d4da87ac39d782741cd794002d.jpg',
      caption: 'Crusher',
      action: () => alert('Crusher'),
    },
    {
      id: '003',
      imageURL: 'https://pbs.twimg.com/media/FY1VHAlX0AAj5ZA.jpg',
      caption: 'Crusher',
      action: () => alert('Crusher'),
    },
    {
      id: '004',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/5705e1164a8394aace6018e27d20d237.jpg',
      caption: 'Data',
      action: () => alert('Data'),
    },
    {
      id: '005',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/aa169b49b583a2b5af89203c2b78c67c.jpg',
      caption: 'La Forge',
      action: () => alert('La Forge'),
    },
    {
      id: '006',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/1aa48fc4880bb0c9b8a3bf979d3b917e.jpg',
      caption: "O'Brien",
      action: () => alert("O'Brien"),
    },
    {
      id: '007',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/ae5e3ce40e0404a45ecacaaf05e5f735.jpg',
      caption: 'Picard',
      action: () => alert('Picard'),
    },
    {
      id: '008',
      imageURL: 'https://pbs.twimg.com/media/E9HZtfiXsAISn7-.jpg',
      caption: 'Pulaski',
      action: () => alert('Pulaski'),
    },
    {
      id: '009',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/18ead4c77c3f40dabf9735432ac9d97a.jpg',
      caption: 'Riker',
      action: () => alert('Riker'),
    },
    {
      id: '010',
      imageURL: 'https://pbs.twimg.com/media/FQ6Q8n_XsAA4zUZ.jpg',
      caption: 'Ro',
      action: () => alert('Ro'),
    },
    {
      id: '011',
      imageURL: 'https://pbs.twimg.com/media/E1b7EWSXMAgrPLc.jpg',
      caption: 'Shelby',
      action: () => alert('Shelby'),
    },
    {
      id: '012',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/31857b449c407203749ae32dd0e7d64a.jpg',
      caption: 'Troi',
      action: () => alert('Troi'),
    },
    {
      id: '013',
      imageURL: 'https://pbs.twimg.com/media/FejYjw6XgAESL46.jpg',
      caption: 'Worf',
      action: () => alert('Worf'),
    },
    {
      id: '014',
      imageURL: 'https://pbs.twimg.com/media/FhNsPOZWYAceiwM.jpg',
      caption: 'Yar',
      action: () => alert('Yar'),
    },
  ],
};

export const WithMissingImages = Template.bind({});
WithMissingImages.args = {
  items: [
    {
      id: '001',
      caption: 'Burke',
    },
    {
      id: '002',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/7501e5d4da87ac39d782741cd794002d.jpg',
      caption: 'Crusher',
    },
    {
      id: '003',
      caption: 'Crusher',
    },
    {
      id: '004',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/5705e1164a8394aace6018e27d20d237.jpg',
      caption: 'Data',
    },
    {
      id: '005',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/aa169b49b583a2b5af89203c2b78c67c.jpg',
      caption: 'La Forge',
    },
    {
      id: '006',
      caption: "O'Brien",
    },
    {
      id: '007',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/ae5e3ce40e0404a45ecacaaf05e5f735.jpg',
      caption: 'Picard',
    },
    {
      id: '008',
      caption: 'Pulaski',
    },
    {
      id: '009',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/18ead4c77c3f40dabf9735432ac9d97a.jpg',
      caption: 'Riker',
    },
    {
      id: '010',
      caption: 'Ro',
    },
    {
      id: '011',
      caption: 'Shelby',
    },
    {
      id: '012',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/31857b449c407203749ae32dd0e7d64a.jpg',
      caption: 'Troi',
    },
    {
      id: '013',
      imageURL: 'https://pbs.twimg.com/media/FejYjw6XgAESL46.jpg',
      caption: 'Worf',
    },
    {
      id: '014',
      caption: 'Yar',
    },
  ],
};

export const WithLargerImages = Template.bind({});
WithLargerImages.args = {
  size: 384,
  items: [
    {
      id: '001',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/8fe04df45a22b63156ebabbb064fcd5e.jpg',
      caption: 'Burke',
    },
    {
      id: '002',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/7501e5d4da87ac39d782741cd794002d.jpg',
      caption: 'Crusher',
    },
    {
      id: '003',
      imageURL: 'https://pbs.twimg.com/media/FY1VHAlX0AAj5ZA.jpg',
      caption: 'Crusher',
    },
    {
      id: '004',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/5705e1164a8394aace6018e27d20d237.jpg',
      caption: 'Data',
    },
    {
      id: '005',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/aa169b49b583a2b5af89203c2b78c67c.jpg',
      caption: 'La Forge',
    },
    {
      id: '006',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/1aa48fc4880bb0c9b8a3bf979d3b917e.jpg',
      caption: "O'Brien",
    },
    {
      id: '007',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/ae5e3ce40e0404a45ecacaaf05e5f735.jpg',
      caption: 'Picard',
    },
    {
      id: '008',
      imageURL: 'https://pbs.twimg.com/media/E9HZtfiXsAISn7-.jpg',
      caption: 'Pulaski',
    },
    {
      id: '009',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/18ead4c77c3f40dabf9735432ac9d97a.jpg',
      caption: 'Riker',
    },
    {
      id: '010',
      imageURL: 'https://pbs.twimg.com/media/FQ6Q8n_XsAA4zUZ.jpg',
      caption: 'Ro',
    },
    {
      id: '011',
      imageURL: 'https://pbs.twimg.com/media/E1b7EWSXMAgrPLc.jpg',
      caption: 'Shelby',
    },
    {
      id: '012',
      imageURL:
        'https://ca.startrek.com/sites/default/files/styles/content_full/public/images/2019-07/31857b449c407203749ae32dd0e7d64a.jpg',
      caption: 'Troi',
    },
    {
      id: '013',
      imageURL: 'https://pbs.twimg.com/media/FejYjw6XgAESL46.jpg',
      caption: 'Worf',
    },
    {
      id: '014',
      imageURL: 'https://pbs.twimg.com/media/FhNsPOZWYAceiwM.jpg',
      caption: 'Yar',
    },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  loadingItemCount: 14,
};
