export default function SendSmsCtrl($rootScope, $scope) {
  console.debug("SendSmsCtrl", $scope.action);


  $scope.users = ["User 1", "User 2", "User 3"];
  $scope.allow = [0, 2, 5, 6, 8, 9, 10, 11, 12];
  $scope.allowParams = [0, 2, 5, 6, 9];
  $scope.dropdowns = {
    transition: [
      {
        label: "Close this screen",
        value: true
      },
      {
        label: "Keep this screen in currently open list",
        value: false
      }
    ],
  };
};

SendSmsCtrl.$inject = ["$rootScope", "$scope"];