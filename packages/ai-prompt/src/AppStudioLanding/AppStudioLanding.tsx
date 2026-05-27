import React, { useState, useEffect } from 'react';
import { colors } from '@m-next/styles';
import Button from '@m-next/button';
import SvgIcon, { CustomDashboardIcon } from '@m-next/svg-icon';
import { AiPrompt } from '../AiPrompt/AiPrompt';
import {
  MainContainer,
  ContentWrapper,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  PromptWrapper,
  PromptSubtext,
  HelpSection,
  HelpContent,
  HelpTitle,
  HelpDescription,
  MethodAIText,
  CardsContainer,
  AppsSection,
  AppsSectionHeader,
  MethodAITextWrapper,
  AIIconWrapper,
  AppsListTitle,
  InvalidScreenContainer,
  InvalidScreenContent,
} from './AppStudioLanding.styles';
import { AppCardStatus, AppStudioCard } from './AppStudioCard';

export interface AppStudioApp {
  appId: string;
  appName: string;
  updatedAt: string;
  updatedBy: string;
  status: AppCardStatus;
}

interface AppStudioLandingProps {
  userName?: string;
  onGenerateClick: (prompt: string, attachments?: File[]) => void;
  isLoading?: boolean;
  onContactTeam?: () => void;
  apps?: AppStudioApp[];
  onAppClick?: (app: AppStudioApp) => void;
  shouldClearOnSubmit?: boolean;
}

export function AppStudioLanding({
  userName = '',
  onGenerateClick,
  isLoading,
  onContactTeam,
  apps,
  onAppClick,
  shouldClearOnSubmit = true,
}: AppStudioLandingProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isSmallScreen) {
    return (
      <MainContainer>
        <InvalidScreenContainer>
          <InvalidScreenContent>
            <CustomDashboardIcon />
            <div>
              <h2>App Studio requires a larger screen width.</h2>
              <p>
                App Studio is designed to work at a minimum width of 1024px, you will need to resize this window or use
                a device with a larger screen.
              </p>
            </div>
          </InvalidScreenContent>
        </InvalidScreenContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <ContentWrapper>
        <HeaderSection>
          <HeaderTitle>{userName}, bring your business ideas to life!</HeaderTitle>
          <HeaderSubtitle>
            Build apps that streamline your workflows, powered by
            <MethodAITextWrapper>
              <MethodAIText>Method AI</MethodAIText>
              <AIIconWrapper>
                <SvgIcon name='ai-gradient-icon' size={10} />
              </AIIconWrapper>
            </MethodAITextWrapper>
            <br />
            and designed around the way you work.
          </HeaderSubtitle>
        </HeaderSection>
        <PromptWrapper>
          <AiPrompt
            assistantId='app-creation-assistant'
            placeholder="Explain how you work, and we'll build the tools for you..."
            buttonText='Start building'
            minRows={3}
            onSubmit={onGenerateClick}
            isLoading={isLoading}
            buttonIcon='ai-assistant'
            shouldClearOnSubmit={shouldClearOnSubmit}
          />
          <PromptSubtext>Save up to 10 hours a week with building customized apps for your organization</PromptSubtext>
        </PromptWrapper>
        {/* Show HelpSection only if no apps */}
        {(!apps || apps.length === 0) && (
          <HelpSection>
            <HelpContent>
              <HelpTitle>
                <SvgIcon name='conversation-chat' size={32} color={colors.blue} style={{ width: 'fit-content' }} />
                Need help bringing your app to life?
              </HelpTitle>
              <HelpDescription>Chat with our team to turn your ideas into a build-ready app plan.</HelpDescription>
            </HelpContent>
            <Button
              buttonStyle='ghost'
              style={{ background: colors.white }}
              onClick={onContactTeam}
              id='contact-our-team'
              value='Contact our team'
            />
          </HelpSection>
        )}
      </ContentWrapper>

      {apps && apps.length > 0 && (
        <AppsSection>
          <AppsSectionHeader>
            <AppsListTitle>My AI apps</AppsListTitle>
            <button type='button' onClick={onContactTeam}>
              <SvgIcon name='conversation-chat' size={16} />
              Need help bringing your app to life?
            </button>
          </AppsSectionHeader>
          <CardsContainer>
            {apps.map((app) => (
              <AppStudioCard key={app.appId} {...app} onClick={() => onAppClick?.(app)} />
            ))}
          </CardsContainer>
        </AppsSection>
      )}
    </MainContainer>
  );
}

export default AppStudioLanding;
