/**
 * ViewSettings component allows users to create and customize their grid views.
 * It provides functionalities to manage columns, filters, and sorting options.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {function} props.onChange - Callback function to handle changes in the view settings.
 * @param {Object} props.view - The current view model.
 * @param {boolean} props.disabled - Flag to disable the component.
 * @param {Object} props.displayPreferences - Preferences for displaying the component.
 * @param {Object} props.controlList - List of controls available for the criteria editor.
 * @param {Array<Object>} props.fieldList - List of fields available for filtering.
 * @param {string} props.viewFriendlyName - Friendly name of the view.
 * @param {Array<Object>} props.columns - List of columns available in the grid.
 *
 * @returns {JSX.Element} The rendered ViewSettings component.
 */
import React, { Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { toCamelCase } from '@m-next/utilities';
import Accordion from '../../../../components/accordion/Accordion';
import * as s from '../common/BlockEditor.styles';
import { selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import { GalleryFilterModel } from './type';
import SortingSection from './SortingSection';
import { selectControls } from '../../../../common/services/screenLayoutSlice';

const CriteriaEditor = React.lazy(() => import('@m-next/criteria-builder'));

// types
const propTypes = {
  onChange: PropTypes.func,
  view: GalleryFilterModel,
  disabled: PropTypes.bool,
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  viewFriendlyName: PropTypes.string,
};

function ViewSettings({ view, onChange, disabled, fieldList, viewFriendlyName }) {
  const displayPreferences = useSelector(selectDisplayPreferences);
  const controlList = useSelector(selectControls);
  const [openQuickEdit, setOpenQuickEdit] = useState(false);
  const [open, setOpen] = useState(true);

  const handleCriteriaChange = (criteria) => {
    const updated = {
      ...view,
      expression: toCamelCase(criteria),
    };
    onChange(updated);
  };

  const handleSortDelete = (index) => {
    const updated = {
      ...view,
      sorting: view.sorting.filter((_, i) => i !== index),
    };

    onChange(updated);
  };

  const handleSortReorder = (from, to) => {
    // Make a copy of the viewList array
    const newList = [...view.sorting];

    // Remove the item from its original position
    const [movedItem] = newList.splice(from, 1);

    // Insert the item at the destination position
    newList.splice(to, 0, movedItem);

    // Create updated control with new viewList
    const updated = {
      ...view,
      sorting: newList,
    };

    onChange(updated);
  };

  const handleSortChange = (index, order) => {
    const updated = {
      ...view,
      sorting: view.sorting.map((item, i) => {
        if (i === index) return { ...item, filterOrder: order };
        return item;
      }),
    };

    onChange(updated);
  };

  const handleAddSort = (column) => {
    const updated = {
      ...view,
      sorting: [...view.sorting, { filterField: column, filterOrder: 'asc' }],
    };

    onChange(updated);
  };

  const handleAddFilterClick = () => {
    setOpenQuickEdit(true);
    setOpen(true);
  };

  const handleCloseCriteriaEditor = () => {
    setOpenQuickEdit(false);
  };

  return (
    <>
      <Accordion
        id='filter'
        caption='Filter'
        onAdd={handleAddFilterClick}
        open={open}
        onClose={() => setOpen(false)}
        variant='left'
        borderless
        tooltipId='editor-tooltip'
        tooltip='Add filter'
      >
        <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
          <CriteriaEditor
            id='filter'
            controlList={controlList}
            dataModelId={viewFriendlyName}
            disabled={disabled}
            displayPreferences={displayPreferences}
            onChange={handleCriteriaChange}
            expression={view.expression}
            filterId={view.filterId}
            fieldList={fieldList}
            includeControls
            includeSessionVariables
            showEmptyFilterIcon={false}
            openQuickEdit={openQuickEdit}
            onClose={handleCloseCriteriaEditor}
            emptyMessage='No filters applied'
          />
        </Suspense>
      </Accordion>

      <s.SettingDivider />

      <SortingSection
        id='sorting'
        caption='Sorting'
        sortColumns={view.sorting}
        fieldList={fieldList ?? []}
        onAdd={handleAddSort}
        onReorder={handleSortReorder}
        onDelete={handleSortDelete}
        onChange={handleSortChange}
        disabled={disabled}
      />
    </>
  );
}

ViewSettings.propTypes = propTypes;
export default ViewSettings;
