import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import Button from '@m-next/button';
import { DebouncedInput } from '@m-next/input';
import Toggle from '@m-next/toggle';
import LoadingSkeleton from '@m-next/loading-skeleton';
import CriteriaEditor from '@m-next/criteria-builder';
import Dropdown from '@m-next/dropdown';
import Grid from '@m-next/grid';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { Text, TextLine } from '@m-next/typeography';
import { formatter, Guid } from '@m-next/utilities';
import { basicOperationId } from '@m-next/types';
import { Z_POPUP } from '@m-next/layout-canvas';
import Dialog from '@m-next/dialog';
import Accordion from '../../../../../components/accordion/Accordion';
import * as s from './ConfigureRelatedRecordTab.styles';
import { useGetFieldsForTableQuery } from '../../../../../common/services/tablesFieldsApi';
import ConfigureJoinDialog from './ConfigureJoinDialog';
import { selectBaseModel, selectScreenFields } from '../../../../../common/services/screenLayoutSlice';
import { selectDisplayPreferences } from '../../../../../common/services/sessionSlice';
import ConfigureJoinChangeWarningDialog from './ConfigureJoinChangeWarningDialog';

// types
const propTypes = {
  expandAll: PropTypes.bool,
  onSendAnalytics: PropTypes.func,
  onChange: PropTypes.func,
  rawRibbon: PropTypes.shape({
    id: PropTypes.string,
    appId: PropTypes.string,
    ribbonId: PropTypes.string,
    caption: PropTypes.string,
    originalCaption: PropTypes.string,
    hasCount: PropTypes.bool,
    recordCount: PropTypes.number,
    joinTable: PropTypes.string,
    joinField: PropTypes.string,
    joinFieldTrueName: PropTypes.string,
    joinFriendlyName: PropTypes.string,
    fromFriendlyName: PropTypes.string,
    fromField: PropTypes.string,
    fromFieldTrueName: PropTypes.string,
    expression: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
    viewScreenId: PropTypes.string,
    appName: PropTypes.string,
    isStock: PropTypes.bool,
    isVisible: PropTypes.bool,
    isVisibleForCustomers: PropTypes.bool,
    isVisibleForLeads: PropTypes.bool,
    isVisibleForVendors: PropTypes.bool,
  }),

  appList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      caption: PropTypes.string,
    }),
  ),
  screenList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      caption: PropTypes.string,
    }),
  ),
  isAppListLoading: PropTypes.bool,
  isScreenListLoading: PropTypes.bool,
  accountName: PropTypes.string,
  onSelect: PropTypes.func,
};

function ConfigureRelatedRecordTab({
  expandAll,
  onSendAnalytics,
  onChange,
  rawRibbon,
  appList,
  screenList,
  isAppListLoading,
  isScreenListLoading,
  accountName,
  onSelect,
}) {
  const screenFields = useSelector(selectScreenFields);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const appBaseTable = useSelector(selectBaseModel);

  const [showHideWarning, setShowHideWarning] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [queuedPermissionsChange, setQueuedPermissionsChange] = useState([]);
  const [openQuickEdit, setOpenQuickEdit] = useState(false);
  const [showConfigureJoinDialog, setShowConfigureJoinDialog] = useState(!rawRibbon);
  const [showConfigureJoinWarningDialog, setShowConfigureJoinWarningDialog] = useState(false);
  const [queuedJoinChange, setQueuedJoinChange] = useState(null);

  const ribbon = useMemo(() => {
    const defaultControl = {
      appId: null,
      ribbonId: Guid.create(),
      caption: '',
      originalCaption: '',
      hasCount: true,
      joinTable: null,
      joinField: null,
      joinFriendlyName: appBaseTable,
      joinFieldTrueName: null,
      fromField: null,
      fromFriendlyName: null,
      fromFieldTrueName: null,
      isStock: true,
      isVisible: true,
      isVisibleForCustomers: true,
      isVisibleForLeads: true,
      isVisibleForVendors: true,
      expression: [],
    };
    defaultControl.recordId = defaultControl.ribbonId;
    defaultControl.id = defaultControl.ribbonId;

    const merged = { ...defaultControl, ...rawRibbon };
    return merged;
  }, [appBaseTable, rawRibbon]);

  const { data: fieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: ribbon.fromFriendlyName, complexFields: false },
    { skip: !ribbon?.fromFriendlyName },
  );

  const hasExpression = useMemo(() => {
    if (!ribbon.expression || ribbon.expression.length === 0) {
      return false;
    }

    if (ribbon.expression.length === 2 && ribbon.expression[1].operation === basicOperationId.CloseBracket) {
      return false;
    }

    return true;
  }, [ribbon.expression]);

  useEffect(() => {
    setPermissions([
      { id: 'customer', label: 'Customer', visible: ribbon.isVisibleForCustomers },
      { id: 'vendor', label: 'Vendor', visible: ribbon.isVisibleForVendors },
      { id: 'lead', label: 'lead', visible: ribbon.isVisibleForLeads },
    ]);
  }, [ribbon.isVisibleForCustomers, ribbon.isVisibleForVendors, ribbon.isVisibleForLeads]);

  // Join is the view for the current screen
  const fromFieldListOptions = useMemo(
    () => formatter.formatFieldList(screenFields, ribbon.joinFriendlyName, null, {}, displayPreferences, null, true),
    [displayPreferences, ribbon.joinFriendlyName, screenFields],
  );

  // From is the view you are linking to

  const toFieldListOptions = useMemo(
    () => formatter.formatFieldList(fieldList, ribbon.fromFriendlyName, null, {}, displayPreferences, null, true),
    [displayPreferences, fieldList, ribbon.fromFriendlyName],
  );

  const fromFieldCaption = useMemo(
    () =>
      fromFieldListOptions
        ?.flatMap((section) => section.options)
        .find((option) => option.value === ribbon.joinFieldTrueName)?.label,
    [fromFieldListOptions, ribbon.joinFieldTrueName],
  );

  const toFieldCaption = useMemo(
    () =>
      toFieldListOptions
        ?.flatMap((section) => section.options)
        .find((option) => option.value === ribbon.fromFieldTrueName)?.label,
    [toFieldListOptions, ribbon.fromFieldTrueName],
  );

  const handleTitleChange = (value) => {
    const updated = { ...ribbon, caption: value };
    onChange(updated);
  };

  const handleHasCountChange = (value) => {
    const updated = { ...ribbon, hasCount: value };
    onChange(updated);
  };

  const handleFilterChange = (value) => {
    const updated = { ...ribbon, expression: value };
    onChange(updated);
    setOpenQuickEdit(false);
  };

  const handleViewScreenChange = (value) => {
    const updated = { ...ribbon, customScreenId: value.value };
    onChange(updated);
  };

  const handleUpdateJoin = (fromField, toField, replace) => {
    const updated = {
      ...ribbon,
      joinFieldTrueName: fromField,
      joinField: fromField,
      toFieldTrueName: fromField,
      toField: fromField,
      fromFieldTrueName: toField,
      fromField: toField,
      replaceScreen: replace === 'replace',
    };
    onChange(updated);
  };

  const handleShowJoinChangeWarning = (fromField, toField, toApp) => {
    if (ribbon.appId === null) {
      const updated = {
        ...ribbon,
        appId: toApp.id,
        caption: toApp.caption,
        fromFriendlyName: toApp.viewFriendlyName,
        isStock: false,
        joinFieldTrueName: fromField,
        joinField: fromField,
        toFieldTrueName: fromField,
        toField: fromField,
        fromFieldTrueName: toField,
        fromField: toField,
        replaceScreen: false,
        create: true,
      };
      onChange(updated);
      onSelect('tab-panel', { id: updated.ribbonId, caption: updated.caption, isStock: false });
    } else {
      setShowConfigureJoinDialog(false);
      setQueuedJoinChange({ fromField, toField });
      setShowConfigureJoinWarningDialog(true);
    }
  };

  const appScreenListOptions = useMemo(() => {
    if (!appList || !screenList) {
      return null;
    }
    const filteredScreenList = screenList
      ?.filter((screen) => screen.viewFriendlyName === ribbon.fromFriendlyName)
      .map((item) => ({ appId: item.appId, value: item.id, label: item.caption }));

    const mergedApps = {
      [ribbon.appId]: {
        caption: ribbon.appName,
        options: [
          { value: ribbon.customScreenId, label: `${ribbon.isStock ? ribbon.originalCaption : ribbon.caption} Panel` },
        ],
      },
    };

    filteredScreenList.forEach((screen) => {
      if (!mergedApps[screen.appId]) {
        const matches = appList.filter((x) => x.id === screen.appId);
        if (matches.length > 0) {
          mergedApps[screen.appId] = { caption: matches[0].caption, options: [] };
        }
      }
      if (mergedApps[screen.appId]) mergedApps[screen.appId].options.push(screen);
    });
    const list = [];
    Object.keys(mergedApps).forEach((item) => {
      list.push({ label: mergedApps[item].caption, options: mergedApps[item].options });
    });
    return list;
  }, [
    appList,
    screenList,
    ribbon.appId,
    ribbon.appName,
    ribbon.customScreenId,
    ribbon.isStock,
    ribbon.originalCaption,
    ribbon.caption,
    ribbon.fromFriendlyName,
  ]);

  const selectedScreen = useMemo(() => {
    const defaultLabel = `${ribbon.isStock ? ribbon.originalCaption : ribbon.caption} Panel`;
    if (screenList) {
      if (ribbon.customScreenId) {
        const label = screenList.find((x) => x.id === ribbon.customScreenId);
        return { value: ribbon.customScreenId, label: label?.caption || defaultLabel };
      }

      const label = screenList.find((x) => x.id === ribbon.ribbonId);
      return { value: ribbon.ribbonId, label: label?.caption || defaultLabel };
    }

    if (ribbon.customScreenId) {
      return { value: ribbon.customScreenId, label: defaultLabel };
    }

    return { value: ribbon.ribbonId, label: defaultLabel };
  }, [ribbon.isStock, ribbon.originalCaption, ribbon.caption, ribbon.customScreenId, ribbon.ribbonId, screenList]);

  const join = useMemo(() => {
    let result = '';
    if (ribbon.joinFriendlyName && fromFieldCaption) {
      result = `${ribbon.joinFriendlyName}.${fromFieldCaption}`;
      if (ribbon.fromFriendlyName && toFieldCaption) {
        result = `${result}, ${ribbon.fromFriendlyName}.${toFieldCaption}`;
      }
      return result;
    }
  }, [ribbon.joinFriendlyName, ribbon.fromFriendlyName, fromFieldCaption, toFieldCaption]);

  const handlePermissionClick = (index) => {
    if (permissions.filter((x) => x.visible === false).length === 2 && permissions[index].visible) {
      setShowHideWarning(true);
      setQueuedPermissionsChange(index);
    } else {
      const updatedPermissions = [...permissions];
      updatedPermissions[index].visible = !updatedPermissions[index].visible;
      const updated = {
        ...ribbon,
        isVisibleForCustomers: updatedPermissions[0].visible,
        isVisibleForVendors: updatedPermissions[1].visible,
        isVisibleForLeads: updatedPermissions[2].visible,
      };
      setPermissions(updatedPermissions);
      onChange(updated);
    }
  };

  const handlePushingQueuedPermissionsChange = () => {
    const updatedPermissions = [...permissions];
    updatedPermissions[queuedPermissionsChange].visible = !updatedPermissions[queuedPermissionsChange].visible;

    const updated = {
      ...ribbon,
      isVisibleForCustomers: updatedPermissions[0].visible,
      isVisibleForVendors: updatedPermissions[1].visible,
      isVisibleForLeads: updatedPermissions[2].visible,
    };
    setPermissions(updatedPermissions);
    onChange(updated);
    setShowHideWarning(false);
  };

  const handleCancelHide = () => {
    setShowHideWarning(false);
  };

  const handleConfirmJoinChange = (option) => {
    handleUpdateJoin(queuedJoinChange.fromField, queuedJoinChange.toField, option);
    setShowConfigureJoinWarningDialog(false);
  };

  return (
    <s.Wrapper padding={16}>
      <Accordion id='related-record-header' caption='Header' open contentStyle={{ gap: 0 }}>
        <DebouncedInput
          compactStyle
          id='related-record-title'
          value={ribbon.caption}
          caption='Title'
          onChange={handleTitleChange}
          style={{ marginBottom: 16, marginTop: 8 }}
        />
        <Toggle
          id='related-record-show-count'
          checked={ribbon.hasCount}
          label='Show record count badge'
          onChange={handleHasCountChange}
          width='100%'
          bold
          style={{ marginBottom: 8 }}
        />
        {ribbon.hasCount && (
          <s.AddFilterWrapper hasExpression={hasExpression}>
            <Text
              bold
              style={{ borderBottom: `1px dashed #AFAFAF` }}
              tooltipId='editor-tab-tooltip'
              tooltip='Filter applies to the record count badge<br/>only, not the data displayed within the<br/>related app'
            >
              Filter record count
            </Text>
            {!hasExpression && (
              <Button
                id='add-filter'
                icon={{ name: 'circle-plus', size: 16 }}
                isV4Design
                value='Add filter'
                buttonStyle='link'
                onClick={() => {
                  setOpenQuickEdit(true);
                }}
              />
            )}
          </s.AddFilterWrapper>
        )}
        {ribbon.hasCount && (
          <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='60px' circle={false} duration={1.4} />}>
            <CriteriaEditor
              id='ribbon-expression'
              key={ribbon.recordId}
              displayPreferences={displayPreferences}
              dataModelId={ribbon.joinFriendlyName}
              expression={ribbon.expression}
              filterId={ribbon.ribbonId}
              fieldList={fieldList}
              showEmptyState={false}
              onChange={handleFilterChange}
              emptyMessage='Filter applies to the record count badge only, not the data displayed within the related app'
              onSendAnalytics={onSendAnalytics}
              openQuickEdit={openQuickEdit}
              onClose={() => setOpenQuickEdit(false)}
            />
          </Suspense>
        )}
      </Accordion>
      <Accordion id='related-record-data' caption='Data' open={expandAll} contentStyle={{ gap: 0 }}>
        <s.AppNameWrapper>
          <SvgIcon size={16} name='screen-V4' color={colors.grey} />
          <TextLine>{ribbon.appName}</TextLine>
        </s.AppNameWrapper>

        {!fromFieldListOptions ||
          (!toFieldListOptions && (
            <LoadingSkeleton count={1} width='100%' height='20px' circle={false} duration={1.4} />
          ))}
        {fromFieldListOptions && toFieldListOptions && (
          <s.LinkWrapper isStock={ribbon.isStock}>
            <s.LinkHeader bold fontSize='small' isStock={ribbon.isStock}>
              Linked fields
            </s.LinkHeader>
            <TextLine onClick={ribbon.isStock ? null : () => setShowConfigureJoinDialog(true)}>{join}</TextLine>
            {!ribbon.isStock && <SvgIcon size={12} name='settings3' onClick={() => setShowConfigureJoinDialog(true)} />}
          </s.LinkWrapper>
        )}
      </Accordion>

      <Accordion
        id='related-record-visibility'
        caption='Visibility'
        open={expandAll}
        tooltip='Controls the visibility of related apps for<br/> specific contact types to display relevant<br/> information'
        tooltipId='editor-tab-tooltip'
      >
        <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
          <Grid
            id='ribbon-permissions'
            searchable={false}
            showPagination={false}
            showGoToPage={false}
            showPageSize={false}
            showReload={false}
            showHeader={false}
            addRowsEnabled={false}
            columns={[
              {
                name: 'label',
                caption: '',
                visible: true,
                editable: false,
                singleLine: true,
                width: 'dynamic',
                renderAs(rowId, resp, rowIdx) {
                  return (
                    <TextLine style={{ width: '40px', opacity: permissions[rowIdx].visible ? 1 : 0.6 }}>
                      {permissions[rowIdx].label}
                    </TextLine>
                  );
                },
              },
              {
                name: 'visible',
                caption: '',
                visible: true,
                editable: true,
                width: 'sm',
                cellWidth: '40px',
                fixedWidth: true,
                renderAs(rowId, resp, rowIdx) {
                  return (
                    <SvgIcon
                      color={colors['grey-dark']}
                      size={16}
                      name={permissions[rowIdx].visible ? 'eye-open-V4' : 'eye-closed-V4'}
                      tooltipId='my-tooltip'
                      tooltip={permissions[rowIdx].visible ? 'Hide' : 'Show'}
                      onClick={() => handlePermissionClick(rowIdx)}
                      style={{ width: '40px', opacity: permissions[rowIdx].visible ? 1 : 0.6 }}
                    />
                  );
                },
              },
            ]}
            data={permissions}
            compact
            pageSize={10}
          />
        </Suspense>
      </Accordion>
      <s.Divider />

      <div>
        <Text
          bold
          gutterBottom={8}
          tooltip='Links a screen to this app ribbon,<br/> specifying which screen opens when<br/> clicked'
          tooltipId='editor-tab-tooltip'
        >
          Screen to display
        </Text>
      </div>
      <Dropdown
        id='select-app'
        options={appScreenListOptions}
        onChange={handleViewScreenChange}
        dropdownStyle='multi-icon'
        isV4Design
        value={selectedScreen}
        style={{ width: '100%' }}
        isLoading={isAppListLoading || isScreenListLoading}
        caption='Screen'
      />
      <Tooltip id='editor-tab-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP }} place='left' />
      {showHideWarning && (
        <Dialog
          id='hide-warning'
          title='Hide linked app'
          isOpen={showHideWarning}
          onClose={handleCancelHide}
          footer={{
            primaryButtonLabel: 'Ok',
            onPrimaryButtonClick: handlePushingQueuedPermissionsChange,
            secondaryButtonLabel: 'Cancel',
            onSecondaryButtonClick: handleCancelHide,
          }}
        >
          <s.DialogContent>
            <TextLine>Are you sure you want to proceed with hiding the app ribbon for all contact types?</TextLine>
            <TextLine>
              Hiding this linked app for all contact types (Customer, Lead, Vendor) will make it invisible to users,
              preventing them from viewing the relational information.
            </TextLine>
            <TextLine>
              Click &quot;<Text bold>Ok</Text>&quot; to confirm or &quot;<Text bold>Cancel</Text>&quot; to go back.
            </TextLine>
          </s.DialogContent>
        </Dialog>
      )}

      {showConfigureJoinDialog && (
        <ConfigureJoinDialog
          fromApp={ribbon.joinFriendlyName} // Join is the view for the current screen
          toApp={ribbon.fromFriendlyName} // From is the view you are linking to
          fromField={ribbon.joinFieldTrueName}
          toField={ribbon.fromFieldTrueName}
          fromView={ribbon.joinFriendlyName}
          toView={ribbon.fromFriendlyName}
          fromFieldList={screenFields}
          toFieldList={fieldList}
          onClose={() => {
            setShowConfigureJoinDialog(false);
          }}
          onDismiss={() => {
            if (ribbon.appId === null) {
              onSelect('tab-panel', null);
            }
          }}
          onUpdate={handleShowJoinChangeWarning}
          appList={appList}
          isCreate={ribbon.appId === null}
          accountName={accountName}
          displayPreferences={displayPreferences}
        />
      )}
      {showConfigureJoinWarningDialog && (
        <ConfigureJoinChangeWarningDialog
          onClose={() => setShowConfigureJoinWarningDialog(false)}
          onConfirm={handleConfirmJoinChange}
          screenName={selectedScreen.label}
        />
      )}
    </s.Wrapper>
  );
}

ConfigureRelatedRecordTab.propTypes = propTypes;
export default ConfigureRelatedRecordTab;
