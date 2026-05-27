import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Routes, Route, Outlet, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import ReactActionEditorWrapper from '@m-next/action-editor';
import Container from '@m-next/container';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { toast, ToastContainer } from 'react-toastify';

import { funTheme, lightTheme } from '@m-next/styles';
import {
  selectAppName,
  selectAccountingType,
  selectScreenName,
  selectVersionNumber,
  selectPublishStatus,
  selectStatus,
  appStates,
  selectAppId,
  selectScreenId,
  selectVersionId,
  selectSpecDocId,
} from '../common/services/appSlice';
import * as s from './app.styles';
import {
  loadNewScreen,
  saveScreen,
  selectActiveRecordId,
  selectDraftInfo,
  selectIsStock,
  selectIsV4Screen,
  startScreenCopy,
  clearScreen,
} from '../common/services/screenLayoutSlice';
import { selectAccountName, selectIsDeveloper, selectFeatureFlags } from '../common/services/sessionSlice';
import InvalidScreenDimensions from './invalidScreenDimensions';
import useAuthenticatedSession from './useAuthenticatedSession';
import './app.css';
import 'react-toastify/dist/ReactToastify.css';
import { usePostAnalyticsMutation } from '../common/services/runtimeApi';
import { useCopyScreenMutation, useCopyScreenVersionMutation } from '../common/services/appsApi';
import ReadOnlyWarningDialog from './components/ReadOnlyWarningDialog';
import { useSetDraftMutation } from '../common/services/screenLayoutApi';
import AppRedirect from './components/AppRedirect';

// Call it once in your app. At the root of your app is the best place

const isChunkLoadError = (error) => {
  if (window.__APP_BUILDER_CHUNK_RECOVERY__?.isChunkLoadError) {
    return window.__APP_BUILDER_CHUNK_RECOVERY__.isChunkLoadError(error);
  }

  const message = `${error?.name ?? ''} ${error?.message ?? ''}`;

  return /ChunkLoadError|Loading chunk [0-9]+ failed|Failed to fetch dynamically imported module/i.test(message);
};

const reloadAfterChunkError = () => {
  if (window.__APP_BUILDER_CHUNK_RECOVERY__?.reload) {
    window.__APP_BUILDER_CHUNK_RECOVERY__.reload();
    return;
  }

  window.location.reload();
};

const lazyWithReload = (importFn) =>
  React.lazy(() =>
    importFn().catch((error) => {
      if (isChunkLoadError(error)) {
        reloadAfterChunkError();
      }

      throw error;
    }),
  );

const Header = lazyWithReload(() => import('../views/header'));
const LayoutDesigner = lazyWithReload(() => import('../views/layout-designer'));
const ModelList = lazyWithReload(() => import('../views/models/ModelList'));
const ModelViewer = lazyWithReload(() => import('../views/models/ModelViewer'));
const ScreenList = lazyWithReload(() => import('../views/screens/ScreenList'));
const AppStudio = lazyWithReload(() => import('../views/management/AppStudio'));

// Signal to the chunk recovery script that the app JS loaded successfully
if (typeof window !== 'undefined') {
  window.__APP_BUILDER_MOUNTED__ = true;
  // Clear retry state on successful load
  try {
    window.sessionStorage.removeItem('appBuilderChunkReloadAt');
    window.sessionStorage.removeItem('appBuilderChunkReloadCount');
  } catch {
    /* ignore */
  }
}

function App() {
  const appName = useSelector(selectAppName);
  const screenName = useSelector(selectScreenName);
  const versionNumber = useSelector(selectVersionNumber);
  const publishStatus = useSelector(selectPublishStatus);
  const accountingType = useSelector(selectAccountingType);
  const appStatus = useSelector(selectStatus);
  const isDeveloper = useSelector(selectIsDeveloper);
  const appId = useSelector(selectAppId);
  const screenId = useSelector(selectScreenId);
  const versionId = useSelector(selectVersionId);
  const specDocId = useSelector(selectSpecDocId);
  const isV4Screen = useSelector(selectIsV4Screen);
  const screenStatus = useSelector(selectStatus);
  const userSession = useSelector((state) => state.session);
  const accountName = useSelector(selectAccountName);
  const activeRecordId = useSelector(selectActiveRecordId);
  const isStock = useSelector(selectIsStock);
  const draftInfo = useSelector(selectDraftInfo);
  const featureFlags = useSelector(selectFeatureFlags);
  const useNewLayoutCanvas = featureFlags?.useNewLayoutCanvas ?? false;

  const dispatch = useDispatch();
  const [copyScreen] = useCopyScreenMutation();
  const [copyScreenVersion] = useCopyScreenVersionMutation();
  const [setDraft] = useSetDraftMutation();

  const [refreshLayout, setRefreshLayout] = useState(0);

  const appWrapperRef = useRef();
  const [screenWidth, setScreenWidth] = useState();
  const [showReadOnlyWarning, setShowReadOnlyWarning] = useState(false);
  const [showHiddenComponents, setShowHiddenComponents] = useState(false);
  const [showDebugMode, setShowDebugMode] = useState(false);

  const [originUrl, setOriginUrl] = useState();
  const [searchParams] = useSearchParams();
  const [postAnalytics] = usePostAnalyticsMutation();
  const location = useLocation();
  const navigate = useNavigate();

  useAuthenticatedSession();
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => createTheme(darkMode ? funTheme : lightTheme), [darkMode]);
  const [ready, setReady] = useState(false);

  // Set flag so Runtime refreshes when returning from V4 App Builder
  useEffect(() => {
    if (isV4Screen) {
      window.sessionStorage.setItem('refreshRuntimeOnReturn', 'true');
    }
  }, [isV4Screen]);

  // Debug mode keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setShowDebugMode(!showDebugMode);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDebugMode]);

  const flushRight = useMemo(() => {
    if (location.pathname.includes('layout')) {
      return true;
    }

    return false;
  }, [location.pathname]);

  const sendAnalytics = async (name, body) => {
    try {
      await postAnalytics({
        name,
        body,
        screenId,
      }).unwrap();
    } catch {
      // Ignore errors posting anayltics
    }
  };

  const doForceRefresh = () => {
    setRefreshLayout(refreshLayout + 1);
  };

  useEffect(() => {
    if (publishStatus && publishStatus !== 'Draft') {
      setShowReadOnlyWarning(true);
    }
  }, [publishStatus]);

  const navigateToOrigin = () => {
    const cameFromDesigner = window.sessionStorage.getItem('cameFromDesigner') === 'true';

    // If V4 screen came from designer, go back 2 steps to skip the layout designer middleman
    if (isV4Screen && cameFromDesigner) {
      window.history.go(-2);
    } else {
      // Otherwise, standard single back navigation
      window.history.back();
    }
  };

  const handleSave = () => {
    dispatch(saveScreen());
  };

  useEffect(() => {
    if (appStatus === appStates.editing) {
      const timerId = setTimeout(() => {
        dispatch(saveScreen());
      }, 500);
      return () => window.clearTimeout(timerId);
    }
  }, [appStatus, dispatch]);

  const handleClose = () => {
    if (appStatus === appStates.editing) {
      dispatch(saveScreen());
    }
    navigateToOrigin();
  };

  const updateScreenDimensions = () => {
    const newWidth = appWrapperRef.current.clientWidth;
    setScreenWidth(newWidth);
  };

  const handleCloseReadOnlyWarningDialog = () => {
    setShowReadOnlyWarning(false);
  };
  // Update 'width' and 'height' when the window resizes
  useEffect(() => {
    window.addEventListener('resize', updateScreenDimensions);

    if (screenWidth === null || screenWidth === undefined) {
      updateScreenDimensions();
    }

    if (!originUrl) {
      const paramValue = searchParams.get('callbackUrl');
      if (paramValue) {
        setOriginUrl(paramValue);
      } else {
        setOriginUrl(`${window.location.origin}/apps/Default.aspx#/${screenId}`);
      }
    }

    return () => window.removeEventListener('resize', updateScreenDimensions);
  }, [originUrl, screenId, screenWidth, searchParams]);

  useEffect(() => {
    if (appId && screenId && versionId && userSession) {
      setReady(true);
    }
  }, [appId, screenId, versionId, userSession]);

  const copyStockScreen = async () => {
    setShowReadOnlyWarning(false);
    dispatch(startScreenCopy());

    try {
      const response = await copyScreen({
        account: accountName,
        body: {
          FromScreenID: screenId,
          ToAppID: appId,
          RedirectScreenId: screenId,
          ToAccount: accountName,
          LegacyResponse: false,
          ActiveRecordId: activeRecordId,
        },
      }).unwrap();
      const newScreenId = response.id; // set new screen id
      const newActiveRecordId = response.activeRecordId;
      const newVersionId = response.versions[response.versions.length - 1].versionId; // new screen version id
      const focusParam = searchParams.get('focus');

      let queryString = '';
      if (newActiveRecordId) {
        queryString += `activeRecordId=${newActiveRecordId}`;
      }
      if (focusParam) {
        queryString += `&focus=${focusParam}`;
      }

      navigate(`/${appId}/layout/${newScreenId}/${newVersionId}${queryString ? `?${queryString}` : ''}`, {
        replace: true,
      });

      dispatch(
        loadNewScreen({
          appId,
          activeRecordId: newActiveRecordId,
        }),
      );
    } catch {
      console.error('Error creating copy');
    }
  };

  const createDraft = async () => {
    setShowReadOnlyWarning(false);
    dispatch(startScreenCopy());

    try {
      const response = await copyScreenVersion({
        account: accountName,
        body: {
          DestinationScreenID: screenId,
          VersionID: versionId,
          LegacyResponse: false,
        },
      }).unwrap();
      console.log('Copy screen response:', response);
      const newVersionId = response.versionId; // new screen version id
      const focusParam = searchParams.get('focus');

      let queryString = '';
      if (activeRecordId) {
        queryString += `activeRecordId=${activeRecordId}`;
      }
      if (focusParam) {
        queryString += `&focus=${focusParam}`;
      }

      navigate(`/${appId}/layout/${screenId}/${newVersionId}${queryString ? `?${queryString}` : ''}`, {
        replace: true,
      });

      dispatch(
        loadNewScreen({
          appId,
          activeRecordId,
        }),
      );
    } catch {
      console.error('Error creating draft');
    }
  };

  const handleClearScreen = () => {
    dispatch(clearScreen());
  };

  const handleCopyScreen = async () => {
    setShowReadOnlyWarning(false);
    if (isStock) {
      copyStockScreen();
    } else if (draftInfo && versionId !== draftInfo?.versionId) {
      let queryString = '';
      if (activeRecordId) {
        queryString += `activeRecordId=${activeRecordId}`;
      }
      const focusParam = searchParams.get('focus');
      if (focusParam) {
        queryString += `&focus=${focusParam}`;
      }

      await setDraft({
        appId,
        screenId,
        versionId: draftInfo?.versionId,
      });

      navigate(`/${appId}/layout/${screenId}/${draftInfo?.versionId}${queryString ? `?${queryString}` : ''}`, {
        replace: true,
      });
    } else {
      createDraft();
    }
  };

  const PageWrapper = useNewLayoutCanvas ? s.Wrapper : s.LegacyWrapper;

  return (
    <ThemeProvider theme={theme}>
      <PageWrapper id='page-wrapper' ref={appWrapperRef}>
        <ToastContainer
          position='top-right'
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          closeButton
          theme='colored'
        />
        <ReadOnlyWarningDialog
          draftInfo={draftInfo}
          isOpen={showReadOnlyWarning}
          onClose={handleCloseReadOnlyWarningDialog}
          onCopyScreen={handleCopyScreen}
          isStock={isStock}
          versionId={versionId}
        />
        <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='45px' circle={false} duration={1.4} />}>
          <Header
            appId={appId}
            appName={appName}
            screenName={screenName}
            versionNumber={versionNumber}
            publishStatus={publishStatus}
            accountingPackage={accountingType}
            isDeveloper={isDeveloper}
            hasLayoutChanges={appStatus === appStates.editing}
            onSave={handleSave}
            onClose={handleClose}
            isV4Screen={isV4Screen}
            screenStatus={screenStatus}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            darkMode={darkMode}
            showAppInfo={true}
            isStock={isStock}
            existingDraft={draftInfo && versionId !== draftInfo?.versionId}
            onEditScreen={handleCopyScreen}
            hiddenComponentsVisible={showHiddenComponents}
            onToggleHiddenComponents={() => setShowHiddenComponents(!showHiddenComponents)}
            onClearScreen={handleClearScreen}
            showDebugMode={showDebugMode && location.pathname.includes('layout')}
            isAiEnabledScreen={!!specDocId}
          />
        </Suspense>
        <s.ContentWrapper id='content-wrapper'>
          <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='45px' circle={false} duration={1.4} />}>
            <Routes>
              <Route
                path='/'
                element={
                  <s.InnerContentWrapper flushRight={flushRight}>
                    <Outlet />
                  </s.InnerContentWrapper>
                }
              >
                <Route index element={<AppStudio />} />
                <Route path=':appId' element={<AppRedirect />} />
                <Route
                  path=':appId/layout/:screenId/:versionId'
                  element={
                    <Suspense
                      fallback={<LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}
                    >
                      {(appStatus === appStates.uninitialized || appStatus === appStates.loading) && (
                        <Container
                          id='layout-designer'
                          isRound
                          scrollable
                          style={{ backgroundColor: lightTheme.background.page, padding: 16 }}
                        >
                          <LoadingSkeleton count={1} width='100%' height='600px' circle={false} duration={1.4} />
                        </Container>
                      )}
                      {appStatus !== appStates.uninitialized && appStatus !== appStates.loading && (
                        <LayoutDesigner onSendAnalytics={sendAnalytics} refreshLayout={refreshLayout} />
                      )}
                    </Suspense>
                  }
                />
                <Route
                  path=':appId/models'
                  element={
                    <Suspense
                      fallback={<LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}
                    >
                      <ModelList onSendAnalytics={sendAnalytics} />
                    </Suspense>
                  }
                />
                <Route
                  path=':appId/models/:dataModelId/:name'
                  element={
                    <Suspense
                      fallback={<LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}
                    >
                      <ModelViewer onSendAnalytics={sendAnalytics} />
                    </Suspense>
                  }
                />
                <Route
                  path=':appId/screens'
                  element={
                    <Suspense
                      fallback={<LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}
                    >
                      <ScreenList onSendAnalytics={sendAnalytics} />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </s.ContentWrapper>
        {screenWidth < 1024 && <InvalidScreenDimensions />}
      </PageWrapper>
      {ready && (
        <ReactActionEditorWrapper
          appId={appId}
          screenId={screenId}
          versionId={versionId}
          userSession={userSession}
          toast={toast}
          onAfterSave={doForceRefresh}
          isV4Screen={isV4Screen}
        />
      )}
    </ThemeProvider>
  );
}
export default App;
