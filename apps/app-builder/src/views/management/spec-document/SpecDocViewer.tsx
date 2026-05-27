import React from 'react';
import { ViewerContainer, ContentArea } from './SpecDocViewer.styles';
import SpecDocDetails from './SpecDocDetails';
import { SpecDocViewerProps } from '../types';

/**
 * Main spec document viewer with tabbed interface
 * Displays spec document in three views: Snapshot, Overview, and Details
 */
function SpecDocViewer({
  specDocument,
  activeTab,
  onTabChange,
  onAskMethod,
  onDownloadPdf,
  disableDownloadPdf,
  onCreateDataEntitiesClick,
  disableCreate,
  onBuildApp,
  disableBuildApp,
}: SpecDocViewerProps) {
  return (
    <ViewerContainer>
      <ContentArea data-testid='spec-doc-content'>
        <SpecDocDetails
          onDownloadPdf={onDownloadPdf}
          specDocument={specDocument}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onAskMethod={onAskMethod}
          disableDownloadPdf={disableDownloadPdf}
          onCreateDataEntitiesClick={onCreateDataEntitiesClick}
          disableCreate={disableCreate}
          onBuildApp={onBuildApp}
          disableBuildApp={disableBuildApp}
        />
      </ContentArea>
    </ViewerContainer>
  );
}

export default SpecDocViewer;
