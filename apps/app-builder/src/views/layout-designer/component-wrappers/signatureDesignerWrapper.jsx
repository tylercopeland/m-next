import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useSelector } from 'react-redux';
import { selectControls } from '../../../common/services/screenLayoutSlice';

const Signature = React.lazy(() => import('@m-next/signature'));

const propTypes = {
    id: PropTypes.string.isRequired,
    onControlClick: PropTypes.func,
};

function SignatureDesignerWrapper({ id, onControlClick }) {
    const control = useSelector((state) => selectControls(state)[id]);

    if (!control) return null;

    // Ensure control has the properties expected by DesignerComponentWrapper
    const normalizedControl = {
        ...control,
        // Ensure width and height are strings with proper format for DesignerComponentWrapper
        width: typeof control.width === 'string' ? control.width : undefined,
        height: typeof control.height === 'string' ? control.height : undefined,
        widthType: control.widthType || 'auto',
        // Ensure other expected properties exist
        disabled: control.disabled || false,
        acceptCaption: control.acceptCaption || 'Accept',
        cancelCaption: control.cancelCaption || 'Cancel',
        hideCancel: control.hideCancel || false,
        hideCaption: control.hideCaption || false,
        caption: control.caption || 'Signature'
    };

    const handleWrapperClick = (e) => {
        e.stopPropagation();
        if (onControlClick) {
            onControlClick(id);
        }
    };

    return (
        <div
            onClick={handleWrapperClick}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                cursor: 'pointer'
            }}
        >
            <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
                <Signature
                    disabled={normalizedControl.disabled}
                    acceptCaption={normalizedControl.acceptCaption}
                    cancelCaption={normalizedControl.cancelCaption}
                    hideCancel={normalizedControl.hideCancel}
                    displayPreferences={{}}
                    label={!normalizedControl.hideCaption ? normalizedControl.caption : null}
                    isSignable={false}
                    isV4Design={true}
                />
            </Suspense>
        </div>
    );
}

SignatureDesignerWrapper.propTypes = propTypes;
export default SignatureDesignerWrapper;
