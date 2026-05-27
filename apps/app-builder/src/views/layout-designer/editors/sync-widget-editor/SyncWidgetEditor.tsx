import React from 'react';
import { TextLine } from '@m-next/typeography';
import Banner from '@m-next/banner';

import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import * as s from '../common/BlockEditor.styles';

interface SyncWidgetControl {
  id: string;
  type?: string;
  caption?: string;
  name?: string;
  visible?: boolean;
  disabled?: boolean;
}

interface SyncWidgetEditorProps {
  rawControl?: SyncWidgetControl;
  onChange?: (control: SyncWidgetControl) => void;
  onAddAction?: (control: SyncWidgetControl, eventName: string) => void;
}

const SyncWidgetEditor: React.FC<SyncWidgetEditorProps> = () => (
    <RumComponentContextProvider componentName='SyncWidgetEditor'>
      <s.Wrapper padding={16}>
        <TextLine>Edit the base configuration and styles of the sync widget.</TextLine>
        <Banner icon='warning-sign' severity='informational'>
          <div>
            <TextLine>No properties to configure</TextLine>
          </div>
        </Banner>
      </s.Wrapper>
    </RumComponentContextProvider>
  );

export default SyncWidgetEditor;
