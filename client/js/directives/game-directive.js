'use strict';

var directive = function(GameService) {
  return {
    restrict: 'E',
    templateUrl: 'game-directive.html',
    scope: {
      game: '=object'
    },
    link: function($scope, $elem, $attr) {
      $scope.init = function() {};

      $attr.$observe('object', function() {
        GameService.get($scope.game.id).then(function(game) {
          $scope.game = game;
        });
      });

      $scope.init();
    }
  };
};
directive.$inject = ['GameService'];
module.exports = directive;