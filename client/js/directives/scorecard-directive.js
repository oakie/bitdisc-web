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
          $scope.game = game;
        });
      };

      $scope.init();
    }
  };
};
directive.$inject = ['ModalService', 'GameService'];
module.exports = directive;