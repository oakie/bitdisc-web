'use strict';
var Chart = require('chart.js');

var ctrl = function($scope, $routeParams, UserService, CourseService, GameService, ModalService) {
  $scope.game = null;
  $scope.params = $routeParams;
  $scope.chart = {};
  $scope.pars = [];

  GameService.get($scope.params.id).then(function(game) {
    $scope.game = game;
  });

  $scope.init = function() {
    if(!$scope.game) {
      return;
    }
    generateCharts($scope.game);
  };

  $scope.$watch('game', function() {
    $scope.init();
  }, true);

  var generateCharts = function(game) {
    var acc = {};
    acc.labels = [''];
    for(var i = 0; i < game.course.holes.length; ++i) {
      acc.labels.push(i + 1);
    }

    acc.datasets = [];
    for(var i = 0; i < game.subgames.length; ++i) {
      var sub = game.subgames[i];

      var d = [0];
      for(var j = 0; j < sub.splits.length; ++j) {
        d.push(d[d.length - 1] + sub.splits[j]);
      }

      var data = {
        label: sub.user.name,
        data: d
      };

      acc.datasets.push(data);
    }

    $scope.chart.acc = acc;
  };

  $scope.openGameOptionsModal = function() {
    ModalService.open({id: 'game-options', game: $scope.game});
  };

  $scope.$on('game-update', function(game) {
    if(game.id !== $scope.params.id) {
      return;
    }
    $scope.game = game;
  });

  $scope.init();
};
ctrl.$inject = ['$scope', '$routeParams', 'UserService', 'CourseService', 'GameService', 'ModalService'];
module.exports = ctrl;