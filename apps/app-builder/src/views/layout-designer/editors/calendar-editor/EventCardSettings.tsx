import React, { useMemo, useState } from 'react';
import { TextLine, Text } from '@m-next/typeography';
import Dropdown from '@m-next/dropdown';
import DebouncedInputArea from '@m-next/input-area';
import { BaseControl } from '@m-next/runtime-interface/src/controls/baseControl';
import { ButtonGroupRow } from '@m-next/button-group';
import { toast } from 'react-toastify';
import Button from '@m-next/button';
import Dialog from '@m-next/dialog';
import InputArea from '@m-next/input-area';
import { useParams } from 'react-router-dom';
import { colors } from '@m-next/styles';
import { useGenerateFormulaMutation } from '../../../../common/services/copilotApi';
import { useValidateFormulaMutation } from '../../../../common/services/runtimeApi';
import { CalendarControl } from './calendar-types';
import ButtonMenuSection from './ButtonMenuSection';
import ColorSelector from '../../../../components/addable-list/component-selectors/ColorSelector';
import Accordion from '../../../../components/accordion/Accordion';
import * as s from '../common/BlockEditor.styles';

// Props for CalendarEditor
interface EventCardSettingsProps {
  control: CalendarControl;
  fieldList: { name: string; caption: string; type: string }[];
  onChange: (control: CalendarControl) => void;
  onAddAction: (control: BaseControl, eventName: string) => void;
}

function EventCardSettings({ control, fieldList, onChange, onAddAction }: EventCardSettingsProps) {
  const { appId, screenId, versionId } = useParams();
  const [validateFormula] = useValidateFormulaMutation();
  const [generateFormula] = useGenerateFormulaMutation();
  const [prompt, setPrompt] = useState('');

  const titleColumnName = useMemo(() => {
    if (control.model.columns.find((column: { name: string; caption: string }) => column.caption === 'Title')) {
      return 'Title';
    }
    return 'ActivityType';
  }, [control]);

  const descriptionColumnName = useMemo(() => {
    if (control.model.columns.find((column: { name: string; caption: string }) => column.caption === 'Description')) {
      return 'Description';
    }
    return 'Comments';
  }, [control]);

  const [title, setTitle] = useState(
    control.model.columns.find((column: { name: string; caption: string }) => column.caption === titleColumnName)!
      .formula,
  );
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState(
    control.model.columns.find((column: { name: string; caption: string }) => column.caption === descriptionColumnName)!
      .formula,
  );
  const [descriptionError, setDescriptionError] = useState('');
  const [generatingTitleFormula, setGeneratingTitleFormula] = useState(false);
  const [generatingDescriptionFormula, setGeneratingDescriptionFormula] = useState(false);
  const [titleExplanation, setTitleExplanation] = useState<string[] | null>(null);
  const [descriptionExplanation, setDescriptionExplanation] = useState<string[] | null>(null);
  const [openTitleDialog, setOpenTitleDialog] = useState(false);
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false);

  const dateTimeOptions = useMemo(() => {
    if (!fieldList) {
      return [];
    }
    const formatted: { value: string; label: string }[] = [];
    fieldList.forEach((field: { name: string; caption: string; type: string }) => {
      if (field.type === 'DateTime') {
        formatted.push({ value: field.name, label: field.caption });
      }
    });
    return formatted;
  }, [fieldList]);

  const selectedStartTime = useMemo(() => {
    const column = control.model.columns.find(
      (column: { name: string; caption: string }) => column.caption === 'StartDate',
    )?.name;
    const field = dateTimeOptions.find((x) => x.value == column);
    if (field) {
      return { value: control.name, label: field.label };
    }
    return { value: 'DueDateStart', label: 'Due date start' };
  }, [control, dateTimeOptions]);

  const selectedEndTime = useMemo(() => {
    const column = control.model.columns.find(
      (column: { name: string; caption: string }) => column.caption === 'EndDate',
    )?.name;
    const field = dateTimeOptions.find((x) => x.value == column);
    if (field) {
      return { value: control.name, label: field.label };
    }
    return { value: 'DueDateEnd', label: 'Due date end' };
  }, [control, dateTimeOptions]);

  const eventTextOptions = useMemo(() => {
    if (!fieldList) {
      return [];
    }
    const formatted: { value: string; label: string }[] = [];
    fieldList.forEach((field: { name: string; caption: string; type: string }) => {
      if (field.type === 'Text' || field.type === 'DropDown') {
        formatted.push({ value: field.name, label: field.caption });
      }
    });
    return formatted;
  }, [fieldList]);

  const selectedEventTitle = useMemo(() => {
    const column = control.model.columns.find(
      (column: { name: string; caption: string }) => column.caption === titleColumnName,
    );
    if (column && column.name !== 'Title') {
      const field = eventTextOptions.find((x) => x.value == column.name);
      if (field) {
        return { value: control.name, label: field.label };
      }
      return { value: 'ActivityType', label: 'Activity type' };
    }
    return { value: 'Title', label: 'Formula' };
  }, [control, eventTextOptions, titleColumnName]);

  const selectedEventDescription = useMemo(() => {
    const column = control.model.columns.find(
      (column: { name: string; caption: string }) => column.caption === descriptionColumnName,
    );
    if (column && column.name !== 'Description') {
      const field = eventTextOptions.find((x) => x.value == column.name);
      if (field) {
        return { value: control.name, label: field.label };
      }
      return { value: 'Comments', label: 'Comments' };
    }
    return { value: 'Description', label: 'Formula' };
  }, [control, eventTextOptions, descriptionColumnName]);

  const appointmentColorOptions = useMemo(() => {
    if (!fieldList) {
      return [];
    }
    const formatted: { value: string; label: string }[] = [];
    fieldList.forEach((field: { name: string; caption: string; type: string }) => {
      if (field.type === 'Text') {
        formatted.push({ value: field.name, label: field.caption });
      }
    });
    return formatted;
  }, [fieldList]);

  const selectedAppointmentColor = useMemo(() => {
    const column = control.model.columns.find(
      (column: { name: string; caption: string }) => column.caption === 'Color',
    )?.name;
    const field = appointmentColorOptions.find((x) => x.value == column);
    if (field) {
      return { value: control.name, label: field.label };
    }
    return { value: 'ActivityStatusColor', label: 'Activity status color' };
  }, [control, appointmentColorOptions]);

  const allDayOptions = useMemo(() => {
    if (!fieldList) {
      return [];
    }
    const formatted: { value: string; label: string }[] = [];
    fieldList.forEach((field: { name: string; caption: string; type: string }) => {
      if (field.type === 'YesNo') {
        formatted.push({ value: field.name, label: field.caption });
      }
    });
    return formatted;
  }, [fieldList]);

  const selectedAllDay = useMemo(() => {
    const column = control.model.columns.find(
      (column: { name: string; caption: string }) => column.caption === 'IsAllDayAppointment',
    )?.name;
    const field = allDayOptions.find((x) => x.value == column);
    if (field) {
      return { value: control.name, label: field.label };
    }
    return { value: 'IsAllDayAppointment', label: 'Is all day appointment' };
  }, [control, allDayOptions]);

  const handleColumnChange = (caption: string, name: string, newCaption?: string) => {
    const columnIndex = control.model.columns.findIndex(
      (column: { name: string; caption: string }) => column.caption === caption,
    );
    const updatedControl = {
      ...control,
      model: {
        ...control.model,
        columns: control.model.columns.map((col: { name: string; caption: string }, index: number) =>
          index === columnIndex ? { ...col, name, caption: newCaption || caption, expression: [{}] } : col,
        ),
      },
    };
    onChange(updatedControl as CalendarControl);
  };

  const handleTypeChange = (value: string, caption: string, name: string) => {
    const columnIndex = control.model.columns.findIndex(
      (column: { name: string; caption: string }) => column.caption === caption,
    );
    const columnCaption = value === name ? name : caption;
    const columnType = value === name ? 6 : 0;
    const updatedControl = {
      ...control,
      model: {
        ...control.model,
        columns: control.model.columns.map((col: { name: string; caption: string }, index: number) =>
          index === columnIndex
            ? { ...col, name: value, columnType, caption: columnCaption, expression: null, formula: null }
            : col,
        ),
      },
    };
    onChange(updatedControl as CalendarControl);
  };

  const handleValidateFormula = async (
    value: string,
    columnCaption: string,
    setValue: (value: string) => void,
    setError: (value: string) => void,
  ) => {
    setValue(value);
    try {
      const response = await validateFormula({
        body: {
          validate: true,
          formula: value,
          viewFriendlyName: control.model.viewName,
        },
      }).unwrap();
      setError(response.error ?? '');
      if (!response.error) {
        const columnIndex = control.model.columns.findIndex(
          (column: { name: string; caption: string }) => column.caption === columnCaption,
        );
        const updatedControl = {
          ...control,
          model: {
            ...control.model,
            columns: control.model.columns.map((col: { name: string; caption: string }, index: number) =>
              index === columnIndex ? { ...col, formula: value } : col,
            ),
          },
        };
        onChange(updatedControl as CalendarControl);
      }
    } catch (ex: unknown) {
      toast.error(`Error generating formula - ${ex instanceof Error ? ex.message : 'Unknown error'}`);
    }
  };

  const handleGenerateTitleFormula = async () => {
    try {
      setGeneratingTitleFormula(true);
      setOpenTitleDialog(false);
      setPrompt('');
      const response = await generateFormula({
        appId,
        screenId,
        versionId,
        body: {
          prompt,
          viewFriendlyName: control.model.viewName,
        },
      }).unwrap();
      if (response?.output?.formula) {
        handleValidateFormula(response.output.formula, titleColumnName, setTitle, setTitleError);
      }
      setTitleExplanation(response?.output?.explanation ?? null);
    } catch (ex: unknown) {
      toast.error(`Error generating formula - ${ex instanceof Error ? ex.message : 'Unknown error'}`);
    } finally {
      setGeneratingTitleFormula(false);
    }
  };

  const handleGenerateDescriptionFormula = async () => {
    try {
      setGeneratingDescriptionFormula(true);
      setOpenDescriptionDialog(false);
      setPrompt('');
      const response = await generateFormula({
        appId,
        screenId,
        versionId,
        body: {
          prompt,
          viewFriendlyName: control.model.viewName,
        },
      }).unwrap();
      if (response?.output?.formula) {
        handleValidateFormula(response.output.formula, descriptionColumnName, setDescription, setDescriptionError);
      }
      setDescriptionExplanation(response?.output?.explanation ?? null);
    } catch (ex: unknown) {
      toast.error(`Error generating formula - ${ex instanceof Error ? ex.message : 'Unknown error'}`);
    } finally {
      setGeneratingDescriptionFormula(false);
    }
  };

  const handleButtonStyleChange = (property: string, value: string) => {
    const updated = { ...control, styles: { ...control.styles, [property]: value } };
    onChange(updated);
  };

  return (
    <s.Wrapper padding={16}>
      <TextLine>Editing the event card in the calendar.</TextLine>
      <Accordion id='event-card' caption='Event card fields' variant='left' open borderless>
        <s.LineWrapper align='baseline' gap={8}>
          <Text>Start date & time</Text>
          <Dropdown
            id='start-date-time-input'
            options={dateTimeOptions}
            value={selectedStartTime}
            onChange={(e) => handleColumnChange('StartDate', String(e.value))}
            isV4Design
            width={184}
            menuPlacement='bottom'
          />
        </s.LineWrapper>
        <s.LineWrapper align='baseline' gap={8}>
          <Text>End date & time</Text>
          <Dropdown
            id='end-date-time-input'
            options={dateTimeOptions}
            value={selectedEndTime}
            onChange={(e) => handleColumnChange('EndDate', String(e.value))}
            isV4Design
            width={184}
            menuPlacement='bottom'
          />
        </s.LineWrapper>
        <s.LineWrapper align='baseline' gap={8}>
          <Text>Event title</Text>
          <Dropdown
            id='event-title-input'
            options={[
              { value: 'ActivityType', label: 'Field' },
              { value: 'Title', label: 'Formula' },
            ]}
            value={
              selectedEventTitle.value === 'Title'
                ? selectedEventTitle
                : { value: selectedEventTitle.value, label: 'Field' }
            }
            onChange={(e) => handleTypeChange(String(e.value), titleColumnName, 'Title')}
            isV4Design
            width={184}
            menuPlacement='bottom'
          />
        </s.LineWrapper>
        <s.LineWrapper align='baseline' gap={8} style={{ justifyContent: 'flex-end' }}>
          {selectedEventTitle.value !== 'Title' ? (
            <Dropdown
              id='event-title-field-input'
              options={eventTextOptions}
              value={selectedEventTitle}
              onChange={(e) => handleColumnChange(titleColumnName, String(e.value))}
              isV4Design
              width={184}
              menuPlacement='bottom'
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>
              <s.LineWrapper>
                <DebouncedInputArea
                  id='event-title-formula-input'
                  value={title}
                  onChange={(e) => handleValidateFormula(e, titleColumnName, setTitle, setTitleError)}
                  validationMessage={titleError}
                  isV4Design
                  placeholder='Type your expression here...'
                  compactStyle
                  disableResize
                  autoGrow={false}
                  initialHeight={64}
                />
              </s.LineWrapper>
              {generatingTitleFormula && <TextLine>Loading...</TextLine>}
              {titleExplanation && (
                <s.CopilotQuerySectionExplanationContainer>
                  <TextLine bold>Explanation</TextLine>
                  <s.CopilotQuerySectionExplanationList>
                    {titleExplanation.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index}>{item}</li>
                    ))}
                  </s.CopilotQuerySectionExplanationList>
                </s.CopilotQuerySectionExplanationContainer>
              )}
              <s.LineWrapper>
                <Button
                  id='open-copilot-title'
                  value='Build with AI'
                  isV4Design
                  buttonStyle='link'
                  style={{ marginRight: 'auto' }}
                  icon={{
                    name: 'ai-assistant',
                    size: 12,
                    position: 'left',
                  }}
                  onClick={() => setOpenTitleDialog(true)}
                />
                <Text fontSize='small' color={colors.grey} bold>
                  Learn more about{' '}
                  <a
                    style={{ color: colors.blue }}
                    href='https://help.method.me/en/articles/2559773-editable-grid-object#h_974ac0d6fc'
                    target='_blank' rel="noreferrer"
                  >
                    formulas
                  </a>
                  .
                </Text>
              </s.LineWrapper>
              {openTitleDialog && (
                <Dialog
                  title='AI expression generator'
                  isOpen
                  onClose={() => setOpenTitleDialog(false)}
                  footer={{
                    primaryButtonLabel: 'Generate',
                    onPrimaryButtonClick: handleGenerateTitleFormula,
                    secondaryButtonLabel: 'Cancel',
                    onSecondaryButtonClick: () => setOpenTitleDialog(false),
                  }}
                >
                  <InputArea
                    id='copilot'
                    value={prompt}
                    onChange={setPrompt}
                    placeholder='What would you like to see in this column?'
                    rows={5}
                  />
                </Dialog>
              )}
            </div>
          )}
        </s.LineWrapper>
        <s.LineWrapper align='baseline' gap={8}>
          <Text>Event description</Text>
          <Dropdown
            id='event-description-input'
            options={[
              { value: 'Comments', label: 'Field' },
              { value: 'Description', label: 'Formula' },
            ]}
            value={
              selectedEventDescription.value === 'Description'
                ? selectedEventDescription
                : { value: selectedEventDescription.value, label: 'Field' }
            }
            onChange={(e) => handleTypeChange(String(e.value), descriptionColumnName, 'Description')}
            isV4Design
            width={184}
            menuPlacement='bottom'
          />
        </s.LineWrapper>
        {selectedEventDescription.value !== 'Description' ? (
          <s.LineWrapper align='baseline' gap={8} style={{ justifyContent: 'flex-end' }}>
            <Dropdown
              id='event-description-field-input'
              options={eventTextOptions}
              value={selectedEventDescription}
              onChange={(e) => handleColumnChange(descriptionColumnName, String(e.value))}
              isV4Design
              width={184}
              menuPlacement='bottom'
            />
          </s.LineWrapper>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>
            <s.LineWrapper>
              <DebouncedInputArea
                id='event-description-formula-input'
                value={description}
                onChange={(e) => handleValidateFormula(e, descriptionColumnName, setDescription, setDescriptionError)}
                validationMessage={descriptionError}
                isV4Design
                placeholder='Type your expression here...'
                compactStyle
                disableResize
                autoGrow={false}
                initialHeight={64}
              />
            </s.LineWrapper>
            {generatingDescriptionFormula && <TextLine>Loading...</TextLine>}
            {descriptionExplanation && (
              <s.CopilotQuerySectionExplanationContainer>
                <TextLine bold>Explanation</TextLine>
                <s.CopilotQuerySectionExplanationList>
                  {descriptionExplanation.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index}>{item}</li>
                  ))}
                </s.CopilotQuerySectionExplanationList>
              </s.CopilotQuerySectionExplanationContainer>
            )}
            <s.LineWrapper>
              <Button
                id='open-copilot-description'
                value='Build with AI'
                isV4Design
                buttonStyle='link'
                style={{ marginRight: 'auto' }}
                icon={{
                  name: 'ai-assistant',
                  size: 12,
                  position: 'left',
                }}
                onClick={() => setOpenDescriptionDialog(true)}
              />
              <Text fontSize='small' color={colors.grey} bold>
                Learn more about{' '}
                <a href='https://help.method.me/en/articles/2559773-editable-grid-object#h_974ac0d6fc' target='_blank' rel="noreferrer">
                  formulas
                </a>
                .
              </Text>
            </s.LineWrapper>
            {openDescriptionDialog && (
              <Dialog
                title='AI expression generator'
                isOpen
                onClose={() => setOpenDescriptionDialog(false)}
                footer={{
                  primaryButtonLabel: 'Generate',
                  onPrimaryButtonClick: handleGenerateDescriptionFormula,
                  secondaryButtonLabel: 'Cancel',
                  onSecondaryButtonClick: () => setOpenDescriptionDialog(false),
                }}
              >
                <InputArea
                  id='copilot'
                  value={prompt}
                  onChange={setPrompt}
                  placeholder='What would you like to see in this column?'
                  rows={5}
                />
              </Dialog>
            )}
          </div>
        )}
        <s.LineWrapper align='baseline' gap={8}>
          <Text>Appointment colors</Text>
          <Dropdown
            id='appointment-colors-input'
            options={appointmentColorOptions}
            value={selectedAppointmentColor}
            onChange={(e) => handleColumnChange('Color', String(e.value))}
            isV4Design
            width={184}
            menuPlacement='bottom'
          />
        </s.LineWrapper>
        <s.LineWrapper align='baseline' gap={8}>
          <Text>All day appointment</Text>
          <Dropdown
            id='all-day-appointment-input'
            options={allDayOptions}
            value={selectedAllDay}
            onChange={(e) => handleColumnChange('IsAllDayAppointment', String(e.value))}
            isV4Design
            width={184}
            menuPlacement='bottom'
          />
        </s.LineWrapper>
      </Accordion>
      <s.SettingDivider />
      <Accordion id='event-card' caption='Card events' variant='left' open borderless>
        <s.LineWrapper>
          <Text>Button variant</Text>
          <ButtonGroupRow
            id='event-card-button-variant'
            width={184}
            selected={control.styles.variant || 'primary'}
            data={[
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
            ]}
            onClick={(e) => handleButtonStyleChange('variant', String(e.value))}
          />
        </s.LineWrapper>
        <s.LineWrapper>
          <Text>Button color</Text>
          <ColorSelector
            id='event-card-button-color'
            value={control.styles.color || 'blue'}
            onChange={(e) => handleButtonStyleChange('color', e)}
            width={184}
            showLabel
            type='fill-color'
          />
        </s.LineWrapper>
      </Accordion>
      <ButtonMenuSection control={control} onChange={onChange} onAddAction={onAddAction} />
    </s.Wrapper>
  );
}

export default EventCardSettings;
