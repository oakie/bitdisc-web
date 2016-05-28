'use strict';

var directive = function($q, ModalService, GameService) {
  return {
    restrict: 'E',
    templateUrl: 'score-input-directive.html',
    scope: true,
    link: function($scope, $elem, $attr) {
      ModalService.register('score-input', $scope);
      angular.element($elem.children()[0]).on('hidden.bs.modal', function () {
        var promises = [];
        for(var i = 0; i < $scope.game.subgames.length; ++i) {
          promises.push(GameService.updateSplit($scope.game.subgames[i], $scope.index));
        }
        $q.all(promises).then(function() {
          $scope.defer.resolve('closed score input');
        });
      });

      $scope.init = function() {
        if(!$scope.context) { return; }
        $scope.defer = $scope.context.defer;
        $scope.game = $scope.context.data.game;
        $scope.index = $scope.context.data.index;
        $scope.title = 'Hole ' + ($scope.context.data.index + 1);
        $scope.par = $scope.game.course.holes[$scope.index].par;
        $scope.distance = $scope.game.course.holes[$scope.index].distance;
      };

      $scope.$watch('context', function() {
        $scope.init();
      });

      $scope.incScore = function(subgame) {
        if(subgame.splits[$scope.index] === 0 && $scope.par !== 0) {
          subgame.splits[$scope.index] = $scope.par;
        } else {
          subgame.splits[$scope.index] += 1;
        }
      };

      $scope.decScore = function(subgame) {
        if(subgame.splits[$scope.index] > 0) {
          subgame.splits[$scope.index] -= 1;
        }
      };

      $scope.init();
    }
  };
};
directive.$inject = ['$q', 'ModalService', 'GameService'];
module.exports = directive;
