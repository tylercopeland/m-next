export default function editorSvc($q, $filter, $templateRequest, currentScreenSvc) {

  var editor = {
    controls: [],
    arSet: [],
    arGet: []
  };

  /**
   * Load an external template
   *
   * @param url    Full path to file
   *
   * @return HTML
   */
  var loadTemplate = function (url) {
    var deferred = $q.defer();
    if (url !== null) {
      $templateRequest(url)
        .then(function (html) {
          deferred.resolve(html);
        });
    } else {
      deferred.reject();
    }
    return deferred.promise;
  };

  /**
   * Save all the changes of action editor and place them back into the current screen for designer to consume
   *
   * @param editorData    Current editor data
   * @param controlMenu   Current control menu
   */
  var saveActionEditor = function (editor) {
    // Get the current screen options
    var screenEvents = {};
    var screenActionSets = {};

    // console.clear();
    // console.warn('saveActionEditor', editor);

    // Loop through all the section and controls and update the screen controls
    angular.forEach(editor.menu, function (section) {
      // console.group("Section: " + section.name);

      // Loop through the menu controls
      angular.forEach(section.controls, function (control) {
        // console.group("Control: " + control.name);

        var screenControl = $filter('filter')(currentScreenSvc.getControls(), { options: { id: control.id } })[0].options;
        // console.debug('screen control', screenControl);

        // Loop through each control event
        angular.forEach(control.events, function (event) {
          // console.info('** event', event);
          if (event.id !== null && event.actionSet !== null) {
            if (event.actionSet.Actions.length > 0) {
              screenControl[event.func] = event.id;
              screenEvents[event.id] = [event.actionSetId];
              screenActionSets[event.actionSetId] = event.actionSet;
            } else {
              screenControl[event.func] = null;
            }
          }
        });

        // Add Grid Properties if necessary
        angular.forEach(control.columns, function (event) {
          if (event.id !== null && event.actionSet !== null) {
            if (event.actionSet.Actions.length > 0) {
              if (control.type === "EDT") {
                screenControl.columns[event.idx].onChangeEvent = event.id;
                screenEvents[event.id] = [event.actionSetId];
                screenActionSets[event.actionSetId] = event.actionSet;
              } else {
                screenControl.model.columns[event.idx].onClick = event.id;
                screenEvents[event.id] = [event.actionSetId];
                screenActionSets[event.actionSetId] = event.actionSet;
              }
            } else {
              if (control.type === "EDT") {
                screenControl.columns[event.idx].onChangeEvent = null;
              } else {
                screenControl.model.columns[event.idx].onClick = null;
              }
            }
          }
        });

        // Add Button Properties if necessary
        angular.forEach(control.buttons, function (event) {
          if (event.id !== null && event.actionSet !== null) {
            screenControl.buttons[event.idx].onClick = event.id;
            screenEvents[event.id] = [event.actionSetId];
            screenActionSets[event.actionSetId] = event.actionSet;
          }
        });
        // console.groupEnd();
      });
      // console.groupEnd();
    });

    // Loop through all the screen events
    angular.forEach(editor.screenEvents, function (event) {
      if (event.id !== null && event.actionSet !== null) {
        if (event.actionSet.Actions.length > 0) {
          currentScreenSvc.setOption(event.func, event.id);
          screenEvents[event.id] = [event.actionSetId];
          screenActionSets[event.actionSetId] = event.actionSet;
        } else {
          currentScreenSvc.setOption(event.func, null);
        }
      }
    });

    currentScreenSvc.setEvents(screenEvents);
    currentScreenSvc.setActionSets(screenActionSets);

    if (typeof $selectedObj !== "undefined" && $selectedObj !== null) {
      var errorList = currentScreenSvc.findReferences($selectedObj.data("dControl"));
      currentScreenSvc.HandleFoundReferences(errorList);
    }
    return;
  };

  /**
   * Populate a list of controls on the screen for later use
   */
  var createControlListing = function (controls) {
    editor.controls = [];
    angular.forEach(controls, function (control) {
      var options = control.options,
        controlType = (options.Type) ? options.Type : options.type,
        caption = (options.Caption) ? options.Caption : options.caption;

      // Hides the sync widget control from being usable in the action editor/action sets
      if(controlType === "SYW") {
        return;
      }

      editor.controls.push({
        id: (options.Id) ? options.Id : options.id,
        name: (options.Name) ? options.Name : options.name,
        caption: caption,
        type: controlType,
        typeLabel: _getTypeLabel(controlType, options.TypeOverride),
        fieldType: _getFieldType(controlType),
        readOnly: options?.readOnly ?? false,
        viewName: (controlType === "GRD") ? options.model.viewName : (controlType === "EDT") ? options.viewFriendlyName : null,
        columns: (controlType === "GRD") ? options.model.columns : (controlType === "EDT") ? options.columns : null,
        buttons: (controlType === "BGR") ? options.buttons : null,
        hasValidation: (!options.isBound || (options.isBound && options.FieldType === 0) || (options.isBound && options.FieldType === 8) || (options.isBound && options.FieldType === 1) || (options.isBound && options.FieldType === 2))
      });

      if (controlType === "BGR") {
        angular.forEach(options.buttons, function (btn) {
          var btnType = (btn.Type) ? btn.Type : btn.type,
            btnCaption = (btn.Caption) ? btn.Caption : btn.caption;

          editor.controls.push({
            id: (btn.Id) ? btn.Id : btn.id,
            name: caption + " - " + btnCaption,
            caption: caption + " - " + btnCaption,
            type: btnType,
            typeLabel: _getTypeLabel(btnType),
            fieldType: _getFieldType(btnType),
            readOnly: btn?.readOnly ?? false,
            viewName: null,
            columns: null,
            buttons: null,
            hasValidation: (!btn.isBound || (btn.isBound && btn.FieldType === 0))
          });
        });
      }

      if (controlType === "EDT") {
        angular.forEach(options.columns, function (column) {

          var setFieldType = 0;
          switch (column.fieldType) {
            case "3":
            case 3:
              setFieldType = 3;
              break;
            case "5":
            case 5:
              setFieldType = 2;
              break;
          }

          editor.controls.push({
            id: column.controlId,
            name: caption + " - " + column.header,
            caption: caption + " - " + column.header,
            type: "DTF",
            typeLabel: _getTypeLabel("DTF"),
            fieldType: setFieldType,
            readOnly: false, //(column.hasOwnProperty('readOnly')) ? column.readOnly : false,
            viewName: null,
            columns: null,
            buttons: null,
            hasValidation: false
          });
        });
      }
    });
  };

  /**
   * Get a list of controls on the screen
   *
   * @param controlTypes    List of control types to ignore (Array)
   * @param matchThese      Only load controls that match the types specified in the first param (Boolean)
   *
   * @return Array
   */
  var getScreenControls = function (controlTypes, matchThese) {
    var controls = [];
    angular.forEach(editor.controls, function (control) {
      // No control types were specified get all
      if (controlTypes === null || controlTypes === undefined) {
        controls.push(control);

        // Some control types were specified
      } else {
        var inArray = (controlTypes.indexOf(control.type) > -1);

        // Match only and it exists
        if (matchThese && inArray) {
          controls.push(control);
        }

        // This means to ignore items from the list and it's not in the array
        if ((matchThese === null || matchThese === undefined || !matchThese) && !inArray) {
          controls.push(control);
        }
      }
    });
    return controls;
  };

  /**
   * Get a list of controls on the screen
   *
   * @param controlTypes      List of control types to ignore (Array)
   * @param matchThese        Only load controls that match the types specified in the first param (Boolean)
   * @param hideProperties    Hide the display options for controls so only show the control name (Boolean)
   *
   * @return Array
   */
  var getControlValues = function (controlTypes, matchThese, hideProperties) {
    var screenControls = getScreenControls(controlTypes, matchThese)
    let controlList = [];

    angular.forEach(screenControls, function (control) {
      // Get all available display options
      if (!hideProperties) {
        var displayOpts = controlDisplayOptions(control);

        if (displayOpts !== null) {
          angular.forEach(displayOpts, function (opt) {
            controlList.push({
              name: control.name + " - " + opt.label,
              typeLabel: control.typeLabel,
              type: control.type,
              id: control.id,
              property: opt.value,
              uniqueName: control.name,
              readOnly: opt.readOnly === undefined ? false : opt.readOnly,
              fieldType: opt.fieldType,
              hasValidation: control.hasValidation,
              buttons: control?.buttons ?? [],
            });
          });
        } else {
          controlList.push({
            name: control.name,
            typeLabel: control.typeLabel,
            type: control.type,
            id: control.id,
            property: (displayOpts === null) ? null : "Text",
            uniqueName: control.name,
            readOnly: control.readOnly === undefined ? false : control.readOnly,
            fieldType: control.fieldType,
            hasValidation: control.hasValidation,
            buttons: control?.buttons ?? [],
          });
        }
      } else {
        controlList.push({
          name: control.name,
          typeLabel: control.typeLabel,
          type: control.type,
          id: control.id,
          property: "",
          uniqueName: control.name,
          readOnly: control.readOnly === undefined ? false : control.readOnly,
          fieldType: control.fieldType,
          hasValidation: control.hasValidation,
          buttons: control?.buttons ?? [],
        });
      }
    });

    return controlList;
  };

  /**
   * Get a list of optional values for a particular control
   *
   * @param type    Type of control (String)
   *
   * @return Array
   */
  var controlDisplayOptions = function (control) {
    var type = (control.Type) ? control.Type : control.type;

    var calendarOpts = [
      { value: 'Title', label: 'Title', fieldType: 0 },
      { value: 'Description', label: 'Description', fieldType: 0 },
      { value: 'ActivityStatus', label: 'Status', fieldType: 0 },
      { value: 'Startdate', label: 'Start Date/Time', fieldType: 3 },
      { value: 'Enddate', label: 'End Date/Time', fieldType: 3 },
      { value: 'Resource', label: 'Resource', fieldType: 1 },
      { value: 'RecordID', label: 'RecordID', fieldType: 1 },
    ];
    var paymentOpts = [
      { value: 'IsValid', label: 'Is Valid', readOnly: true },
      { value: 'CardHolderName', label: 'Card Holder Name', fieldType: 0 },
      { value: 'MaskedCreditCardNumber', label: 'Masked Credit Card Number', readOnly: true, fieldType: 0 },
      { value: 'ExpiryMonth', label: 'Expiry Month', readOnly: true, fieldType: 3 },
      { value: 'ExpiryYear', label: 'Expiry Year', readOnly: true, fieldType: 3 }
    ];
    var chartOpts = [
      { value: 'PrimaryAxis', label: 'Primary Axis', fieldType: 0 },
      { value: 'RecordID', label: 'RecordID', fieldType: 1 }
    ];
    var dropdownOpts = [
      { value: 'Text', label: 'Display', fieldType: 0 },
      { value: 'Value', label: 'RecordID', fieldType: 1 }
    ];
    var signatureOpts = [
      { value: 'SignedName', label: 'Signed Name', readOnly: true, fieldType: 0 },
      { value: 'IPAddress', label: 'IP Address', readOnly: true, fieldType: 0 },
      { value: 'SignedDateTime', label: 'Signed DateTime', readOnly: true, fieldType: 3 },
      { value: 'SignatureUrl', label: 'Signature Url', readOnly: true, fieldType: 0 },
      { value: 'ScreenCaptureUrl', label: 'Screen Capture Url', readOnly: true, fieldType: 0 }
    ];
    var addressLookupOpts = [
      { value: 'StreetAddress', label: 'StreetAddress', readOnly: true, fieldType: 0 },
      { value: 'City', label: 'City', readOnly: true, fieldType: 0 },
      { value: 'StateProvince', label: 'StateProvince', readOnly: true, fieldType: 0 },
      { value: 'ZipPostalCode', label: 'ZipPostalCode', readOnly: true, fieldType: 0 },
      { value: 'Country', label: 'Country', readOnly: true, fieldType: 0 },
      { value: 'Latitude', label: 'Latitude', readOnly: true, fieldType: 0 },
      { value: 'Longitude', label: 'Longitude', readOnly: true, fieldType: 0 }
    ];
    // var defaultOpts = [
    //   { value: 'Text', label: 'Display', fieldType: 0 }
    // ];

    var altOptions = null;

    // Determine if a display field is needed
    switch (type) {
      case "CAL":
        altOptions = angular.copy(calendarOpts);
        break;
      case "PAY":
        altOptions = angular.copy(paymentOpts);
        break;
      case "SIG":
        altOptions = angular.copy(signatureOpts);
        break;
      case "ADR":
        altOptions = angular.copy(addressLookupOpts);
        break;
      case "CHT":
        altOptions = angular.copy(chartOpts);
        break;
      case "GRD":
        altOptions = [];
        angular.forEach(control.columns, function (column) {
          altOptions.push({
            value: column.name,
            label: column.caption,
            fieldType: column.fieldType
          });
        });
        break;
      case "EDT":
        altOptions = [];
        angular.forEach(control.columns, function (column) {
          altOptions.push({
            value: column.field,
            label: column.header,
            fieldType: column.fieldType
          });
        });
        break;
      case "DRP":
        altOptions = angular.copy(dropdownOpts);
        break;
      case "GAL":
        altOptions = [{
          value: "RecordID",
          label: "RecordID"
        },
        {
          value: "Caption",
          label: "Caption"
        }];
        break;
      default:
        // altOptions = angular.copy(defaultOpts);
        break;
    }

    return altOptions;
  };

  /**
   * Get a list of all suggested action results
   *
   * @param setList      Array of current AR's that are set
   * @param getList      Array of current AR's that are being used
   * 
   * @return Array
   */
  var getSuggestedActionResults = function () {
    var opts = [];

    angular.forEach(editor.arSet, function (item) {
      var usage = editor.arGet.reduce(function (n, val) {
        return n + (val === item.id);
      }, 0);

      var found = $filter('filter')(opts, { guid: item.id });

      if (found.length === 0 && item.name !== null) {
        opts.push({
          label: item.name,
          guid: item.id,
          value: item.name,
          usage: usage
        });
      }
    });

    return opts;
  };

  /**
   * Get the display name for a particular control
   *
   * @param controlId     The id of the control
   * @param property      The additional property of this control if necessary
   * 
   * @return String
   */
  var getControlDisplayName = function (controlId, property) {
    var control = $filter('filter')(editor.controls, { id: controlId }),
      displayOpts = (control.length === 1) ? controlDisplayOptions(control[0]) : false,
      controlName = (control.length > 0) ? control[0].name : null,
      prop = (displayOpts === null || property === null) ? null : " - " + $filter('filter')(displayOpts, { value: property })[0].label;

    // if(!displayOpts) {
    //   return "";
    // }

    return (displayOpts === null || displayOpts.length === 1) ?
      (!property) ? controlName : controlName + prop :
      controlName + prop;
  };

  /**
   * Get grid control viewName
   *
   * @param controlId     The id of the control
   * 
   * @return String
   */
  var getGridViewName = function (controlId) {
    var controls = $filter('filter')(editor.controls, { id: controlId });
    return controls && controls.length > 0
      ? controls[0].viewName
      : "";
  };

  var getArSet = function () {
    return editor.arSet;
  };

  var getArGet = function () {
    return editor.arGet;
  };

  var assignArSet = function (arSet) {
    editor.arSet = arSet;
  };

  var assignArGet = function (arGet) {
    editor.arGet = arGet;
  };

  /**
   * Rename the action result for each instance it's been set
   *
   * @param name        The new name to use for this action result
   * @param id          The ID of the Action Result to update
   *
   * @return Null
   */
  var renameActionResult = function (name, id) {
    angular.forEach(editor.arSet, function (ar) {
      if (ar.id === id) {
        ar.model.updateName(name);
      }
    });
  };

  /**
   * Get the name of the action result to display in dropdowns
   *
   * @param id        The ID of the Action Result to display
   *
   * @return String
   */
  var getActionResultName = function (id) {
    var displayName = "";
    angular.forEach(editor.arSet, function (ar) {
      if (ar.id === id) {
        displayName = ar.name;
      }
    });
    return displayName;
  };

  /**
   * Get the list of filters for particular grid control
   *
   * @param controlID        The ID of the Grid to load
   *
   * @return String
   */
  var getControlFilters = function (controlId) {
    var controls = currentScreenSvc.getControls(), // Load the controls from the designer
      found = $filter('filter')(controls, { options: { id: controlId } });

    return (found && found.length === 1) ? found[0].options : null;
  };

  var getControlById = function (controlId) {
    return $filter('filter')(editor.controls, { id: controlId }, true);
  };

  // Private Functions

  /**
   * Get the label for the type of control this is
   */
  var _getTypeLabel = function (type, typeOverride) {
    var typeLabel = "";
    switch (type) {
      case ("GRD"):
        typeLabel = "Grid";
        break;
      case ("BTN"):
        typeLabel = "Buttons";
        break;
      case ("BGR"):
      case ("BGI"):
        typeLabel = "Button Menu";
        break;
      // case ("BGI"):
      //     typeLabel = "Button Menu Item";
      //     break;
      case ("LBL"):
        typeLabel = "Text";
        break;
      case ("TXT"):
        typeLabel = (typeOverride === "HTM") ? "HTML Editor" : "Text Input";
        break;
      case ("CHK"):
        typeLabel = "CheckBox";
        break;
      case ("TGL"):
        typeLabel = "Toggle";
        break;
      case ("DTP"):
        typeLabel = "DateTimePicker";
        break;
      case ("RAD"):
        typeLabel = "Radio Button";
        break;
      case ("PIC"):
        typeLabel = "Picture";
        break;
      case ("ICO"):
        typeLabel = "Icon";
        break;
      case ("DRP"):
        typeLabel = "Dropdown";
        break;
      case ("FIL"):
        typeLabel = "File Attachment";
        break;
      case ("TAG"):
        typeLabel = "TagList";
        break;
      case ("PAY"):
        typeLabel = "PaymentWidget";
        break;
      case ("SIG"):
        typeLabel = "Signature";
        break;
      case ("ADR"):
        typeLabel = "Address Lookup";
        break;
      case ("F-BLOCK"):
        typeLabel = "Field Block";
        break;
      case ("CHT"):
        typeLabel = "Chart";
        break;
      case ("CAL"):
        typeLabel = "Calendar";
        break;
      case ("SEC"):
        typeLabel = "Section";
        break;
      case ("L-CON"):
        typeLabel = "Container";
        break;
      case ("DOC"):
        typeLabel = "Attachments";
        break;
      case ("EDT"):
        typeLabel = "Editable Grid";
        break;
      case ("DTF"):
        typeLabel = "Editable Grid Field";
        break;
      case ("REC"):
        typeLabel = "RecurrenceWidget";
        break;
      case "GAL":
        return "Gallery";
    }
    return typeLabel;
  };

  /**
   * Get the type of field this control is
   */
  var _getFieldType = function (type) {
    var fieldType = 0;
    switch (type) {
      case ("CHK"):
        fieldType = 2;
        break;
      case ("TGL"):
        fieldType = 2;
        break;
      case ("DTP"):
        fieldType = 3;
        break;
    }
    return fieldType;
  };

  return {
    loadTemplate: loadTemplate,
    saveActionEditor: saveActionEditor,
    createControlListing: createControlListing,
    getScreenControls: getScreenControls,
    getControlValues: getControlValues,
    controlDisplayOptions: controlDisplayOptions,
    getSuggestedActionResults: getSuggestedActionResults,
    getControlDisplayName: getControlDisplayName,
    getGridViewName: getGridViewName,
    getArSet: getArSet,
    getArGet: getArGet,
    assignArSet: assignArSet,
    assignArGet: assignArGet,
    renameActionResult: renameActionResult,
    getActionResultName: getActionResultName,
    getControlFilters: getControlFilters,
    getControlById: getControlById,
  };
};

editorSvc.$inject = ["$q", "$filter", "$templateRequest", "currentScreenSvc"];