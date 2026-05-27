import React from 'react';
import Typeography from '../src';

export default {
  component: Typeography,
  title: 'm-one/Typeography',
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

export const Text = {
  render: (args) => (
    <div>
      <Typeography fontSize='xxlarge' variant='body2' {...args}>
        Text xxlarge
      </Typeography>{' '}
      <Typeography fontSize='xlarge' variant='body2' {...args}>
        Text xlarge
      </Typeography>{' '}
      <Typeography fontSize='large' variant='body2' {...args}>
        Text large
      </Typeography>{' '}
      <Typeography fontSize='medium' variant='body2' {...args}>
        Text medium
      </Typeography>{' '}
      <Typeography fontSize='small' variant='body2' {...args}>
        Text small
      </Typeography>{' '}
    </div>
  ),
};

export const TextLine = {
  render: (args) => (
    <div>
      <Typeography fontSize='xxlarge' variant='body1' {...args}>
        TextLine xxlarge
      </Typeography>
      <Typeography fontSize='xlarge' variant='body1' {...args}>
        TextLine xlarge
      </Typeography>
      <Typeography fontSize='large' variant='body1' {...args}>
        TextLine large
      </Typeography>
      <Typeography fontSize='medium' variant='body1' {...args}>
        TextLine medium
      </Typeography>
      <Typeography fontSize='small' variant='body1' {...args}>
        TextLine small
      </Typeography>
    </div>
  ),
};

export const TextDiv = {
  render: (args) => (
    <div>
      <Typeography fontSize='xxlarge' variant='div' {...args}>
        TextLine xxlarge
      </Typeography>
      <Typeography fontSize='xlarge' variant='div' {...args}>
        TextLine xlarge
      </Typeography>
      <Typeography fontSize='large' variant='div' {...args}>
        TextLine large
      </Typeography>
      <Typeography fontSize='medium' variant='div' {...args}>
        TextLine medium
      </Typeography>
      <Typeography fontSize='small' variant='div' {...args}>
        TextLine small
      </Typeography>
    </div>
  ),
};

export const Header1 = {
  render: (args) => (
    <div>
      <Typeography fontSize='xxlarge' variant='h1' {...args}>
        Header1 xxlarge
      </Typeography>
      <Typeography fontSize='xlarge' variant='h1' {...args}>
        Header1 xlarge
      </Typeography>
      <Typeography fontSize='large' variant='h1' {...args}>
        Header1 large
      </Typeography>
      <Typeography fontSize='medium' variant='h1' {...args}>
        Header1 medium
      </Typeography>
      <Typeography fontSize='small' variant='h1' {...args}>
        Header1 small
      </Typeography>
    </div>
  ),
};

export const Header2 = {
  render: (args) => (
    <div>
      <Typeography fontSize='xxlarge' variant='h2' {...args}>
        Header2 xxlarge
      </Typeography>
      <Typeography fontSize='xlarge' variant='h2' {...args}>
        Header2 xlarge
      </Typeography>
      <Typeography fontSize='large' variant='h2' {...args}>
        Header2 large
      </Typeography>
      <Typeography fontSize='medium' variant='h2' {...args}>
        Header2 medium
      </Typeography>
      <Typeography fontSize='small' variant='h2' {...args}>
        Header2 small
      </Typeography>
    </div>
  ),
};

export const Header3 = {
  render: (args) => (
    <div>
      <Typeography fontSize='xxlarge' variant='h3' {...args}>
        Header3 xxlarge
      </Typeography>
      <Typeography fontSize='xlarge' variant='h3' {...args}>
        Header3 xlarge
      </Typeography>
      <Typeography fontSize='large' variant='h3' {...args}>
        Header3 large
      </Typeography>
      <Typeography fontSize='medium' variant='h3' {...args}>
        Header3 medium
      </Typeography>
      <Typeography fontSize='small' variant='h3' {...args}>
        Header3 small
      </Typeography>
    </div>
  ),
};

export const Header4 = {
  render: (args) => (
    <div>
      <Typeography fontSize='xxlarge' variant='h4' {...args}>
        Header4 xxlarge
      </Typeography>
      <Typeography fontSize='xlarge' variant='h4' {...args}>
        Header4 xlarge
      </Typeography>
      <Typeography fontSize='large' variant='h4' {...args}>
        Header4 large
      </Typeography>
      <Typeography fontSize='medium' variant='h4' {...args}>
        Header4 medium
      </Typeography>
      <Typeography fontSize='small' variant='h4' {...args}>
        Header4 small
      </Typeography>
    </div>
  ),
};
