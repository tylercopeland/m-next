import { matchers } from '@emotion/jest';
import '@testing-library/jest-dom/extend-expect';
import reducer, { appStates } from './appSlice';
import { controlUpdated, saveScreen, screenLoaded, screenSaved } from './screenLayoutSlice';
import { sessionRefeshed } from './sessionSlice';

expect.extend(matchers);

describe('App Slice', () => {
  describe('Functional', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        accountingType: null,
        appId: null,
        appName: null,
        creatorName: null,
        dataModels: [],
        defaultScreen: null,
        description: null,
        iconFileName: null,
        isBuildingApp: false,
        isReadOnly: null,
        listScreen: null,
        newScreen: null,
        projections: [],
        publishStatus: null,
        screenId: null,
        screenName: null,
        screens: [],
        specDocId: null,
        status: 'uninitialized',
        updatedDate: null,
        userPreferenceScreen: null,
        versionId: null,
        versionNumber: null,
        viewScreen: null,
      });
    });

    test('should handle initial screen load', () => {
      const previousState = {};
      expect(
        reducer(
          previousState,
          screenLoaded({
            appId: '92ce0e6b-763d-4931-b60e-a2d40170e915',
            screenId: 'ba094da5-42e1-4bd3-a503-e85cc56cd392',
            versionId: 'ba31d568-2b93-4bdc-91a8-64144074e18c',
            screenName: 'View Contact(2)',
            appName: 'Contacts',
            isReadOnly: false,
            comments: '',
            modifiedBy: 'Alexander Ballard',
            createdBy: 'Alexander Ballard',
            lastModifyDate: '2022-05-20T20:46:13.2Z',
            versionNumber: 2,
            publishStatus: 'Draft',
            accountingType: 'QBG',
            appRibbonType: 2,
            viewFriendlyName: 'Contacts',
            recordId: 45,
          }),
        ),
      ).toEqual({
        status: appStates.ready,
        appName: 'Contacts',
        screenName: 'View Contact(2)',
        versionNumber: 2,
        accountingType: 'QBG',
        publishStatus: 'Draft',
        isReadOnly: false,
        appId: '92ce0e6b-763d-4931-b60e-a2d40170e915',
        screenId: 'ba094da5-42e1-4bd3-a503-e85cc56cd392',
        versionId: 'ba31d568-2b93-4bdc-91a8-64144074e18c',
      });
    });

    test('should handle updating a control', () => {
      const previousState = { publishStatus: 'Draft' };
      expect(reducer(previousState, controlUpdated())).toEqual({
        status: appStates.editing,
        publishStatus: 'Draft',
      });
    });

    test('should handle updating a control on readonly', () => {
      const previousState = { publishStatus: 'Read only' };
      expect(reducer(previousState, controlUpdated())).toEqual({
        publishStatus: 'Read only',
      });
    });

    test('should handle saving screen', () => {
      const previousState = {};
      expect(reducer(previousState, saveScreen())).toEqual({
        status: appStates.saving,
      });
    });

    test('should handle screen saved', () => {
      const previousState = {
        status: appStates.saving,
      };
      expect(reducer(previousState, screenSaved())).toEqual({
        status: appStates.ready,
      });
    });

    test('should handle session Refeshed uninitialized', () => {
      const previousState = {
        status: appStates.uninitialized,
      };
      expect(reducer(previousState, sessionRefeshed())).toEqual({
        status: appStates.idle,
      });
    });

    test('should handle session Refeshed initilized', () => {
      const previousState = {
        status: appStates.saving,
      };
      expect(reducer(previousState, sessionRefeshed())).toEqual({
        status: appStates.saving,
      });
    });

    // end functional
  });
});
