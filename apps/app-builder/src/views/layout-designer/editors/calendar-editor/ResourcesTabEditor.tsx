import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import styled from '@emotion/styled';
import { Popper } from '@mui/material';
import { ClickOutside } from '@m-next/utilities';
import Container from '@m-next/container';
import { colors } from '@m-next/styles';
import { Text } from '@m-next/typeography';
import Button from '@m-next/button';
import { useSelector } from 'react-redux';
import { FieldTypeNames } from '@m-next/types';
import Dropdown from '@m-next/dropdown';
import type { DropdownOption } from '@m-next/dropdown';
import Input from '@m-next/input';
import Toggle from '@m-next/toggle';
import { Z_POPUP } from '@m-next/layout-canvas';
import type { CalendarControl, ResourceData } from './calendar-types';
import { useGetFieldsForTableQuery } from '../../../../common/services/tablesFieldsApi';
import { selectAccountName } from '../../../../common/services/sessionSlice';
import * as s from '../common/BlockEditor.styles';

interface ResourcesTabEditorProps {
  id: string | number;
  onClose: (resource: ResourceData) => void;
  onCancel: () => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  control: CalendarControl;
}

const HeaderWrapper = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
]);

const ButtonFooter = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    paddingTop: 8,
    justifyContent: 'flex-end',
  },
]);

function ResourcesTabEditor({ id, onClose, onCancel, open, anchorEl, control }: ResourcesTabEditorProps): JSX.Element {
  const [hasResourceChanges, setHasResourceChanges] = useState<boolean>(false);
  const [resourceTitle, setResourceTitle] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<DropdownOption>({ label: '', value: '' });
  const [defaultToCurrentUser, setDefaultToCurrentUser] = useState<boolean>(true);

  const accountName = useSelector(selectAccountName);

  const { data: resourceFields } = useGetFieldsForTableQuery({
    accountName,
    tableName: 'Activity',
    complexFields: true,
  });

  const filteredResourceFields = useMemo(() => {
    if (resourceFields) {
      return resourceFields
        .filter(
          (field: { name: string; caption: string; type: string; sourceField: string; sourceTable: string }) =>
            field.sourceField !== 'RecordID' && field.type === FieldTypeNames.DropDown,
        )
        .map((field: { name: string; caption: string; type: string; sourceField: string; sourceTable: string }) => ({
          label: field.caption || field.name,
          value: field.name,
        }));
    }
    return [];
  }, [resourceFields]);

  useEffect(() => {
    if (filteredResourceFields && filteredResourceFields.length > 0) {
      const resourceField = control.resourceFieldv2 || 'AssignedTo';
      const foundResource = filteredResourceFields.find((field: { value: string }) => field.value === resourceField);
      if (foundResource) {
        setSelectedResource(foundResource);
      }
    }
    setResourceTitle(control.resourceTitle || '');
    if (!control.defaultResource || control.defaultResource === '') {
      setDefaultToCurrentUser(false);
    } else {
      setDefaultToCurrentUser(true);
    }
    setHasResourceChanges(false);
  }, [filteredResourceFields, control.resourceFieldv2, control.resourceTitle, control.defaultResource]);

  const parent = useRef<HTMLDivElement>(null);

  const handleCancel = (): void => {
    if (filteredResourceFields && filteredResourceFields.length > 0) {
      const resourceField = control.resourceFieldv2 || 'AssignedTo';
      const foundResource = filteredResourceFields.find((field: { value: string }) => field.value === resourceField);
      if (foundResource) {
        setSelectedResource(foundResource);
      }
    }
    setResourceTitle(control.resourceTitle || '');
    if (!control.defaultResource || control.defaultResource === '') {
      setDefaultToCurrentUser(false);
    } else {
      setDefaultToCurrentUser(true);
    }
    setHasResourceChanges(false);
    onCancel();
  };

  const handleResourceChange = (resource: DropdownOption) => {
    setSelectedResource(resource);
    setHasResourceChanges(true);
  };

  const handleDefaultResourceChange = (checked: boolean) => {
    setDefaultToCurrentUser(checked);
    setHasResourceChanges(true);
  };

  const handleResourceTitleChange = (title: string) => {
    setResourceTitle(title);
    setHasResourceChanges(true);
  };

  return (
    <Popper
      id={`${id}-quick-editor`}
      ref={parent}
      open={open}
      anchorEl={anchorEl}
      placement='left-start'
      style={{ zIndex: 200 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [8, 8],
          },
        },
      ]}
      role='none'
    >
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />

      <ClickOutside onClickOutsideHandler={handleCancel} parentRef={parent}>
        <Container
          width={320}
          borderless
          style={{
            padding: 16,
            borderRadius: 4,
            border: ` 1px solid ${colors['grey-light']}`,
            background: colors.white,
            boxShadow: '0px 10px 10px 0px rgba(0, 0, 0, 0.25)',
            gap: 16,
          }}
        >
          <Container style={{ gap: 16, padding: 0 }}>
            <HeaderWrapper>
              <Text id={`${id}-quick-editor-title`} bold>
                Resources Tab
              </Text>
            </HeaderWrapper>
            <s.LineWrapper>
              <Text style={{ flexGrow: 1 }}>Resource title</Text>
              <Input
                id='resource-title'
                value={resourceTitle}
                onChange={(e) => handleResourceTitleChange(e.target.value)}
                width='184px'
                style={{ marginBottom: '0px' }}
              />
            </s.LineWrapper>

            <s.LineWrapper>
              <Text style={{ flexGrow: 1 }}>Resource field</Text>
              <Dropdown
                id='table'
                value={selectedResource}
                options={filteredResourceFields}
                onChange={handleResourceChange}
                width={184}
                isV4Design
                required
              />
            </s.LineWrapper>
            {selectedResource?.value === 'AssignedTo' && (
              <s.LineWrapper>
                <Text style={{ flexGrow: 1 }}>Default to current user</Text>
                <Toggle id='default-resource' checked={defaultToCurrentUser} onChange={handleDefaultResourceChange} />
              </s.LineWrapper>
            )}
          </Container>
          <ButtonFooter>
            <Button id='cancel' buttonStyle='plain' onClick={handleCancel} value='Cancel' color={colors.blue} />
            <Button
              id='apply'
              buttonStyle='primary'
              onClick={() =>
                onClose({
                  title: resourceTitle,
                  field: resourceFields.find((field: { name: string }) => field.name === selectedResource.value),
                  defaultToCurrentUser,
                })
              }
              value='Apply'
              disabled={!hasResourceChanges}
            />
          </ButtonFooter>
        </Container>
      </ClickOutside>
      <Tooltip id='popover-tooltip' />
    </Popper>
  );
}

export default ResourcesTabEditor;
