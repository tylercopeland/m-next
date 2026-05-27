export default function ShowRightPanelCtrl($rootScope, $scope) {
  console.debug("ShowRightPanelCtrl", $scope.action);

  $scope.panels = [
    { value: 'invite', label: "Quick Invite User" },
    { value: 'tags', label: "Manage Tags" }
  ];

  $scope.$watch("action.Panel", function(curr, prev) {
      if(curr !== prev) {
          $scope.action.validate();
      }
  });
};

ShowRightPanelCtrl.$inject = ["$rootScope", "$scope"];