import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@m-next/styles';

// Skeleton loading animation
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Skeleton Components
export const DetailsSkeletonContainer = styled.div({
  flex: 1,
  backgroundColor: colors.white,
  borderRadius: '8px',
  borderTopLeftRadius: 0,
  border: '1px solid rgb(229, 231, 235)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
});

export const HeaderSection = styled.div({
  padding: '24px 24px 4px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '16px',
});

export const HeaderLeft = styled.div({
  flex: 1,
});

export const HeaderTitle = styled.div({
  height: '32px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  width: '256px',
  marginBottom: '8px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const HeaderRight = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
});

export const HeaderButton = styled.div({
  height: '36px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '8px',
  width: '128px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const TabsContainer = styled.div({
  borderBottom: '1px solid rgb(229, 231, 235)',
});

export const TabsWrapper = styled.div({
  display: 'flex',
  gap: '4px',
  overflowX: 'auto',
});

export const TabWrapper = styled.div({
  padding: '16px 24px',
});

export const TabSkeleton = styled.div({
  height: '20px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const ContentSection = styled.div({
  padding: '32px',
});

export const ContentTitle = styled.div({
  height: '20px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  width: '256px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const ContentAction = styled.div({
  height: '36px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  width: '96px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const CardsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',

  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

export const CardSkeleton = styled.div({
  border: '1px solid rgb(229, 231, 235)',
  borderRadius: '8px',
  overflow: 'hidden',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const CardHeader = styled.div({
  padding: '24px',
  backgroundColor: 'rgb(249, 250, 251)',
});

export const CardIconRow = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
});

export const CardIcon = styled.div({
  width: '40px',
  height: '40px',
  backgroundColor: 'rgb(209, 213, 219)',
  borderRadius: '50%',
  flexShrink: 0,
});

export const CardTextSection = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const CardTextLine1 = styled.div({
  height: '20px',
  backgroundColor: 'rgb(209, 213, 219)',
  borderRadius: '4px',
  width: '75%',
});

export const CardTextLine2 = styled.div({
  height: '16px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  width: '100%',
});

export const CardBody = styled.div({
  padding: '24px',
  backgroundColor: colors.white,
});

export const CardBodyLabel = styled.div({
  height: '12px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  width: '96px',
  marginBottom: '12px',
});

export const CardBodyLines = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const CardBodyLine = styled.div({
  height: '12px',
  backgroundColor: 'rgb(243, 244, 246)',
  borderRadius: '4px',
  width: '100%',
});

// New skeleton layout components
export const SkeletonWrapper = styled.div({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  height: '100%',
});

export const TopSectionSkeleton = styled.div({
  display: 'flex',
  gap: '16px',
  alignItems: 'flex-start',
});

export const LeftSidebarSkeleton = styled.div({
  flex: '0 0 288px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const SidebarTitleSkeleton = styled.div({
  width: '100%',
  height: '36px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const CheckboxListSkeleton = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const CheckboxItemSkeleton = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const CheckboxSkeleton = styled.div({
  width: '16px',
  height: '16px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '2px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const CheckboxLabelSkeleton = styled.div({
  width: '140px',
  height: '16px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '2px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const SidebarButtonContainerSkeleton = styled.div({
  borderTop: '1px solid #E5E5E5',
  paddingTop: '16px',
});

export const SidebarButtonSkeleton = styled.div({
  width: '80px',
  height: '32px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const RightFormCardSkeleton = styled.div({
  flex: 1,
  border: '1px solid #E5E5E5',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const FormCardHeaderSkeleton = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const FormCardLabelSkeleton = styled.div({
  width: '60px',
  height: '12px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '2px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const FormCardButtonSkeleton = styled.div({
  width: '100px',
  height: '24px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const FormCardInputSkeleton = styled.div({
  width: '100%',
  height: '40px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const TabsSectionSkeleton = styled.div({
  borderBottom: '1px solid #E5E5E5',
});

export const TabsListSkeleton = styled.div({
  display: 'flex',
  gap: '32px',
  paddingBottom: '8px',
});

export const TabItemSkeleton = styled.div<{ width: string }>((props) => ({
  width: props.width,
  height: '20px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '2px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
}));

export const ContentAreaSkeleton = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const ContentHeaderSkeleton = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const ContentHeaderTextSkeleton = styled.div({
  width: '240px',
  height: '32px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const ActionButtonSkeleton = styled.div({
  width: '100px',
  height: '32px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const TableRowsSkeleton = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const TableRowSkeleton = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '12px',
  border: '1px solid #E5E5E5',
  borderRadius: '4px',
});

export const RowAvatarSkeleton = styled.div({
  width: '40px',
  height: '40px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '50%',
  flexShrink: 0,
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const RowContentSkeleton = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const RowTitleSkeleton = styled.div({
  width: '160px',
  height: '16px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '2px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const RowSubtitleSkeleton = styled.div({
  width: '240px',
  height: '12px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '2px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const RowButtonSkeleton = styled.div({
  width: '100px',
  height: '24px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

// Loaded state components
export const LoadedContainer = styled.div({
  flex: 1,
  backgroundColor: colors.white,
  borderRadius: '16px',
  borderTopLeftRadius: 0,
  overflow: 'hidden',
});

// Header components
export const LoadedHeader = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
});

export const AppDescription = styled.div({
  display: 'flex',
  gap: '12px'
})

export const AppDescriptionText = styled.div()

export const LoadedTitle = styled.h1({
  fontSize: '28px',
  lineHeight: '36px',
  fontWeight: 600,
  color: colors['grey-darker'],
});

export const Description = styled.p({
  fontSize: '16px',
  fontWeight: 400,
  color: colors['grey-dark'],
  lineHeight: 1.5
})

export const TwoColumnLayout = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'start',
  gap: '16px',
});

export const ColumnLeftSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
});

export const DownloadButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  backgroundColor: colors.white,
  border: '1px solid rgb(209, 213, 219)',
  color: 'rgb(55, 65, 81)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    backgroundColor: 'rgb(249, 250, 251)',
    borderColor: 'rgb(156, 163, 175)',
  },
});

// Benefits
export const BenefitsList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const BenefitItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '11px',
});

export const BenefitIcon = styled.div({
  width: '32px',
  height: '32px',
  backgroundColor: colors['grey-lighter'],
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const BenefitText = styled.p({
  fontSize: '16px',
  fontWeight: 600,
  color: colors['grey-darker'],
  margin: 0,
});

// Contact Card
export const ContactCard = styled.div({
  background: colors['blue-lighter'],
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid rgb(191, 219, 254)',
});

export const ContactContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16px',
});

export const ContactText = styled.div({
  flex: 1,
});

export const ContactTitle = styled.h3({
  fontSize: '16px',
  fontWeight: 600,
  color: colors['grey-darker'],
});

export const ContactDescription = styled.p({
  fontSize: '16px',
  color: colors['grey-dark'],
});

// Spec Doc Content

export const ContentHeader = styled.div({
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: `1px solid ${colors['grey-light']}`,
});

// Tabs components
export const LoadedTabsContainer = styled.div({
  borderBottom: `1px solid ${colors['grey-light']}`,
});

export const LoadedTabsWrapper = styled.div({
  display: 'flex',
  gap: '4px',
  overflowX: 'auto',
});

interface TabProps {
  isActive: boolean;
}

export const Tab = styled.button<TabProps>(({ isActive }) => ({
  padding: '8px 24px 16px 24px',
  fontSize: '16px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  transition: 'color 0.2s ease-in-out',
  borderBottom: isActive ? `2px solid ${colors.blue} !important` : `2px solid transparent !important`,
  color: isActive ? colors.blue : colors['grey-dark'],
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
}));

// Content area
export const LoadedContentSection = styled.div({
  padding: '24px',
  overflowY: 'auto',
});

export const SectionHeader = styled.div({
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const SectionDescription = styled.p({
  fontSize: '16px',
  color: colors['grey-dark'],
  lineHeight: 1.5,
  margin: 0,
});

export const SectionActionsContainer = styled.div({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

export const AskMiaButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 12px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#7B2FF7',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',
  
  '&:hover': {
    color: '#4D169C',
    backgroundColor: '#F5F2FF',
  },
});

// Role cards
export const RolesList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

interface SpecItemCardHeaderProps {
  isClickable?: boolean;
}

export const SpecItemCard = styled.div({
  border: '1px solid rgb(229, 231, 235)',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'box-shadow 0.2s ease-in-out',

  '&:hover': {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
});

export const SpecItemCardHeader = styled.div<SpecItemCardHeaderProps>(({ isClickable }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  backgroundColor: colors.white,
  cursor: isClickable ? 'pointer' : 'default',
  transition: isClickable ? 'background-color 0.2s ease-in-out' : undefined,
  gap: '16px',
  padding: '8px 16px',
}));

export const SpecItemCardHeaderContent = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  flex: 1,
  minWidth: 0,
});

export const SpecItemCardText = styled.div({
  flex: 1,
});

export const SpecItemName = styled.h3({
  fontSize: '16px',
  fontWeight: 600,
  color: colors['grey-darker'],
  lineHeight: 1.5
});

export const SpecItemDescription = styled.p({
  fontSize: '16px',
  color: colors['grey-dark'],
  lineHeight: 1.5
});

export const SpecItemCardRight = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  flexShrink: 0,
});

export const SpecItemCardStats = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '14px',
  color: 'rgb(75, 85, 99)',
});

export const StatsDivider = styled.span({
  color: 'rgb(156, 163, 175)',
});

// ROLES

export const RoleCardBody = styled.div({
  borderTop: '1px solid rgb(229, 231, 235)',
  padding: '16px',
  backgroundColor: colors.white,
});

export const PermissionsLabel = styled.h4({
  fontSize: '14px',
  fontWeight: 600,
  color: colors['grey'],
  margin: 0,
  marginBottom: '8px',
});

export const PermissionsList = styled.ul({
  listStyleType: 'disc',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  paddingLeft: '24px'
});

export const PermissionItem = styled.li({
  fontSize: '16px',
  color: colors['grey-dark'],
});

// Features/Workflows components
export const WorkflowsList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const WorkflowHeader = styled.button({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '12px',
  transition: 'background-color 0.2s ease-in-out',
  gap: '16px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: 'rgb(249, 250, 251)',
  },
});

export const WorkflowHeaderLeft = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  flex: 1,
  minWidth: 0,
});

export const WorkflowHeaderText = styled.div({
  textAlign: 'left',
  flex: 1,
  minWidth: 0,
});

export const WorkflowName = styled.h3({
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '4px',
  margin: 0,
  color: 'rgb(17, 24, 39)',
});

export const WorkflowDescription = styled.p({
  fontSize: '14px',
  color: 'rgb(75, 85, 99)',
  margin: 0,
});


export const WorkflowBody = styled.div({
  borderTop: '1px solid rgb(229, 231, 235)',
  padding: '16px',
  backgroundColor: colors.white,
});

export const StepsLabel = styled.h4({
  fontSize: '14px',
  fontWeight: 600,
  color: 'rgb(107, 114, 128)',
  marginBottom: '8px',
  margin: 0,
});

export const StepsList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const StepCard = styled.div({
  backgroundColor: colors['concrete'],
  border: `1px solid ${colors['grey-light']}`,
  borderRadius: '8px',
  padding: '12px 16px',
});

export const StepContent = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
});

export const StepContentLeft = styled.div({
  flex: 1,
  minWidth: 0,
});

export const StepActor = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
});

export const ActorLabel = styled.span({
  fontSize: '14px',
  fontWeight: 600,
  color: colors.blue,
});

export const StepTitle = styled.h5({
  fontSize: '16px',
  fontWeight: 600,
  color: colors['grey-darker'],
  lineHeight: 1.3,
});

export const StepDescription = styled.p({
  fontSize: '14px',
  color: colors['grey-dark'],
  lineHeight: '16px',
});

export const StepBadge = styled.span({
  padding: '2px 8px',
  backgroundColor: 'rgb(219, 234, 254)',
  color: 'rgb(29, 78, 216)',
  fontSize: '12px',
  fontWeight: 500,
  borderRadius: '4px',
  flexShrink: 0,
});

// Data Entities components
export const EntitiesList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const EntityBody = styled.div({
  borderTop: `1px solid ${colors['grey-light']}`,
  backgroundColor: colors['concrete'],
});

export const FieldsSection = styled.div({
  padding: '16px',
});

export const FieldsSectionTitle = styled.h4({
  fontSize: '16px',
  fontWeight: 600,
  color: colors['grey'],
  lineHeight: '16px'
});

export const FieldsList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const FieldRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '40px',
  fontSize: '16px',
  padding: '6px 0',
});

export const FieldName = styled.span({
  fontWeight: 600,
  color: colors['grey-darker'],
  minWidth: '160px',
  textTransform: 'capitalize',
});

export const FieldDescription = styled.span({
  color: colors['grey-darker'],
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const FieldBadges = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
});

export const RelationshipsSection = styled.div({
  padding: '16px',
  borderTop: `1px solid ${colors['grey-light']}`,
});

export const RelationshipsList = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '8px'
});

// Business Rules components
export const RulesList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const RuleBody = styled.div({
  borderTop: '1px solid rgb(229, 231, 235)',
  padding: '16px',
  backgroundColor: colors.white,
});

export const RuleLogic = styled.div({
  fontSize: '16px',
  lineHeight: 1.5,
  color: colors['grey-dark'],
  backgroundColor: colors['concrete'],
  border: `1px solid ${colors['grey-light']}`,
  borderRadius: '8px',
  padding: '12px',
});

export const RuleKeyword = styled.span({
  fontWeight: 600,
  color: colors['grey-darker'],
  textTransform: 'uppercase'
});

// ============================================================================
// Screens Section
// ============================================================================

export const ScreensGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '16px',
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
});

export const ScreenCard = styled.div({
  border: '1px solid rgb(229, 231, 235)',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: colors.white,
});

export const ScreenCardHeader = styled.div({
  borderBottom: '1px solid rgb(229, 231, 235)',
  padding: '12px',
  backgroundColor: colors.white,
});

export const ScreenCardTitle = styled.h3({
  fontSize: '14px',
  fontWeight: 600,
  color: 'rgb(17, 24, 39)',
  margin: 0,
});

export const ScreenPreview = styled.div({
  height: '128px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  background: 'linear-gradient(to bottom right, rgb(249, 250, 251), rgb(243, 244, 246))',
});

export const ScreenCardFooter = styled.div({
  padding: '12px',
  backgroundColor: colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const WorkflowCount = styled.span({
  fontSize: '12px',
  color: 'rgb(107, 114, 128)',
});

// Screen mockup components
export const MockupContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const MockupTabs = styled.div({
  display: 'flex',
  gap: '8px',
});

interface MockupTabProps {
  width: 'wide' | 'normal';
}

export const MockupTab = styled.div<MockupTabProps>(({ width }) => ({
  height: '8px',
  backgroundColor: width === 'wide' ? 'rgb(156, 163, 175)' : 'rgb(209, 213, 219)',
  borderRadius: '4px',
  width: width === 'wide' ? '33%' : '25%',
}));

export const MockupTitle = styled.div({
  height: '12px',
  backgroundColor: 'rgb(209, 213, 219)',
  borderRadius: '4px',
  width: '50%',
});

export const MockupChartBars = styled.div({
  display: 'flex',
  gap: '6px',
  marginTop: '12px',
  alignItems: 'flex-end',
  height: '48px',
});

interface MockupBarProps {
  height?: string;
}

export const MockupBar = styled.div<MockupBarProps>(({ height }) => ({
  backgroundColor: 'rgb(156, 163, 175)',
  borderRadius: '4px',
  width: '20%',
  height: height || '75%',
}));

export const MockupFormRow = styled.div({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

interface MockupLabelProps {
  width?: string;
}

export const MockupLabel = styled.div<MockupLabelProps>(({ width }) => ({
  height: '8px',
  backgroundColor: 'rgb(209, 213, 219)',
  borderRadius: '4px',
  width: width || '25%',
}));

export const MockupInput = styled.div({
  height: '32px',
  backgroundColor: 'rgb(229, 231, 235)',
  borderRadius: '4px',
  flex: 1,
});

export const MockupButton = styled.div({
  height: '10px',
  backgroundColor: 'rgb(156, 163, 175)',
  borderRadius: '4px',
  width: '40px',
});

export const MockupSidebar = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '33%',
});

export const MockupSidebarItem = styled.div({
  height: '8px',
  backgroundColor: 'rgb(209, 213, 219)',
  borderRadius: '4px',
});

export const MockupContent = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const MockupListRow = styled.div({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

export const MockupBullet = styled.div({
  width: '6px',
  height: '6px',
  backgroundColor: 'rgb(209, 213, 219)',
  borderRadius: '50%',
  flexShrink: 0,
});
