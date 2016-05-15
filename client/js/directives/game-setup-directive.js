'use strict';

var directive = function(ModalService, CourseService, UserService, GameService) {
  return {
    restrict: 'E',
    templateUrl: 'game-setup-directive.html',
    scope: true,
    link: function($scope, $elem, $attr) {
      ModalService.registerModalScope('game-setup', $scope);
      angular.element($elem.children()[0]).on('hidden.bs.modal', function () {
        $scope.defer.resolve('closed game setup');
      });

      $scope.init = function() {
        if(!$scope.context) { return; }
        $scope.defer = $scope.context.defer;
        $scope.setup = {
          course: null,
          players: []
        };
        CourseService.list().then(function(courses) {
          $scope.courses = courses;
        });
        UserService.list().then(function (users) {
          $scope.users = users;
        });
      };

      $scope.$watch('context', function() {
        $scope.init();
      });

      $scope.proceed = function() {

      };

      $scope.init();
    }
  };
};
directive.$inject = ['ModalService', 'CourseService', 'UserService', 'GameService'];
module.exports = directive;