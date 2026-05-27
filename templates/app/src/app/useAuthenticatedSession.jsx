import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import { useRefreshSessionQuery } from '../common/services/sessionApi';
import { sessionRefeshed } from '../common/services/sessionSlice';
import config from './config.json';

function useAuthenticatedSession() {
  const dispatch = useDispatch();
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
      if (config.datadog.enabled) {
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
  }, [sessionData, error, isSuccess]);
}

export default useAuthenticatedSession;
