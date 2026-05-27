import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextLine } from '@m-next/typeography';
import InputArea, { DebouncedInputArea } from '@m-next/input-area';
import Button from '@m-next/button';
import Dialog from '@m-next/dialog';

import * as s from '../GridBlockEditor.styles';
import { GridColumnModel } from '../type';
import { useGenerateFormulaMutation } from '../../../../../common/services/copilotApi';
import { useValidateFormulaMutation } from '../../../../../common/services/runtimeApi';
import Accordion from '../../../../../components/accordion/Accordion';

const propTypes = {
  column: GridColumnModel,
  onChange: PropTypes.func,
  viewFriendlyName: PropTypes.string,
  recordId: PropTypes.string,
};

const ColumnFormulaSection = ({ column, onChange, viewFriendlyName, recordId }) => {
  const { appId, screenId, versionId } = useParams();
  const [generateFormula] = useGenerateFormulaMutation();
  const [validateFormula] = useValidateFormulaMutation();
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);
  const [generatingFormula, setGeneratingFormula] = useState(false);
  const [formula, setFormula] = useState(column.formula);
  const [prompt, setPrompt] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  // Reset state when column changes
  useEffect(() => {
    setFormula(column.formula);
    setGeneratingFormula(false);
    setError(null);
    setExplanation(null);
    setPrompt('');
    setOpenDialog(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.field]);

  const handlePropertyChange = (property, value) => {
    const updated = { ...column, [property]: value };
    onChange(updated);
  };

  const handleValidateFormula = async (value) => {
    if (value === formula) return;
    setFormula(value);
    try {
      const response = await validateFormula({
        body: {
          recordId,
          validate: true,
          viewFriendlyName,
          formula: value,
        },
      }).unwrap();
      setError(response.error ?? null);
      if (!response.error) {
        handlePropertyChange('formula', value);
      }
    } catch (ex) {
      toast.error(`Error generating formula - ${ex.data?.message}`);
    }
  };

  const handleGenerateFormula = async () => {
    try {
      setGeneratingFormula(true);
      setOpenDialog(false);
      setPrompt('');
      const response = await generateFormula({
        appId,
        screenId,
        versionId,
        body: {
          prompt,
          viewFriendlyName,
        },
      }).unwrap();
      if (response?.output?.formula) {
        handleValidateFormula(response.output.formula);
      }
      setExplanation(response?.output?.explanation ?? null);
    } catch (ex) {
      toast.error(`Error generating formula - ${ex.data?.message}`);
    } finally {
      setGeneratingFormula(false);
    }
  };

  const expSubTitle = `Learn more about Expressions in our <a href="https://help.method.me/en/articles/2559773-editable-grid-object#h_974ac0d6fc" target="_blank">help center</a>.`;

  return (
    <Accordion
      id='expression'
      caption='Expression'
      open
      variant='left'
      borderless
      hasBetaPill
      allowHtml
      suppressSubTitleIcon
      subTitle={expSubTitle}
    >
      <DebouncedInputArea
        id='formula'
        value={formula}
        onChange={handleValidateFormula}
        validationMessage={error}
        isV4Design
        placeholder='Type your expression here...'
        compactStyle
        disableResize
        autoGrow={false}
        initialHeight={64}
      />
      {generatingFormula && <TextLine>Loading...</TextLine>}
      {explanation && (
        <s.CopilotQuerySectionExplanationContainer>
          <TextLine bold>Explanation</TextLine>
          <s.CopilotQuerySectionExplanationList>
            {explanation.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>{item}</li>
            ))}
          </s.CopilotQuerySectionExplanationList>
        </s.CopilotQuerySectionExplanationContainer>
      )}
      <Button
        id='open-copilot'
        value='Build with AI'
        onClick={() => setOpenDialog(true)}
        isV4Design
        buttonStyle='link'
        style={{ marginRight: 'auto' }}
        icon={{
          name: 'ai-assistant',
          size: 12,
          position: 'left',
        }}
      />

      {openDialog && (
        <Dialog
          title='AI expression generator'
          isOpen
          onClose={() => setOpenDialog(false)}
          footer={{
            primaryButtonLabel: 'Generate',
            onPrimaryButtonClick: handleGenerateFormula,
            secondaryButtonLabel: 'Cancel',
            onSecondaryButtonClick: () => setOpenDialog(false),
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
    </Accordion>
  );
};

ColumnFormulaSection.propTypes = propTypes;
export default ColumnFormulaSection;
