import React, { useEffect, useState, MutableRefObject } from 'react';
import { ValidationMessage } from '@m-next/validation';
import { colors } from '@m-next/styles';
import Button from '@m-next/button';
import SignaturePad from 'react-signature-canvas';
import './signatureStyles.css';
import * as s from './Signature.styles';

interface SignatureTypes {
  type: string;
  draw: string;
  [key: string]: string;
}

interface SignatureInputProps {
  type: string;
  placeholder?: string;
  sigPadRef: MutableRefObject<SignaturePad | null>;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drawing?:  any;
  signatureTypes: SignatureTypes;
  setSignatureValue: (type: string, value: string) => void;
  resetAddStatus: () => void;
  validationMessage: string;
  setValidationMessage: (message: string) => void;
}

function SignatureInput({
  type,
  placeholder,
  sigPadRef,
  name,
  drawing,
  signatureTypes,
  setSignatureValue,
  resetAddStatus,
  validationMessage,
  setValidationMessage
} : SignatureInputProps){
  const [canvasWidth, setCanvasWidth] = useState(0);

  const clearValidationMsg = () => {
    resetAddStatus();
    setValidationMessage('');
  };

  useEffect(() => {
    if (drawing && sigPadRef.current?.fromData) {
      sigPadRef.current.fromData(drawing);
    }
  }, [sigPadRef.current, drawing]);

  useEffect(() => {
    if (validationMessage) {
      clearValidationMsg();
    }
  }, [type]);

  const onClickClear = () => {
    const isDrawActive = type === signatureTypes.draw;
    setSignatureValue(type, '');
    if (isDrawActive && sigPadRef.current) {
      sigPadRef.current.clear();
    }
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSignatureValue(type, value);
    if (validationMessage) clearValidationMsg();
  };


  const nameInputView = (
    <s.SignatureInput
      label='Full name'
      id='signature-text-input'
      readonly={false}
      placeholder={placeholder}
      type='text'
      name={name}
      value={name}
      onChange={handleNameInputChange}
      validationMessage={validationMessage}
      isV4Design
      autoComplete='on'
    />
  );
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SignaturePadComponent = SignaturePad as any;
  const drawPadView = (
    <div>
      <div style={{ marginBottom: '16px' }}>Draw your signature within the bounding box.</div>
      <s.signatureContainer isInvalid={!!validationMessage && validationMessage.length > 0}>
        <SignaturePadComponent
          onBegin={() => validationMessage && clearValidationMsg()}
          ref={(el: SignaturePad) => {
            const canvas = el?.getCanvas?.();
            if (canvas) {
              if (!canvasWidth) {
                setCanvasWidth(canvas.parentElement?.offsetWidth ?? 0);
              }
              canvas.width = canvasWidth;
              canvas.height = 200;
            }
            sigPadRef.current = el;
          }}
          penColor={colors.method}
        />
      </s.signatureContainer>
      <ValidationMessage id='signature-pad-validation' message={validationMessage} isV4Design />
    </div>
  );

  return (
    <s.inputContainer>
      <div>{type === signatureTypes.draw ? drawPadView : nameInputView}</div>
      <div style={{ marginTop: validationMessage ? '2px' : '16px' }}>
        <Button id='signature-modal-clear' isV4Design buttonStyle='ghost' onClick={onClickClear} value='Clear' />
      </div>
    </s.inputContainer>
  );
}

export default SignatureInput;
