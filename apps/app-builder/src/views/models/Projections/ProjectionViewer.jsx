import React, { useMemo, Suspense } from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { DataModel, Projection } from '@m-next/types';
import Accordion from '../../../components/accordion/Accordion';
import ProjectionGrid from './ProjectionGrid';

const CriteriaEditor = React.lazy(() => import('@m-next/criteria-builder'));

const propTypes = {
  id: PropTypes.string,
  projectionId: PropTypes.string,
  projection: PropTypes.arrayOf(Projection),
  dataModel: DataModel,
  onChange: PropTypes.func,
  displayPreferences: PropTypes.instanceOf(Object),
};

function ProjectionViewer({ id, projectionId, projections, dataModel, onChange, displayPreferences }) {
  const projection = useMemo(() => {
    const match = projections.filter((x) => x.id === projectionId);
    if (match !== null && match.length > 0) {
      return match[0];
    }
    return null;
  }, [projectionId, projections]);

  const render = () => {
    if (projection) {
      return (
        <Accordion id={id} caption={projection.caption}>
          <Accordion id={`${id}-columns`} caption='Columns'>
            <ProjectionGrid
              dataModel={dataModel}
              displayPreferences={displayPreferences}
              id={`${id}-columns-grid`}
              onChange={onChange}
              projection={projection}
            />
          </Accordion>

          <Accordion id={`${id}-filter-criteria`} caption='Filter criteria'>
            <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='60px' circle={false} duration={1.4} />}>
              <CriteriaEditor
                id={`${id}-filter-expression`}
                controlList={[]}
                displayPreferences={displayPreferences}
                dataModelId={dataModel.name}
                expression={projection.filtering}
                filterId={projection.id}
                fieldList={dataModel.fields}
                //  onChange={onFilterChange}
                //   onUpdatedValidStatus={handleExpressionValidationChange}
                //   onSendAnalytics={onSendAnalytics}
              />
            </Suspense>
          </Accordion>
        </Accordion>
      );
    }
    return null;
  };

  return render();
}

ProjectionViewer.propTypes = propTypes;
export default ProjectionViewer;
