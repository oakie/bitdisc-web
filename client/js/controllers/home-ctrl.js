'use strict';

var ctrl = function($scope, UserService, CourseService, GameService, ModalService) {
  $scope.init = function() {
    UserService.list().then(function(items) {
      $scope.users = listify(items);
    });
    CourseService.list().then(function(items) {
      $scope.courses = listify(items);
    });
    GameService.list().then(function(items) {
      $scope.games = listify(items);
    });
  };

  $scope.openGameSetupModal = function() {
    var context = {id: 'game-setup', data: {}};
    var gameSetupPromise = ModalService.openModal(context);
    gameSetupPromise.then(function (val) {
      console.log(val);
    });
  };

  var listify = function(items) {
    var list = [];
    $.each(items, function(key, value) {
      list.push(value);
    });
    return list;
  };

  $scope.init();
};
ctrl.$inject = ['$scope', 'UserService', 'CourseService', 'GameService', 'ModalService'];
module.exports = ctrl;