'use strict';

var directive = function(ModalService) {
  return {
    restrict: 'E',
    templateUrl: 'scorecard-directive.html',
    scope: {
      game: '=object',
      editable: '=?'
    },
    link: function($scope, $elem, $attr) {
      $scope.init = function() {
        $scope.editable = $scope.editable || false;
      };

      $attr.$observe('game', function() {});

      $scope.openScoreInputModal = function(index) {
        if($scope.editable) {
          var context = {id: 'score-input', data: {game: $scope.game, index: index}};
          ModalService.open(context).then(function (val) {
            console.log(val);
          });
        }
      };
      
      $scope.init();
    }
  };
};
directive.$inject = ['ModalService'];
module.exports = directive;