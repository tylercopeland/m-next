import React from 'react';

import PropTypes from 'prop-types';
import { Text } from '@m-next/typeography';
import Toggle from '@m-next/toggle';
import Dropdown from '@m-next/dropdown';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import DefaultStateSelector from '../../common/components/default-state-selector/DefaultStateSelector';

import * as s from '../GridBlockEditor.styles';
import Accordion from '../../../../../components/accordion/Accordion';
import GridModel from '../type';
import CaptionInput from '../../common/components/caption-input/CaptionInput';

const propTypes = {
  control: GridModel,
  onChange: PropTypes.func,
};

const GridDisplaySection = ({ control, onChange }) => {
  const handlePropertyChange = (property, value) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handlePageSizeChange = (e) => {
    const updated = {
      ...control,
      paging: {
        ...control.paging,
        pageSize: e,
      },
    };
    onChange(updated);
  };

  const handleLabelChange = (value, name) => {
    if (value) {
      const updatedControl = { ...control };
      updatedControl.caption = value;
      if (!control.isBound && control.name !== value) {
        updatedControl.name = name;
      }
      onChange(updatedControl);
    }
  };

  return (
    <Accordion id='display' caption='Display' variant='left' open borderless>
      <CaptionInput
        id='grid-title'
        value={control.caption}
        label='Title'
        onChange={handleLabelChange}
        controlId={control.id}
        style={{ flexGrow: 1 }}
      />
      <s.LineWrapper gap={8}>
        <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
        <Toggle
          id='show-title'
          checked={!control.hideCaption}
          onChange={(e) => handlePropertyChange('hideCaption', !e)}
          label='Show title'
          width='100%'
          style={{ justifyContent: 'flex-start' }}
          labelStyle={{ flexBasis: '100%' }}
        />
      </s.LineWrapper>
      <s.LineWrapper>
        <Text style={{ flexGrow: 1 }}>Records per page</Text>
        <Dropdown
          id='page-size'
          isV4Design
          options={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 1000, label: '1000' },
          ]}
          value={{ value: control.paging.pageSize, label: control.paging.pageSize }}
          width={184}
          onChange={(e) => handlePageSizeChange(e.value)}
        />
      </s.LineWrapper>
      <Toggle
        id='show-vertical-dividers'
        checked={control.showVerticalDividers}
        onChange={(e) => handlePropertyChange('showVerticalDividers', e)}
        label='Show vertical dividers'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      <DefaultStateSelector control={control} onChange={onChange} />
    </Accordion>
  );
};

GridDisplaySection.propTypes = propTypes;
export default GridDisplaySection;
