'use strict';

var directive = function($location, UtilService, ModalService, UserService) {
  return {
    restrict: 'E',
    templateUrl: 'guest-setup-directive.html',
    scope: true,
    link: function($scope, $elem, $attr) {
      ModalService.register('guest-setup', $scope);

      $scope.init = function() {
        if(!$scope.context) {
          return;
        }
        $scope.guest = {name: '', email: ''};
      };

      $scope.$watch('context', function() {
        $scope.init();
      });

      $scope.proceed = function() {
        UserService.createGuest($scope.guest).then(function(user) {
          ModalService.close(user);
        });
      };

      $scope.cancel = function() {
        ModalService.close();
      };

      $scope.init();
    }
  };
};
directive.$inject = ['$location', 'UtilService', 'ModalService', 'UserService'];
module.exports = directive;