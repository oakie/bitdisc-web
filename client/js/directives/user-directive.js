'use strict';

var directive = function() {
  return {
    restrict: 'E',
    templateUrl: 'user-directive.html',
    transclude: {
      left: '?left',
      right: '?right'
    },
    scope: {
      user: '=object'
    },
    link: function($scope, $elem, $attr, $ctrl, $transclude) {
      $scope.contains = {
        left: function() {
          return $transclude.isSlotFilled('left');
        },
        right: function() {
          return $transclude.isSlotFilled('right');
        }
      };

      $scope.init = function() {
        $scope.avatar = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/1772/ninja-simple-512.png';
      };

      $attr.$observe('object', function() {
        if($scope.user.avatar) {
          $scope.avatar = 'data:image/png;base64,' + $scope.user.avatar;
        }
      });

      $scope.init();
    }
  };
};
directive.$inject = [];
module.exports = directive;