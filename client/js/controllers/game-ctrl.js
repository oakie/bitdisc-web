'use strict';
var Chart = require('chart.js');

var ctrl = function($scope, $routeParams, UserService, CourseService, GameService) {
  $scope.init = function() {
    $scope.params = $routeParams;
    $scope.chart = {};

    GameService.get($scope.params.id).then(function(game) {
      $scope.game = game;

      for(var i = 0; i < game.subgames.length; ++i) {
        var subgame = game.subgames[i];
        subgame.score = 0;
        if (subgame.splits) {
          for(var j = 0; j < subgame.splits.length; ++j) {
            subgame.score += subgame.splits[j];
          }
        }
      }

      generateCharts(game);
    });
  };

  var generateCharts = function(game) {
    var acc = {};
    acc.labels = [''];
    for(var i = 0; i < game.course.holes.length; ++i) {
      acc.labels.push(i+1);
    }

    acc.datasets = [];
    for(var i = 0; i < game.subgames.length; ++i) {
      var sub = game.subgames[i];

      var d = [0];
      for(var j = 0; j < sub.splits.length; ++j) {
        d.push(d[d.length-1] + sub.splits[j]);
      }

      var data = {
        label: sub.user.name,
        data: d
      };

      acc.datasets.push(data);
    }

    $scope.chart.acc = acc;
  };

  $scope.init();
};
ctrl.$inject = ['$scope', '$routeParams', 'UserService', 'CourseService', 'GameService'];
module.exports = ctrl;