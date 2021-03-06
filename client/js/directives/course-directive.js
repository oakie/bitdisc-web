'use strict';

var directive = function() {
  return {
    restrict: 'E',
    templateUrl: 'course-directive.html',
    scope: {
      course: '=object'
    },
    link: function($scope, $elem, $attr) {
      $scope.init = function() {
      };

      $attr.$observe('object', function() {
      });

      $scope.init();
    }
  };
};
directive.$inject = [];
module.exports = directive;