'use strict';

var directive = function(GameService) {
  return {
    restrict: 'E',
    templateUrl: 'scorecard-directive.html',
    scope: {
      game: '=object'
    },
    link: function($scope, $elem, $attr) {
      $scope.init = function() {};

      $attr.$observe('game', function() {});

      $scope.init();
    }
  };
};
directive.$inject = ['GameService'];
module.exports = directive;