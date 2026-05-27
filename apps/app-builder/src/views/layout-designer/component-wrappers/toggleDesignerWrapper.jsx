import React, { Suspense, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useSelector } from 'react-redux';
import { Div } from '@m-next/typeography/src/Typeography.styles';
import { selectControls } from '../../../common/services/screenLayoutSlice';

const Toggle = React.lazy(() => import('@m-next/toggle'));

const propTypes = {
    id: PropTypes.string,
};

function ToggleDesignerWrapper({ id }) {
    const control = useSelector((state) => selectControls(state)[id]);

    // Parse defaultValue safely - handle legacy bug where defaultValue was incorrectly set to "Toggle"
    const parseDefaultValue = (val) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') {
            return val.toLowerCase() === 'true' || val.toLowerCase() === 'yes';
        }
        return false;
    };

    const [toggled, setToggled] = useState(parseDefaultValue(control.defaultValue));

    useEffect(() => {
        setToggled(parseDefaultValue(control.defaultValue));
    }, [control.defaultValue]);

    const handleClick = () => {
        setToggled(!toggled);
    }

    const alignRight = useMemo(() => control.classes?.toLowerCase().indexOf('mi-caption-float-right') >= 0, [control.classes]);

    return (
        <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
            <Div style={{ height: 24, marginTop: 4, marginBottom: 4, width: 'fit-content' }} onClick={!control.disabled ? handleClick : null}> 
                <Toggle
                    id={control.id}
                    checked={toggled}
                    label={control.hideCaption ? null : control.caption}
                    disabled={control.disabled}
                    hidden={control.hidden}
                    onChange={handleClick}
                    legacyClasses={control.classes}
                    alignRight={alignRight}
                    style={{ display: 'inline-block' }}
                    labelStyle={control.hideCaption ? {} : { float: alignRight ? 'right' : 'left' }}
                    bold
                />
            </Div>
        </Suspense>
    )
}

ToggleDesignerWrapper.propTypes = propTypes;
export default ToggleDesignerWrapper;