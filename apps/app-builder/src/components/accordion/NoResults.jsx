import React from 'react';
import { TextLine } from '@m-next/typeography';
import * as s from './AddColumnDialog.styles';

const NoResults = () => (
  <s.NoResultsWrapper>
    <TextLine bold fontSize='mediumLarge'>
      No results found
    </TextLine>
    <TextLine style={{ textAlign: 'center' }}>
      Try changing the search terms to get the
      <br /> results you&apos;re looking for.
    </TextLine>
  </s.NoResultsWrapper>
);

export default NoResults;
