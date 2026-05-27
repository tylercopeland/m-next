/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TagWidget from './TagWidget';
import EditableTagWidget from './EditableTagWidget';
import ReadOnlyTagWidget from './ReadOnlyTagWidget';

expect.extend(matchers);

const tagsList = [
  {
    name: 'aaa',
    colour: '#84f3ff',
  },
  {
    name: 'bbb',
    colour: '#A9d9bf',
  },
  {
    name: 'ccc',
    colour: '#ffabb5',
  },
  {
    name: 'ddd',
    colour: '#bacad0',
  },
  {
    name: 'eee',
    colour: '#ffea80',
  },
  {
    name: 'fff',
    colour: '#ffaca1',
  },
  {
    name: 'ggg',
    colour: '#91a2ff',
  },
  {
    name: 'hhh',
    colour: '#ffcdab',
  },
  {
    name: 'iii',
    colour: '',
  },
];

describe('TagsWidget', () => {
  describe('Functional', () => {
    it('Renders Tags', async () => {
      const { getByText } = render(
        <TagWidget
          id='test'
          tagsList={tagsList}
          caption='Tag List'
          value={['aaa', 'bbb', 'ccc', 'DDD', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj', '']}
        />,
      );
      expect(getByText('aaa')).toBeDefined();
      expect(getByText('bbb')).toBeDefined();
      expect(getByText('ccc')).toBeDefined();
      expect(getByText('DDD')).toBeDefined();
      expect(getByText('eee')).toBeDefined();
      expect(getByText('fff')).toBeDefined();
      expect(getByText('ggg')).toBeDefined();
      expect(getByText('hhh')).toBeDefined();
      expect(getByText('iii')).toBeDefined();
    });

    it('Editbale Tags', async () => {
      const { getByText } = render(
        <TagWidget
          id='test'
          tagsList={tagsList}
          caption='Tag List'
          value={['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj', '']}
          suggestions={['aaa', 'bbb', 'ccc']}
          isEditable
        />,
      );
      expect(getByText('aaa')).toBeDefined();
      expect(getByText('bbb')).toBeDefined();
      expect(getByText('ccc')).toBeDefined();
      expect(getByText('ddd')).toBeDefined();
      expect(getByText('eee')).toBeDefined();
      expect(getByText('fff')).toBeDefined();
      expect(getByText('ggg')).toBeDefined();
      expect(getByText('hhh')).toBeDefined();
      expect(getByText('iii')).toBeDefined();
    });
  });
  describe('Snapshots', () => {
    it('Default', async () => {
      const tree = render(<TagWidget />).container;
      expect(tree).toMatchSnapshot();
    });

    it('ReadOnly Tags', async () => {
      const tree = render(
        <TagWidget
          id='test'
          tagsList={tagsList}
          caption='Tag List'
          value={['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj', '']}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('ReadOnly Empty Tags', async () => {
      const tree = render(<TagWidget id='test' tagsList={tagsList} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('ReadOnlyTagWidget Default', async () => {
      const tree = render(<ReadOnlyTagWidget />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Editable Tags', async () => {
      const tree = render(
        <TagWidget
          id='test'
          tagsList={tagsList}
          caption='Tag List'
          value={['aaa', 'bbb', 'ccc', 'DDD', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj', '', 'zzzz']}
          isEditable
          suggestions={['aaa', 'bbb', 'ccc']}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Editable Empty Tags', async () => {
      const tree = render(
        <TagWidget id='test' tagsList={tagsList} isEditable suggestions={['aaa', 'bbb', 'ccc']} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('EditableTagWidget Empty Tags', async () => {
      const tree = render(
        <EditableTagWidget id='test' tagsList={tagsList} isEditable suggestions={['aaa', 'bbb', 'ccc']} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('EditableTagWidget Empty suggestions', async () => {
      const tree = render(
        <EditableTagWidget
          id='test'
          value={['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj', '']}
          tagsList={tagsList}
          isEditable
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('EditableTagWidget Empty tagsList', async () => {
      const tree = render(
        <EditableTagWidget
          id='test'
          value={['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj', '']}
          isEditable
          suggestions={['aaa', 'bbb', 'ccc']}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });
});
