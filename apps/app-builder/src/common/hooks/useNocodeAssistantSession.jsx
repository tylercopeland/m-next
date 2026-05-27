import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useStartSessionMutation } from '../services/nocodeAssistantApi';
import {
  selectAccountName,
  selectTokenV2,
  selectTokenRTC,
  selectNocodeAssistantSessionId,
  nocodeAssistantSessionSet,
} from '../services/sessionSlice';

/**
 * Custom hook to manage nocode assistant session initialization
 * @param {Object} options - Hook options
 * @param {string} [options.existingSessionId] - Optional existing session ID to use instead of creating a new one
 * @returns {Object} Session state and control functions
 * @returns {boolean} isInitializing - Whether the session is currently being initialized
 * @returns {Object|null} error - Error object with message and canRetry flag, or null
 * @returns {string|null} sessionId - Current session ID, or null
 * @returns {Function} retry - Function to retry session initialization
 */
function useNocodeAssistantSession({ existingSessionId } = {}) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const [startSession] = useStartSessionMutation();
  const dispatch = useDispatch();

  // Get session data from Redux
  const accountName = useSelector(selectAccountName);
  const tokenV2 = useSelector(selectTokenV2);
  const tokenRTC = useSelector(selectTokenRTC);
  const sessionId = useSelector(selectNocodeAssistantSessionId);

  // Track if we've already initiated session initialization
  const hasInitialized = useRef(false);

  // If an existing session ID is provided, set it in Redux on mount
  useEffect(() => {
    if (existingSessionId && !sessionId) {
      dispatch(nocodeAssistantSessionSet(existingSessionId));
    }
  }, [existingSessionId, sessionId, dispatch]);

  // Initialize session on mount or when retry is triggered
  useEffect(() => {
    const initializeSession = async () => {
      // Skip initialization if we have an existing session ID
      if (existingSessionId) {
        return;
      }

      // Only initialize if we don't have a session ID and haven't already initialized
      if (!sessionId && !hasInitialized.current && accountName && tokenV2 && tokenRTC) {
        hasInitialized.current = true;
        setIsInitializing(true);
        setError(null);

        try {
          const response = await startSession({ accountName, v2Token: tokenV2, rtcToken: tokenRTC }).unwrap();
          dispatch(nocodeAssistantSessionSet(response.sessionId));
        } catch (err) {
          console.error('Error starting nocode assistant session:', err);
          hasInitialized.current = false; // Allow retry on error

          // Set error message based on status code
          if (err?.status === 401 || err?.status === 403) {
            setError({
              message: 'Authentication failed. Please log in again to continue.',
              canRetry: false,
            });
          } else {
            setError({
              message: 'Failed to initialize the AI assistant. Please try again.',
              canRetry: true,
            });
          }
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeSession();
  }, [sessionId, accountName, tokenV2, tokenRTC, startSession, dispatch, retryTrigger, existingSessionId]);

  /**
   * Retry session initialization after an error
   */
  const retry = () => {
    hasInitialized.current = false;
    setError(null);
    setRetryTrigger((prev) => prev + 1);
  };

  /**
   * Clear the current nocode assistant session from Redux and reset hook state
   */
  const clearSession = () => {
    // Reset local initialization tracking and error state
    hasInitialized.current = false;
    setError(null);
    setIsInitializing(false);
    // Clear the session id in Redux
    dispatch(nocodeAssistantSessionSet(null));
  };

  return {
    isInitializing,
    error,
    sessionId,
    retry,
    clearSession,
  };
}

export default useNocodeAssistantSession;
