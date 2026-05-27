import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ValidationMessage } from '@m-next/validation';
import Button from '@m-next/button';
import { colors } from '@m-next/styles';
import Dialog from '@m-next/dialog';
import { formatter } from '@m-next/utilities';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import ScreenCapture from './ScreenCapture';
import * as s from './Signature.styles';
import './signatureStyles.css';
import { SignatureModalDialog } from './SignatureModalDialog';

const propTypes = {
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  data: PropTypes.instanceOf(Object),
  acceptCaption: PropTypes.string,
  cancelCaption: PropTypes.string,
  isMobile: PropTypes.bool,
  hideCancel: PropTypes.bool,
  displayPreferences: PropTypes.instanceOf(Object),
  label: PropTypes.string,
  panelName: PropTypes.string,
  isSignable: PropTypes.bool,
  onAccept: PropTypes.func,
  onCancel: PropTypes.func,
  onUpload: PropTypes.func,
};

interface SignatureModel {
  name: string;
  drawing: string | null;
  documentId: string;
  documentUrl: string;
  signatureUrl: string;
  drawingUrl: string;
  ipAddress: string;
  isSigned: boolean;
  signedOn: string | null;
}

interface SignatureProps {
  disabled: boolean,
  visible?: boolean,
  data?: SignatureModel,
  acceptCaption: string,
  cancelCaption: string,
  isMobile?: boolean,
  hideCancel: boolean,
  displayPreferences: object,
  label?: string,
  placeholder?: string,
  panelName?: string,
  isSignable?: boolean,
  onAccept?: () => void,
  onCancel?: () => void,
  onUpload?: (documentId: string, data: FormData) => Promise<{ data: SignatureModel }>,
}

function Signature({ disabled, visible = true, data, acceptCaption, cancelCaption, isMobile = false, hideCancel, displayPreferences, label, placeholder, panelName, isSignable = true, onAccept, onCancel, onUpload }: SignatureProps) {
  const [acceptInProgress, setAcceptInProgress] = useState(false);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const defaultValue: SignatureModel = {
    name: '',
    drawing: null,
    documentId: uuidv4(),
    documentUrl: '',
    signatureUrl: '',
    drawingUrl: '',
    ipAddress: '',
    isSigned: false,
    signedOn: null,
  };

  const [model, setModel] = useState(defaultValue);
  const [validationMessage, setValidationMessage] = useState('');

  const isReadOnly = () => model.isSigned && model.documentUrl && model.signatureUrl;
  const isIOS = () =>
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  const screenCapture = useMemo(() => ScreenCapture(), []);

  const signatureDefaultModel = {
    isAdded: false,
    isTyped: false,
    isDrawn: false,
    validation: '',
  };

  const drawingDefaultModel = {
    points: null,
    img: null,
    blob: null,
  };

  const [signatureModel, setSignatureModel] = useState(signatureDefaultModel);
  const [drawingModel, setDrawingModel] = useState(drawingDefaultModel);

  const addOrEditSignature = () => {
    if (acceptInProgress || !isSignable || disabled) {
      return;
    }
    setSignModalOpen(true);
  };

  const handleCancel = () => {
    setSignModalOpen(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAdd = async (drawPadValue: any, nameValue: string) => {
    const noDrawing = !(drawPadValue !== null);
    if (noDrawing) {
      setModel({ ...model, drawing: null, name: nameValue });
      setDrawingModel(drawingDefaultModel);
    } else {
      const canvas = drawPadValue.getTrimmedCanvas();
      const blob = canvas.msToBlob
        ? canvas.msToBlob()
        :
          await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));

      setModel({ ...model, name: '' });
      setDrawingModel({
        points: drawPadValue.toData(),
        img: canvas.toDataURL('image/png'),
        blob,
      });
    }
    setSignatureModel({
      isAdded: true,
      isDrawn: !noDrawing,
      isTyped: noDrawing,
      validation: '',
    });
    setSignModalOpen(false);
  }

  const processUpload = async () => {
    if(onUpload){
      try {
        const el = document.getElementById(`runtime-sub-content-${panelName}`)!;
        const files = await screenCapture.generate(model, drawingModel.img ?? '', el, isIOS());

        const formData = new FormData();
        formData.append('files', files[0], 'doc.pdf');
        formData.append('files', files[1], 'sig.jpeg');
        if (signatureModel.isDrawn && drawingModel.blob) {
          formData.append('files', drawingModel.blob, 'drawing.png');
        }
 
        formData.append('name', model.name);

        const response = await onUpload(model.documentId, formData);

        if (response.data) {
          setModel(response.data);
        }
      } catch (error) {
        setErrorModalOpen(true);
        throw error;
      } finally  {
        setAcceptInProgress(false);
      }
    }
  };

  const handleOnAccept = async () => {
    if(isSignable){
      if (!signatureModel.isAdded) {
        setSignatureModel({
          ...signatureModel,
          validation: 'You must add a signature to continue.',
        });
        return;
      }

      setSignatureModel({
        ...signatureModel,
        validation: '',
      });

      if(onAccept){
        setAcceptInProgress(true);
        await processUpload();
        onAccept();
      }
    }
  };

  const handleOnCancel = () => {
    if(onCancel){
      onCancel();
    }
  }

  useEffect(() => {
    if (data) {
      setModel(data);
      if (data.isSigned) {
        setSignatureModel((state) => ({
          ...state,
          isDrawn: data.drawingUrl?.length > 0,
          isTyped: data.name?.length > 0,
          isAdded: true,
        }));
      }
    }
  }, [data]);

  useEffect(() => {
    if (validationMessage) {
      setSignatureModel({
        ...signatureModel,
        validation: validationMessage,
      });
    }
  }, [validationMessage]);

  const handlePlaceholderClick = () => {
    if (isReadOnly()) {
      window.open(model.documentUrl, '_blank');
      return;
    }
    addOrEditSignature();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => e.key === 'Enter' && handlePlaceholderClick();

  const currentDate = formatter.formatDate('Short Date', moment().toDate(), displayPreferences);
  const signedOnDate = () => formatter.formatDate('Short Date', model.signedOn ?? new Date(), displayPreferences);

  const getSignOnDateBySignature = () => (isReadOnly() ? signedOnDate() : currentDate);

  return (
    visible ? (
      <>
        {label ? <label htmlFor='signature-widget-wrapper'>{label}</label> : null}
        <s.Wrapper
          id='signature-widget-wrapper'
          isSigned={signatureModel.isAdded}
          isInvalid={signatureModel.validation.length > 0}
        >
          <div id='signature-widget-wrapper-inner'>
            <s.Placeholder
              role='link'
              id='signature-widget-placeholder'
              isSignatureAdded={signatureModel.isAdded}
              onClick={addOrEditSignature}
              tabIndex={0}
              onKeyUp={handleKeyPress}
            >
              Add a signature
            </s.Placeholder>
            <s.Container role='link'
              isSignatureAdded={signatureModel.isAdded}
              onClick={handlePlaceholderClick}
            >
              {signatureModel.isDrawn ? (
                <img
                  id='signature-drawing-img'
                  src={(isReadOnly() ? model.drawingUrl : drawingModel.img) ?? undefined}
                  alt='signature'
                  style={{ height: '80px' }}
                />
              ) : (
                <s.SignatureLabel>{model.name}</s.SignatureLabel>
             )}
              <p>
                {signatureModel.isDrawn
                  ? `Signed ${getSignOnDateBySignature()}`
                  : `${model.name} ${getSignOnDateBySignature()}`}
              </p>
              <p>
                <b>ID:</b> {model.documentId?.split('-').join('')}
              </p>
              <s.SignatureLink
                id='signature-edit' 
                tabIndex={0}
                onKeyUp={handleKeyPress}
              >
                  {isReadOnly() ? 'View signed document' : 'Edit signature'}
              </s.SignatureLink>
            </s.Container>
          </div>
        </s.Wrapper>
        <ValidationMessage
          id='signature-validation'
          message={signatureModel.validation}
          isV4Design
        />
        <div style={{ display: isReadOnly() ? 'none' : undefined }}>
          <s.ButtonsContainer id='signature-buttons' isMobile={isMobile}>
            <Button
              onClick={handleOnAccept}
              disabled={disabled || acceptInProgress}
              isMobile={isMobile}
              isV4Design
              id='signature-accept'
              buttonStyle='primary'
              value={acceptCaption}
              style={{ margin: isMobile ? '0 0 10px 0' : '0  0  0 10px' }}
            />

            {!hideCancel ? (
              <Button
                onClick={handleOnCancel}
                disabled={disabled}
                isMobile={isMobile}
                isV4Design
                id='signature-cancel'
                buttonStyle='ghost'
                value={cancelCaption}
              />
            ) : null}
          </s.ButtonsContainer>
        </div>
        <SignatureModalDialog
          isOpen={signModalOpen}
          placeholder={placeholder}
          modelName={model.name}
          handleAdd={handleAdd}
          handleCancel={handleCancel}
          validationMessage={validationMessage}
          setValidationMessage={setValidationMessage}
          drawingPoints={drawingModel.points || []}
        />
        <Dialog
          id='signature-upload-error'
          isOpen={errorModalOpen}
          role='alertdialog'
          title='Signature'
          footer={{
            primaryButtonLabel: 'Ok',
            onPrimaryButtonClick: () => setErrorModalOpen(false)
          }}
        >
          <div style={{ color: colors.red }}>Unable to store signature, no active screen id.</div>
        </Dialog>
      </>
    ) : null
  );
}

Signature.propTypes = propTypes;
export default Signature;
