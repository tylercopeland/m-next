import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import Button from '@m-next/button';
import { colors } from '@m-next/styles';
import * as s from './EmptyCanvasState.styles';

/**
 * EmptyCanvasState component displays a friendly empty state message
 * when the canvas has no components, encouraging users to add components.
 * Based on Figma design: https://www.figma.com/design/EqYPQ0iA60pSN5aXcDuTOY/App-builder---Layout-engine?node-id=293-852376
 */
const EmptyCanvasState = ({
  onAddComponents,
  heading = 'Your canvas is blank',
  subtext = 'Start creating your masterpiece by dragging components onto the screen.',
  buttonText = 'Add components',
}) => (
  <s.MainContainer>
    <s.EmptyStateContainer>
      <SvgIcon name='mission-graphic' size={104} color={colors['blue']} />
      <s.TextContainer>
        <s.Heading>{heading}</s.Heading>
        <s.Subtext>{subtext}</s.Subtext>
      </s.TextContainer>
      <Button
        id='add-components-button'
        value={buttonText}
        buttonStyle='primary'
        isV4Design
        onClick={(e) => {
          e.stopPropagation();
          onAddComponents();
        }}
      />
    </s.EmptyStateContainer>
  </s.MainContainer>
);

EmptyCanvasState.propTypes = {
  /** Callback function when the "Add components" button is clicked */
  onAddComponents: PropTypes.func.isRequired,
  /** Optional custom heading text */
  heading: PropTypes.string,
  /** Optional custom subtext */
  subtext: PropTypes.string,
  /** Optional custom button text */
  buttonText: PropTypes.string,
};

export default EmptyCanvasState;
