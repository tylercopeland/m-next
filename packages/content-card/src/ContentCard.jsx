import React from 'react';
import PropTypes from 'prop-types';
import Button from '@m-next/button';
import Pill from '@m-next/pill';
import SvgIcon from '@m-next/svg-icon';
import * as s from './ContentCard.styles';

const propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  timeToComplete: PropTypes.number,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  isComplete: PropTypes.bool,
  thumbnail: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default function ContentCard(props) {
  const {
    id,
    title,
    description,
    timeToComplete,
    buttonText = 'Launch Demo',
    onClick,
    isComplete = false,
    icon,
    iconColor,
    iconSize,
    thumbnail,
  } = props;

  return (
    <s.ContentCardWrapper id={id} style={{ position: 'relative' }}>
      {isComplete && icon && (
        <s.CompletionIcon>
          <SvgIcon id={`${id}-svg-icon`} name={icon} size={iconSize || 16} color={iconColor || 'green'} />
        </s.CompletionIcon>
      )}
      {thumbnail ? <s.ThumbnailImage src={thumbnail} alt={title || 'thumbnail'} /> : <s.Thumbnail />}
      <s.BottomSection>
        <s.HeaderText>{title}</s.HeaderText>
        <s.Description>{description}</s.Description>
        <s.CTAContainer>
          <Button id={`${id}-button`} buttonStyle='ghost' isV4Design value={buttonText} onClick={onClick} />
          {timeToComplete && (
            <Pill size='narrow' colorScheme='grey'>
              ~{timeToComplete}min
            </Pill>
          )}
        </s.CTAContainer>
      </s.BottomSection>
    </s.ContentCardWrapper>
  );
}

ContentCard.propTypes = propTypes;
