/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { SpecDocWorkflow, UserContext } from '@m-next/api-interface';
import Pill from '@m-next/pill';
import { colors } from '@m-next/styles';
import {
  SectionHeader,
  SectionDescription,
  AskMiaButton,
  WorkflowsList,
  StatsDivider,
  WorkflowBody,
  StepsLabel,
  StepsList,
  StepCard,
  StepContent,
  StepContentLeft,
  StepActor,
  ActorLabel,
  StepTitle,
  StepDescription,
  SpecItemCardHeader,
  SpecItemCardHeaderContent,
  SpecItemCardText,
  SpecItemName,
  SpecItemDescription,
  SpecItemCardRight,
  SpecItemCardStats,
  SpecItemCard,
} from '../SpecDocDetails.styles';
import SvgIcon from '@m-next/svg-icon';

interface FeaturesSectionProps {
  keyWorkflows?: SpecDocWorkflow[];
  onAskMethod?: (context: UserContext) => void;
}

// Helper function to parse step text and extract actor, title, description, and badge
const parseStep = (stepText: string, index: number) => {
  // This is a simplified parser - in production, step data should come structured
  // For now, we'll use the step text as the title
  const actors = ['User', 'System', 'Database'];
  const badges = ['Trigger', 'UI update', 'Manual entry', 'Validation', 'DB Operation', 'Calculation'];

  return {
    actor: actors[index % actors.length],
    title: stepText,
    description: stepText,
    badge: badges[index % badges.length],
  };
};

/**
 * Features section - displays key workflows with expandable step details
 */
function FeaturesSection({ keyWorkflows = [], onAskMethod = () => {} }: FeaturesSectionProps) {
  const [expandedWorkflows, setExpandedWorkflows] = useState<number[]>([]); // First workflow expanded by default

  const toggleWorkflow = (index: number) => {
    setExpandedWorkflows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <>
      <SectionHeader>
        <SectionDescription>Main user journeys and processes in your application</SectionDescription>
        <AskMiaButton onClick={() => onAskMethod?.({
          type: 'spec-section',
          identifier: 'Features',
        })} title="Ask Method AI about this section">
          <SvgIcon name="ai-chat" size={16} color='currentColor' />
          Ask Method AI
        </AskMiaButton>
      </SectionHeader>
      <WorkflowsList>
        {keyWorkflows.map((workflow, index) => {
          const isExpanded = expandedWorkflows.includes(index);
          const stepsCount = workflow.steps?.length || 0;
          const triggersCount = workflow.triggers?.length || 0;

          return (
            <SpecItemCard key={index}>
              <SpecItemCardHeader onClick={() => toggleWorkflow(index)} isClickable>
                <SpecItemCardHeaderContent>
                  <SpecItemCardText>
                    <SpecItemName>{workflow.name}</SpecItemName>
                    <SpecItemDescription>{workflow.description}</SpecItemDescription>
                  </SpecItemCardText>
                </SpecItemCardHeaderContent>
                <SpecItemCardRight>
                  <SpecItemCardStats>
                    <span>{stepsCount} steps</span>
                    <StatsDivider>•</StatsDivider>
                    <span>{triggersCount} triggers</span>
                  </SpecItemCardStats>
                  {isExpanded ? (
                    <SvgIcon name="chevron-up" size={12} color={colors.grey} />
                  ) : (
                    <SvgIcon name="chevron-down" size={12} color={colors.grey} />
                  )}
                </SpecItemCardRight>
              </SpecItemCardHeader>
              {isExpanded && (
                <WorkflowBody>
                  <StepsLabel>Steps</StepsLabel>
                  <StepsList>
                    {workflow.steps?.map((step, stepIndex) => {
                      const parsedStep = parseStep(step, stepIndex);
                      return (
                        <StepCard key={stepIndex}>
                          <StepContent>
                            <StepContentLeft>
                              <StepActor>
                                <ActorLabel>{parsedStep.actor}</ActorLabel>
                              </StepActor>
                              <StepTitle>{parsedStep.title}</StepTitle>
                              <StepDescription>{parsedStep.description}</StepDescription>
                            </StepContentLeft>
                            <Pill colorScheme="v4-blue">{parsedStep.badge}</Pill>
                          </StepContent>
                        </StepCard>
                      );
                    })}
                  </StepsList>
                </WorkflowBody>
              )}
            </SpecItemCard>
          );
        })}
      </WorkflowsList>
    </>
  );
}

export default FeaturesSection;
