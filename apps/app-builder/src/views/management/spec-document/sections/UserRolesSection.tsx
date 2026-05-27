/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { SpecDocUserRole, UserContext } from '@m-next/api-interface';
import { colors } from '@m-next/styles';
import {
  SectionHeader,
  SectionDescription,
  AskMiaButton,
  RolesList,
  RoleCardBody,
  PermissionsLabel,
  PermissionsList,
  PermissionItem,
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

interface UserRolesSectionProps {
  userRoles?: SpecDocUserRole[];
  onAskMethod?: (userContext: UserContext) => void;
}

/**
 * User Roles section - displays accordion-style role cards with permissions
 */
function UserRolesSection({ userRoles = [], onAskMethod = () => {} }: UserRolesSectionProps) {
  const [expandedRoles, setExpandedRoles] = useState<Set<number>>(new Set([]));

  const toggleRole = (index: number) => {
    setExpandedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <>
      <SectionHeader>
        <SectionDescription>Define who can use your application and their permissions</SectionDescription>
        <AskMiaButton onClick={() => onAskMethod?.({
          type: 'spec-section',
          identifier: 'User Roles',
        })} title="Ask Method AI about this section">
          <SvgIcon name="ai-chat" size={16} color='currentColor' />
          Ask Method AI
        </AskMiaButton>
      </SectionHeader>
      <RolesList>
        {userRoles.map((role, index) => {
          const isExpanded = expandedRoles.has(index);
          const permissionCount = role.permissions?.length || 0;

          return (
            <SpecItemCard key={index}>
              <SpecItemCardHeader onClick={() => toggleRole(index)} isClickable>
                <SpecItemCardHeaderContent>
                  <SpecItemCardText>
                    <SpecItemName>{role.name}</SpecItemName>
                    <SpecItemDescription>{role.description}</SpecItemDescription>
                  </SpecItemCardText>
                </SpecItemCardHeaderContent>
                <SpecItemCardRight>
                  <SpecItemCardStats>
                    <span>{permissionCount} {permissionCount === 1 ? 'permission' : 'permissions'}</span>
                  </SpecItemCardStats>
                   {isExpanded ? (
                      <SvgIcon name="chevron-up" size={12} color={colors.grey} />
                    ) : (
                      <SvgIcon name="chevron-down" size={12} color={colors.grey} />
                    )}
                </SpecItemCardRight>
              </SpecItemCardHeader>
              {isExpanded && (
                <RoleCardBody>
                  <PermissionsLabel>Permissions</PermissionsLabel>
                  <PermissionsList>
                    {role.permissions &&
                      role.permissions.map((permission, permIndex) => (
                        <PermissionItem key={permIndex}>{permission}</PermissionItem>
                      ))}
                  </PermissionsList>
                </RoleCardBody>
              )}
            </SpecItemCard>
          );
        })}
      </RolesList>
    </>
  );
}

export default UserRolesSection;
