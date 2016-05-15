'use strict';

var ctrl = function($scope, $location, AuthService) {
  var onAuth = function(auth) {
    $scope.auth = auth;
  };
  AuthService.onauth(onAuth);
  AuthService.get().then(onAuth);

  $scope.init = function() {};

  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.signIn = function () {
    AuthService.signin();
  };

  $scope.signOut = function() {
    AuthService.signout();
  };

  $scope.init();
};
ctrl.$inject = ['$scope', '$location', 'AuthService'];
module.exports = ctrl;