'use strict';

var ctrl = function($scope, UtilService, ModalService, GameService) {
  $scope.init = function() {
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
ctrl.$inject = ['$scope', 'UtilService', 'ModalService', 'GameService'];
module.exports = ctrl;