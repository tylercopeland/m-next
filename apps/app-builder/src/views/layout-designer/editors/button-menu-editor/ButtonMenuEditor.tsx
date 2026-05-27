import React, { Suspense, useMemo, useState, useRef } from 'react';
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import Toggle from '@m-next/toggle';
import LoadingSkeleton from '@m-next/loading-skeleton';
import {
  ButtonGroupControl,
  createButtonGroupItemControl,
  FieldTypeIds,
  migrateButtonGroupControl,
  WIDGETS,
  type BaseControl,
} from '@m-next/runtime-interface';
import { toCamelCase } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';

import { Tooltip } from 'react-tooltip';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import EditorInput from '../common/components/editor-input/EditorInput';
import * as s from '../common/BlockEditor.styles';
import Accordion from '../../../../components/accordion/Accordion';
import ColorSelector from '../../../../components/addable-list/component-selectors/ColorSelector';
import QuickEdit from './QuickEdit';
import styled from '@emotion/styled';

// prevent grid caption column from creating scrollbar
const GridWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  
  td[aria-colindex="2"] {
    max-width: 0;
    
    span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

 
// @ts-ignore Missing type definitions for @m-next/grid component
const Grid = React.lazy(() => import('@m-next/grid'));

interface ButtonMenuEditorProps {
  rawControl: ButtonGroupControl | null;
  onChange: (control: ButtonGroupControl) => void;
  onAddAction: (control: ButtonGroupControl, eventName: string) => void;
}

const ButtonMenuEditor: React.FC<ButtonMenuEditorProps> = ({ rawControl, onChange, onAddAction }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedButton, setSelectedButton] = useState<BaseControl | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const control = useMemo((): ButtonGroupControl => {
    const defaultControl: ButtonGroupControl = {
      id: '',
      caption: 'ButtonMenu',
      hideCaption: false,
      name: '',
      visible: true,
      disabled: false,
      type: WIDGETS.BUTTONGROUP,
      classes: '',
      widthType: 'auto',
      width: null,
      height: null,
      isBound: false,
      defaultValue: null,
      buttons: [],
      hasMenuLabel: false,
      menuLabel: 'More actions',
      isWorking: false,
      styles: {
        variant: 'secondary',
        color: 'dark-grey',
      },
    };

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    const migrated = migrateButtonGroupControl(merged);

    return migrated ?? merged;
  }, [rawControl]);

  const handlePropertyChange = (property: string, value: unknown): void => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handleChildPropertyChange = (property: string, child: string, value: unknown): void => {
    interface ControlWithIndexableProperties {
      [key: string]: Record<string, unknown> | unknown;
    }
     
    const updated = { ...control, [property]: { ...(control as ControlWithIndexableProperties)[property] as Record<string, unknown>, [child]: value } };
    onChange(updated);
  };

  const getUniqueName = (): { name: string; caption: string } => {
    const baseName = 'Menuitem';
    const baseCaption = 'Menu item';
    let name = 'Menuitem1';
    let caption = 'Menu item 1';

    let index = 1;
    while (
      control.buttons.some(
        (button) =>
          button.name.toLocaleLowerCase() === name.toLocaleLowerCase() ||
          button.caption?.toLocaleLowerCase() === caption.toLocaleLowerCase(),
      )
    ) {
      name = `${baseName}${index}`;
      caption = `${baseCaption} ${index}`;
      index += 1;
    }

    return { name, caption };
  };

  const handleAddButton = (): void => {
    if (control.buttons.length >= 8) {
      return;
    }

    const updated = { ...control };
    const { caption } = getUniqueName();
    const newButton = createButtonGroupItemControl({ parentName: control.name, caption });
    updated.buttons.push(newButton);
    onChange(updated);
  };

  const handleEditButton = (
    e: React.MouseEvent<HTMLElement>,
    _columnName: string,
    _val: unknown,
    _column: unknown,
    _rowIdx: number,
    primaryKey: string,
  ): void => {
    setSelectedButton(control.buttons.find((button) => button.id === primaryKey) || null);
    setAnchorEl(e.currentTarget as HTMLElement);
  };

  const handleButtonReorder = (from: number, to: number): void => {
    const newButtonList = [...control.buttons];
    const [movedItem] = newButtonList.splice(from, 1);
    newButtonList.splice(to, 0, movedItem!);

    const updated = {
      ...control,
      buttons: newButtonList,
    };

    onChange(updated);
  };

  const handleDeleteButton = (_rowIdx: number, primaryKey: string): void => {
    const updated = { ...control };
    updated.buttons = updated.buttons.filter((button) => button.id !== primaryKey);
    onChange(updated);
  };

  const handleUpdateSelectedButton = (updatedButton: BaseControl | null): void => {
    if (!updatedButton) return;
    const updatedButtons = control.buttons.map((button) => (button.id === updatedButton.id ? updatedButton : button));
    const updatedControl = { ...control, buttons: updatedButtons };
    setSelectedButton(null);
    setAnchorEl(null);
    onChange(updatedControl);
  };

  const handleShowMenuLabelChange = (e: boolean): void => {
    const updated = { ...control, hasMenuLabel: e };
    if (!updated.menuLabel) {
      updated.menuLabel = 'More actions';
    }
    onChange(updated);
  };

  const handleAddAction = (updatedButton: BaseControl, eventName: string): void => {
    const updatedButtons = control.buttons.map((button) => (button.id === updatedButton.id ? updatedButton : button));
    const updatedControl = { ...control, buttons: updatedButtons };
    onAddAction(updatedControl, eventName);
  };

  return (
    <s.Wrapper padding={16}>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      <TextLine>Edit the base configuration and styles of the button menu.</TextLine>
      <Accordion id='display' caption='Display' variant='left' open borderless>
        <s.LineWrapper>
          <Text>Variant</Text>
          <ButtonGroupRow
            id='button-menu-variant'
            width={184}
            selected={control.styles?.variant}
            data={[
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
            ]}
            onClick={(e) => handleChildPropertyChange('styles', 'variant', e.value)}
          />
        </s.LineWrapper>
        <s.LineWrapper>
          <Text>Color</Text>
          <ColorSelector
            id='button-menu-color'
            value={control.styles?.color}
            onChange={(value: string) => handleChildPropertyChange('styles', 'color', value)}
            width={184}
            showLabel
            type='fill-color'
          />
        </s.LineWrapper>
        <DefaultStateSelector control={control} onChange={onChange} />
      </Accordion>
      <Accordion
        id='button-list'
        caption='Menu items'
        onAdd={control.buttons.length < 8 ? handleAddButton : undefined}
        variant='left'
        open
        borderless
        tooltipId='editor-tooltip'
        tooltip='Add menu item'
      >
        <s.LineWrapper ref={gridRef}>
          <Text
            tooltip='Opens menu by default. Turn off to set a custom action.'
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >
            Main button opens menu
          </Text>
          <Toggle id='main-button-opens-menu' checked={control.hasMenuLabel} onChange={handleShowMenuLabelChange} />
        </s.LineWrapper>
        {control.hasMenuLabel && (
          <EditorInput
            id='menu-label'
            value={control.menuLabel}
            onChange={(e: string | number) => handlePropertyChange('menuLabel', String(e))}
            controlId={control.id}
            label='Main button label'
            showChildIcon
          />
        )}
        <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
          <GridWrapper>
            <Grid
              id='buttons'
              hideCaption={false}
              searchable={false}
              showGoToPage={false}
              showPageSize={false}
              showReload={false}
              showHeader={false}
              addRowsEnabled={false}
              editable
              tooltipId='editor-tooltip'
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
                  onColumnClick: handleEditButton,
                  width: 'dynamic',
                },
              ]}
              data={control.buttons}
              draggable
              showDragOnHover
              onReorder={handleButtonReorder}
              compact
              pageSize={50}
              totalRecords={control.buttons.length}
              hideRecordCount
              pageNumber={1}
              isPageData
              canDelete={control.buttons.length > 2}
              onDelete={handleDeleteButton}
              alwaysShowDragHandles
            />
          </GridWrapper>
        </Suspense>
      </Accordion>

      {selectedButton && (
        <QuickEdit
          id='button-menu-quick-edit'
          button={selectedButton}
          onClose={handleUpdateSelectedButton}
          onCancel={() => {
            setSelectedButton(null);
          }}
          open={!!selectedButton}
          anchorEl={anchorEl}
          onAddAction={handleAddAction}
          control={control}
        />
      )}
    </s.Wrapper>
  );
};

export default ButtonMenuEditor;
