import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFeatureFlags, selectNocodeAssistantSessionId } from '../../common/services/sessionSlice';
import { selectSpecDocId } from '../../common/services/appSlice';
import { useGetAppScreensQuery } from '../../common/services/managementApi';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@m-next/button';
import Pill from '@m-next/pill';
import PillTab from '@m-next/pill-tab';
import SvgIcon from '@m-next/svg-icon';
import { Text } from '@m-next/typeography';
import { useTheme } from '@mui/material';
import Image from '@m-next/image';
import Container from '@m-next/container';
import DeviceViewSelector from '../../components/DeviceViewSelector';
import HiddenComponentsToggle from '../../components/HiddenComponentsToggle';
import { toast } from 'react-toastify';
import * as s from './header.styles';
import { screenStates } from '../../common/services/screenLayoutSlice';
import ScreenSelector from './components/ScreenSelector/ScreenSelector';
import { AiGradientButton } from '@m-next/ai-prompt';
import { Tooltip } from 'react-tooltip';
import { colors } from '@m-next/styles';
import AiBuildScreenDialog from './components/AiBuildScreenDialog';
import { useBuildApp } from '../../common/hooks/useBuildApp';

const propTypes = {
  appId: PropTypes.string,
  appName: PropTypes.string,
  screenName: PropTypes.string,
  versionNumber: PropTypes.number,
  accountingPackage: PropTypes.oneOf(['All', 'QBO', 'QBG', 'Xero']),
  onClose: PropTypes.func,
  isDeveloper: PropTypes.bool,
  publishStatus: PropTypes.oneOf(['Published', 'Archived', 'Draft']),
  isV4Screen: PropTypes.bool,
  screenStatus: PropTypes.string,
  showAppInfo: PropTypes.bool,
  toggleDarkMode: PropTypes.func,
  darkMode: PropTypes.bool,
  showDarkModeToggle: PropTypes.bool,
  isStock: PropTypes.bool,
  existingDraft: PropTypes.bool,
  onEditScreen: PropTypes.func,
  hiddenComponentsVisible: PropTypes.bool,
  onToggleHiddenComponents: PropTypes.func,
  onClearScreen: PropTypes.func,
  showDebugMode: PropTypes.bool,
  isAiEnabledScreen: PropTypes.bool,
};

function Header({
  appId,
  appName,
  screenName,
  onClose,
  publishStatus,
  isV4Screen,
  screenStatus,
  showAppInfo,
  toggleDarkMode,
  darkMode,
  showDarkModeToggle = false,
  isStock = true,
  existingDraft = false,
  onEditScreen = () => {},
  onClearScreen = () => {},
  showDebugMode = false,
  isAiEnabledScreen = false,
}) {
  const featureFlags = useSelector(selectFeatureFlags);
  const useNewLayoutCanvas = featureFlags?.useNewLayoutCanvas ?? false;
  const isAppStudioBuildEnabled = !!(featureFlags && featureFlags.appStudioBuild);
  const specDocId = useSelector(selectSpecDocId);
  const nocodeAssistantSessionId = useSelector(selectNocodeAssistantSessionId);
  const handleClose = () => onClose();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  // Use sessionId from Redux state (persists across navigation) or fallback to URL param
  const sessionId = nocodeAssistantSessionId || searchParams.get('sessionId');

  const [aiBuildDialogOpen, setAiBuildDialogOpen] = useState(false);

  const { content } = useTheme();
  const location = useLocation();

  // Determine if we're in AI Plan mode
  const isAiPlanMode = useMemo(() => {
    if (
      location.pathname.includes('layout') ||
      location.pathname.includes('screen') ||
      location.pathname.includes('models')
    ) {
      return false;
    }
    return true;
  }, [location.pathname]);

  // Fetch screens for regular mode and AI plan mode
  const { data: screens } = useGetAppScreensQuery({ appId }, { skip: !appId });

  // Use build app hook when in plan mode
  const { buildApp, isBuildingApp } = useBuildApp({
    sessionId: sessionId || '',
    specDocId,
  });

  // Handle PillTab toggle between Plan and Build
  const handlePillTabChange = (value) => {
    if (value === 'build') {
      // Navigate to the app builder with the home screen
      const targetAppId = appId;
      if (!targetAppId) {
        console.error('No app ID available');
        return;
      }

      const homeScreen = screens?.find((screen) => screen.isDefaultAppScreen);

      if (homeScreen) {
        const version = homeScreen.versions.find((v) => v.versionId === homeScreen.currentVersion);
        const url = sessionId
          ? `/${targetAppId}/layout/${homeScreen.id}/${version.versionId}?sessionId=${sessionId}`
          : `/${targetAppId}/layout/${homeScreen.id}/${version.versionId}`;
        navigate(url, { replace: true });
      } else {
        // Fallback: navigate to screens list if no home screen found
        const url = sessionId ? `/${targetAppId}/screens?sessionId=${sessionId}` : `/${targetAppId}/screens`;
        navigate(url, { replace: true });
      }
    } else if (value === 'plan') {
      const url = `/?specDocId=${specDocId}`;
      navigate(url, { replace: true });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === '<' || e.key === ',')) {
        e.preventDefault();
        setAiBuildDialogOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedToggle = useMemo(() => {
    if (location.pathname.includes('layout') || location.pathname.includes('screens')) {
      return 'screens';
    }
    if (location.pathname.includes('models')) {
      return 'models';
    }

    return null;
  }, [location.pathname]);

  const saveText = useMemo(() => {
    if (screenStatus === screenStates.editing || screenStatus === screenStates.saving) return 'Saving...';
    // For AI Plan mode, show "Saved" if spec doc has been generated
    if (isAiPlanMode && specDocId) return 'Saved';
    if (!publishStatus) return '';
    return publishStatus === 'Draft' ? 'Saved' : 'Changes not saved';
  }, [publishStatus, screenStatus, isAiPlanMode, specDocId]);

  const editButtonText = useMemo(() => {
    if (!publishStatus) return '';
    if (publishStatus === 'Draft') return null;
    if (isStock) return 'Create copy';
    if (existingDraft) return 'Edit draft';

    return 'Create draft';
  }, [existingDraft, isStock, publishStatus]);

  const showCheck = useMemo(() => {
    if (screenStatus === screenStates.ready) return true;
    // Show checkmark in AI Plan mode when spec doc is generated
    if (isAiPlanMode && specDocId) return true;
    return false;
  }, [screenStatus, isAiPlanMode, specDocId]);

  const renderHeaderTitle = () => {
    if (!showAppInfo || (!appName && !screenName)) return;

    return (
      <s.Header id='header-title'>
        {appName && <s.HeaderAppName wide={!(isAiPlanMode || isAiEnabledScreen)}>{appName}</s.HeaderAppName>}
        {appName && screenName && <span style={{ display: 'block', width: '16px', textAlign: 'center' }}>/</span>}
        {screenName && (
          <ScreenSelector
            appId={appId}
            screens={screens}
            currentScreenName={screenName}
            wide={!(isAiPlanMode || isAiEnabledScreen)}
          />
        )}
      </s.Header>
    );
  };

  const renderPill = (text, color) => (
    <Pill id='header-version-state' leadIcon={{ name: 'dot' }} colorScheme={color}>
      {text}
    </Pill>
  );

  // Legacy header (without new layout canvas features)
  if (!useNewLayoutCanvas) {
    return (
      <s.LegacyWrapper id='header-wrapper'>
        <Container
          id='header'
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: '8px 16px 8px 8px',
            alignItems: 'center',
          }}
          width='100%'
          isRound={false}
        >
          <s.LegacyLeftWrapper>
            <SvgIcon id='header-close' name='back' size={24} onClick={handleClose} color={colors.grey} />
            {showAppInfo && publishStatus === 'Draft' && renderPill('Draft', 'orange')}
            {showAppInfo && publishStatus === 'Published' && renderPill('Published (Read-only)', 'green')}
            {showAppInfo && publishStatus === 'Archived' && renderPill('Archived (Read-only)', 'grey')}
            {renderHeaderTitle()}
          </s.LegacyLeftWrapper>
          {isV4Screen && showAppInfo && (
            <s.LegacyCenterWrapper>
              <Link
                style={{ textDecoration: 'none', outline: 'none', color: content.primary, cursor: 'pointer' }}
                to={`./${appId}/screens`}
              >
                <s.LegacyToggleItem selected={selectedToggle === 'screens'}>
                  <Text bold style={{ cursor: 'pointer' }}>
                    Screens
                  </Text>
                </s.LegacyToggleItem>
              </Link>
              <Link
                style={{ textDecoration: 'none', outline: 'none', color: content.primary, cursor: 'pointer' }}
                to={`./${appId}/models`}
              >
                <s.LegacyToggleItem selected={selectedToggle === 'models'}>
                  <Text bold style={{ cursor: 'pointer' }}>
                    Data Models
                  </Text>
                </s.LegacyToggleItem>
              </Link>
            </s.LegacyCenterWrapper>
          )}
          <s.LegacyRightWrapper>
            {showDarkModeToggle && (
              <SvgIcon id='dark-mode' size={24} onClick={toggleDarkMode}>
                {!darkMode ? (
                  <svg
                    height={24}
                    viewBox='0 0 24 24'
                    width={24}
                    xmlSpace='preserve'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 6.75c-2.895 0 -5.25 2.355 -5.25 5.25s2.355 5.25 5.25 5.25 5.25 -2.355 5.25 -5.25 -2.355 -5.25 -5.25 -5.25zm0 9c-2.071 0 -3.75 -1.679 -3.75 -3.75s1.679 -3.75 3.75 -3.75 3.75 1.679 3.75 3.75 -1.679 3.75 -3.75 3.75zm0 -10.5c0.414 0 0.75 -0.336 0.75 -0.75V3c0 -0.414 -0.336 -0.75 -0.75 -0.75s-0.75 0.336 -0.75 0.75v1.5c0 0.414 0.336 0.75 0.75 0.75zm0 13.5c-0.414 0 -0.75 0.336 -0.75 0.75v1.5c0 0.414 0.336 0.75 0.75 0.75s0.75 -0.336 0.75 -0.75v-1.5c0 -0.414 -0.336 -0.75 -0.75 -0.75zm5.833 -11.523 1.061 -1.061c0.293 -0.293 0.293 -0.768 0 -1.061s-0.768 -0.293 -1.061 0l-1.061 1.061c-0.293 0.293 -0.293 0.768 0 1.061s0.768 0.293 1.061 0zM6.167 16.773l-1.061 1.061c-0.293 0.293 -0.293 0.768 0 1.06s0.768 0.293 1.061 0l1.061 -1.06c0.293 -0.294 0.293 -0.768 0 -1.061 -0.293 -0.293 -0.768 -0.294 -1.061 0zM5.25 12c0 -0.414 -0.336 -0.75 -0.75 -0.75H3c-0.414 0 -0.75 0.336 -0.75 0.75s0.336 0.75 0.75 0.75h1.5c0.414 0 0.75 -0.336 0.75 -0.75zm15.75 -0.75h-1.5c-0.414 0 -0.75 0.336 -0.75 0.75s0.336 0.75 0.75 0.75h1.5c0.414 0 0.75 -0.336 0.75 -0.75s-0.336 -0.75 -0.75 -0.75zm-14.834 -4.023c0.293 0.293 0.768 0.293 1.061 0 0.293 -0.293 0.293 -0.768 0 -1.061l-1.061 -1.061c-0.293 -0.293 -0.768 -0.293 -1.061 0 -0.293 0.293 -0.293 0.768 0 1.061l1.061 1.061zm11.668 9.546c-0.294 -0.293 -0.768 -0.293 -1.061 0 -0.293 0.293 -0.294 0.768 0 1.061l1.061 1.061c0.293 0.293 0.768 0.293 1.06 0s0.293 -0.768 0 -1.061l-1.06 -1.061z'
                      fill={content.primary}
                    />
                  </svg>
                ) : (
                  <svg
                    className='feather feather-moon'
                    fill='none'
                    height={24}
                    stroke={content.primary}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    width={24}
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
                  </svg>
                )}
              </SvgIcon>
            )}
            {showAppInfo && (
              <s.LegacySaveWrapper>
                {showCheck && <SvgIcon size={16} name='circle-checkmark' color={content.secondary} />}

                {(screenStatus === screenStates.editing || screenStatus === screenStates.saving) && (
                  <Image id='spinner' imgType='Fixed' width={22} height={22} value='./spinner.gif' />
                )}
                {saveText && saveText.length > 0 && (
                  <Text bold color={content.secondary} style={editButtonText ? { width: 128 } : {}}>
                    {saveText}
                  </Text>
                )}
                {editButtonText && editButtonText.length > 0 && (
                  <Button
                    id='header-edit'
                    value={editButtonText}
                    onClick={onEditScreen}
                    width={120}
                    widthType='fixed'
                    isV4Design
                  />
                )}
              </s.LegacySaveWrapper>
            )}
            {/* TODO: Re-enable Publish button when feature is complete (NCNG-7) */}
            {/* {showAppInfo && isV4Screen && <Button id='header-publish' value='Publish' />} */}
          </s.LegacyRightWrapper>
        </Container>
        <AiBuildScreenDialog isOpen={aiBuildDialogOpen} onClose={() => setAiBuildDialogOpen(false)} />
      </s.LegacyWrapper>
    );
  }

  // New header with layout canvas features
  return (
    <s.Wrapper id='header-wrapper'>
      <s.LeftWrapper>
        <SvgIcon id='header-close' name='back' size={24} onClick={handleClose} color={colors.grey} />
        {showAppInfo && publishStatus === 'Draft' && renderPill('Draft', 'orange')}
        {renderHeaderTitle()}
      </s.LeftWrapper>
      <s.CenterWrapper>
        {isV4Screen && showAppInfo && !useNewLayoutCanvas && (
          <>
            <Link
              style={{ textDecoration: 'none', outline: 'none', color: content.primary, cursor: 'pointer' }}
              to={`./${appId}/screens`}
            >
              <s.ToggleItem selected={selectedToggle === 'screens'}>
                <Text bold style={{ cursor: 'pointer' }}>
                  Screens
                </Text>
              </s.ToggleItem>
            </Link>
            <Link
              style={{ textDecoration: 'none', outline: 'none', color: content.primary, cursor: 'pointer' }}
              to={`./${appId}/models`}
            >
              <s.ToggleItem selected={selectedToggle === 'models'}>
                <Text bold style={{ cursor: 'pointer' }}>
                  Data Models
                </Text>
              </s.ToggleItem>
            </Link>
          </>
        )}
        {(isAiPlanMode || isAiEnabledScreen) && (
          <PillTab
            options={[
              { label: 'Plan', value: 'plan' },
              { label: 'Build', value: 'build', disabled: !appId },
            ]}
            value={isAiPlanMode ? 'plan' : 'build'}
            onChange={handlePillTabChange}
          />
        )}
      </s.CenterWrapper>
      <s.RightWrapper>
        {useNewLayoutCanvas && !isAiPlanMode && (
          <>
            <DeviceViewSelector />
            <HiddenComponentsToggle />
          </>
        )}
        {showDebugMode && (
          <Button
            id='test-toast-button'
            value='Test Toast'
            onClick={() => toast.success('Screen upgrade completed to App Builder')}
            isV4Design
            variant='secondary'
            width={120}
            widthType='fixed'
          />
        )}
        {showDebugMode && (
          <SvgIcon
            id='debug-clear'
            size={24}
            onClick={() => {
              if (window.confirm('Clear screen and start over? This cannot be undone.')) {
                onClearScreen();
              }
            }}
            title='Debug: Clear Screen'
          >
            <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' fill='none'>
              <path
                d='M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6'
                stroke={content.primary}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </SvgIcon>
        )}
        {showDarkModeToggle && (
          <SvgIcon id='dark-mode' size={24} onClick={toggleDarkMode}>
            {!darkMode ? (
              <svg height={24} viewBox='0 0 24 24' width={24} xmlSpace='preserve' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M12 6.75c-2.895 0 -5.25 2.355 -5.25 5.25s2.355 5.25 5.25 5.25 5.25 -2.355 5.25 -5.25 -2.355 -5.25 -5.25 -5.25zm0 9c-2.071 0 -3.75 -1.679 -3.75 -3.75s1.679 -3.75 3.75 -3.75 3.75 1.679 3.75 3.75 -1.679 3.75 -3.75 3.75zm0 -10.5c0.414 0 0.75 -0.336 0.75 -0.75V3c0 -0.414 -0.336 -0.75 -0.75 -0.75s-0.75 0.336 -0.75 0.75v1.5c0 0.414 0.336 0.75 0.75 0.75zm0 13.5c-0.414 0 -0.75 0.336 -0.75 0.75v1.5c0 0.414 0.336 0.75 0.75 0.75s0.75 -0.336 0.75 -0.75v-1.5c0 -0.414 -0.336 -0.75 -0.75 -0.75zm5.833 -11.523 1.061 -1.061c0.293 -0.293 0.293 -0.768 0 -1.061s-0.768 -0.293 -1.061 0l-1.061 1.061c-0.293 0.293 -0.293 0.768 0 1.061s0.768 0.293 1.061 0zM6.167 16.773l-1.061 1.061c-0.293 0.293 -0.293 0.768 0 1.06s0.768 0.293 1.061 0l1.061 -1.06c0.293 -0.294 0.293 -0.768 0 -1.061 -0.293 -0.293 -0.768 -0.294 -1.061 0zM5.25 12c0 -0.414 -0.336 -0.75 -0.75 -0.75H3c-0.414 0 -0.75 0.336 -0.75 0.75s0.336 0.75 0.75 0.75h1.5c0.414 0 0.75 -0.336 0.75 -0.75zm15.75 -0.75h-1.5c-0.414 0 -0.75 0.336 -0.75 0.75s0.336 0.75 0.75 0.75h1.5c0.414 0 0.75 -0.336 0.75 -0.75s-0.336 -0.75 -0.75 -0.75zm-14.834 -4.023c0.293 0.293 0.768 0.293 1.061 0 0.293 -0.293 0.293 -0.768 0 -1.061l-1.061 -1.061c-0.293 -0.293 -0.768 -0.293 -1.061 0 -0.293 0.293 -0.293 0.768 0 1.061l1.061 1.061zm11.668 9.546c-0.294 -0.293 -0.768 -0.293 -1.061 0 -0.293 0.293 -0.294 0.768 0 1.061l1.061 1.061c0.293 0.293 0.768 0.293 1.06 0s0.293 -0.768 0 -1.061l-1.06 -1.061z'
                  fill={content.primary}
                />
              </svg>
            ) : (
              <svg
                className='feather feather-moon'
                fill='none'
                height={24}
                stroke={content.primary}
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                viewBox='0 0 24 24'
                width={24}
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
              </svg>
            )}
          </SvgIcon>
        )}
        {showAppInfo && (
          <s.SaveWrapper>
            {showCheck && <SvgIcon size={16} name='circle-checkmark' color={content.secondary} />}

            {(screenStatus === screenStates.editing || screenStatus === screenStates.saving) && (
              <Image id='spinner' imgType='Fixed' width={22} height={22} value='./spinner.gif' />
            )}
            {saveText && saveText.length > 0 && (
              <Text bold color={content.secondary} style={editButtonText ? { width: 128 } : {}}>
                {saveText}
              </Text>
            )}
            {editButtonText && editButtonText.length > 0 && (
              <Button
                id='header-edit'
                value={editButtonText}
                onClick={onEditScreen}
                width={120}
                widthType='fixed'
                isV4Design
              />
            )}
          </s.SaveWrapper>
        )}
        {/* TODO: Re-enable Publish button when feature is complete (NCNG-7) */}
        {/* {showAppInfo && isV4Screen && <Button id='header-publish' value='Publish' />} */}

        {/* AI Plan mode: Show build button or view app button */}
        {/* {isAiPlanMode && !appId && ( */}
        {isAiPlanMode && (
          <>
            <AiGradientButton
              id='header-build'
              value={isBuildingApp ? 'Building...' : 'Build app'}
              onClick={() => buildApp()}
              disabled={isBuildingApp || !specDocId || !!appId || !isAppStudioBuildEnabled}
            />
            <Tooltip
              id='header-build-tooltip'
              place='bottom'
              style={{
                backgroundColor: colors['grey-darkest'],
                borderRadius: '2px',
                padding: '4px 8px',
                fontSize: '12px',
              }}
            />
          </>
        )}
      </s.RightWrapper>
      <AiBuildScreenDialog isOpen={aiBuildDialogOpen} onClose={() => setAiBuildDialogOpen(false)} />
    </s.Wrapper>
  );
}

Header.propTypes = propTypes;

export default Header;
