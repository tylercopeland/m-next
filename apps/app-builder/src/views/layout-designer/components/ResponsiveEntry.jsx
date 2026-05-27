import React from 'react';
import PropTypes from 'prop-types';
import { Grid as FluidGrid } from '@mui/material';
import { widgets } from '@m-next/types';
import DesignerComponentWrapper from '../component-wrappers/designerComponentWrapper';
import FieldBlockDesignerWrapper from '../component-wrappers/fieldBlockDesignerWrapper';
import ChartDesignerWrapper from '../component-wrappers/chartDesignerWrapper';
import GridDesignerWrapper from '../component-wrappers/gridDesignerWrapper';
import CardDesignerWrapper from '../component-wrappers/CardDesignWrapper';

// types
const propTypes = {
  layout: PropTypes.shape({
    size: PropTypes.number,
    controlId: PropTypes.string,
    type: PropTypes.string,
  }),
  onControlClick: PropTypes.func,
  width: PropTypes.number,
};

function ResponsiveEntry({ layout, onControlClick, width }) {
  const { size, controlId, type } = layout;

  return (
    <FluidGrid item id={controlId} key={controlId} md={size}>
      {type === widgets.FIELD_BLOCK && (
        <DesignerComponentWrapper key={controlId} id={controlId} onControlClick={onControlClick}>
          <FieldBlockDesignerWrapper id={controlId} />
        </DesignerComponentWrapper>
      )}
      {type === widgets.CHART && (
        <ChartDesignerWrapper key={controlId} id={controlId} onControlClick={onControlClick} />
      )}
      {type === widgets.DATATABLE && (
        <DesignerComponentWrapper key={controlId} id={controlId} onControlClick={onControlClick} width={width}>
          <GridDesignerWrapper id={controlId} />
        </DesignerComponentWrapper>
      )}
      {type === widgets.CARD && (
        <DesignerComponentWrapper key={controlId} id={controlId} onControlClick={onControlClick}>
          <CardDesignerWrapper id={controlId} />
        </DesignerComponentWrapper>
      )}
    </FluidGrid>
  );
}

ResponsiveEntry.propTypes = propTypes;
export default ResponsiveEntry;
