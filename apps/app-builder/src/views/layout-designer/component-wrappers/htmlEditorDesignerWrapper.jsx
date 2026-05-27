import React, { Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  selectControls
} from '../../../common/services/screenLayoutSlice';
import {
  selectAccountName,
  selectMethodIdentity,
  selectTokenRTC
} from '../../../common/services/sessionSlice';
import { getValueFromComplexValue } from '../../../components/complex-value/complex-value-utils';
import { getGatewayUrl, getRuntimeUrl } from "../../../common/services/urlServce";

const HtmlEditor = React.lazy(() => import('@m-next/html-editor'));

function HtmlEditorDesignerWrapper({ id }) {
  // Support both controlled and uncontrolled usage
  const control = useSelector((state) => selectControls(state)[id]);
  const controlList = useSelector(selectControls);
  const gatewayUrl = getGatewayUrl();
  
  // Get authentication information from session
  const accountName = useSelector(selectAccountName);
  const methodIdentity = useSelector(selectMethodIdentity);
  const tokenRTC = useSelector(selectTokenRTC);
  
  // Create authContext object
  const authContext = {
    account: accountName || '',
    identity: methodIdentity || '',
    authToken: tokenRTC || '',
    runtimeCoreUrl: getRuntimeUrl(),
    secureToken: accountName && methodIdentity && tokenRTC
      ? `${accountName}:${methodIdentity}:${tokenRTC}`
      : ''
  };

  // Extract the value from the complex value object with null checks
  const defaultValue = useMemo(() => getValueFromComplexValue(control.defaultValue, controlList), [control, controlList]);

  // Early return if control doesn't exist yet
  if (!control) {
    return (
      <Suspense fallback={<div style={{ height: 200, background: "#eee" }}>Loading html editor...</div>}>
        <div style={{ height: 200, background: "#f5f5f5", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>HTML Editor</div>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div style={{ height: 4000, background: "#eee" }}>Loading html editor...</div>}>
      <HtmlEditor
        authContext={authContext}
        id={id}
        caption={control.hideCaption ? null : control.caption}
        placeholder={control.placeholder}
        required={control.required}
        disabled={control.disabled}
        isV4Design
        gatewayUrl={gatewayUrl}
        data={defaultValue}
      />
    </Suspense>
  );
}

HtmlEditorDesignerWrapper.propTypes = {
  id: PropTypes.string,
};

export default HtmlEditorDesignerWrapper;
