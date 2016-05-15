'use strict';

var directive = function($location, ModalService, CourseService, UserService, GameService) {
  return {
    restrict: 'E',
    templateUrl: 'game-setup-directive.html',
    scope: true,
    link: function($scope, $elem, $attr) {
      ModalService.register('game-setup', $scope);
      angular.element($elem.children()[0]).on('hidden.bs.modal', function () {
        $scope.defer.resolve('closed game setup');
      });

      $scope.init = function() {
        if(!$scope.context) { return; }
        $scope.defer = $scope.context.defer;
        $scope.selectedPlayer = null;
        $scope.setup = {
          course: null,
          players: []
        };
        CourseService.list().then(function(courses) {
          $scope.courses = listify(courses);
        });
        UserService.list().then(function (users) {
          $scope.users = listify(users);
        });
      };

      $scope.$watch('context', function() {
        $scope.init();
      });

      $scope.proceed = function() {
        GameService.create($scope.setup).then(function(game) {
          $location.path('/game/' + game.id);
          ModalService.close();
        });
      };

      $scope.addPlayer = function(user) {
        if($scope.setup.players.indexOf(user) > -1) {
          return;
        }
        $scope.setup.players.push(user);
        $scope.selectedPlayer = null;
      };

      $scope.removePlayer = function(user) {
        var index = $scope.setup.players.indexOf(user);
        if(index > -1) {
          $scope.setup.players.splice(index, 1);
        }
      };

      var listify = function(items) {
        var list = [];
        $.each(items, function(key, value) {
          list.push(value);
        });
        return list;
      };

      $scope.init();
    }
  };
};
directive.$inject = ['$location', 'ModalService', 'CourseService', 'UserService', 'GameService'];
module.exports = directive;