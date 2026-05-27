import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import { useRefreshSessionQuery } from '../common/services/sessionApi';
import {
  featureFlagsLoaded,
  preferencesLoaded,
  selectAccountId,
  selectUserId,
  sessionRefeshed,
} from '../common/services/sessionSlice';
import { useGetUserFeatureFlagsQuery, useGetUserPreferencesQuery } from '../common/services/preferencesApi';

const getHostName = () => {
  const { hostname } = window.location;

  const parts = hostname.split('.');

  if (parts.length > 2 && (parts[parts.length - 2].length <= 3 || parts[parts.length - 1].length <= 3)) {
    // Check if it's a known TLD like 'co.uk' or a short TLD
    return parts.slice(-2).join('.'); // For example, 'example.co.uk'
  }
  if (parts.length > 2) {
    // General case for subdomains, e.g., 'sub.example.com'
    return parts.slice(-2).join('.'); // Returns 'example.com'
  }
  // Case for naked domains, e.g., 'example.com'
  return hostname;
};

function useAuthenticatedSession() {
  const dispatch = useDispatch();
  const accountId = useSelector(selectAccountId);
  const userId = useSelector(selectUserId);
  const {
    data: sessionData,
    error,
    isSuccess,
  } = useRefreshSessionQuery(null, {
    pollingInterval: 600000,
  });

  useEffect(() => {
    if (error) {
      if (error.status === 401) {
        window.location.assign(`${window.location.origin}/apps/Logout`);
      }
    }

    if (isSuccess && !error) {
      dispatch(sessionRefeshed(sessionData));

      const hostname = getHostName();

      const isDDEnabled = hostname !== 'methodlocal.com';
      if (isDDEnabled) {
        datadogRum.setUser({
          id: sessionData.methodIdentity,
          name: sessionData.userName,
          email: sessionData.userEmail,
          account: sessionData.accountName,
          accountFriendlyName: sessionData.accountFriendlyName,
        });

        datadogLogs.setUser({
          id: sessionData.methodIdentity,
          name: sessionData.userName,
          email: sessionData.userEmail,
          account: sessionData.accountName,
          accountFriendlyName: sessionData.accountFriendlyName,
        });
      }
    }
  }, [sessionData, error, isSuccess, dispatch]);

  const { data: preferencData, isSuccess: isSuccessPreferences } = useGetUserPreferencesQuery(
    { accountId, userId },
    {
      skip: !accountId && !userId,
    },
  );

  useEffect(() => {
    if (isSuccessPreferences) {
      dispatch(preferencesLoaded(preferencData));
    }
  }, [preferencData, isSuccessPreferences, dispatch]);

  const {
    data: featureFlags,
    isSuccess: isSuccessFeatureFlags,
    isError: isErrorFeatureFlags,
  } = useGetUserFeatureFlagsQuery(
    { accountId, userId },
    {
      skip: !accountId && !userId,
    },
  );

  useEffect(() => {
    if (isSuccessFeatureFlags) {
      dispatch(featureFlagsLoaded(featureFlags));
    }
  }, [featureFlags, isSuccessFeatureFlags, dispatch]);

  useEffect(() => {
    if (isErrorFeatureFlags) {
      dispatch(featureFlagsLoaded({}));
    }
  }, [isErrorFeatureFlags, dispatch]);
}

export default useAuthenticatedSession;
