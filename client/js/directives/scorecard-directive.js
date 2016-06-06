'use strict';

var directive = function(ModalService, GameService) {
  return {
    restrict: 'E',
    templateUrl: 'scorecard-directive.html',
    scope: {
      game: '=object',
      editable: '=?'
    },
    link: function($scope, $elem, $attr) {
      $scope.init = function() {
        $scope.editable = $scope.editable || false;
        $scope.pars = calcAccumulatedPar($scope.game.course.holes);
      };

      $scope.openScoreInputModal = function(index) {
        if(!$scope.editable) {
          return;
        }
        var context = {id: 'score-input', data: {game: $scope.game, index: index}};
        ModalService.open(context).then(function(val) {
          console.log(val);
        });
      };

      $scope.finish = function() {
        GameService.finish($scope.game).then(function(game) {
          $scope.$emit('message', {event: 'game-update', data: game});
        });
      };

      $scope.totalDiffFromPar = function(splits, index) {
        var p = 0;
        for(var i = 0; i <= index; ++i) {
          p += splits[i];
        }
        return p - $scope.pars[index];
      };

      var calcAccumulatedPar = function(holes) {
        if(!holes || holes.length === 0) { return []; }
        var p = [holes[0].par];
        for(var i = 1; i < holes.length; ++i) {
          p.push(p[p.length - 1] + holes[i].par);
        }
        return p;
      };


      $scope.init();
    }
  };
};
directive.$inject = ['ModalService', 'GameService'];
module.exports = directive;