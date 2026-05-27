import React from 'react';
import { TextLine } from '@m-next/typeography';
import Banner from '@m-next/banner';

import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import * as s from '../common/BlockEditor.styles';

interface MapControl {
  id: string;
  type?: string;
  caption?: string;
  name?: string;
  visible?: boolean;
  disabled?: boolean;
  componentVersion?: string;
}

interface MapBlockEditorProps {
  rawControl?: MapControl;
}

const MapBlockEditor: React.FC<MapBlockEditorProps> = () => (
    <RumComponentContextProvider componentName='MapBlockEditor'>
      <s.Wrapper padding={16}>
        <TextLine>Edit the base configuration and styles of the map widget.</TextLine>
        <Banner icon='warning-sign' severity='informational'>
          <div>
            <TextLine>No properties to configure</TextLine>
          </div>
        </Banner>
      </s.Wrapper>
    </RumComponentContextProvider>
  );

export default MapBlockEditor;
