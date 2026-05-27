import React, { Suspense, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useSelector } from 'react-redux';
import { Div } from '@m-next/typeography/src/Typeography.styles';
import { selectControls } from '../../../common/services/screenLayoutSlice';

const Checkbox = React.lazy(() => import('@m-next/checkbox'));

const propTypes = {
    id: PropTypes.string,
};

function CheckboxDesignerWrapper({ id }) {
    const control = useSelector((state) => selectControls(state)[id]);
    const [checked, setChecked] = useState(control.defaultValue);

    useEffect(() => {
        setChecked(control.defaultValue);
    }, [control.defaultValue]);

    const handleClick = () => {
        setChecked(!checked);
    }

    return (
        <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
            <Div style={{ height: 24, marginTop: 8 }} onClick={!control.disabled ? handleClick : null}>
                <Checkbox 
                    id={control.id}
                    align={control.align?.toLowerCase() || 'left'}
                    checked={checked}
                    hideCaption={control.hideCaption}
                    label={control.caption}
                    disabled={control.disabled}
                    hidden={control.hidden}
                    onChange={handleClick}
                    legacyClasses={control.classes}
                    style={{ position: 'relative' }}
                    narrow
                />
            </Div>
        </Suspense>
    )
}

CheckboxDesignerWrapper.propTypes = propTypes;
export default CheckboxDesignerWrapper;

