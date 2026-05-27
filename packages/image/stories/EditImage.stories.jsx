import { EditableImage } from '../src';

export default {
  component: EditableImage,
  title: 'm-one/Image',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
  },
};

export const Editable = {
  args: {
    id: 'test',
    width: 128,
    height: 128,
    imgType: 'Fixed',
    value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    circle: false,
  },
};

export const Uploading = {
  args: {
    id: 'test',
    width: 40,
    height: 40,
    imgType: 'Fixed',
    value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    circle: false,
    uploading: true,
    uploadProgress: 50,
    uploadingFile: '1024px-Juvenile_Ragdoll.jpg',
  },
};
