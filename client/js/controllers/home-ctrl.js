'use strict';

var ctrl = function($scope, UtilService, UserService, CourseService, GameService, ModalService) {
  $scope.init = function() {
    UserService.list().then(function(items) {
      $scope.users = UtilService.listify(items);
    });
    CourseService.list().then(function(items) {
      $scope.courses = UtilService.listify(items);
    });
    GameService.list().then(function(items) {
      $scope.games = UtilService.listify(items);
    });
  };

  $scope.openGameSetupModal = function() {
    var context = {id: 'game-setup', data: {}};
    var gameSetupPromise = ModalService.open(context);
    gameSetupPromise.then(function (val) {
      console.log(val);
    });
  };

  $scope.init();
};
ctrl.$inject = ['$scope', 'UtilService', 'UserService', 'CourseService', 'GameService', 'ModalService'];
module.exports = ctrl;