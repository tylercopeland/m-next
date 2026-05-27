import React, { useRef, useState, useMemo } from 'react';

import PropTypes from 'prop-types';
import { FieldTypeIds } from '@m-next/types';
import { colors } from '@m-next/styles';
import { Popper } from '@mui/material';
import { ClickOutside , Guid } from '@m-next/utilities';
import Container from '@m-next/container';
import Button from '@m-next/button';
import { Text } from '@m-next/typeography';
import createBaseControl from '@m-next/runtime-interface/src/controls/baseControl';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import EditorInput from '../common/components/editor-input/EditorInput';

import Accordion from '../../../../components/accordion/Accordion';

const Grid = React.lazy(() => import('@m-next/grid'));

const propTypes = {
  control: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  onAddAction: PropTypes.func,
};

const ButtonMenuSection = ({ control, onChange, onAddAction }) => {
  const parent = useRef();
  const [open, setOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const events = useMemo(() => {
    if (selectedButton?.onClick) {
      return [
        {
          id: selectedButton.onClick,
          value: `${selectedButton.caption} Click`,
          label: 'Click',
        },
      ];
    }
    return undefined;
  }, [selectedButton]);

  const handleReorder = (from, to) => {
    const newButtons = [...control.buttons];
    const [movedItem] = newButtons.splice(from, 1);
    newButtons.splice(to, 0, movedItem);
    const updated = {
      ...control,
      buttons: newButtons,
    };
    onChange(updated);
  };

  const getUniqueName = () => {
    const baseCaption = 'Menu item';
    let index = 1;
    let caption = `${baseCaption} ${index}`;

    while (control.buttons.some((btn) => btn.caption.toLocaleLowerCase() === caption.toLocaleLowerCase())) {
      index += 1;
      caption = `${baseCaption} ${index}`;
    }
    return caption;
  };

  const handleAddButton = () => {
    const id = Guid.create();
    const caption = getUniqueName();
    const newButton = createBaseControl({
      id,
      type: 'BGI',
      typeOverride: 'BGI',
      hideCaption: false,
      caption,
      defaultValue: caption,
      name: `${control.name}~~${id}`,
    });

    const updatedButtons = [...control.buttons];
    updatedButtons.push(newButton);
    const updatedControl = {
      ...control,
      buttons: updatedButtons,
    };
    onChange(updatedControl);
  };

  const handleEdit = (e, columnName, val, column, rowIdx, primaryKey) => {
    setSelectedButton({ ...control.buttons.find((button) => button.id === primaryKey) });
    setAnchorEl(e.currentTarget);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleApply = () => {
    const newButtons = [...control.buttons];
    const index = control.buttons.findIndex((button) => button.id === selectedButton.id);
    newButtons[index] = selectedButton;
    const updated = {
      ...control,
      buttons: [...newButtons],
    };
    onChange(updated);
    setOpen(false);
    setAnchorEl(null);
  };

  const handleDeleteButton = (index) => {
    const newButtons = [...control.buttons];
    newButtons.splice(index, 1);
    const updated = { ...control, buttons: newButtons };
    onChange(updated);
  };

  const handleAddAction = (property) => {
    const updatedButton = { ...selectedButton, [property]: Guid.create() };
    setSelectedButton(updatedButton);
    const updatedControl = {
      ...control,
      buttons: control.buttons.map((button) => (button.id === updatedButton.id ? updatedButton : button)),
    };
    onChange(updatedControl);
    onAddAction(updatedButton, `${selectedButton.caption} Click`);
  };

  return (
    <>
      <Accordion
        id='event-card'
        caption='Button menu items'
        onAdd={control.buttons.length <= 8 ? handleAddButton : null}
        variant='left'
        open
        borderless
      >
        <Grid
          id='buttons-list'
          hideCaption={false}
          searchable={false}
          showGoToPage={false}
          showPageSize={false}
          showReload={false}
          showHeader={false}
          addRowsEnabled={false}
          editable
          columns={[
            {
              name: 'id',
              primary: true,
              caption: '',
              visible: false,
              editable: false,
              singleLine: true,
              fieldType: FieldTypeIds.Text,
              width: 'dynamic',
            },
            {
              name: 'caption',
              caption: '',
              visible: true,
              editable: false,
              singleLine: true,
              fieldType: FieldTypeIds.Text,
              onColumnClick: handleEdit,
              width: 'dynamic',
            },
          ]}
          data={control.buttons}
          draggable={control.buttons.length > 1}
          showDragOnHover
          onReorder={handleReorder}
          compact
          pageSize={50}
          totalRecords={control.buttons.length}
          hideRecordCount
          pageNumber={1}
          isPageData
          canDelete={control.buttons.length > 1}
          onDelete={handleDeleteButton}
          alwaysShowDragHandles
        />
      </Accordion>
      <Popper
        id="button-menu-popup"
        ref={parent}
        open={open}
        anchorEl={anchorEl}
        placement='left-end'
        style={{ zIndex: 200 }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 32],
            },
          },
        ]}
        role='none'
      >
        <ClickOutside onClickOutsideHandler={handleCancel} parentRef={parent}>
          <Container
            width={320}
            padding={16}
            borderless
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              borderRadius: 4,
              border: `1px solid ${colors['grey-background']}`,
              background: colors.white,
              boxShadow: '0px 10px 10px 0px rgba(0, 0, 0, 0.25)',
            }}
          >
            <Text bold>{selectedButton.caption} properties</Text>
            <EditorInput
              id='button-label-input'
              value={selectedButton.caption || ''}
              label='Label'
              onChange={(value) => {
                setSelectedButton({ ...selectedButton, caption: value });
              }}
              controlId={control.id}
              maxLength={30}
              type='text'
            />
            <ActionListSection
              values={events}
              emptyMessage='No click event applied'
              canAdd
              actions={[{ value: 'Click', label: 'Click', source: 'onClick' }]}
              addLabel='Add click'
              onAddAction={handleAddAction}
              control={control}
              singleActionVariant
            />
            <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'flex-end' }}>
              <Button id='button-apply-button' buttonStyle='link' onClick={handleCancel} value='Cancel' />
              <Button id='button-cancel-button' onClick={handleApply} value='Apply' />
            </div>
          </Container>
        </ClickOutside>
      </Popper>
    </>
  );
};

ButtonMenuSection.propTypes = propTypes;
export default ButtonMenuSection;
