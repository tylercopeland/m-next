const ComponentButtonMenuCtrl = function ($rootScope, $scope, $filter, $timeout, guidSvc) {
  console.debug("ComponentButtonMenuCtrl", $scope.control);
  $scope.svgIconStyle = {
    display: 'inline-block'
  };
  $scope.$parent.layout.title = $scope.control.name + " | Menu Items";
  $scope.selectedBtn = null;
  $scope.selectedIdx = null;
  $scope.buttonLabel = "Edit Actions (0)";

  $scope.layout = {
    sortableConfig: {       // Object that controls the drag and drop sorting
      animation: 150,
      group: 'columns',
      handle: '.mi-icon-move',
      filter: '.mi-ae-ignore',
      disabled: false,
      scroll: true,
      filter: '.ignore-elements'
    }
  };

  var getMenuItemCount = function (prefix, searchArray) {
    var counter = 1,
      items = [];

    angular.forEach(searchArray, function (btn) {
      isPrefixed = (btn.caption.replace(prefix, "") !== btn.caption) ? btn.caption.replace(prefix, "") : false;
      if (isPrefixed) {
        if (!isNaN(parseInt(isPrefixed))) {
          items.push(parseInt(isPrefixed));
        }
      }
    });

    if (items.length > 0) {
      items = $filter('orderBy')(items);
      counter = parseInt(items[items.length - 1]) + 1;
    }

    return counter;
  };

  var reloadButton = function () {
    // console.log('selectedIdx', $scope.selectedIdx)
    if ($scope.selectedIdx !== null) {
      $scope.loadButton($scope.control.buttons[$scope.selectedIdx], $scope.selectedIdx);
    }
  };

  $scope.addNewButton = function () {
    var name = "Menu Item " + getMenuItemCount("Menu Item ", $scope.control.buttons),
      guid = guidSvc.create();

    $scope.control.buttons.push({
      id: guid,
      Type: "BGI",
      caption: name,
      name: $scope.control.name + "~~" + guid,
      onClick: null,
      visible: true,
      disabled: false
    });

    var idx = $scope.control.buttons.length - 1;
    $scope.loadButton($scope.control.buttons[idx], idx);
    $rootScope.$broadcast("component:modal:autoSave");
  };

  $scope.loadButton = function (button, idx) {
    $scope.selectedBtn = button;
    $scope.selectedIdx = idx;

    const events = currentScreenSvc.getEvents();
    const actionSets = currentScreenSvc.getActionSets();

    var count = (button.onClick !== null) ?
    actionSets[events[button.onClick][0]].Actions.length : 0;

    $scope.buttonLabel = "Edit Actions (" + count + ")";
    angular.element("#buttonName").focus();
  };

  $scope.deleteButton = function (idx) {
    var control = $scope.control.buttons[idx];
    control.properties = {
      events: [
        { name: "Click", func: "onClick" }
      ]
    };
    var blnDeleted = $scope.TryDelete(control);
    if (blnDeleted == false) {
      return false;
    }

    $scope.control.buttons.splice(idx, 1);

    var newIdx = (idx === 0) ? 0 : idx - 1;
    $scope.loadButton($scope.control.buttons[newIdx], newIdx);
    $rootScope.$broadcast("component:modal:autoSave");
  };

  $scope.openActionEditor = function () {
    $rootScope.$broadcast("component:modal:autoSave");
    angular.element("#actionEditorModal").scope().openEditor($scope.selectedControl, $scope.selectedIdx, true, true);
  };

  // Add new button if empty
  if ($scope.control.buttons.length === 0) {
    $scope.addNewButton();
  }
  $scope.loadButton($scope.control.buttons[0], 0);

  $scope.$watch('control', function (curr, prev) {
    reloadButton();
  }, true);

  $scope.$watch('control.buttons', function (curr, prev) {
    // console.log('control.buttons', curr);
    reloadButton();
    $rootScope.$broadcast("component:modal:isModified");
  }, true);

  $scope.$on("miae:closed", function () {
    // console.log('miaeClosed')
    $timeout(function () {
      reloadButton();
    });
  });
};
ComponentButtonMenuCtrl.$inject = ['$rootScope', '$scope', '$filter', '$timeout', 'guidSvc'];
export default ComponentButtonMenuCtrl;