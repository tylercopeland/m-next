import React from 'react';

import PropTypes from 'prop-types';
import { Text } from '@m-next/typeography';
import Toggle from '@m-next/toggle';
import Pill from '@m-next/pill';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { isCustomViewEnabledPropName } from './GridViewsSection';

import * as s from '../GridBlockEditor.styles';
import Accordion from '../../../../../components/accordion/Accordion';
import GridModel from '../type';
import EditorInput from '../../common/components/editor-input/EditorInput';

const propTypes = {
  control: GridModel,
  onChange: PropTypes.func,
};

const GridInteractionsSection = ({ control, onChange }) => {
  const handlePropertyChange = (property, value) => {
    const updated = { ...control, [property]: value };
    
    if (property === 'isSearchable' && !value) {
      updated[isCustomViewEnabledPropName] = false;
    }

    onChange(updated);
  };

  return (
    <Accordion id='interactions' caption='Interactions' variant='left' open borderless>
      <Toggle
        id='show-search'
        checked={control.isSearchable}
        onChange={(e) => handlePropertyChange('isSearchable', e)}
        label='Search & filtering'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      <Toggle
        id='show-sort'
        checked={control.showSort}
        onChange={(e) => handlePropertyChange('showSort', e)}
        label='Sort'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      <Toggle
        id='show-show-hide-columns'
        checked={control.showShowHideColumns}
        onChange={(e) => handlePropertyChange('showShowHideColumns', e)}
        label='Show/Hide columns'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      <Toggle
        id='show-export'
        checked={control.showExport}
        onChange={(e) => handlePropertyChange('showExport', e)}
        label='Export to CSV'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      {control.viewFriendlyName === 'Contacts' && (
        <Toggle
          id='show-export-mail-chimp'
          checked={control.showExportToMailChimp}
          onChange={(e) => handlePropertyChange('showExportToMailChimp', e)}
          label='Export to Mailchimp'
          width='100%'
          style={{ justifyContent: 'flex-start' }}
          labelStyle={{ flexBasis: '100%' }}
        />
      )}
      <Toggle
        id='show-refresh'
        checked={control.showRefresh}
        onChange={(e) => handlePropertyChange('showRefresh', e)}
        label='Refresh'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      <Toggle
        id='show-row-select'
        checked={control.isSelectable}
        onChange={(e) => handlePropertyChange('isSelectable', e)}
        label='Select records'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      <s.LineWrapper gap={4}>
        <Text style={{ textWrap: 'nowrap' }}>Reorder columns</Text>
        <Pill size='narrow' colorScheme='grey'>
          Beta
        </Pill>
        <Toggle
          id='show-reorder-columns'
          checked={control.canReorderColumns}
          onChange={(e) => handlePropertyChange('canReorderColumns', e)}
          width='100%'
          style={{ justifyContent: 'flex-start' }}
          labelStyle={{ flexBasis: '100%' }}
        />
      </s.LineWrapper>
      <Toggle
        id='can-add-more-rows'
        checked={control.canAddMoreRows}
        onChange={(e) => handlePropertyChange('canAddMoreRows', e)}
        label='Add lines'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      {control.canAddMoreRows && (
        <EditorInput
          id='add-label'
          gap={8}
          value={control.addLabel}
          label='Add button text'
          onChange={(e) => handlePropertyChange('addLabel', e)}
          controlId={control.id}
          maxLength={30}
          showChildIcon
        />
      )}
      {control.canAddMoreRows && (
        <EditorInput
          id='add-rows-count'
          gap={8}
          type='integer'
          value={control.newRowsCount}
          label='Rows on add'
          onChange={(e) => handlePropertyChange('newRowsCount', e)}
          controlId={control.id}
          maxLength={10}
          showChildIcon
        />
      )}
      <Toggle
        id='can-delete-rows'
        checked={control.showDeleteColumn}
        onChange={(e) => handlePropertyChange('showDeleteColumn', e)}
        label='Delete records'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      {control.showDeleteColumn && (
        <s.LineWrapper gap={8}>
          <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
          <Toggle
            id='show-delete-confirmation'
            checked={control.showDeleteConfirmation}
            onChange={(e) => handlePropertyChange('showDeleteConfirmation', e)}
            label='Delete confirmation'
            width='100%'
            style={{ justifyContent: 'flex-start' }}
            labelStyle={{ flexBasis: '100%' }}
          />
        </s.LineWrapper>
      )}
    </Accordion>
  );
};

GridInteractionsSection.propTypes = propTypes;
export default GridInteractionsSection;
