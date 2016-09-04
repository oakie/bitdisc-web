'use strict';

var ctrl = function($scope, UtilService, UserService, CourseService, GameService, ModalService) {
  $scope.me = null;
  $scope.limit = {
    games: 5,
    friends: 10,
    courses: 5
  };

  $scope.init = function() {
    UserService.me().then(function(user) {
      $scope.me = user;
      GameService.userGames($scope.me).then(function(items) {
        $scope.games = UtilService.listify(items);
      });
    });
    UserService.getFriends().then(function(friends) {
      if(friends.length > 0) {
        $scope.friends = friends;
      }
    });
    UserService.list().then(function(items) {
      $scope.users = UtilService.listify(items);
    });
    CourseService.list().then(function(items) {
      $scope.courses = UtilService.listify(items);
    });
  };

  $scope.openGameSetupModal = function() {
    var context = {id: 'game-setup', data: {}};
    ModalService.open(context).then(function(val) {
      console.log(val);
    });
  };

  $scope.openGuestSetupModal = function() {
    var context = {id: 'guest-setup', data: {}};
    ModalService.open(context).then(function(val) {
      console.log(val);
      if(val) {
        $scope.friends.push(val);
      }
    });
  };

  $scope.init();
};
ctrl.$inject = ['$scope', 'UtilService', 'UserService', 'CourseService', 'GameService', 'ModalService'];
module.exports = ctrl;