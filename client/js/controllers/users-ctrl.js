'use strict';

var ctrl = function($scope, UtilService, UserService) {
  $scope.init = function() {
    UserService.list().then(function(items) {
      $scope.users = UtilService.listify(items);
    });
  };


  $scope.init();
};
ctrl.$inject = ['$scope', 'UtilService', 'UserService'];
module.exports = ctrl;