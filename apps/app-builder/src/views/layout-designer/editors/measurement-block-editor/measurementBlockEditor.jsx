import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Toggle from '@m-next/toggle';
import Input from '@m-next/input';
import Dropdown from '@m-next/dropdown';
import Tabs from '@m-next/tabs';
import * as s from './measurementBlockEditor.styles';

// const DataModelEditor = React.lazy(() => import('../data-model-editor'));
// types
const propTypes = {
  onChange: PropTypes.func,
  control: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    caption: PropTypes.string,
    collapseEmpty: PropTypes.bool,
    dataModelId: PropTypes.string,
    projection: PropTypes.shape({
      id: PropTypes.string,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          caption: PropTypes.string,
          type: PropTypes.string,
          isVisible: PropTypes.bool,
          isRequired: PropTypes.bool,
          maxLength: PropTypes.number,
        })
      ),
    }),
  }),
};

function MeasurementBlockEditor({ control, onChange }) {

  const handleCaptionChange = (e) => {
    onChange({ ...control, caption: e.target.value });
  };

  const handleCollapseChange = (value) => {
    onChange({ ...control, collapseEmpty: value });
  };

  const dataModels = [
    { value: 'Contact', label: 'Contact' },
    { value: 'Customer', label: 'Customer' },
  ];


  const [selectedTab, setSelectedTab] = useState('DataModel');

  const tabList = [
    { id: 'DataModel', caption: 'Field' },
    { id: 'Settings', caption: 'Object' },
  ];

  const handleTabChange = (e) => {
    setSelectedTab(e);
  };

  const renderTabContent = () => {
    if (selectedTab === 'Settings') {
      return (
        <s.Wrapper padding={16}>
          <s.LineWrapper>
            <Input
              compactStyle
              id='settings-caption'
              value={control?.caption}
              label='Caption'
              onChange={handleCaptionChange}
              />
          </s.LineWrapper>
          <s.LineWrapper>
            <Toggle
              id='settings-collapse'
              checked={control?.collapseEmpty}
              onChange={handleCollapseChange}
              label='Hide Empty Fields'
              width='100%'
            />
          </s.LineWrapper>
          <Dropdown
            id='settings-data-model'
            options={dataModels}
            value={{ value: control.dataModelId, label: control.dataModelId }}
            caption='Table'
            isV4Design
            disabled
          />
        </s.Wrapper>
      );
    }
    return (
      <s.Wrapper>
        Temp
      </s.Wrapper>
    );
  };

  return (
    <Tabs
      id='field-block-editor'
      tabList={tabList}
      onRenderTabContent={renderTabContent}
      onChange={handleTabChange}
      selectedTab={selectedTab}
      containerMargin='0px'
      borderless
      dyanmicHeight
      headerStyle={{ marginLeft: 16 }}
    />
  );
}

MeasurementBlockEditor.propTypes = propTypes;
export default MeasurementBlockEditor;
