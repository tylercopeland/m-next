import React, { useMemo, useState } from 'react';
import ChipsFilter, { FilterChips } from '../src';
import fieldList from '../testing/data/fieldListActivities.json';
import expression from '../testing/data/expression.json';

export default {
  title: 'm-next/Components/Form/FilterChips',
  component: FilterChips,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 32, fontFamily }}>
    <h3
      style={{
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#374151',
        marginBottom: 8,
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

const baseOptions = [
  { value: '1', label: 'Alex', avatar: 'AB.mci' },
  { value: '2', label: 'Debbie', avatar: 'DD.mci' },
  { value: '3', label: "Bad'Val", avatar: 'DD.mci' },
  { value: '4', label: 'Even Long tag name 2024', avatar: 'DD.mci' },
];

const baseTags = [
  { colour: '#A9D9BF', name: 'Hot lead' },
  { colour: '#84F3FF', name: "Ala'a" },
  { colour: '#BACAD0', name: 'Sales Con' },
  { colour: '#B3E5FF', name: 'Duplicate' },
  { colour: '#FFCDAB', name: 'Unpaid' },
];

const StatefulFilterChips = ({
  initialExpression = expression,
  ...rest
}) => {
  const [internalExpression, setInternalExpression] = useState(initialExpression);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = useMemo(
    () => baseOptions.filter((o) => o.label.toLowerCase().includes(searchText.toLowerCase())),
    [searchText],
  );

  return (
    <FilterChips
      fieldList={fieldList}
      simpleChipsExpression={internalExpression?.simple}
      advancedChipsExpression={internalExpression?.advanced}
      onExpressionChange={(next) => setInternalExpression(next)}
      onSearch={(field, text) => setSearchText(text)}
      options={filteredOptions}
      tagsList={baseTags}
      viewName='Activities'
      {...rest}
    />
  );
};

export const Basic = () => (
  <Section title='Basic FilterChips'>
    <StatefulFilterChips id='basic-filter-chips' />
  </Section>
);

export const Empty = () => (
  <Section title='Empty state — only AddChip is shown'>
    <StatefulFilterChips id='empty-filter-chips' initialExpression={null} />
  </Section>
);

export const Disabled = () => (
  <Section title='Disabled'>
    <StatefulFilterChips id='disabled-filter-chips' disabled />
  </Section>
);

export const WithLabel = () => (
  <Section title='With a label (becomes aria-label on the group)'>
    <StatefulFilterChips id='labelled-filter-chips' label='Activity filters' />
  </Section>
);

export const Mobile = () => (
  <Section title='Mobile layout (deprecated isMobile prop still honoured)'>
    <StatefulFilterChips id='mobile-filter-chips' isMobile />
  </Section>
);

export const SaveButtonsRow = () => (
  <Section title='With save/reset row enabled'>
    <StatefulFilterChips
      id='save-filter-chips'
      egCustomViewsSaveButtonEnabled
      viewResetButtonVisible
      currentViewType='custom'
      onClickResetButton={() => {}}
      onUpdateCurrentView={() => {}}
      onClickShowSaveGridViewDialog={() => {}}
    />
  </Section>
);

export const DefaultExportStillWorks = () => (
  <Section title='`import ChipsFilter from "@m-next/chips-filter"` (legacy name)'>
    <StatefulFilterChips id='legacy-default-filter-chips' />
    <p style={{ fontFamily, fontSize: 12, color: '#6b7280', marginTop: 8 }}>
      The default export is still <code>ChipsFilter</code>. The named export{' '}
      <code>FilterChips</code> aliases it. Both render the same component:{' '}
      {ChipsFilter === FilterChips ? 'identical references confirmed' : 'mismatch!'}
    </p>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
    <StatefulFilterChips id='legacy-caption' caption='Legacy caption prop' />
    <div style={{ height: 12 }} />
    <StatefulFilterChips id='legacy-forwardref' forwardRef={() => {}} />
    <div style={{ height: 12 }} />
    <StatefulFilterChips
      id='legacy-ghosts'
      isV4Design
      legacyClass='legacy-class-name'
      displayAuto
      compactStyle
      label='Legacy ghosts silently ignored'
    />
  </Section>
);
