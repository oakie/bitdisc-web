'use strict';

var service = function(config, $q) {
  var modalScopes = {};
  return {
    openModal: function(context) {
      $('.modal').modal('hide'); // hide any already opened modals

      var defer = $q.defer();
      context.defer = defer;

      if(!modalScopes[context.id]) {
        console.log('unregistered modal scope: ' + context.id);
        return null;
      }

      modalScopes[context.id].context = context;
      defer.promise.then(function () {
        modalScopes[context.id].context = null;
      });

      console.log('openModal', modalScopes);
      $('#' + context.id + '-modal .modal').modal('show');

      return defer.promise;
    },
    registerModalScope: function (name, scope) {
      modalScopes[name] = scope;
    }
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;