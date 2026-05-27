import React from 'react';
import { Toolbar } from '../../src/components/Toolbar/Toolbar';

export default {
  title: 'App Builder/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => (
  <div style={{ height: '600px', display: 'flex' }}>
    <Toolbar {...args} />
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
      <p>Main content area (ChatPanel or Layout Designer)</p>
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  topButtons: [
    { id: 'add', icon: 'add', label: 'Add Component', onClick: () => console.log('Add clicked') },
    { id: 'print', icon: 'print', label: 'Print Preview', onClick: () => console.log('Print clicked') },
  ],
  bottomButtons: [
    { id: 'settings', icon: 'settings', label: 'Settings', onClick: () => console.log('Settings clicked') },
    { id: 'help', icon: 'help', label: 'Help', onClick: () => console.log('Help clicked') },
  ],
};

export const TopButtonsOnly = Template.bind({});
TopButtonsOnly.args = {
  topButtons: [
    { id: 'add', icon: 'add', label: 'Add Component', onClick: () => console.log('Add clicked') },
    { id: 'print', icon: 'print', label: 'Print Preview', onClick: () => console.log('Print clicked') },
    { id: 'save', icon: 'save', label: 'Save', onClick: () => console.log('Save clicked') },
  ],
};

export const BottomButtonsOnly = Template.bind({});
BottomButtonsOnly.args = {
  bottomButtons: [
    { id: 'settings', icon: 'settings', label: 'Settings', onClick: () => console.log('Settings clicked') },
    { id: 'help', icon: 'help', label: 'Help', onClick: () => console.log('Help clicked') },
  ],
};

export const WithDisabledButtons = Template.bind({});
WithDisabledButtons.args = {
  topButtons: [
    { id: 'add', icon: 'add', label: 'Add Component', onClick: () => console.log('Add clicked') },
    { id: 'print', icon: 'print', label: 'Print Preview', onClick: () => console.log('Print clicked'), disabled: true },
  ],
  bottomButtons: [
    { id: 'settings', icon: 'settings', label: 'Settings', onClick: () => console.log('Settings clicked'), disabled: true },
    { id: 'help', icon: 'help', label: 'Help', onClick: () => console.log('Help clicked') },
  ],
};

export const ManyButtons = Template.bind({});
ManyButtons.args = {
  topButtons: [
    { id: 'add', icon: 'add', label: 'Add Component', onClick: () => console.log('Add clicked') },
    { id: 'copy', icon: 'copy', label: 'Copy', onClick: () => console.log('Copy clicked') },
    { id: 'paste', icon: 'paste', label: 'Paste', onClick: () => console.log('Paste clicked') },
    { id: 'delete', icon: 'delete', label: 'Delete', onClick: () => console.log('Delete clicked') },
    { id: 'undo', icon: 'undo', label: 'Undo', onClick: () => console.log('Undo clicked') },
    { id: 'redo', icon: 'redo', label: 'Redo', onClick: () => console.log('Redo clicked') },
  ],
  bottomButtons: [
    { id: 'settings', icon: 'settings', label: 'Settings', onClick: () => console.log('Settings clicked') },
    { id: 'help', icon: 'help', label: 'Help', onClick: () => console.log('Help clicked') },
  ],
};

export const Empty = Template.bind({});
Empty.args = {};

export const WithActiveState = Template.bind({});
WithActiveState.args = {
  topButtons: [
    { id: 'book', icon: 'book', label: 'Spec Doc', onClick: () => console.log('Book clicked'), isActive: true },
    { id: 'files', icon: 'files-folder', label: 'Files', onClick: () => console.log('Files clicked') },
  ],
  bottomButtons: [
    { id: 'components', icon: 'components', label: 'Components', onClick: () => console.log('Components clicked') },
  ],
};

export const WithHighlightedState = Template.bind({});
WithHighlightedState.args = {
  topButtons: [
    { id: 'book', icon: 'book', label: 'Spec Doc', onClick: () => console.log('Book clicked'), isHighlighted: true },
    { id: 'files', icon: 'files-folder', label: 'Files', onClick: () => console.log('Files clicked') },
  ],
  bottomButtons: [
    { id: 'components', icon: 'components', label: 'Components', onClick: () => console.log('Components clicked') },
  ],
};

export const WithActiveAndHighlighted = Template.bind({});
WithActiveAndHighlighted.args = {
  topButtons: [
    { id: 'book', icon: 'book', label: 'Spec Doc', onClick: () => console.log('Book clicked'), isActive: true, isHighlighted: true },
    { id: 'files', icon: 'files-folder', label: 'Files', onClick: () => console.log('Files clicked'), isHighlighted: true },
  ],
  bottomButtons: [
    { id: 'components', icon: 'components', label: 'Components', onClick: () => console.log('Components clicked') },
  ],
};

export const WithAIButton = Template.bind({});
WithAIButton.args = {
  topButtons: [
    { id: 'book', icon: 'book', label: 'Spec Doc', onClick: () => console.log('Book clicked') },
  ],
  aiButtonConfig: {
    onClick: () => console.log('AI button clicked'),
  },
};

export const WithAIButtonActive = Template.bind({});
WithAIButtonActive.args = {
  topButtons: [
    { id: 'book', icon: 'book', label: 'Spec Doc', onClick: () => console.log('Book clicked') },
  ],
  aiButtonConfig: {
    onClick: () => console.log('AI button clicked'),
    isActive: true,
  },
};