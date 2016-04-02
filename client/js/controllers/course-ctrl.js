'use strict';

var ctrl = function($scope, $routeParams, UserService, CourseService, GameService) {
  $scope.init = function() {
    $scope.params = $routeParams;

    CourseService.get($scope.params.id).then(function(course) {
      $scope.course = course;

      $scope.par = 0;
      $scope.distance = 0;
      for(var i = 0; i < $scope.course.holes.length; ++i) {
        $scope.par += $scope.course.holes[i].par;
        $scope.distance += $scope.course.holes[i].distance;
      }
    });
  };

  $scope.init();
};
ctrl.$inject = ['$scope', '$routeParams', 'UserService', 'CourseService', 'GameService'];
module.exports = ctrl;