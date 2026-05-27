import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import { Text } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import Pill from '@m-next/pill';
import { MenuList, MenuItem } from '@m-next/menu';
import styled from '@emotion/styled';
import { basicOperationId } from '@m-next/types';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.number,
  connector: PropTypes.number,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  set: PropTypes.number,
};

function GroupTypeSelector({ id, value, connector, onChange, readonly, set }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const option = useMemo(() => ({ value, label: value === basicOperationId.And ? 'ALL' : 'ANY' }), [value]);
  const connectorLabel = useMemo(() => {
    if (connector) return connector === basicOperationId.And ? 'and' : 'or';
    return null;
  }, [connector]);

  const handleChange = (e) => {
    onChange(e.value, set);
  };

  const openMenu = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleAllClick = () => {
    onChange(basicOperationId.And, set);
    handleClose();
  };

  const handleAnyClick = () => {
    onChange(basicOperationId.Or, set);
    handleClose();
  };

  return (
    <GroupHeaderWrapper id={`${id}-group-header`} readonly={readonly}>
      <Text bold={!readonly}>{connectorLabel ? `${connectorLabel} if` : 'If'}</Text>
      {readonly && (
        <Pill id={`${id}-group-type`} onClick={openMenu} bold colorScheme='grey'>
          <Text bold color={colors.blue}>
            {value === basicOperationId.And ? 'ALL' : 'ANY'}
          </Text>
        </Pill>
      )}
      {readonly && (
        <MenuList id={`${id}-group-type`} anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem id={`${id}-group-all`} onClick={handleAllClick} style={{ textAlign: 'center' }}>
            All
          </MenuItem>
          <MenuItem id={`${id}-group-any`} onClick={handleAnyClick} style={{ textAlign: 'center' }}>
            Any
          </MenuItem>
        </MenuList>
      )}
      {!readonly && (
        <Dropdown
          id={`${id}-group-type`}
          menuPlacement='bottom'
          isV4Design
          value={option}
          options={[
            { value: basicOperationId.And, label: 'ALL' },
            { value: basicOperationId.Or, label: 'ANY' },
          ]}
          onChange={handleChange}
        />
      )}
      <Text bold={!readonly}>of the following are true:</Text>
    </GroupHeaderWrapper>
  );
}

GroupTypeSelector.propTypes = propTypes;
export default GroupTypeSelector;

const GroupHeaderWrapper = styled.div(({ readonly }) => [
  {
    display: 'flex',
    alignItems: 'center',
    gap: readonly ? 4 : 8,
  },
]);
