import React, { useState } from 'react';
import PillTab from '../src/PillTab';
import { PillTabOption } from '../src/types';

export default {
  title: 'm-one/PillTab',
  component: PillTab,
};

// Basic two options
const basicOptions: PillTabOption[] = [
  { value: 'plan', label: 'Plan' },
  { value: 'build', label: 'Build' },
];

export const Basic = () => {
  const [value, setValue] = useState('plan');
  
  return (
    <div style={{ padding: '40px' }}>
      <PillTab
        options={basicOptions}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

// With disabled option
const disabledOptions: PillTabOption[] = [
  { value: 'plan', label: 'Plan' },
  { value: 'build', label: 'Build', disabled: true },
  { value: 'deploy', label: 'Deploy' },
];

export const WithDisabled = () => {
  const [value, setValue] = useState('plan');
  
  return (
    <div style={{ padding: '40px' }}>
      <PillTab
        options={disabledOptions}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

// As navigation links
const linkOptions: PillTabOption[] = [
  { value: 'home', label: 'Home', href: '#home' },
  { value: 'about', label: 'About', href: '#about' },
  { value: 'contact', label: 'Contact', href: '#contact' },
];

export const AsLinks = () => {
  const [value, setValue] = useState('home');
  
  return (
    <div style={{ padding: '40px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#6B7280' }}>
        Navigation tabs with anchor links
      </h3>
      <PillTab
        options={linkOptions}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

// External links with target
const externalLinkOptions: PillTabOption[] = [
  { value: 'docs', label: 'Docs', href: 'https://example.com/docs', target: '_blank', rel: 'noopener noreferrer' },
  { value: 'api', label: 'API', href: 'https://example.com/api', target: '_blank', rel: 'noopener noreferrer' },
  { value: 'local', label: 'Local' }, // This one is a button
];

export const MixedLinksAndButtons = () => {
  const [value, setValue] = useState('docs');
  
  return (
    <div style={{ padding: '40px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#6B7280' }}>
        Mix of links (first two) and button (third)
      </h3>
      <PillTab
        options={externalLinkOptions}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          console.log('Selected:', newValue);
        }}
      />
    </div>
  );
};
