'use strict';

var directive = function($location, UtilService, ModalService, CourseService, UserService, GameService) {
  return {
    restrict: 'E',
    templateUrl: 'game-setup-directive.html',
    scope: true,
    link: function($scope, $elem, $attr) {
      ModalService.register('game-setup', $scope);

      $scope.init = function() {
        if(!$scope.context) {
          return;
        }
        $scope.selectedPlayer = null;
        $scope.setup = {
          course: null,
          players: []
        };
        CourseService.list().then(function(courses) {
          $scope.courses = UtilService.listify(courses);
        });
        UserService.list().then(function(users) {
          $scope.users = UtilService.listify(users);
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

      $scope.cancel = function() {
        ModalService.close();
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

      $scope.addGuest = function() {
        var context = {id: 'guest-setup', data: {}};
        ModalService.open(context).then(function(guest) {
          console.log('game setup new guest: ', guest);
          if(guest) {
            $scope.addPlayer(guest);
          }
        });
      };

      $scope.init();
    }
  };
};
directive.$inject = ['$location', 'UtilService', 'ModalService', 'CourseService', 'UserService', 'GameService'];
module.exports = directive;