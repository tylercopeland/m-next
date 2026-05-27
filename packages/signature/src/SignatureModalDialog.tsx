import React, { useState, useRef, useEffect } from 'react';
import Dialog from '@m-next/dialog';
import { TabHeader } from '@m-next/tabs';
import SignatureInput from './SignatureInput';

// constants
const signatureTypes = { type: 'Type', draw: 'Draw' };

const tabs = [
  { id: 'signature-dialog-type', caption: signatureTypes.type },
  { id:'signature-dialog-draw', caption: signatureTypes.draw },
];

interface Point {
  x: number;
  y: number;
}

interface SignatureModalDialogProps {
  isOpen: boolean,
  placeholder?: string;
  modelName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleAdd: (drawing: any, name: string) => Promise<void>;
  handleCancel: () => void;
  validationMessage: string;
  setValidationMessage: (message: string) => void;
  drawingPoints: Point[];
}

export function SignatureModalDialog({ isOpen, placeholder, modelName, handleAdd, handleCancel, validationMessage, setValidationMessage, drawingPoints }: SignatureModalDialogProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]?.id ?? '');

  const sigPadRef = useRef(null);
  const [signatureState, setSignatureState] = useState({
    addStatus: 'idle',
    Type: modelName,
    Draw: drawingPoints,
  });

  useEffect(() => {
    setSignatureState((prev) => ({
      ...prev,
      Type: modelName,
      Draw: drawingPoints,
    }));
  }, [modelName, drawingPoints]);

  const setSignatureValue = (signatureType: string, value: string) =>
    setSignatureState({
      ...signatureState,
      [signatureType]: value,
      addStatus: 'idle',
    });
  const setAddSignatureStatus = (addStatus: 'idle' | 'pending' | 'error') =>
    setSignatureState({ ...signatureState, addStatus });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function validateInputs(drawPadValue: any, nameValue: string) {
    if (!nameValue && tabs[0] && selectedTab === tabs[0].id) {
      setValidationMessage('Please type your name to continue.');
      return false;
    }

    if ((drawPadValue === null || drawPadValue.isEmpty?.()) && tabs[1] && selectedTab === tabs[1].id) {
      setValidationMessage('Please draw your signature to continue.');
      return false;
    }

    return true;
  }

  const handleConfirm = () => {
    const newDrawPadValue = sigPadRef.current;
    setAddSignatureStatus('pending');

    if (validateInputs(newDrawPadValue, signatureState.Type || '')) {
      handleAdd(newDrawPadValue, signatureState.Type || '')
        .catch(() => {
          setAddSignatureStatus('error');
        });
    } else {
      setAddSignatureStatus('error');
    }
  };

  function renderSignatureInput() {
    return (
      <SignatureInput
        type={tabs.find((tab) => tab.id === selectedTab)?.caption || ''}
        placeholder={placeholder}
        signatureTypes={signatureTypes}
        name={signatureState.Type || ''}
        drawing={signatureState.Draw}
        sigPadRef={sigPadRef}
        setSignatureValue={setSignatureValue}
        resetAddStatus={() => setAddSignatureStatus('idle')}
        validationMessage={validationMessage}
        setValidationMessage={setValidationMessage}
      />
    );
  }

  return (
    <Dialog
      id='signature-widget-modalDialog'
      isOpen={isOpen}
      onClose={handleCancel}
      width='auto'
      header={
        <TabHeader
          id='signature-tabs'
          headerStyle={{ borderBottomWidth: '0px', height: '40px'}}
          tabList={tabs}
          selectedTab={selectedTab}
          onChange={setSelectedTab}
        />
      }
      footer={{
        primaryButtonLabel: 'Add signature',
        onPrimaryButtonClick: handleConfirm,
        secondaryButtonLabel: 'Cancel',
        onSecondaryButtonClick: handleCancel,
      }}
    >
      {renderSignatureInput()}
    </Dialog>
  );
}

export default SignatureModalDialog;
