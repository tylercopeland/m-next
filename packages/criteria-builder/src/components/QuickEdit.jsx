import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import styled from '@emotion/styled';
import { Popper } from '@mui/material';
import { ClickOutside } from '@m-next/utilities';
import Container from '@m-next/container';
import { colors } from '@m-next/styles';
import { Text } from '@m-next/typeography';
import Button from '@m-next/button';
import { HTMLElementType, Predicate } from '@m-next/types';
import PredicateEditor from './PredicateEditor';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  first: Predicate,
  operation: PropTypes.number,
  second: Predicate,
  dateField: PropTypes.number,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  index: PropTypes.number,
  set: PropTypes.number,
  elementKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  anchorEl: PropTypes.oneOfType([HTMLElementType, PropTypes.object, PropTypes.func]),
  open: PropTypes.bool,
  validation: PropTypes.shape({
    first: PropTypes.shape({
      value: PropTypes.string,
      type: PropTypes.string,
      property: PropTypes.string,
      childProperty: PropTypes.string,
    }),
    operation: PropTypes.string,
    second: PropTypes.shape({
      value: PropTypes.string,
      type: PropTypes.string,
      property: PropTypes.string,
      childProperty: PropTypes.string,
    }),
  }),
  ghost: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
  includeControls: PropTypes.bool,
  includeSessionVariables: PropTypes.bool,
};

const HeaderWrapper = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
]);

const FilterWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    background: colors['grey-lighter'],
    flexDirection: 'column',
    padding: 8,
  },
]);

const ButtonFooter = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    paddingTop: 8,
    justifyContent: 'flex-end',
  },
]);

function QuickEdit({
  id,
  first,
  operation,
  second,
  dateField,
  fieldList,
  controlList,
  onClose,
  onCancel,
  onChange,
  fieldListOptions,
  index,
  set,
  open,
  anchorEl,
  validation,
  elementKey,
  ghost,
  forcedTimeZone,
  includeControls = true,
  includeSessionVariables = true,
}) {
  const [disableClickOutside, setDisableClickOutside] = useState(false);

  const handleDisableClickOutSide = (disable) => {
    setDisableClickOutside(disable);
  };
  const parent = useRef();

  const handleCancel = () => {
    if (!disableClickOutside) {
      onCancel();
    }
  };

  return (
    <Popper
      id={`${id}-quick-editor`}
      ref={parent}
      open={open}
      anchorEl={anchorEl}
      placement='left-end'
      style={{ zIndex: 9999 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 16],
          },
        },
      ]}
      role='none'
    >
      <ClickOutside onClickOutsideHandler={handleCancel} parentRef={parent}>
        <Container
          width={320}
          borderless
          style={{
            padding: 8,
            borderRadius: 4,
            border: ` 1px solid ${colors['grey-light']}`,
            background: colors.white,
            boxShadow: '0px 10px 10px 0px rgba(0, 0, 0, 0.25)',
          }}
        >
          <HeaderWrapper>
            <Text id={`${id}-quick-editor-title`} bold>
              {first.value ? 'Edit' : 'Add'} Filter
            </Text>
          </HeaderWrapper>
          <FilterWrapper>
            <PredicateEditor
              id={id}
              first={first}
              operation={operation}
              second={second}
              dateField={dateField}
              controlList={controlList}
              fieldList={fieldList}
              fieldListOptions={fieldListOptions}
              onChange={onChange}
              index={index}
              validation={validation}
              set={set}
              elementKey={elementKey}
              ghost={ghost}
              onDisableClickOutside={handleDisableClickOutSide}
              forcedTimeZone={forcedTimeZone}
              includeControls={includeControls}
              includeSessionVariables={includeSessionVariables}
            />
          </FilterWrapper>
          <ButtonFooter>
            <Button id='cancel' buttonStyle='link' onClick={onCancel} value='Cancel' />
            <Button id='apply' buttonStyle='primary' onClick={onClose} value='Apply' />
          </ButtonFooter>
        </Container>
      </ClickOutside>
      <Tooltip id='popover-tooltip' />
    </Popper>
  );
}

QuickEdit.propTypes = propTypes;
export default QuickEdit;
