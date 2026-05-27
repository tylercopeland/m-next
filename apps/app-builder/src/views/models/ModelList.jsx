import React from 'react';
import { useParams } from 'react-router-dom';

import Container from '@m-next/container';
import { Tooltip } from 'react-tooltip';
import ModelCard from './ModelCard';
import { useGetDataModelListQuery } from '../../common/services/dataModelApi';

const propTypes = {};

function ModelList() {
  const { appId } = useParams();
  const { data: modelList } = useGetDataModelListQuery({ appId });

  return (
    <Container
      id='model-list'
      style={{
        flexDirection: 'row',
        display: 'flex',
        gap: '16px',
        backgroundColor: 'transparent',
        flexWrap: 'wrap',
      }}
      isRound={false}
      borderless
    >
      {modelList?.map((model) => (
        <ModelCard name={model.name} id={model.id} key={model.id} fields={model.fields} views={0} />
      ))}

    

      <Tooltip id='model-tooltip' />
    </Container>
  );
}

ModelList.propTypes = propTypes;
export default ModelList;
