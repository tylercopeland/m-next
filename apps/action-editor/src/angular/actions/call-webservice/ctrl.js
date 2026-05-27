export default function CallWebServiceCtrl($scope, $http) {
  console.debug('CallWebServiceCtrl', $scope.action);

  var originalName = angular.copy($scope.action.config.name);

  $scope.altTitle = '';
  $scope.allow = [0, 2, 5, 6, 9];
  $scope.testMode = false;
  $scope.serviceType = $scope.action.Function === null ? 'REST' : 'SOAP';
  $scope.placeholder = $scope.action.Function === null ? 'https://api.domain.com/v1/people' : 'https://webservice.com/web/service.asmx';
  $scope.showResult = false;
  $scope.payload = {
    default: function(contentType) {
      switch (contentType) {
        case 0:
          return '{\n "key": "value"\n }';

        case 1:
        case 4:
          return '<TestModel xmlns="http://schemas.datacontract.org/2004/07/YourNameSpace" >\n\t<Output>Value</Output>\n</TestModel>';

        case 2:
          return 'some text';

        case 3:
          return 'Key1=value1&Key2=value2';
        default:
      }
    },
    value: null
  };
  $scope.result = {
    url: '',
    statusCode: null,
    duration: '',
    message: ''
  };

  $scope.addItem = function(type) {
    switch (type) {
      case 'param':
        $scope.action.addParam();
        break;

      case 'header':
        $scope.action.addHeader();
        break;
    }
  };

  $scope.removeItem = function(type, idx) {
    switch (type) {
      case 'param':
        $scope.action.Params.splice(idx, 1);
        break;

      case 'header':
        $scope.action.Headers.splice(idx, 1);
        break;
    }
  };

  $scope.toggleTestMode = function() {
    $scope.testMode = !$scope.testMode;
    $scope.altTitle = $scope.testMode ? originalName + ' -  Test Environment' : originalName;
    $scope.showResult = false;
  };

  $scope.toggleServiceType = function(type) {
    $scope.serviceType = type;
    $scope.action.Function = type === 'REST' ? null : '';
    $scope.placeholder = type === 'REST' ? 'https://api.domain.com/v1/people' : 'https://webservice.com/web/service.asmx';
    $scope.action.HttpMethod = type === 'SOAP' ? 1 : 0;
    $scope.action.WebServiceType = type === 'SOAP' ? 0 : 1;
  };

  $scope.httpMethods = [
    {
      label: 'GET',
      value: 0
    },
    {
      label: 'POST',
      value: 1
    },
    {
      label: 'PUT',
      value: 2
    },
    {
      label: 'DELETE',
      value: 3
    },
    {
      label: 'PATCH',
      value: 6
    }
  ];

  $scope.contentTypes = [
    {
      label: 'application/JSON',
      value: 0
    },
    {
      label: 'application/XML',
      value: 1
    },
    {
      label: 'application/x-www-form-urlencoded',
      value: 3
    },
    {
      label: 'text/Plain',
      value: 2
    },
    {
      label: 'text/XML',
      value: 4
    }
  ];

  $scope.$watch('action.Payload.Value', function(value) {
    if (value) {
      $scope.payload.value = $scope.action.Payload.ValueType === 9 ? value : '';
    }
  });

  $scope.testService = function() {
    var values = angular.element('input[name=values]'),
      params = [];

    $scope.showResult = false;

    angular.forEach($scope.action.Params, function(param, idx) {
      if (param.Key !== '') {
        params.push({
          key: param.Key,
          value: values[idx].value
        });
      }
    });

    var headerValues = angular.element('input[name=headerValues]'),
      headerParams = [];

    angular.forEach($scope.action.Headers, function(param, idx) {
      if (param.Key) {
        headerParams.push({
          key: param.Key,
          value: headerValues[idx].value
        });
      }
    });
    $http
      .post(`${window.location.origin}/runtime/api/v1/actions/callservice`, {
        url: $scope.action.Url,
        func: $scope.action.Function,
        params: params,
        httpMethod: $scope.action.HttpMethod,
        webServiceType: $scope.action.WebServiceType,
        headers: headerParams,
        contentType: $scope.action.ContentType,
        payload: $scope.payload.value
      })
      .success(function(resp) {
        $scope.showResult = true;
        $scope.result = {
          url: resp.message,
          duration: resp.duration,
          response: resp.markup,
          statusCode: resp.statusCode
        };
      })
      .error(function(_err) {
      });
  };
};

CallWebServiceCtrl.$inject = ['$scope', '$http'];