'use strict';

var ctrl = function($scope, $location, AuthService) {
  $scope.init = function() {
    AuthService.signin().then(function(token) {
      console.log(token);
    });
  };

  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.init();
};
ctrl.$inject = ['$scope', '$location', 'AuthService'];
module.exports = ctrl;