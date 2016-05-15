'use strict';

var directive = function(ModalService) {
  return {
    restrict: 'E',
    templateUrl: 'score-input-directive.html',
    scope: true,
    link: function($scope, $elem, $attr) {
      ModalService.register('score-input', $scope);
      angular.element($elem.children()[0]).on('hidden.bs.modal', function () {
        $scope.defer.resolve('closed score input');
      });

      $scope.init = function() {
        if(!$scope.context) { return; }
        console.log($scope.context);
        $scope.defer = $scope.context.defer;
        $scope.game = $scope.context.data.game;
        $scope.index = $scope.context.data.index;
        $scope.title = 'Hole ' + ($scope.context.data.index + 1);
      };

      $scope.$watch('context', function() {
        $scope.init();
      });

      $scope.incScore = function(subgame) {
        subgame.splits[$scope.index] += 1;
      };

      $scope.decScore = function(subgame) {
        subgame.splits[$scope.index] -= 1;
      };

      $scope.init();
    }
  };
};
directive.$inject = ['ModalService'];
module.exports = directive;