'use strict';

var directive = function() {
  return {
    restrict: 'E',
    templateUrl: 'panel-directive.html',
    transclude: {
      body: '?panelBody',
      list: '?panelList',
      table: '?panelTable'
    },
    scope: {
      title: '='
    },
    link: function($scope, $elem, $attr, $ctrl, $transclude) {
      $scope.contains = {
        body: function() { return $transclude.isSlotFilled('body'); },
        list: function() { return $transclude.isSlotFilled('list'); },
        table: function() { return $transclude.isSlotFilled('table'); }
      };
    }
  };
};
directive.$inject = [];
module.exports = directive;