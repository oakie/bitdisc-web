'use strict';

var ctrl = function($scope, UtilService, CourseService) {
  $scope.init = function() {
    CourseService.list().then(function(items) {
      $scope.courses = UtilService.listify(items);
    });
  };
  $scope.init();
};
ctrl.$inject = ['$scope', 'UtilService', 'CourseService'];
module.exports = ctrl;