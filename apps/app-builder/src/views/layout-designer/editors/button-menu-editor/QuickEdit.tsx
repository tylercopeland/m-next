import React, { useMemo, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import styled from '@emotion/styled';
import { Popper } from '@mui/material';
import { ClickOutside, Guid } from '@m-next/utilities';
import Container from '@m-next/container';
import { colors } from '@m-next/styles';
import { Text } from '@m-next/typeography';
import Button from '@m-next/button';
import { BaseControl, ButtonGroupControl } from '@m-next/runtime-interface';
import { Z_POPUP } from '@m-next/layout-canvas';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';

interface EventData {
  id: string;
  value: string;
  label: string;
}

interface QuickEditProps {
  id: string | number;
  onClose: (button: BaseControl) => void;
  onCancel: () => void;
  onAddAction: (button: BaseControl, eventName: string) => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  button: BaseControl;
  control: ButtonGroupControl;
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

function QuickEdit({
  id,
  button,
  onClose,
  onCancel,
  open,
  anchorEl,
  onAddAction,
  control,
}: QuickEditProps): JSX.Element {
  const [selectedButton, setSelectedButton] = useState<BaseControl>(button);
  const [hasSelectedButtonChanges, setHasSelectedButtonChanges] = useState<boolean>(false);

  const events: EventData[] | undefined = useMemo(() => {
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

  const parent = useRef<HTMLDivElement>(null);

  const handleCancel = (): void => {
    onCancel();
  };

  const handleUpdateSelectedButtonCaption = (newCaption: string): void => {
    setSelectedButton({
      ...selectedButton,
      caption: newCaption,
      name: selectedButton.id,
    });
    setHasSelectedButtonChanges(true);
  };

  const handleUpdateSelectedButtonState = (updated: BaseControl): void => {
    setSelectedButton(updated);
    setHasSelectedButtonChanges(true);
  };

  const handleAddAction = (property: string): void => {
    const updated = { ...selectedButton, [property]: Guid.create() };
    setSelectedButton(updated);
    setHasSelectedButtonChanges(true);
    onAddAction(updated, `${selectedButton.caption} Click`);
  };

  return (
    <Popper
      id={`${id}-quick-editor`}
      ref={parent}
      open={open}
      anchorEl={anchorEl}
      placement='left-start'
      style={{ zIndex: Z_POPUP.POPOVER, paddingBottom: 16 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [8, 29],
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: [],
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
            padding: 8,
            borderRadius: 4,
            border: ` 1px solid ${colors['grey-light']}`,
            background: colors.white,
            boxShadow: '0px 10px 10px 0px rgba(0, 0, 0, 0.25)',
            gap: 16,
          }}
        >
          <HeaderWrapper>
            <Text 
              id={`${id}-quick-editor-title`} 
              bold 
              style={{ wordBreak: 'break-all' }}
            >
              {selectedButton.caption} properties
            </Text>
          </HeaderWrapper>
          <Container style={{ gap: 16, padding: 0 }}>
            <CaptionInput
              id='button-caption'
              value={selectedButton?.caption || ''}
              onChange={handleUpdateSelectedButtonCaption}
              controlId={selectedButton?.id}
              label='Label'
            />
            <ActionListSection
              caption='Events'
              values={events}
              emptyMessage='No events applied'
              canAdd
              actions={[{ value: 'Click', label: 'Click', source: 'onClick' }]}
              addLabel='Add click'
              onAddAction={handleAddAction}
              control={control}
              singleActionVariant
            />
            <DefaultStateSelector 
              control={selectedButton} 
              onChange={handleUpdateSelectedButtonState} 
              forceClassic={true}
            />
          </Container>
          <ButtonFooter>
            <Button id='cancel' buttonStyle='link' onClick={onCancel} value='Cancel' />
            <Button
              id='apply'
              buttonStyle='primary'
              onClick={() => onClose(selectedButton)}
              value='Apply'
              disabled={!hasSelectedButtonChanges}
            />
          </ButtonFooter>
        </Container>
      </ClickOutside>
      <Tooltip id='popover-tooltip' />
    </Popper>
  );
}

export default QuickEdit;
