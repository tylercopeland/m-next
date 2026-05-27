import React from 'react';
import {
  SkeletonWrapper,
  TopSectionSkeleton,
  LeftSidebarSkeleton,
  SidebarTitleSkeleton,
  CheckboxListSkeleton,
  CheckboxItemSkeleton,
  CheckboxSkeleton,
  CheckboxLabelSkeleton,
  SidebarButtonContainerSkeleton,
  SidebarButtonSkeleton,
  RightFormCardSkeleton,
  FormCardHeaderSkeleton,
  FormCardLabelSkeleton,
  FormCardButtonSkeleton,
  FormCardInputSkeleton,
  TabsSectionSkeleton,
  TabsListSkeleton,
  TabItemSkeleton,
  ContentAreaSkeleton,
  ContentHeaderSkeleton,
  ContentHeaderTextSkeleton,
  ActionButtonSkeleton,
  TableRowsSkeleton,
  TableRowSkeleton,
  RowAvatarSkeleton,
  RowContentSkeleton,
  RowTitleSkeleton,
  RowSubtitleSkeleton,
  RowButtonSkeleton,
} from './SpecDocDetails.styles';

/**
 * Loading skeleton for SpecDocDetails
 * Matches the layout with sidebar, content area, tabs, and table
 */
function SpecDocDetailsSkeleton() {
  return (
    <SkeletonWrapper data-testid="spec-doc-details-loading">
      {/* Top Section with Title and Form */}
      <TopSectionSkeleton>
        {/* Left Side - Sidebar with Checkboxes */}
        <LeftSidebarSkeleton>
          {/* Title */}
          <SidebarTitleSkeleton />
          
          {/* Checkbox List Items */}
          <CheckboxListSkeleton>
            {[1, 2, 3].map((i) => (
              <CheckboxItemSkeleton key={i}>
                <CheckboxSkeleton />
                <CheckboxLabelSkeleton />
              </CheckboxItemSkeleton>
            ))}
          </CheckboxListSkeleton>
        </LeftSidebarSkeleton>

        {/* Right Side - Form Card */}
        <RightFormCardSkeleton>
          <FormCardHeaderSkeleton>
            <FormCardLabelSkeleton />
            <FormCardButtonSkeleton />
          </FormCardHeaderSkeleton>
          <FormCardInputSkeleton />
        </RightFormCardSkeleton>
      </TopSectionSkeleton>

      {/* Button at Bottom with Border */}
      <SidebarButtonContainerSkeleton>
        <SidebarButtonSkeleton />
      </SidebarButtonContainerSkeleton>

      {/* Tabs Section */}
      <TabsSectionSkeleton>
        <TabsListSkeleton>
          {['100px', '100px', '100px', '100px', '100px'].map((width, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TabItemSkeleton key={i} width={width} />
          ))}
        </TabsListSkeleton>
      </TabsSectionSkeleton>

      {/* Content Area */}
      <ContentAreaSkeleton>
        {/* Search Bar */}
        <ContentHeaderSkeleton>
          <ContentHeaderTextSkeleton />
          <ActionButtonSkeleton />
        </ContentHeaderSkeleton>

        {/* Table Rows */}
        <TableRowsSkeleton>
          {[1, 2, 3].map((i) => (
            <TableRowSkeleton key={i}>
              <RowAvatarSkeleton />
              <RowContentSkeleton>
                <RowTitleSkeleton />
                <RowSubtitleSkeleton />
              </RowContentSkeleton>
              <RowButtonSkeleton />
            </TableRowSkeleton>
          ))}
        </TableRowsSkeleton>
      </ContentAreaSkeleton>
    </SkeletonWrapper>
  );
}

export default SpecDocDetailsSkeleton;
