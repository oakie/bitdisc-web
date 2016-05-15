'use strict';

var service = function(config, $q) {
  var modalScopes = {};

  var open = function(context) {
    close(); // hide any already opened modals

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

    $('#' + context.id + '-modal .modal').modal('show');

    return defer.promise;
  };

  var register = function (name, scope) {
    modalScopes[name] = scope;
  };

  var close = function() {
    $('.modal').modal('hide');
  };

  return {
    open: open,
    register: register,
    close: close
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;