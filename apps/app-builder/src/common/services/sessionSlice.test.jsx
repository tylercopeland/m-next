import { matchers } from '@emotion/jest';
import '@testing-library/jest-dom/extend-expect';
import reducer, { preferencesLoaded, sessionRefeshed } from './sessionSlice';

expect.extend(matchers);

describe('Session Slice', () => {
  describe('Functional', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        accountName: null,
        accountFriendlyName: null,
        accountId: null,
        isDeveloper: null,
        userName: null,
        userId: null,
        methodIdentity: null,
        userEmail: null,
        tokenV2: null,
        tokenRTC: null,
        preferences: null,
        isAdmin: false,
        featureFlags: null,
        isCustomizer: false,
        exportedFunctions: null,
        nocodeAssistantSessionId: null,
      });
    });

    test('should handle session Refeshed', () => {
      const previousState = {
        accountName: null,
        accountId: null,
        isDeveloper: null,
        userName: null,
        userId: null,
        methodIdentity: null,
        userEmail: null,
        tokenV2: null,
        tokenRTC: null,
        preferences: null,
        isAdmin: false,
        isCustomizer: false,
        exportedFunctions: null,
      };

      expect(
        reducer(
          previousState,
          sessionRefeshed({
            accountName: 'Test',
            accountId: 1,
            isDeveloper: false,
            userName: 'Testi',
            userId: 3,
            methodIdentity: 'new',
            userEmail: 'a@atesting.com',
            tokenV2: 'abc',
            tokenRTC: 'edf',
            isAdmin: true,
            isCustomizer: true,
            exportedFunctions: ['func1', 'func2'],
          }),
        ),
      ).toEqual({
        accountName: 'Test',
        accountId: 1,
        isDeveloper: false,
        userName: 'Testi',
        userId: 3,
        methodIdentity: 'new',
        userEmail: 'a@atesting.com',
        tokenV2: 'abc',
        tokenRTC: 'edf',
        preferences: null,
        isAdmin: true,
        isCustomizer: true,
        exportedFunctions: ['func1', 'func2'],
      });
    });

    test('should handle preferences Loaded', () => {
      const previousState = {};
      expect(reducer(previousState, preferencesLoaded({ 1: true, 2: false }))).toEqual({
        preferences: { 1: true, 2: false },
      });
    });

    // end functional
  });
});
