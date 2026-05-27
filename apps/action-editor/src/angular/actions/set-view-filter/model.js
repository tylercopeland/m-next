import template from "./tmpl.html";

export default function SetViewFilterModel(BaseModel, guidSvc, $filter, editorSvc) {
  function SetViewFilterModel(data) {
    this.ViewFilters = [];
    this.isReadOnly = false;

    angular.extend(
      this,
      new BaseModel(this.config.id, this.config.name),
      data
    );

    if (data === undefined) {
      this.addNewItem();
    } else {
      var self = this;
      angular.forEach(data.ViewFilters, function(item) {
        self.loadFilters(item);
      });
    }
  }

  SetViewFilterModel.prototype = angular.copy(BaseModel.prototype);

  SetViewFilterModel.prototype.config = {
    id: 16,
    category: "Screen",
    name: "Set View Filter",
    description: {
      short: "Sets Filter for selected control or Screen.",
      long: "Sets Filter for selected control or Screen."
    },
    learnMore: [
      [
        "Learn more",
        "https://help.method.me/en/articles/2623135-set-view-filter-action"
      ]
    ],
    template: template,
    active: true,
    hasNested: false, // Only needed if this model contains a nested action set
    nestedProperties: [] // List the property names that contain a nested action set
  };

  SetViewFilterModel.prototype.addNewItem = function() {
    this.ViewFilters.push({
      ControlId: null,
      ViewFilterId: null,
      ValidationMessages: []
    });
  };

  SetViewFilterModel.prototype.getFilterCount = function(ctrl) {
    var controlOptions = editorSvc.getControlFilters(ctrl.value);
    if (controlOptions.Type === "EDT" || controlOptions.type === "EDT") {
      ctrl.filterCount =
        controlOptions !== null &&
        controlOptions.viewList &&
        controlOptions.viewList.length > 1
          ? controlOptions.viewList.length
          : 0;
    } else {
      ctrl.filterCount =
        controlOptions !== null && controlOptions.filterDef
          ? controlOptions.filterDef.length
          : 0;
    }
  };

  SetViewFilterModel.prototype.loadFilters = function(item) {
    var controlOptions = editorSvc.getControlFilters(item.ControlId);

    item.filterList = [];
    if (!item.ValidationMessages) {
      item.ValidationMessages = [];
    }
    // item.filterList = [{
    //     value: guidSvc.empty,
    //     label: "Set control without filters"
    // }];

    // Proceed if filterDef exists
    if (controlOptions !== null && controlOptions.filterDef) {
      angular.forEach(controlOptions.filterDef, function(obj) {
        item.filterList.push({
          value: obj.filterId,
          label: obj.filterName
        });
      });
    }

    if (controlOptions !== null && controlOptions.viewList) {
      angular.forEach(controlOptions.viewList, function(obj) {
        item.filterList.push({
          value: obj.id,
          label: obj.name
        });
      });
    }
  };

  SetViewFilterModel.prototype.isUsingControl = function(control) {
    var result = false;
    angular.forEach(this.ViewFilters, function(item) {
      if (item.ControlId !== null && item.ControlId === control) {
        result =  true;
      }
    });

    return result;
  };
  
  SetViewFilterModel.prototype.validate = function() {
    var self = this;
    this.InValid = false;
    this.ValidationMessages = [];

    angular.forEach(this.ViewFilters, function(item) {
      var idx;
      var found = $filter("filter")(item.ValidationMessages, {
        Property: "ControlId"
      });

      if (
        item.ControlId === null ||
        item.ControlId === undefined ||
        item.ControlId === guidSvc.empty
      ) {
        if (!found || found.length === 0) {
          item.ValidationMessages.push({
            Property: "ControlId",
            Message: 100
          });
        }
        self.InValid = true;
      } else {
        if (found || found.length === 1) {
          idx = item.ValidationMessages.indexOf(found[0]);
          item.ValidationMessages.splice(idx, 1);
        }
      }

      found = $filter("filter")(item.ValidationMessages, {
        Property: "ViewFilterId"
      });

      if (item.ViewFilterId === null || item.ViewFilterId === undefined) {
        if (!found || found.length === 0) {
          item.ValidationMessages.push({
            Property: "ViewFilterId",
            Message: 110
          });
        }
        self.InValid = true;
      } else {
        if (found || found.length === 1) {
          idx = item.ValidationMessages.indexOf(found[0]);
          item.ValidationMessages.splice(idx, 1);
        }
      }
    });
  };

  return SetViewFilterModel;
};

SetViewFilterModel.$inject = [
  "BaseModel",
  "guidSvc",
  "$filter",
  "editorSvc"
];