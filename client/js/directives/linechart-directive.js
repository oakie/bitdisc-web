'use strict';
var Chart = require('chart.js');

var colors = ['228,26,28', '55,126,184', '77,175,74', '152,78,163', '255,127,0', '255,255,51'];

var directive = function($sce) {
  var generateLegend = function(datasets) {
    var str = '<ul class="list-inline">';
    for(var i = 0; i < datasets.length; ++i) {
      str += '<li><span class="glyphicon glyphicon-user" style="color: rgb(' + colors[i] + ');" /> ' + datasets[i].label + '</li>';
    }
    str += '</ul>';
    return str;
  };
  return {
    restrict: 'E',
    templateUrl: 'linechart-directive.html',
    scope: {
      data: '=',
      style: '@'
    },
    link: function($scope, $elem, $attr) {
      $scope.init = function() {
        $scope.container = $elem.find('canvas')[0].getContext('2d');
      };
      
      $scope.$watch('data', function() {
        if(!$scope.data) return;

        for(var i = 0; i < $scope.data.datasets.length; ++i) {
          var d = $scope.data.datasets[i];
          d.strokeColor = 'rgba(' + colors[i] + ',1)';
          d.pointColor = 'rgba(' + colors[i] + ',1)';
          d.pointStrokeColor = '#fff';
          d.pointHighlightFill = '#fff';
          d.pointHighlightStroke = 'rgba(' + colors[i] + ',1)';
        }

        $scope.line = new Chart($scope.container).Line($scope.data, {
          responsive: true,
          datasetFill: false,
          maintainAspectRatio: false,
          scaleShowLabels: true
        });

        $scope.legend = $sce.trustAsHtml(generateLegend($scope.data.datasets));
      });

      $scope.init();
    }
  };
};
directive.$inject = ['$sce'];
module.exports = directive;
