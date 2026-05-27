import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { useSelector } from 'react-redux';

import * as s from './recurrenceWidget.styles';
import { selectControls } from '../../../common/services/screenLayoutSlice';

const RecurrenceDesignerWrapper = ({ className = 'ui-draggable-handle control', id }) => {
  const control = useSelector((state) => selectControls(state)[id]);

  return (
    <s.RecContainer
      id={id}
      method_type='REC'
      className={className}
      widthType={control.widthType}
      width={control.width}
      disabled={false}
      visible
    >
      <s.RecurrenceLabel className='mi-caption mi-text-bold' title={control.caption} hideCaption={control.hideCaption}>
        {control.caption}
      </s.RecurrenceLabel>
      <s.RecurrenceWidgetDiv
        id={control.caption ? control.caption : 'Recurrence'}
        className='mi-recurrence mi-control-width-full'
        tabIndex={0}
        disabled={null}
      >
        <s.RecurrenceTitle
          className='mi-label'
          title='Does Not Repeat'
          id={`${control.caption ? control.caption : 'Recurrence'}-PATTERN-SUMMARY`}
        >
          Does Not Repeat
        </s.RecurrenceTitle>
        <s.RecurrenceIcon className={null}>
          <SvgIcon
            name='edit'
            caption='Edit'
            size={14}
            color={colors.blue}
            id={`${control.caption ? control.caption : 'Recurrence'}-EDIT-ICON`}
          />
        </s.RecurrenceIcon>
      </s.RecurrenceWidgetDiv>
    </s.RecContainer>
  );
};

RecurrenceDesignerWrapper.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default RecurrenceDesignerWrapper;
