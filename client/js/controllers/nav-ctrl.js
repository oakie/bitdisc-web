'use strict';

var ctrl = function($scope, $location, AuthService) {
  $scope.init = function() {
  };

  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.signIn = function(provider) {
    AuthService.signin(provider);
  };

  $scope.signOut = function() {
    AuthService.signout();
  };

  $scope.apply = function() {
    var phase = $scope.$root.$$phase;
    if(phase !== '$apply' && phase !== '$digest') {
      $scope.$apply();
    }
  };

  AuthService.onAuth('nav-ctrl', function(auth) {
    console.log('nav onauth', auth);
    $scope.auth = auth;
    $scope.apply();
  });

  $scope.init();
};
ctrl.$inject = ['$scope', '$location', 'AuthService'];
module.exports = ctrl;