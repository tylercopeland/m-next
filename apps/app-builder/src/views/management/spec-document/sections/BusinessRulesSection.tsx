/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { SpecDocBusinessRule, UserContext } from '@m-next/api-interface';
import Pill from '@m-next/pill';
import { colors } from '@m-next/styles';
import {
  SectionHeader,
  SectionDescription,
  AskMiaButton,
  RulesList,
  RuleBody,
  RuleLogic,
  RuleKeyword,
  SpecItemCardText,
  SpecItemName,
  SpecItemDescription,
  SpecItemCardHeaderContent,
  SpecItemCardRight,
  SpecItemCardHeader,
  SpecItemCard,
} from '../SpecDocDetails.styles';
import SvgIcon from '@m-next/svg-icon';

const PillColorSchemeMap: Record<string, string> = {
  essential: 'v4-red',
  important: 'v4-orange',
  helpful: 'v4-yellow',
  'nicetohave': 'v4-blue',
}

interface BusinessRulesSectionProps {
  businessRules?: SpecDocBusinessRule[];
  onAskMethod?: (context: UserContext) => void;
}

/**
 * Business Rules section - displays validation rules and automation logic
 */
function BusinessRulesSection({ businessRules = [], onAskMethod = () => {} }: BusinessRulesSectionProps) {
  const [expandedRules, setExpandedRules] = useState<number[]>([]); // First rule expanded by default

  const toggleRule = (index: number) => {
    setExpandedRules((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <>
      <SectionHeader>
        <SectionDescription>Logic and constraints that govern your application</SectionDescription>
        <AskMiaButton onClick={() => onAskMethod?.({
          type: 'spec-section',
          identifier: 'Business Rules',
        })} title='Ask Method AI about this section'>
          <SvgIcon name="ai-chat" size={16} color='currentColor'/>
          Ask Method AI
        </AskMiaButton>
      </SectionHeader>
      <RulesList>
        {businessRules.map((rule, index) => {
          const isExpanded = expandedRules.includes(index);

          return (
            <SpecItemCard key={index}>
              <SpecItemCardHeader onClick={() => toggleRule(index)}>
                <SpecItemCardHeaderContent>
                  <SpecItemCardText>
                    <SpecItemName>{rule.name}</SpecItemName>
                    <SpecItemDescription>{rule.description}</SpecItemDescription>
                  </SpecItemCardText>
                </SpecItemCardHeaderContent>
                <SpecItemCardRight>
                  <Pill colorScheme={PillColorSchemeMap[rule.priority?.toLowerCase()]} style={{textTransform: 'capitalize'}}>{rule.priority?.replace('-', ' ')}</Pill>
                   {isExpanded ? (
                      <SvgIcon name="chevron-up" size={12} color={colors.grey} />
                    ) : (
                      <SvgIcon name="chevron-down" size={12} color={colors.grey} />
                    )}
                </SpecItemCardRight>
              </SpecItemCardHeader>
              {isExpanded && (
                <RuleBody>
                  <RuleLogic>
                    <RuleKeyword>IF</RuleKeyword> {rule.condition} <RuleKeyword>{' '} THEN</RuleKeyword> {rule.action}
                  </RuleLogic>
                </RuleBody>
              )}
            </SpecItemCard>
          );
        })}
      </RulesList>
    </>
  );
}

export default BusinessRulesSection;
