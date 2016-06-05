'use strict';

var directive = function($location, ModalService, CourseService, UserService, GameService) {
  return {
    restrict: 'E',
    templateUrl: 'game-options-directive.html',
    scope: true,
    link: function($scope, $elem, $attr) {
      ModalService.register('game-options', $scope);
      angular.element($elem.children()[0]).on('hidden.bs.modal', function() {
        $scope.defer.resolve('closed game options');
      });

      $scope.init = function() {
        if(!$scope.context) {
          return;
        }
        $scope.defer = $scope.context.defer;
        $scope.game = $scope.context.game;
      };

      $scope.$watch('context', function() {
        $scope.init();
      });

      $scope.delete = function() {
        GameService.remove($scope.game).then(function() {
          ModalService.close();
          $location.path('/');
        });
      };

      $scope.init();
    }
  };
};
directive.$inject = ['$location', 'ModalService', 'CourseService', 'UserService', 'GameService'];
module.exports = directive;