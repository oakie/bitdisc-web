'use strict';

var directive = function($location, UtilService, ModalService, CourseService, UserService) {
  return {
    restrict: 'E',
    templateUrl: 'user-select-directive.html',
    scope: true,
    link: function($scope, $elem, $attr) {
      ModalService.register('user-select', $scope);

      $scope.init = function() {
        if(!$scope.context) {
          return;
        }
        $scope.userFilter = '';
        UserService.list().then(function(users) {
          $scope.users = UtilService.listify(users);
          $scope.selected = {};
          for(var i = 0; i < $scope.users.length; ++i) {
            $scope.selected[$scope.users[i].id] = false;
          }

          var s = $scope.context.data.selected;
          for(var i = 0; i < s.length; ++i) {
            $scope.selected[s[i].id] = true;
          }
        });
      };

      $scope.$watch('context', function() {
        $scope.init();
      });

      $scope.proceed = function() {
        var list = [];
        for(var i = 0; i < $scope.users.length; ++i) {
          if($scope.selected[$scope.users[i].id]) {
            list.push($scope.users[i]);
          }
        }
        ModalService.close(UtilService.values(list));
      };

      $scope.cancel = function() {
        ModalService.close();
      };

      $scope.init();
    }
  };
};
directive.$inject = ['$location', 'UtilService', 'ModalService', 'CourseService', 'UserService', 'GameService'];
module.exports = directive;