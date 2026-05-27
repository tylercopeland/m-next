import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@m-next/dialog';
import { TextLine } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import Button from '@m-next/button';
import Dropdown from '@m-next/dropdown';
import { Field, FieldTypeNames } from '@m-next/types';
import { formatter } from '@m-next/utilities';
import LoadingSkeleton from '@m-next/loading-skeleton';
import HomeIcon from './HomeIcon';
import LinkedFieldsIcon from './LinkedFieldsIcon';
import * as s from './ConfigureJoinDialog.styles';
import JoinIcon from './JoinIcon';
import { useGetFieldsForTableQuery } from '../../../../../common/services/tablesFieldsApi';

const propTypes = {
  onClose: PropTypes.func,
  onUpdate: PropTypes.func,
  fromApp: PropTypes.string,
  toApp: PropTypes.string,
  fromField: PropTypes.string,
  toField: PropTypes.string,
  fromView: PropTypes.string,
  toView: PropTypes.string,
  fromFieldList: PropTypes.arrayOf(Field),
  toFieldList: PropTypes.arrayOf(Field),
  displayPreferences: PropTypes.instanceOf(Object),
  appList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      caption: PropTypes.string,
    }),
  ),
  isCreate: PropTypes.bool,
  accountName: PropTypes.string,
  onDismiss: PropTypes.func,
};

function ConfigureJoinDialog({
  onClose,
  onUpdate,
  fromApp,
  toApp,
  fromFieldList,
  toFieldList,
  fromField,
  toField,
  fromView,
  toView,
  displayPreferences,
  appList,
  isCreate,
  accountName,
  onDismiss,
}) {
  const [internalFromField, setInternalFromField] = useState(fromField);
  const [internalToField, setInternalToField] = useState(toField);
  const [internalApp, setInternalApp] = useState(null);

  const toAppName = useMemo(() => toApp || internalApp?.caption, [toApp, internalApp]);

  const { data: fieldList, isFetching } = useGetFieldsForTableQuery(
    { accountName, tableName: internalApp?.viewFriendlyName, complexFields: false },
    { skip: !internalApp || !internalApp?.viewFriendlyName },
  );

  const internalToFieldListOptions = useMemo(
    () =>
      isFetching
        ? null
        : formatter.formatFieldList(fieldList, internalApp?.viewFriendlyName, null, {}, displayPreferences, null, true),
    [isFetching, fieldList, internalApp?.viewFriendlyName, displayPreferences],
  );

  const fromFieldType = useMemo(
    () => fromFieldList?.find((x) => x.name === internalFromField)?.type,
    [fromFieldList, internalFromField],
  );
  const fromFieldListOptions = useMemo(
    () =>
      formatter.formatFieldList(
        fromFieldList,
        fromView,
        null,
        {},
        displayPreferences,
        [FieldTypeNames.Integer, FieldTypeNames.DropDown],
        true,
      ),
    [displayPreferences, fromView, fromFieldList],
  );

  const filteredToFieldList = useMemo(
    () => toFieldList?.filter((x) => x.type === fromFieldType),
    [toFieldList, fromFieldType],
  );

  const toFieldListOptions = useMemo(
    () =>
      formatter.formatFieldList(
        filteredToFieldList,
        toView,
        null,
        {},
        displayPreferences,
        [FieldTypeNames.Integer, FieldTypeNames.DropDown],
        true,
      ),
    [displayPreferences, filteredToFieldList, toView],
  );

  const toAppOption = useMemo(() => appList?.find((app) => app.id === internalApp), [appList, internalApp]);
  const toAppListOptions = useMemo(() => appList?.map((app) => ({ value: app.id, label: app.caption })), [appList]);

  const fromFieldOption = useMemo(
    () =>
      fromFieldListOptions?.flatMap((section) => section.options).find((option) => option.value === internalFromField),
    [fromFieldListOptions, internalFromField],
  );

  const toFieldOption = useMemo(
    () =>
      (toFieldListOptions || internalToFieldListOptions)
        ?.flatMap((section) => section.options)
        .find((option) => option.value === internalToField),
    [toFieldListOptions, internalToFieldListOptions, internalToField],
  );

  useEffect(() => {
    if (isCreate && internalToFieldListOptions && internalToFieldListOptions.length > 0) {
      let linkFields = internalToFieldListOptions
        ?.flatMap((section) => section.options)
        .filter((x) => x.source === fromApp && x.fieldType === FieldTypeNames.DropDown);
      let matchedOnEntity = false;
      if (linkFields.length === 0) {
        linkFields = internalToFieldListOptions
          ?.flatMap((section) => section.options)
          .filter(
            (x) => ['Entity', 'Customer', 'Vendor'].includes(x.source) && x.fieldType === FieldTypeNames.DropDown,
          );
        matchedOnEntity = true;
      }

      if (linkFields.length > 0) {
        setInternalToField(linkFields[0].value);
        const exists = fromFieldListOptions
          ?.flatMap((section) => section.options)
          .find((x) => x.value === linkFields[0].source);
        if (exists) {
          setInternalFromField(linkFields[0].source);
        }
        if (matchedOnEntity) {
          const sourceFields = fromFieldListOptions
            ?.flatMap((section) => section.options)
            .filter(
              (x) => ['Entity', 'Customer', 'Vendor'].includes(x.source) && x.fieldType === FieldTypeNames.DropDown,
            );
          if (sourceFields.length > 0) {
            setInternalFromField(sourceFields[0].value);
          }
        }
      }
    }
  }, [fromApp, fromFieldListOptions, isCreate, internalToFieldListOptions, toApp, fieldList]);

  const handleAppChange = (app) => {
    setInternalApp(appList?.find((x) => x.id === app.value));
    setInternalFromField(null);
  };

  return (
    <Dialog
      id='hide-warning'
      title={`${isCreate ? 'Add' : 'Edit'} App ribbon`}
      isOpen
      onClose={onClose}
      onDismiss={onDismiss}
      width={800}
    >
      <s.DialogContent>
        <s.DialogInnerContent>
          <TextLine bold style={{ fontSize: 24 }} gutterBottom={8}>
            Which related information you would like to add?
          </TextLine>
          {isCreate ? (
            <TextLine gutterBottom={24}>
              Create an App ribbon by selecting the app that you would like to display linked information with. Then
              select the fields for which you would like to create the relation between (i.e. Invoices linked to a
              Contact).
            </TextLine>
          ) : (
            <TextLine gutterBottom={24}>
              Edit the fields for which you would like to create the relation between (i.e. Invoices linked to a
              Contact).
            </TextLine>
          )}
          <div style={{ display: 'flex' }}>
            <s.Container>
              <s.ColorBlock
                style={{
                  background: colors['purple-lighter'],
                }}
              >
                <HomeIcon />
              </s.ColorBlock>
              <TextLine bold fontSize='mediumLarge'>
                Primary App
              </TextLine>
              <s.AppNameWrapper>
                <SvgIcon size={20} name='screen-V4' color={colors.grey} />
                <TextLine>{fromApp}</TextLine>
              </s.AppNameWrapper>
              {(!isCreate || !!internalApp) && (
                <s.FieldSelectorWrapper>
                  <SvgIcon size={32} style={{ marginTop: -12, marginRight: 4 }}>
                    <svg xmlns='http://www.w3.org/2000/svg' width={21} height={31} viewBox='0 0 21 31' fill='none'>
                      <path
                        d='M1.75 1a.75.75 0 0 0-1.5 0zM1 27H.25c0 .415.336.75.75.75zm12 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0M.25 1v26h1.5V1zM1 27.75h16v-1.5H1z'
                        fill={colors.grey}
                      />
                    </svg>
                  </SvgIcon>
                  <Dropdown
                    id='from-field'
                    style={{ width: '100%' }}
                    dropdownStyle='multi-icon'
                    caption={`Field list from ${fromApp}`}
                    isV4Design
                    options={fromFieldListOptions}
                    value={fromFieldOption}
                    onChange={(field) => {
                      setInternalFromField(field.value);
                      setInternalToField(null);
                    }}
                    menuPlacement='top'
                  />
                </s.FieldSelectorWrapper>
              )}
            </s.Container>
            <JoinIcon />
            <s.Container>
              <s.ColorBlock
                style={{
                  background: colors['blue-lighter'],
                }}
              >
                <LinkedFieldsIcon />
              </s.ColorBlock>
              <TextLine bold fontSize='mediumLarge'>
                Related App
              </TextLine>
              <s.AppNameWrapper>
                <SvgIcon size={20} name='screen-V4' color={colors.grey} />
                {isCreate ? (
                  <Dropdown
                    id='to-app'
                    style={{ width: '100%' }}
                    dropdownStyle='multi-icon'
                    isV4Design
                    options={toAppListOptions}
                    value={toAppOption}
                    onChange={handleAppChange}
                    menuPlacement='top'
                    placeholder='Select app'
                  />
                ) : (
                  <TextLine>{toAppName}</TextLine>
                )}
              </s.AppNameWrapper>
              {(!isCreate || !!internalApp) && (
                <s.FieldSelectorWrapper>
                  <SvgIcon size={32} style={{ marginTop: -12, marginRight: 4 }}>
                    <svg xmlns='http://www.w3.org/2000/svg' width={21} height={31} viewBox='0 0 21 31' fill='none'>
                      <path
                        d='M1.75 1a.75.75 0 0 0-1.5 0zM1 27H.25c0 .415.336.75.75.75zm12 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0M.25 1v26h1.5V1zM1 27.75h16v-1.5H1z'
                        fill={colors.grey}
                      />
                    </svg>
                  </SvgIcon>
                  {!internalToFieldListOptions && !toFieldListOptions && (
                    <LoadingSkeleton
                      id='to-field'
                      count={1}
                      width='258px'
                      height='32px'
                      circle={false}
                      duration={1.4}
                    />
                  )}
                  {(internalToFieldListOptions || toFieldListOptions) && (
                    <Dropdown
                      id='to-field'
                      style={{ width: '100%' }}
                      dropdownStyle='multi-icon'
                      caption={`Field list from ${toAppName}`}
                      isV4Design
                      options={internalToFieldListOptions || toFieldListOptions}
                      value={toFieldOption}
                      onChange={(field) => setInternalToField(field.value)}
                      menuPlacement='top'
                    />
                  )}
                </s.FieldSelectorWrapper>
              )}
            </s.Container>
          </div>
        </s.DialogInnerContent>
        <s.DialogFooter>
          <Button
            id='update-join'
            value={isCreate ? 'Add' : 'Update'}
            disabled={
              (internalFromField === fromField && internalToField === toField) || !internalFromField || !internalToField
            }
            onClick={() => onUpdate(internalFromField, internalToField, internalApp)}
          />
        </s.DialogFooter>
      </s.DialogContent>
    </Dialog>
  );
}

ConfigureJoinDialog.propTypes = propTypes;
export default ConfigureJoinDialog;
