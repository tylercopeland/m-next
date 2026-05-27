import { matchers } from '@emotion/jest';
import '@testing-library/jest-dom/extend-expect';
import reducer, {
  actionUpdated,
  changeActiveRecord,
  clearLastControlUsed,
  controlSelected,
  controlUpdated,
  focusOn,
  reloadRibbons,
  ribbonsRefreshComplete,
  ribbonUpdated,
  ribbonVisualizationUpdated,
  saveScreen,
  screenLoaded,
  screenSaved,
  screenStates,
} from './screenLayoutSlice';

expect.extend(matchers);
const controls = {
  'f8c4f153-8b01-4c69-87e8-1659e9ed06d2': {
    type: 'LBL',
    displayTag: 'p',
    formatRounding: '',
    formatSeparator: '',
    formatType: '',
    hrefFormat: '',
    icon: '',
    iconAlign: 'Left',
    isUsingNoWrap: false,
    showCurrency: true,
    id: 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2',
    name: 'Email1',
    typeOverride: 'LBL',
    isBound: false,
    isComplexType: false,
    fieldType: 0,
    value: null,
    caption: 'Text',
    classes: 'mi-text-bold',
    hideCaption: false,
    isOutputOnly: false,
    regularCaption: false,
    width: '',
    widthType: 'auto',
    visible: true,
    disabled: false,
    defaultValue: 'Email',
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    comments: '',
    screenEvents: [],
    screenFunctions: [],
    defaultFocusControl: null,
  },
};

describe('Screen Layout Slice', () => {
  describe('Functional', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        status: screenStates.idle,
        controls: null,
        layout: null,
        selectedControlId: null,
        selectedControlProperty: null,
        appRibbonType: null,
        changes: {},
        actionUpserts: {},
        lastControlUpdated: null,
        activeRecordId: null,
        baseModel: null,
        baseModelJoins: [],
        fields: [],
        dataModels: [],
        layoutV4: {},
        projections: [],
        isV4Screen: false,
        id: null,
        versionId: null,
        ribbonConfiguration: {},
        ribbonVisualization: {},
        ribbonStatus: screenStates.idle,
        hoverStack: [],
        hoveredControlId: null,
        publishStatus: null,
        resolution: 'desktop',
        isStock: true,
        draftInfo: null,
        clipboard: null,
        comments: '',
        defaultFocusControl: null,
        screenFunctions: [],
        onLoad: null,
        onFocus: null,
        onActiveRecordChange: null,
        showHiddenComponents: false,
        staticLayout: true,
        forceRefetchTimestamp: null,
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
            defaultFocusControl: null,
            screenEvents: [],
            screenFunctions: [],
            layout: {
              id: '00000000-0000-0000-0000-000000000000',
              type: 'L-SCR',
              legacyClass: null,
              legacyDataWidth: null,
              legacyDataHeight: null,
              typeOverride: null,
              legacyChildClass: null,
              content: [
                {
                  id: '08a82e90-4595-48ff-b254-c8d262c97b10',
                  type: 'L-SEC',
                  legacyClass:
                    'mi-Section mi-cell-padding-left-1x mi-cell-padding-right-1x mi-cell-padding-top-1x mi-cell-padding-bottom-1x mi-top-border-none mi-bottom-border-none mi-left-border-none mi-right-border-none',
                  legacyDataWidth: null,
                  legacyDataHeight: null,
                  typeOverride: null,
                  legacyChildClass: 'tbl  ',
                  content: [
                    {
                      id: 'dd205b61-4ee3-4a3e-97c0-e30641b7bbbc',
                      type: 'L-ROW',
                      legacyClass: 'tblrow',
                      legacyDataWidth: null,
                      legacyDataHeight: null,
                      typeOverride: null,
                      legacyChildClass: null,
                      content: [
                        {
                          id: '58890884-3f2f-4abf-b5e4-35934477e55b',
                          type: 'L-COL',
                          legacyClass: 'tblcell',
                          legacyDataWidth: '',
                          legacyDataHeight: '',
                          typeOverride: null,
                          legacyChildClass: null,
                          content: [
                            {
                              id: '6b5512ae-8186-2af2-c7ab-a4f11e02ea57',
                              type: 'CHK',
                              legacyClass: null,
                              legacyDataWidth: null,
                              legacyDataHeight: null,
                              typeOverride: '',
                              legacyChildClass: null,
                              content: null,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            controls,
            modifiedBy: 'Alexander Ballard',
            createdBy: 'Alexander Ballard',
            lastModifyDate: '2022-05-20T20:46:13.2Z',
            versionNumber: 2,
            publishStatus: 'Draft',
            accountingType: 'QBG',
            appRibbonType: 2,
            viewFriendlyName: 'Contacts',
          }),
        ),
      ).toEqual({
        status: screenStates.ready,
        controls,
        data: { 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2': 'Email' },
        dataModels: undefined,
        id: 'ba094da5-42e1-4bd3-a503-e85cc56cd392',
        versionId: 'ba31d568-2b93-4bdc-91a8-64144074e18c',
        publishStatus: 'Draft',
        isStock: undefined,
        isV4Screen: undefined,
        draftInfo: null,
        comments: '',
        defaultFocusControl: null,
        screenFunctions: [],
        onLoad: null,
        onFocus: null,
        onActiveRecordChange: null,
        projections: undefined,
        staticLayout: true,
        layout: {
          id: '00000000-0000-0000-0000-000000000000',
          type: 'L-SCR',
          legacyClass: null,
          legacyDataWidth: null,
          legacyDataHeight: null,
          typeOverride: null,
          legacyChildClass: null,
          content: [
            {
              id: '08a82e90-4595-48ff-b254-c8d262c97b10',
              type: 'L-SEC',
              legacyClass:
                'mi-Section mi-cell-padding-left-1x mi-cell-padding-right-1x mi-cell-padding-top-1x mi-cell-padding-bottom-1x mi-top-border-none mi-bottom-border-none mi-left-border-none mi-right-border-none',
              legacyDataWidth: null,
              legacyDataHeight: null,
              typeOverride: null,
              legacyChildClass: 'tbl  ',
              content: [
                {
                  id: 'dd205b61-4ee3-4a3e-97c0-e30641b7bbbc',
                  type: 'L-ROW',
                  legacyClass: 'tblrow',
                  legacyDataWidth: null,
                  legacyDataHeight: null,
                  typeOverride: null,
                  legacyChildClass: null,
                  content: [
                    {
                      id: '58890884-3f2f-4abf-b5e4-35934477e55b',
                      type: 'L-COL',
                      legacyClass: 'tblcell',
                      legacyDataWidth: '',
                      legacyDataHeight: '',
                      typeOverride: null,
                      legacyChildClass: null,
                      content: [
                        {
                          id: '6b5512ae-8186-2af2-c7ab-a4f11e02ea57',
                          type: 'CHK',
                          legacyClass: null,
                          legacyDataWidth: null,
                          legacyDataHeight: null,
                          typeOverride: '',
                          legacyChildClass: null,
                          content: null,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        appRibbonType: 2,
        baseModel: 'Contacts',
      });
    });

    test('should handle updating a control', () => {
      const previousState = {
        controls,
        changes: {},
        lastControlUpdated: null,
        versionId: 'test',
        publishStatus: 'Draft',
      };
      const updated = { ...controls['f8c4f153-8b01-4c69-87e8-1659e9ed06d2'], caption: 'Changed' };
      // The reducer adds __dimensionsLockedUntil and preserves width/height to the control in state.controls
      // But state.changes stores the original action.payload (updated)
      const expectedControl = {
        ...updated,
        width: updated.width,
        height: updated.height,
        __dimensionsLockedUntil: null,
      };
      expect(reducer(previousState, controlUpdated(updated))).toEqual({
        controls: { 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2': expectedControl },
        changes: { test: { 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2': updated } },
        lastControlUpdated: updated.id,
        status: screenStates.editing,
        versionId: 'test',
        publishStatus: 'Draft',
      });
    });

    test('should handle saving screen', () => {
      const previousState = {
        lastControlUpdated: 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2',
      };
      expect(reducer(previousState, saveScreen())).toEqual({
        lastControlUpdated: null,
        status: screenStates.saving,
      });
    });

    test('should handle screen saved', () => {
      const previousState = {
        changes: { 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2': controls['f8c4f153-8b01-4c69-87e8-1659e9ed06d2'] },
        actionUpserts: {},
        status: screenStates.saving,
      };
      expect(reducer(previousState, screenSaved())).toEqual({
        changes: { 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2': controls['f8c4f153-8b01-4c69-87e8-1659e9ed06d2'] },
        actionUpserts: {},
        status: screenStates.ready,
      });
    });

    test('should handle clear Last Control Used', () => {
      const previousState = {
        lastControlUpdated: 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2',
      };
      expect(reducer(previousState, clearLastControlUsed())).toEqual({
        lastControlUpdated: null,
      });
    });

    test('should handle focus On', () => {
      const previousState = {
        focusOn: null,
      };
      expect(reducer(previousState, focusOn('f8c4f153-8b01-4c69-87e8-1659e9ed06d2'))).toEqual({
        focusOn: 'f8c4f153-8b01-4c69-87e8-1659e9ed06d2',
      });
    });

    test('should handle change active record', () => {
      const previousState = {
        activeRecordId: null,
      };
      expect(reducer(previousState, changeActiveRecord(45))).toEqual({
        activeRecordId: 45,
      });
    });

    test('should handle actionUpdated', () => {
      const payload = { id: 'action1', actionSet: { action: 'doSomething' } };

      const previousState = {
        versionId: 'test',
        status: screenStates.ready,
        actionUpserts: { test: {} },
        publishStatus: 'Draft',
      };
      expect(reducer(previousState, actionUpdated(payload))).toEqual({
        versionId: 'test',
        status: screenStates.editing,
        actionUpserts: { test: { [payload.id]: payload.actionSet } },
        publishStatus: 'Draft',
      });
    });

    test('should handle ribbonUpdated', () => {
      const payload = { ribbonId: 'ribbon1', config: { color: 'blue' } };

      const previousState = {
        versionId: 'test',
        status: screenStates.ready,
        ribbonConfiguration: { test: {} },
      };
      expect(reducer(previousState, ribbonUpdated(payload))).toEqual({
        versionId: 'test',
        status: screenStates.editing,
        ribbonConfiguration: { test: { [payload.ribbonId]: payload } },
      });
    });

    test('should handle ribbonVisualizationChange', () => {
      const payload = [
        { ribbonId: 1, visible: true },
        { ribbonId: 2, visible: false },
      ];

      const previousState = {
        versionId: 'test',
        status: screenStates.ready,
        ribbonVisualization: {
          test: [
            { ribbonId: 1, visible: true },
            { ribbonId: 2, visible: true },
          ],
        },
      };
      expect(reducer(previousState, ribbonVisualizationUpdated(payload))).toEqual({
        versionId: 'test',
        status: screenStates.editing,
        ribbonVisualization: { test: payload },
      });
    });

    test('should handle reload ribbons', () => {
      const previousState = {
        ribbonStatus: screenStates.ready,
      };
      expect(reducer(previousState, reloadRibbons())).toEqual({
        ribbonStatus: screenStates.refreshed,
      });
    });

    test('should handle refreshed ribbons', () => {
      const previousState = {
        ribbonStatus: screenStates.refreshed,
      };
      expect(reducer(previousState, ribbonsRefreshComplete())).toEqual({
        ribbonStatus: screenStates.ready,
      });
    });

    test('should handle controlSelected', () => {
      const payload = { controlId: 'control1', property: 'value', canvasClickDisabled: true };
      const previousState = {};
      expect(reducer(previousState, controlSelected(payload))).toEqual({
        selectedControlId: payload.controlId,
        selectedControlProperty: payload.property,
        canvasClickDisabled: payload.canvasClickDisabled,
      });
    });

    test('should handle clear controlSelected', () => {
      const payload = null;
      const previousState = {
        selectedControlId: 'control1',
        selectedControlProperty: 'value',
        canvasClickDisabled: true,
      };
      expect(reducer(previousState, controlSelected(payload))).toEqual({
        selectedControlId: null,
        selectedControlProperty: null,
        canvasClickDisabled: false,
      });
    });

    // end functional
  });
});
