// import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import ReactActionEditorWrapper from './react/ReactActionEditorWrapper';
import React from 'react';

const rootElement = document.getElementById('react-action-editor-wrapper');

if (rootElement) {
  // This will not exist when we run in legacy angular invocation, which is fine, we want to terminate silently.
  ReactDOM.render(
    // <StrictMode>
    <ReactActionEditorWrapper 
      appId='test-app-id' 
      screenId='test-screen-id' 
      versionId='test-version-id' 
      userSession={{tokenRTC: 'testRTCToken', tokenV2:'testV2Token'}}
    />,
    // </StrictMode>
    rootElement
  );
}
