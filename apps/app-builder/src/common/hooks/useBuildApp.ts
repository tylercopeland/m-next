import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useBuildAppMutation } from '../services/nocodeAssistantApi';
import { selectAccountName } from '../services/sessionSlice';
import { buildAppStarted, buildAppCompleted, selectIsBuildingApp } from '../services/appSlice';
import { BuildAppResponse } from '../../views/management/types';

interface UseBuildAppParams {
  sessionId: string;
  specDocId?: string | null;
  onBuildComplete?: (response: BuildAppResponse, hasFailures: boolean) => void;
}

interface UseBuildAppReturn {
  buildApp: (options?: { skipScreens?: boolean }) => Promise<void>;
  isBuildingApp: boolean;
}

export function useBuildApp({ sessionId, specDocId, onBuildComplete }: UseBuildAppParams): UseBuildAppReturn {
  const [buildAppMutation] = useBuildAppMutation();
  const accountName = useSelector(selectAccountName);
  const dispatch = useDispatch();
  const isBuildingApp = useSelector(selectIsBuildingApp);

  const buildApp = useCallback(
    async (options?: { skipScreens?: boolean }) => {
      if (!specDocId) {
        console.error('No spec document ID available');
        toast.error('No spec document available to build');
        return;
      }

      dispatch(buildAppStarted());
      const skipScreens = options?.skipScreens ?? false;
      
      toast.info(skipScreens ? 'Creating tables and fields...' : 'Building app...');

      try {
        const response = await buildAppMutation({
          specDocId,
          ...(skipScreens && { skipScreens }),
          session: {
            sessionId,
            accountName,
          },
        }).unwrap();

        // Check if there were any failures
        const hasFailures = response?.status === 'partial' || response?.result?.data?.failureCount > 0;

        // Call the callback if provided, allowing parent to handle response
        if (onBuildComplete) {
          onBuildComplete(response, hasFailures);
        } else {
          // Default behavior - just show toast
          if (hasFailures) {
            toast.error(skipScreens ? 'Failed to create some tables and fields' : 'Failed to build some parts of the app');
          } else {
            toast.success(skipScreens ? 'Tables and fields created' : 'App built successfully');
          }
        }
      } catch (error) {
        console.error('Error building app:', error);
        toast.error(skipScreens ? 'Failed to create tables and fields' : 'Failed to build app');
        dispatch(buildAppCompleted());
      } 
    },
    [specDocId, sessionId, accountName, buildAppMutation, onBuildComplete, dispatch],
  );

  return {
    buildApp,
    isBuildingApp,
  };
}
