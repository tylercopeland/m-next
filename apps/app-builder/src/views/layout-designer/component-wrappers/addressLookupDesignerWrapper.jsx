import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectControls } from '../../../common/services/screenLayoutSlice';
import { getGatewayUrl } from '../../../common/services/urlServce';

const AddressLookup = React.lazy(() => import('@m-next/address-lookup'));

function AddressLookupDesignerWrapper({ id }) {
  // Support both controlled and uncontrolled usage
  const control = useSelector((state) => selectControls(state)[id]);
  const gatewayUrl = getGatewayUrl();

  return (
    <div>
      <Suspense fallback={<div style={{ height: 40, background: '#eee' }}>Loading Address Lookup...</div>}>
        <AddressLookup
          id={id}
          caption={control.hideCaption ? null : control.caption}
          placeholder={control.placeholder}
          required={control.required}
          disabled={control.disabled}
          gatewayUrl={gatewayUrl}
          width='100%'
        />
      </Suspense>
    </div>
  );
}

AddressLookupDesignerWrapper.propTypes = {
  id: PropTypes.string,
};

export default AddressLookupDesignerWrapper;
