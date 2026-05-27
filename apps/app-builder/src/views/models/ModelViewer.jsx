import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import Container from '@m-next/container';
import { Header } from '@m-next/typeography';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { Tooltip } from 'react-tooltip';
import { Grid as FluidGrid } from '@mui/material';

import ModelField from './ModelField';
import { useGetDataModelQuery } from '../../common/services/dataModelApi';
import { selectDisplayPreferences } from '../../common/services/sessionSlice';

const CriteriaEditor = React.lazy(() => import('@m-next/criteria-builder'));

const propTypes = {};

function ModelViewer() {
  const { dataModelId } = useParams();
  const displayPreferences = useSelector(selectDisplayPreferences);
  const { data: dataModel } = useGetDataModelQuery({ dataModelId });

  return dataModel ? (
    <Container id='model-list' isRound={false} borderless isLoading={!dataModel}>
      <Header>{dataModel.caption}</Header>
      <FluidGrid container spacing={2} columns={{ xs: 4, sm: 6, md: 12 }}>
        <FluidGrid item md={4} style={{ height: 500 }}>
          <Header variant='h2'>Fields</Header>
          <Container
            scrollable
            style={{
              flexDirection: 'column',
              display: 'flex',
              gap: '16px',
            }}
          >
            {dataModel.fields.map((field) => (
              <ModelField key={field.name} field={field} />
            ))}
          </Container>
        </FluidGrid>
        <FluidGrid item md={8}>
          <Header variant='h2' style={{ marginTop: 16 }}>
            Filter criteria
          </Header>
          <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='60px' circle={false} duration={1.4} />}>
            <CriteriaEditor
              id='model-filter-expression'
              controlList={[]}
              displayPreferences={displayPreferences}
              dataModelId={dataModel.name}
              expression={dataModel.filtering || []}
              filterId={dataModel.id}
              fieldList={dataModel.fields}
              disabled
              //        onChange={onFilterChange}
              //        onUpdatedValidStatus={handleExpressionValidationChange}
              //        onSendAnalytics={onSendAnalytics}
            />
          </Suspense>
        </FluidGrid>
      </FluidGrid>
      <Tooltip id='model-tooltip' />
    </Container>
  ) : null;
}

ModelViewer.propTypes = propTypes;
export default ModelViewer;
