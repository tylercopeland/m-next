export default function editorApiSvc($http, $q, $rootScope, configs, currentScreenSvc, noSqlSvc) {
  var endpoints = {
    GetFieldNames: '/field/{account}/GetFieldNames', // not used
    GetFieldNamesAndTypesFriendly: '/field/{account}/GetFieldNamesAndTypesFriendly', // not used
    GetJoinFieldByChildName: '/field/{account}//GetJoinFieldByChildName', // not used
    GetFieldNamesWithRestriction: 'field/{account}/GetFieldNamesWithRestriction',
    GetAppsAndPermissionSettings: '/apps/api/AppStore/GetAppsAndPermissionSettings',
    GetReportNames: '/apps/api/View/GetReportNames',
    GetReportTableNames: '/apps/api/View/GetReportTableNames',
  };

  var tables = {
    fields: [],
  };

  /**
   * Return internal list of fields
   */
  const getFields = function (table) {
    return tables.fields[table] ? tables.fields[table] : [];
  };

  /**
   * Set internal list of fields
   */
  const setFields = function (fields) {
    tables.fields = angular.copy(fields);
  };

  /**
   * Clear fields from list
   */
  var clearFields = function (table) {
    delete tables.fields[table];
  };

  /**
   * Get a list of Apps and their permissions
   *
   * @return Promise (response)
   */
  var getAppsAndPermissions = function () {
    const deferred = $q.defer();
    const url = window.location.origin + endpoints.GetAppsAndPermissionSettings;
    console.debug('computed URL:', url);
    $http
      .get(url)
      .success(function (resp) {
        if (resp.Data) {
          deferred.resolve(resp.Data);
        } else {
          deferred.resolve(resp.data);
        }
      })
      .error(function () {
        deferred.reject();
      });

    return deferred.promise;
  };

  /**
   * Get a list of App Screens
   *
   * @return Promise (response)
   */
  var loadScreenList = function () {
    var deferred = $q.defer();
    if ($rootScope.actionEditor.isReactWrapper) {
      deferred.resolve(currentScreenSvc.getScreenList());
    } else {
      var url = configs.designerV1Endpoint + '/api/v1/Designer/GoToScreenList';
      var options = { headers: { Authorization: 'Bearer ' + configs.rtToken } };
      $http
        .get(url, options)
        .success(function (resp) {
          if (resp.Data) {
            deferred.resolve(resp.Data);
          } else {
            deferred.resolve(resp.data);
          }
        })
        .error(function () {
          deferred.reject();
        });
    }

    return deferred.promise;
  };

  /**
   * Get a list of Report Names
   *
   * @return Promise (response)
   */
  var getReportNames = function () {
    var deferred = $q.defer(),
      url = window.location.origin + endpoints.GetReportNames;

    $http
      .get(url)
      .success(function (resp) {
        if (resp.Data) {
          deferred.resolve(resp.Data);
        } else {
          deferred.resolve(resp.data);
        }
      })
      .error(function () {
        deferred.reject();
      });

    return deferred.promise;
  };

  /**
   * Get a list of Report Table Names
   *
   * @return Promise (response)
   */
  var getReportTableNames = function (reportName) {
    var deferred = $q.defer(),
      url =
        window.location.origin +
        endpoints.GetReportTableNames +
        '?reportViewFriendlyName=' +
        encodeURIComponent(reportName);

    $http
      .get(url)
      .success(function (resp) {
        if (resp.Data) {
          deferred.resolve(resp.Data);
        } else {
          deferred.resolve(resp.data);
        }
      })
      .error(function () {
        deferred.reject();
      });

    return deferred.promise;
  };

  /**
   * Get a list of Fields within a given table
   *
   * @return Promise (response)
   */
  var loadTableFields = function (tableName) {
    const fields = getFields(tableName);
    const deferred = $q.defer();
    let query;
    if (tableName && fields.length === 0) {
      if ($rootScope.actionEditor.isReactWrapper) {
        query = currentScreenSvc.getTableFields(tableName);
      } else {
        const url = endpoints.GetFieldNamesWithRestriction + '?viewFriendlyName=' + tableName;

        query = angular.element('html').scope().callMicroServiceV2('get', 'tables-fields', url);
      }

      query.then(
        function (resp) {
          const data = resp.Data || resp.data;
          if (data.length > 0) {
            angular.forEach(data, function (obj) {
              let fieldType = 0;
              obj.Key = obj.key.toString();
              if (
                obj.value.fldType === 'Integer' ||
                obj.value.fldType === 'Decimal' ||
                obj.value.fldType === 'Money' ||
                obj.value.fldType === 'DropDown'
              ) {
                fieldType = 1;
              } else if (obj.value.fldType === 'YesNo') {
                fieldType = 2;
              } else if (obj.value.fldType === 'DateTime') {
                fieldType = 3;
              } else if (obj.value.fldType === 'Picture') {
                fieldType = 7;
              }
              obj.value.fieldType = fieldType;
            });
            tables.fields[tableName] = angular.copy(data);
          }
          deferred.resolve(data);
        },
        function (_error) {
          deferred.reject();
        },
      );
    } else {
      if (fields.length > 0) {
        deferred.resolve(fields);
      } else {
        deferred.reject();
      }
    }

    return deferred.promise;
  };

  /**
   * Convert the list of fields to an object for complex value
   *
   * @return Array
   */
  var createFieldListOptions = function (tableName, ignore) {
    let fieldList = [];

    angular.forEach(tables.fields[tableName], function (obj) {
      if (
        (ignore === null || ignore === undefined || ignore.indexOf(obj.value.fldTypeId) === -1) &&
        (noSqlSvc.isRecordIDSupported(tableName) || obj.key.toString() !== 'RecordID')
      ) {
        fieldList.push({
          label:
            obj.value.fldType === 'DropDown'
              ? obj.key.toString() + ' - Display'
              : obj.key.toString().replace('_', ' - '),
          value: obj.key.toString(),
          type: obj.value.fldType,
          required: obj.value.isReq,
          fieldType: obj.value.fieldType,
          fldTypeId: obj.value.fldTypeId,
          recordID: obj.key.toString().includes('RecordID'),
          dropDownRecordID: obj.key.toString().includes('_RecordID'),
          isLinked: obj.value.isLinked,
        });
      }
    });

    return fieldList;
  };

  /**
   * For complex value control determine the values to display in the loop dropdown
   *
   * @param config    This is the action Model's loop object
   */
  var getAllLoopFieldValues = function (config) {
    var deferred = $q.defer(),
      fieldList = [];

    if (config.tableName === 'LoopAttachments') {
      fieldList = [
        { label: 'Attachment Url', value: 'Url' },
        { label: 'Attachment Name', value: 'Filename' },
        { label: 'Attachment Extension', value: 'Extension' },
        { label: 'Attachment Size', value: 'Size' },
        { label: 'Created Date', value: 'CreatedDate' },
        { label: 'Created By', value: 'CreatedBy' },
        { label: 'Include On Send', value: 'AttachToEmail' },
        { label: 'Tenant ID', value: 'TenantId' },
      ];

      deferred.resolve(fieldList);
      return deferred.promise;
    } else if (config.tableName === 'LoopThroughList') {
      fieldList = [{ label: 'ListValue', value: 'ListValue', type: 'Text' }];
      deferred.resolve(fieldList);
      return deferred.promise;
    } else {
      loadTableFields(config.tableName).then(function (_resp) {
        angular.forEach(createFieldListOptions(config.tableName), function (obj) {
          if (config.distinctColumn) {
            if (obj.value === config.distinctColumn) {
              fieldList.push({
                label: obj.label,
                value: obj.value,
              });
            }
          } else {
            fieldList.push({
              label: obj.label,
              value: obj.value,
            });
          }
        });
        deferred.resolve(fieldList);
      });
    }

    return deferred.promise;
  };

  return {
    getFields: getFields,
    setFields: setFields,
    clearFields: clearFields,
    getAppsAndPermissions: getAppsAndPermissions,
    loadScreenList: loadScreenList,
    getReportNames: getReportNames,
    getReportTableNames: getReportTableNames,
    loadTableFields: loadTableFields,
    createFieldListOptions: createFieldListOptions,
    getAllLoopFieldValues: getAllLoopFieldValues,
  };
}

editorApiSvc.$inject = ['$http', '$q', '$rootScope', 'configs', 'currentScreenSvc', 'noSqlSvc'];
