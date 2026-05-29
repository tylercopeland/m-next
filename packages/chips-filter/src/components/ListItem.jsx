import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import CheckBox from '@m-next/checkbox';
import Toggle from '@m-next/toggle';
import Image from '@m-next/image';
import { Text } from '@m-next/typeography';
import Container from '@m-next/container';
import { useTheme } from '@emotion/react';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';
import Pill from '@m-next/pill';
import { Tag } from '@m-next/types';

const propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  isMobile: PropTypes.bool,
  showLabel: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  showToggle: PropTypes.bool,
  showImage: PropTypes.bool,
  showPill: PropTypes.bool,
  rightSelect: PropTypes.bool,
  label: PropTypes.string,
  image: PropTypes.string,
  checked: PropTypes.bool,
  bold: PropTypes.bool,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tagsList: PropTypes.arrayOf(Tag),
  tooltipId: PropTypes.string,
};

const Wrapper = styled(Container)`
  flex-direction: row;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  :hover {
    background-color: ${colors.concrete};
  }
`;

function ListItem({
  id,
  isMobile,
  disabled,
  showLabel = true,
  showCheckbox = true,
  showToggle = false,
  showImage = false,
  showPill = false,
  rightSelect = false,
  label,
  image,
  checked,
  bold,
  selected,
  onClick,
  value,
  tagsList,
  tooltipId,
}) {
  const [hover, setHover] = useState(false);
  const { content: themeContent } = useTheme();
  const content = themeContent ?? lightTheme.content;

  const color = useMemo(() => {
    if (showPill && tagsList) {
      const match = tagsList.find((tag) => tag.name === value);
      switch (match?.colour.toLowerCase()) {
        case '#84f3ff':
          return 'teal';
        case '#a9d9bf':
          return 'green';
        case '#ffabb5':
          return 'fuchsia';
        case '#bacad0':
          return 'grey';
        case '#ffea80':
          return 'yellow';
        case '#ffaca1':
          return 'red';
        case '#91a2ff':
          return 'purple';
        case '#ffcdab':
          return 'orange';
        default:
          return 'blue';
      }
    }
    if (showPill && !tagsList) {
      return 'blue';
    }
    return '';
  }, [showPill, tagsList, value]);

  const handleClick = () => {
    onClick(value);
  };

  return (
    <Wrapper
      borderless
      style={{}}
      isRound={false}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      index={-1}
    >
      {showCheckbox && !rightSelect && (
        <CheckBox
          id={`${id}-checkbox`}
          disabled={disabled}
          isMobile={isMobile}
          checked={checked}
          isV4Design
          narrow
          name={label}
          onChange={handleClick}
        />
      )}

      {showImage && (
        <Image
          id={`${id}-image`}
          disabled={disabled}
          isMobile={isMobile}
          circle
          height={isMobile ? 32 : 24}
          width={isMobile ? 32 : 24}
          isV4Design
          value={image}
          onClick={handleClick}
        />
      )}

      {showLabel && (
        <Text
          id={`${id}-label`}
          disabled={disabled}
          isMobile={isMobile}
          isV4Design
          color={hover || selected ? content.secondary : content.primary}
          style={{
            flexGrow: 1,
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          bold={bold}
          onClick={handleClick}
          tooltip={label?.length > 16 ? label : null}
          tooltipId={tooltipId}
        >
          {label || '(blank)'}
        </Text>
      )}

      {showPill && (
        <Pill
          id={`${id}-pill`}
          disabled={disabled}
          isMobile={isMobile}
          isV4Design
          style={{ cursor: 'pointer' }}
          colorScheme={color}
          variant='solid'
          size='narrow'
          onClick={handleClick}
          tooltip={label?.length > 30 ? label : null}
          tooltipId={tooltipId}
        >
          {label}
        </Pill>
      )}

      {showToggle && (
        <Toggle
          id={`${id}-toggle`}
          disabled={disabled}
          isMobile={isMobile}
          checked={checked}
          isV4Design
          size={isMobile ? 'medium' : 'small'}
          name={label}
          onChange={handleClick}
        />
      )}

      {showCheckbox && rightSelect && (
        <CheckBox
          id={`${id}-checkbox`}
          disabled={disabled}
          isMobile={isMobile}
          checked={checked}
          isV4Design
          narrow
          name={label}
          onChange={handleClick}
        />
      )}
    </Wrapper>
  );
}

ListItem.propTypes = propTypes;
export default ListItem;
