'use strict';

var ctrl = function($scope, $location, AuthService) {
  $scope.backdrop = null;

  $scope.init = function() {
    $('#navbar').on('show.bs.collapse', function() {
      $scope.backdrop = $('<div class="modal-backdrop fade in" style="z-index: 1029;"></div>').appendTo(document.body);
      $scope.backdrop.on('click', $scope.hideBackdrop);
    });
  };

  $scope.hideBackdrop = function() {
    $('#navbar').collapse('hide');
    if($scope.backdrop) {
      $scope.backdrop.remove();
    }
  };
  $('#navbar').find('ul > li > a').on('click', $scope.hideBackdrop);


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

  $scope.$on('message', function(_, context) {
    $scope.$broadcast(context.event, context.data);
  });

  $scope.init();
};
ctrl.$inject = ['$scope', '$location', 'AuthService'];
module.exports = ctrl;