/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { SpecDocDataEntity, UserContext } from '@m-next/api-interface';
import Pill from '@m-next/pill';
import { colors } from '@m-next/styles';
import {
  SectionHeader,
  SectionDescription,
  AskMiaButton,
  EntitiesList,
  EntityBody,
  FieldsSection,
  FieldsSectionTitle,
  FieldsList,
  FieldRow,
  FieldName,
  FieldDescription,
  FieldBadges,
  RelationshipsSection,
  RelationshipsList,
  SpecItemName,
  SpecItemCardHeaderContent,
  SpecItemDescription,
  SpecItemCardText,
  SpecItemCardHeader,
  SpecItemCardRight,
  SpecItemCardStats,
  SpecItemCard,
  SectionActionsContainer,
} from '../SpecDocDetails.styles';
import SvgIcon from '@m-next/svg-icon';
import Button from '@m-next/button';
import { Z_POPUP } from '@m-next/layout-canvas';
import { Tooltip } from 'react-tooltip';

const RELATION_TYPE_MAP: Record<string, string> = {
  belongs_to: 'Belongs to',
  has_one: 'Has one',
  has_many: 'Has many',
  many_to_many: 'Has many (many-to-many)',
};

function getRelationshipLabel(relationshipType: string, relatedTable: string): string {
  const typeLabel = RELATION_TYPE_MAP[relationshipType] || relationshipType;
  return `${typeLabel} ${relatedTable}`;
}

interface DataEntitiesSectionProps {
  dataEntities?: SpecDocDataEntity[];
  onAskMethod?: (context: UserContext) => void;
  onCreateDataEntitiesClick?: () => void;
  isCreateLoading?: boolean;
  disableCreate?: boolean;
}

/**
 * Data Entities section - displays tables, fields, and relationships
 */
function DataEntitiesSection({
  dataEntities = [],
  onAskMethod = () => {},
  onCreateDataEntitiesClick,
  disableCreate = false,
}: DataEntitiesSectionProps) {
  const [expandedEntities, setExpandedEntities] = useState<number[]>([]); // First entity expanded by default

  const toggleEntity = (index: number) => {
    setExpandedEntities((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <>
      <SectionHeader>
        <Tooltip
          id='create-tables-fields-tooltip'
          opacity={1}
          style={{ zIndex: Z_POPUP.TOOLTIP,  wordBreak: 'break-word' }}
        />
        <SectionDescription>Core data structures and their relationships</SectionDescription>
        <SectionActionsContainer>
          <AskMiaButton
            onClick={() =>
              onAskMethod({
                type: 'spec-section',
                identifier: 'Data Entities',
              })
            }
            title='Ask Method AI about this section'
          >
            <SvgIcon name='ai-chat' size={16} color='currentColor' />
            Ask Method AI
          </AskMiaButton>
          {onCreateDataEntitiesClick && (
            <Button
              id='create-tables-fields'
              buttonStyle='ghost'
              style={{ background: colors.white }}
              onClick={onCreateDataEntitiesClick}
              disabled={disableCreate}
              value='Create tables and fields'
              tooltip='Tables and fields can only be created once per app'
              tooltipId={disableCreate ? 'create-tables-fields-tooltip' : undefined}
            />
          )}
        </SectionActionsContainer>
      </SectionHeader>
      <EntitiesList>
        {dataEntities.map((entity, index) => {
          const isExpanded = expandedEntities.includes(index);
          const fieldsCount = entity.fields?.length || 0;

          return (
            <SpecItemCard key={index}>
              <SpecItemCardHeader onClick={() => toggleEntity(index)}>
                <SpecItemCardHeaderContent>
                  <SpecItemCardText>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SpecItemName>{entity.tableName}</SpecItemName>
                      {/* Bring back when final design ready */}
                      {/* {entity.source === 'existing' && (
                        <Pill colorScheme="v4-green" style={{ fontSize: '11px' }}>Existing</Pill>
                      )} */}
                    </div>
                    <SpecItemDescription>{entity.description}</SpecItemDescription>
                  </SpecItemCardText>
                </SpecItemCardHeaderContent>
                <SpecItemCardRight>
                  <SpecItemCardStats>
                    <span>{fieldsCount} fields</span>
                  </SpecItemCardStats>
                  {isExpanded ? (
                    <SvgIcon name='chevron-up' size={12} color={colors.grey} />
                  ) : (
                    <SvgIcon name='chevron-down' size={12} color={colors.grey} />
                  )}
                </SpecItemCardRight>
              </SpecItemCardHeader>
              {isExpanded && (
                <EntityBody>
                  <FieldsSection>
                    <FieldsSectionTitle>Fields</FieldsSectionTitle>
                    <FieldsList>
                      {entity.fields?.map((field, fieldIndex) => (
                        <FieldRow key={fieldIndex}>
                          <FieldName>{field.fieldName}</FieldName>
                          <FieldDescription>{field.description || field.fieldName}</FieldDescription>
                          <FieldBadges>
                            <Pill colorScheme='v4-purple' style={{ textTransform: 'capitalize' }}>
                              {field.type}
                            </Pill>
                            <Pill colorScheme={field.required ? 'v4-red' : 'v4-gray'}>
                              {field.required ? 'Required' : 'Optional'}
                            </Pill>
                            {/* Bring back when final design ready */}
                            {/* {field.source === 'existing' && (
                              <Pill colorScheme="v4-green" style={{ fontSize: '11px' }}>Existing</Pill>
                            )} */}
                          </FieldBadges>
                        </FieldRow>
                      ))}
                    </FieldsList>
                  </FieldsSection>
                  {entity.relationships && entity.relationships.length > 0 && (
                    <RelationshipsSection>
                      <FieldsSectionTitle>Relationships</FieldsSectionTitle>
                      <RelationshipsList>
                        {entity.relationships.map((relationship, relIndex) => (
                          <Pill colorScheme='v4-purple' key={relIndex}>
                            {getRelationshipLabel(relationship.relationshipType, relationship.relatedTable)}
                          </Pill>
                        ))}
                      </RelationshipsList>
                    </RelationshipsSection>
                  )}
                </EntityBody>
              )}
            </SpecItemCard>
          );
        })}
      </EntitiesList>
    </>
  );
}

export default DataEntitiesSection;
