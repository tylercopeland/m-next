import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useGetAppScreensQuery } from '../../common/services/managementApi';
import { selectTokenRTC } from '../../common/services/sessionSlice';

/**
 * Redirects to the first screen of an app when only appId is provided in the URL
 */
function AppRedirect() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenRTC = useSelector(selectTokenRTC);
  const { data: screens, isLoading, isError } = useGetAppScreensQuery({ appId }, { skip: !appId || !tokenRTC });

  useEffect(() => {
    if (screens && screens.length > 0) {
      // Get the first screen and its latest version
      const firstScreen = screens[0];
      const latestVersion =
        firstScreen.versions && firstScreen.versions.length > 0
          ? firstScreen.versions[firstScreen.versions.length - 1]
          : null;
      const sessionId = searchParams.get('sessionId');

      if (latestVersion) {
        // Redirect to the first screen's layout
        navigate(`/${appId}/layout/${firstScreen.id}/${latestVersion.versionId}?sessionId=${sessionId}`, {
          replace: true,
        });
      }
    } else if (screens && screens.length === 0) {
      // No screens found, redirect to app studio
      navigate('/', { replace: true });
    }
  }, [screens, appId, navigate, searchParams]);

  useEffect(() => {
    if (isError) {
      // On error, redirect to app studio
      console.error('Error fetching app screens');
      navigate('/', { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return <LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />;
  }

  return null;
}

export default AppRedirect;
