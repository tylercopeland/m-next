import React, { useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@m-next/typeography';
import Button from '@m-next/button';
import { interactions } from '@m-next/utilities';
import Accordion from './Accordion';
import * as s from './Accordion.styles';
import AddColumnDialog from './AddColumnDialog';

const propTypes = {
  id: PropTypes.string,
  caption: PropTypes.string,
  emptyMessage: PropTypes.string,
  canAdd: PropTypes.bool,
  onAdd: PropTypes.func,
  values: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  options: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  addLabel: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltip: PropTypes.string,
  children: PropTypes.node,
  isEmpty: PropTypes.bool,
  valueKey: PropTypes.string,
  optionKey: PropTypes.string,
  optionCaption: PropTypes.string,
  optionIcon: PropTypes.string,
  subHeader: PropTypes.instanceOf(Object),
  shiftLeft: PropTypes.number,
};

const AddableAccordion = ({
  id,
  caption,
  emptyMessage,
  canAdd,
  values = [],
  onAdd,
  addLabel = 'Add',
  tooltipId,
  tooltip,
  children,
  isEmpty,
  options = [],
  valueKey = 'value',
  optionKey = 'value',
  optionCaption = 'label',
  optionIcon = 'icon',
  subHeader,
  shiftLeft = 0,
}) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(true);
  const addButtonRef = useRef();

  const filteredOptions = useMemo(() => {
    if (!values || values.length === 0) {
      return options;
    }
    return options?.filter((option) => !values.find((value) => value[valueKey] === option[optionKey]));
  }, [values, options, valueKey, optionKey]);

  const handleAddItem = (option) => {
    setIsAddMenuOpen(false);
    onAdd(option);
  };

  const handleOpenAddMenu = (e) => {
    interactions.preventPropagation(e);
    if (filteredOptions.length === 1) {
      onAdd(filteredOptions[0]);
      return;
    }
    setAnchorEl(e);
    setIsAddMenuOpen(true);
    setOpen(true);
  };
  const handleCloseAddMeu = () => {
    setAnchorEl(null);
    setIsAddMenuOpen(false);
  };
  return (
    <div style={{ position: 'relative' }}>
      <Accordion
        id={id}
        caption={caption}
        onAdd={canAdd && filteredOptions.length > 0 ? handleOpenAddMenu : null}
        variant='left'
        addButtonRef={addButtonRef}
        open={open}
        onClose={() => setOpen(false)}
        borderless
        tooltipId={tooltipId}
        tooltip={tooltip}
      >
        {subHeader}
        {isEmpty && (
          <s.EmptyContent>
            <Text>{emptyMessage}</Text>
            <Button
              id={`${id}-add`}
              value={addLabel}
              buttonStyle='link'
              icon={{
                name: 'plus-V4',
                size: 10,
                position: 'left',
              }}
              isV4Design
              onClick={handleOpenAddMenu}
            />
          </s.EmptyContent>
        )}
        {!isEmpty && children}
      </Accordion>
      {isAddMenuOpen && (
        <AddColumnDialog
          options={filteredOptions}
          onAdd={handleAddItem}
          onClose={handleCloseAddMeu}
          anchorEl={anchorEl}
          id={id}
          optionKey={optionKey}
          optionCaption={optionCaption}
          optionsIcon={optionIcon}
          shiftLeft={shiftLeft}
        />
      )}
    </div>
  );
};

AddableAccordion.propTypes = propTypes;
export default AddableAccordion;
