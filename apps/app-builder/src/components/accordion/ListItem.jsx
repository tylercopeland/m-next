import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { TextDiv } from '@m-next/typeography';
import Container from '@m-next/container';
import { useTheme } from '@emotion/react';
import { colors, lightTheme } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import { useEllipsisDetection } from '@m-next/utilities';

const propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  searchText: PropTypes.string,
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

function ListItem({ id, disabled, label, selected, onClick, value, icon, searchText }) {
  const [hover, setHover] = useState(false);
  const { content: themeContent } = useTheme();
  const content = themeContent ?? lightTheme.content;
  const ref = useRef(null);
  const isEllipsed = useEllipsisDetection(ref);

  const getOptionLabel = () => {
    if (!label) return;
    if (searchText) {
      const cleanInput = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let regex = new RegExp(`(.*)(${cleanInput.trim()})(.*)`, 'i');
      let result = label.match(regex);

      if (result === null && searchText.length > 1) {
        regex = new RegExp(
          `(.*)(${searchText.substr(0, searchText.length - 1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.${searchText[
            searchText.length - 1
          ].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(.*)`,
          'i',
        );
        result = label.match(regex);
      }
      if (result === null) {
        return label;
      }
      return (
        <span>
          {result[1]}
          <b>{result[2]}</b>
          {result[3]}
        </span>
      );
    }

    return label;
  };

  const handleClick = () => {
    onClick(value);
  };

  return (
    <Wrapper
      borderless
      style={{
        backgroundColor: selected ? colors.concrete : null,
      }}
      isRound={false}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      tabIndex={0}
    >
      <SvgIcon name={icon} color={hover || selected ? content.secondary : content.primary} size={16} />
      <TextDiv
        ref={ref}
        id={`${id}-label`}
        disabled={disabled}
        isV4Design
        color={hover || selected ? content.secondary : content.primary}
        selected={selected}
        style={{
          flexGrow: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        onClick={handleClick}
        tooltip={getOptionLabel()}
        tooltipId={isEllipsed ? 'editor-tooltip' : null}
      >
        {getOptionLabel()}
      </TextDiv>
    </Wrapper>
  );
}

ListItem.propTypes = propTypes;
export default ListItem;
