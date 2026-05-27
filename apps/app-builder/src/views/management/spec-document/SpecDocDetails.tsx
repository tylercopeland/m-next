import React, { useState } from 'react';
import { SpecDocumentContent, UserContext } from '@m-next/api-interface';
import { DetailTab } from '../types';
import SpecDocDetailsSkeleton from './SpecDocDetailsSkeleton';
import {
  UserRolesSection,
  FeaturesSection,
  DataEntitiesSection,
  BusinessRulesSection,
  ScreensSection,
} from './sections';
import {
  LoadedContainer,
  AppDescription,
  LoadedHeader,
  LoadedTitle,
  TwoColumnLayout,
  Description,
  LoadedTabsContainer,
  LoadedTabsWrapper,
  BenefitsList,
  BenefitItem,
  BenefitIcon,
  BenefitText,
  Tab,
  LoadedContentSection,
  TabSkeleton,
  TabWrapper,
  CardsGrid,
  CardSkeleton,
  CardHeader,
  CardIconRow,
  CardIcon,
  CardTextSection,
  CardTextLine1,
  CardTextLine2,
  CardBody,
  CardBodyLabel,
  CardBodyLines,
  CardBodyLine,
  ContactCard,
  ContactContent,
  ContactText,
  ContactTitle,
  ContactDescription,
  ContentHeader,
  ColumnLeftSection,
} from './SpecDocDetails.styles';
import { colors } from '@m-next/styles';
import Button from '@m-next/button';
import SvgIcon from '@m-next/svg-icon';
import {AiGradientButton} from '@m-next/ai-prompt';
import { Tooltip } from 'react-tooltip';

interface SpecDocDetailsProps {
  specDocument: { content: Partial<SpecDocumentContent> } | null;
  onDownloadPdf?: () => void;
  disableDownloadPdf?: boolean;
  onAskMethod?: (context: UserContext) => void;
  onCreateDataEntitiesClick?: () => void;
  isCreateLoading?: boolean;
  disableCreate?: boolean;
  onBuildApp?: () => void;
  disableBuildApp?: boolean;
  activeTab?: DetailTab;
  onTabChange?: (tab: DetailTab) => void;
}

const TABS: Record<string, DetailTab> = {
  USER_ROLES: 'userRoles',
  FEATURES: 'features',
  DATA_ENTITIES: 'dataEntities',
  BUSINESS_RULES: 'businessRules',
  SCREENS: 'screens',
};

/**
 * Details view of spec document - displays all technical details
 * Shows loading skeleton with progressive loading support
 */
function SpecDocDetails({
  specDocument,
  onDownloadPdf = () => {},
  disableDownloadPdf = false,
  onAskMethod = () => {},
  activeTab: activeTabProp,
  onTabChange,
  onCreateDataEntitiesClick,
  disableCreate,
  onBuildApp,
  disableBuildApp = false,
}: SpecDocDetailsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<DetailTab>(TABS.USER_ROLES);
  const activeTab = activeTabProp ?? internalActiveTab;

  // Show loading skeleton
  if (!specDocument) {
    return <SpecDocDetailsSkeleton />;
  }

  const { content } = specDocument;
  const {
    appName = '',
    appPurpose = '',
    appIcon = '',
    userRoles = [],
    keyWorkflows = [],
    dataEntities = [],
    businessRules = [],
    screens = [],
  } = content;

  // Tab configuration
  const tabs = [
    { id: TABS.USER_ROLES, label: 'User Roles', count: userRoles.length },
    { id: TABS.FEATURES, label: 'Features', count: keyWorkflows.length },
    { id: TABS.DATA_ENTITIES, label: 'Data Entities', count: dataEntities.length },
    { id: TABS.BUSINESS_RULES, label: 'Business Rules', count: businessRules.length },
    { id: TABS.SCREENS, label: 'Screens', count: screens.length },
  ];

  const loadingTabWidths = [80, 96, 112, 96, 112, 80];

  const onContact = () => {
    window.open('https://methodps.youcanbook.me/', '_blank');
  };

  // Render active tab content
  const renderContent = () => {
    if (!specDocument || !content || userRoles.length === 0) {
      return (
        <CardsGrid>
          {[1, 2, 3].map((index) => (
            <CardSkeleton key={index}>
              <CardHeader>
                <CardIconRow>
                  <CardIcon />
                  <CardTextSection>
                    <CardTextLine1 />
                    <CardTextLine2 />
                  </CardTextSection>
                </CardIconRow>
              </CardHeader>
              <CardBody>
                <CardBodyLabel />
                <CardBodyLines>
                  <CardBodyLine />
                  <CardBodyLine style={{ width: '83%' }} />
                  <CardBodyLine style={{ width: '80%' }} />
                </CardBodyLines>
              </CardBody>
            </CardSkeleton>
          ))}
        </CardsGrid>
      );
    }
    switch (activeTab) {
      case TABS.USER_ROLES:
        return <UserRolesSection userRoles={userRoles} onAskMethod={onAskMethod} />;
      case TABS.FEATURES:
        return <FeaturesSection keyWorkflows={keyWorkflows} onAskMethod={onAskMethod} />;
        case TABS.DATA_ENTITIES:
          return <DataEntitiesSection dataEntities={dataEntities} onAskMethod={onAskMethod} onCreateDataEntitiesClick={onCreateDataEntitiesClick}  disableCreate={disableCreate} />;
      case TABS.BUSINESS_RULES:
        return <BusinessRulesSection businessRules={businessRules} onAskMethod={onAskMethod} />;
      case TABS.SCREENS:
        return <ScreensSection screens={screens} onAskMethod={onAskMethod} />;
      default:
        return <UserRolesSection userRoles={userRoles} onAskMethod={onAskMethod} />;
    }
  };

  return (
    <LoadedContainer data-testid='spec-doc-details'>
      {/* Header */}
      <LoadedHeader>
        <AppDescription>
          <SvgIcon name={appIcon || 'screen-V4'} size={32} color={colors.grey} />
          <div>
            <LoadedTitle>{appName || 'Untitled Application'}</LoadedTitle>
            <Description>{appPurpose || 'No description provided.'}</Description>
          </div>
        </AppDescription>

        <TwoColumnLayout>
          {/* Benefits List */}
          <ColumnLeftSection>
            <BenefitsList>
              <BenefitItem>
                <BenefitIcon>
                  <SvgIcon name="clock" size={16} color={colors.grey} />
                </BenefitIcon>
                <BenefitText>Save time on admin tasks</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>
                  <SvgIcon name="pages" size={16} color={colors.grey} />
                </BenefitIcon>
                <BenefitText>Reduce duplicate entries</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>
                  <SvgIcon name="check-circle" size={16} color={colors.grey} />
                </BenefitIcon>
                <BenefitText>Single source of truth</BenefitText>
              </BenefitItem>
            </BenefitsList>

            {onBuildApp ? (
              <AiGradientButton
                value="Build app"
                onClick={onBuildApp}
                disabled={disableBuildApp}
              />
            ) : (
              <>
                <AiGradientButton
                  value="Build app"
                  disabled
                  data-tooltip-id="specdoc-build-tooltip"
                  data-tooltip-content="App building coming soon."
                />
                <Tooltip
                  id="specdoc-build-tooltip"
                  place="bottom"
                  style={{
                    backgroundColor: colors['grey-darkest'],
                    borderRadius: '2px',
                    padding: '4px 8px',
                    fontSize: '12px',
                  }}
                />
              </>
            )}
          </ColumnLeftSection>
          {/* Contact Card */}
            <ContactCard>
              <ContactContent>
                <ContactText>
                  <SvgIcon name="conversation-chat" size={16} color={colors.blue} style={{width: 'fit-content'}}/>
                  <ContactTitle>Want a more polished, professional version of your app?</ContactTitle>
                  <ContactDescription>Schedule a chat with our team and discover how we can help fine-tune your build for the best results.</ContactDescription>
                </ContactText>
                <Button buttonStyle="ghost" style={{background: colors.white}} onClick={onContact} id={'contact-our-team'} value='Contact our team' />
              </ContactContent>
            </ContactCard>
        </TwoColumnLayout>
      </LoadedHeader>

      <ContentHeader>
        <h1>App breakdown</h1>
        <Button icon={{name: 'cloud-download', size: 15, color: colors.grey}} buttonStyle="radio" onClick={onDownloadPdf} id={'download-pdf'} value='Download PDF' disabled={disableDownloadPdf} />
      </ContentHeader>

      {/* Tabs */}
      <LoadedTabsContainer>
        <LoadedTabsWrapper>
          {tabs.map((tab, index) =>
            tab.count > 0 ? (
              <Tab 
                key={tab.id} 
                isActive={activeTab === tab.id} 
                onClick={() => {
                  if (onTabChange) {
                    onTabChange(tab.id);
                  } else {
                    setInternalActiveTab(tab.id);
                  }
                }}
              >
                {tab.label} ({tab.count})
              </Tab>
            ) : (
              <TabWrapper>
                <TabSkeleton style={{ width: loadingTabWidths[index] }} />
              </TabWrapper>
            ),
          )}
        </LoadedTabsWrapper>
      </LoadedTabsContainer>

      {/* Content */}
      <LoadedContentSection>{renderContent()}</LoadedContentSection>
    </LoadedContainer>
  );
}

export default SpecDocDetails;
