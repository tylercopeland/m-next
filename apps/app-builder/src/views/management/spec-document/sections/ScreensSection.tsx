/* eslint-disable react/no-array-index-key */
import React from 'react';
import { ScreenType, SpecDocScreenSummary, UserContext } from '@m-next/api-interface';
import Pill from '@m-next/pill';
import {
  SectionHeader,
  SectionDescription,
  AskMiaButton,
  ScreensGrid,
  ScreenCard,
  ScreenCardHeader,
  ScreenCardTitle,
  ScreenPreview,
  ScreenCardFooter,
  WorkflowCount,
  MockupContainer,
  MockupTabs,
  MockupTab,
  MockupTitle,
  MockupChartBars,
  MockupBar,
  MockupFormRow,
  MockupLabel,
  MockupInput,
  MockupButton,
  MockupSidebar,
  MockupSidebarItem,
  MockupContent,
  MockupListRow,
  MockupBullet,
} from '../SpecDocDetails.styles';
import SvgIcon from '@m-next/svg-icon';

const SCREEN_PILL_COLOR_MAP: Record<ScreenType, string> = {
  list: 'v4-blue',
  stock: 'v4-blue',
  record: 'v4-green',
  portal: 'v4-green',
  preference: 'v4-purple',
  dashboard: 'v4-purple',
  other: 'v4-gray',
};

interface ScreensSectionProps {
  screens?: SpecDocScreenSummary[];
  onAskMethod?: (context: UserContext) => void;
}

interface ScreenMockupProps {
  screenType?: string;
}

/**
 * Renders a mockup preview based on screen type
 */
const ScreenMockup: React.FC<ScreenMockupProps> = ({ screenType = 'main' }) => {
  const type = screenType?.toLowerCase();

  // Dashboard/Main mockup - tabs + chart
  if (type === 'main' || !type || type === 'dashboard') {
    return (
      <MockupContainer>
        <MockupTabs>
          <MockupTab width="wide" />
          <MockupTab width="normal" />
          <MockupTab width="wide" />
        </MockupTabs>
        <MockupTitle />
        <MockupChartBars>
          <MockupBar height="67%" />
          <MockupBar height="83%" />
          <MockupBar height="58%" />
          <MockupBar height="92%" />
          <MockupBar height="75%" />
        </MockupChartBars>
      </MockupContainer>
    );
  }

  // Form mockup - input fields + button
  if (type === 'form' || type === 'record') {
    return (
      <MockupContainer style={{ gap: '6px' }}>
        <MockupFormRow>
          <MockupLabel width="25%" />
          <MockupLabel width="33%" />
          <MockupLabel width="25%" />
          <MockupButton />
        </MockupFormRow>
        <MockupInput />
      </MockupContainer>
    );
  }

  // Detail mockup - sidebar + form
  if (type === 'detail') {
    return (
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <MockupSidebar>
          <MockupSidebarItem />
          <MockupSidebarItem />
          <MockupSidebarItem />
          <MockupSidebarItem />
        </MockupSidebar>
        <MockupContent>
          <MockupFormRow>
            <MockupLabel />
            <MockupLabel />
            <MockupLabel />
            <MockupButton />
          </MockupFormRow>
          <MockupInput />
        </MockupContent>
      </div>
    );
  }

  // List mockup - rows with bullets
  if (type === 'list') {
    return (
      <MockupContainer style={{ gap: '6px' }}>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupLabel width="20%" />
          <MockupButton />
        </MockupListRow>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupLabel width="20%" />
          <MockupButton />
        </MockupListRow>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupLabel width="20%" />
          <MockupButton />
        </MockupListRow>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupLabel width="20%" />
          <MockupButton />
        </MockupListRow>
      </MockupContainer>
    );
  }

  // Report mockup - tabs + chart
  if (type === 'report') {
    return (
      <MockupContainer>
        <MockupTabs>
          <MockupTab width="wide" />
          <MockupTab width="wide" />
          <MockupTab width="wide" />
        </MockupTabs>
        <MockupTitle />
        <MockupChartBars>
          <MockupBar height="83%" />
          <MockupBar height="100%" />
          <MockupBar height="67%" />
          <MockupBar height="92%" />
          <MockupBar height="83%" />
        </MockupChartBars>
      </MockupContainer>
    );
  }

  // Settings mockup - form-like
  if (type === 'settings' || type === 'preference') {
    return (
      <MockupContainer style={{ gap: '6px' }}>
        <MockupFormRow>
          <MockupLabel />
          <MockupLabel />
          <MockupLabel />
          <MockupButton />
        </MockupFormRow>
        <MockupInput />
      </MockupContainer>
    );
  }

  // Tool mockup - list-like
  if (type === 'tool') {
    return (
      <MockupContainer style={{ gap: '6px' }}>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupLabel width="20%" />
          <MockupButton />
        </MockupListRow>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupLabel width="20%" />
          <MockupButton />
        </MockupListRow>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupLabel width="20%" />
          <MockupButton />
        </MockupListRow>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupLabel width="20%" />
          <MockupButton />
        </MockupListRow>
      </MockupContainer>
    );
  }

  // Portal mockup
  if (type === 'portal') {
    return (
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <MockupSidebar>
          <MockupSidebarItem />
          <MockupSidebarItem />
          <MockupSidebarItem />
        </MockupSidebar>
        <MockupContent>
          <MockupTitle />
          <MockupChartBars>
            <MockupBar height="67%" />
            <MockupBar height="83%" />
            <MockupBar height="58%" />
          </MockupChartBars>
        </MockupContent>
      </div>
    );
  }

  // Stock mockup
  if (type === 'stock') {
    return (
      <MockupContainer>
        <MockupTitle />
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupButton />
        </MockupListRow>
        <MockupListRow>
          <MockupBullet />
          <MockupLabel width="100%" />
          <MockupLabel width="25%" />
          <MockupButton />
        </MockupListRow>
      </MockupContainer>
    );
  }

  // Default to main mockup
  return (
    <MockupContainer>
      <MockupTabs>
        <MockupTab width="wide" />
        <MockupTab width="normal" />
        <MockupTab width="wide" />
      </MockupTabs>
      <MockupTitle />
      <MockupChartBars>
        <MockupBar height="67%" />
        <MockupBar height="83%" />
        <MockupBar height="58%" />
        <MockupBar height="92%" />
        <MockupBar height="75%" />
      </MockupChartBars>
    </MockupContainer>
  );
};

/**
 * Screens section - displays application screens and their specifications
 */
function ScreensSection({ screens = [], onAskMethod = () => {} }: ScreensSectionProps) {
  return (
    <>
      <SectionHeader>
        <SectionDescription>User interface screens and their purposes</SectionDescription>
        <AskMiaButton onClick={() => onAskMethod?.({
          type: 'spec-section',
          identifier: 'Screens',
        })} title="Ask Method AI about this section">
          <SvgIcon name="ai-chat" size={16} color='currentColor' />
          Ask Method AI
        </AskMiaButton>
      </SectionHeader>
      <ScreensGrid>
        {screens.map((screen, index) => {
          const workflowCount = screen.primaryWorkflows?.length || 0;

          return (
            <ScreenCard key={index}>
              <ScreenCardHeader>
                <ScreenCardTitle>{screen.screenName}</ScreenCardTitle>
              </ScreenCardHeader>
              <ScreenPreview>
                <ScreenMockup screenType={screen.screenType} />
              </ScreenPreview>
              <ScreenCardFooter>
                {screen.isStartingScreen ? 
                <Pill colorScheme="v4-blue">Start Screen</Pill> : 
                <Pill colorScheme={SCREEN_PILL_COLOR_MAP[screen.screenType || 'v4-blue']} style={{textTransform: 'capitalize'}}>{screen.screenType}</Pill>
              }
                <WorkflowCount>
                  {workflowCount} workflow{workflowCount !== 1 ? 's' : ''}
                </WorkflowCount>
              </ScreenCardFooter>
            </ScreenCard>
          );
        })}
      </ScreensGrid>
    </>
  );
}

export default ScreensSection;
