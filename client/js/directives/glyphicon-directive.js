'use strict';

var directive = function() {
  return {
    restrict: 'E',
    template: '<span class="glyphicon glyphicon-{{ name }}" aria-hidden="true" />',
    scope: {
      name: '@'
    }
  };
};
directive.$inject = [];
module.exports = directive;