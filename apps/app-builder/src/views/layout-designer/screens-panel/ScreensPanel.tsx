import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import SvgIcon from '@m-next/svg-icon';
import * as s from './ScreensPanel.styles';
import { useGetAppScreensQuery } from '../../../common/services/managementApi';
import { selectAppId, selectIsBuildingApp } from '../../../common/services/appSlice';
import { selectLoadedScreenId } from '../../../common/services/screenLayoutSlice';
import { colors } from '@m-next/styles';
import { useNavigate } from 'react-router-dom';

interface Screen {
  id: string;
  name: string;
  versions?: Array<{
    versionId: string;
    versionState: string;
  }>;
  isDefaultAppScreen?: boolean;
  currentVersion?: string;
  aiBuildStatus?: 'in_progress' | 'done';
}

export interface ScreensPanelProps {
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Callback when add button is clicked */
  onAddScreen?: () => void;
  /** Test ID for the component */
  'data-testid'?: string;
}

export function ScreensPanel({
  onClose,
  onAddScreen,
  'data-testid': testId,
}: ScreensPanelProps) {
  const containerTestId = testId || 'screens-sidebar';
  const appId = useSelector(selectAppId);
  const loadedScreenId = useSelector(selectLoadedScreenId);
  const isBuildingApp = useSelector(selectIsBuildingApp);
  const { data: screens = [] as Screen[] } = useGetAppScreensQuery({ appId }, { skip: !appId });
  const navigate = useNavigate();

  // Sort screens: Home screen first, then alphabetically by name
  const sortedScreens = React.useMemo(() => {
    return [...screens].sort((a, b) => {
      // Home screen always comes first
      if (a.isDefaultAppScreen && !b.isDefaultAppScreen) return -1;
      if (!a.isDefaultAppScreen && b.isDefaultAppScreen) return 1;
      // Both are home or both are not home - sort alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [screens]);

  const getVersionId = (screen: Screen): string | null => {
    if (screen.versions && screen.versions.length > 0) {
      let version = screen.versions.find((v) => v.versionState === 'TEST');
      if (!version) {
        version = screen.versions.find(v => v.versionId === screen.currentVersion);
      }
      return version ? version.versionId : null;
    }
    return null;
  };

  const handleScreenSelect = (screen: Screen) => {
    const versionId = getVersionId(screen);
    if (versionId) {
      navigate(`/${appId}/layout/${screen.id}/${versionId}`, { replace: true });
    }
  };

  const handleSettingsClick = () => {
    // Open the legacy apps management screens page in a new tab (outside React router)
    window.open(`/apps/Default.aspx#/apps/${appId}/screens`, '_blank');
  }

  return (
    <s.SidebarContainer data-testid={containerTestId}>
      <Tooltip id="screen-building-tooltip" place="right" style={{ zIndex: 100 }} />
      <Tooltip id="settings-tooltip" place="left" style={{ zIndex: 100 }} />
      <s.SidebarHeader>
        <s.SidebarTitle>Screens</s.SidebarTitle>
        <s.CloseButton onClick={onClose}>
          <SvgIcon name="close-V4" color={colors['grey']} />
        </s.CloseButton>
      </s.SidebarHeader>

      <s.ScreensInfo>
        <s.ScreenCount>{screens?.length || 0} Screens</s.ScreenCount>
        <s.ActionButtons>
          <s.IconButton
            type="button"
            onClick={handleSettingsClick}
            aria-label="Settings"
            data-testid={`${containerTestId}-settings`}
            data-tooltip-id="settings-tooltip"
            data-tooltip-content="Advanced Settings"
          >
            <SvgIcon name="settings2" size={12} />
          </s.IconButton>
          {onAddScreen && (
            <s.IconButton
              type="button"
              onClick={onAddScreen}
              aria-label="Add screen"
              data-testid={`${containerTestId}-add`}
            >
              <SvgIcon name="plus" size={12} />
            </s.IconButton>
          )}
        </s.ActionButtons>
      </s.ScreensInfo>

      <s.ScreensList>
        {sortedScreens?.map((screen: Screen) => {
          const isDisabled = screen.aiBuildStatus === 'in_progress';
          return (
            <s.ScreenItem
              key={screen.id}
              isActive={loadedScreenId === screen.id}
              isDisabled={isDisabled}
              onClick={() => !isDisabled && handleScreenSelect(screen)}
              data-testid={`${containerTestId}-screen-${screen.id}`}
              {...(isDisabled && {
                'data-tooltip-id': 'screen-building-tooltip',
                'data-tooltip-content': 'Screen is still building.'
              })}
            >
              <s.ScreenIcon>
                <SvgIcon name={screen.isDefaultAppScreen ? 'home' : 'screen-V4'} size={12} />
              </s.ScreenIcon>

              <s.ScreenName>{screen.name}</s.ScreenName>
              {screen.aiBuildStatus === 'in_progress' && (
                <s.LoadingSpinner />
              )}

              {isBuildingApp && screen.aiBuildStatus === 'done' && (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SvgIcon name='check-circle-filled' size={16} color={colors['green']} />
                </div>
              )}
            </s.ScreenItem>
          );
        })}
      </s.ScreensList>
    </s.SidebarContainer>
  );
}

export default ScreensPanel;
