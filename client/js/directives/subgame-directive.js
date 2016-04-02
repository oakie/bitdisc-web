'use strict';

var directive = function() {
  return {
    restrict: 'E',
    templateUrl: 'subgame-directive.html',
    scope: {
      subgame: '=object'
    },
    link: function($scope, $elem, $attr) {
      $scope.init = function() {
        $scope.avatar = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/1772/ninja-simple-512.png';
      };

      $attr.$observe('object', function() {
        if($scope.subgame.user.avatar) {
          $scope.avatar = 'data:image/png;base64,' + $scope.subgame.user.avatar;
        }
      });

      $scope.init();
    }
  };
};
directive.$inject = [];
module.exports = directive;