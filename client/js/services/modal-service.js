'use strict';

var service = function(config, $q) {
  var modals = {};

  var open = function(context) {
    close(); // hide any already opened modals

    var defer = $q.defer();
    context.defer = defer;

    if(!modals[context.id]) {
      console.log('unregistered modal scope: ' + context.id);
      return null;
    }

    modals[context.id].scope.context = context;
    defer.promise.then(function () {
      modals[context.id].scope.context = null;
    });
    modals[context.id].elem.modal('show');

    return defer.promise;
  };

  var register = function (name, scope) {
    modals[name] = {scope: scope, elem: $('#' + name + '-modal .modal')};
  };

  var close = function() {
    for (var key in modals) {
      if (modals.hasOwnProperty(key)) {
        modals[key].elem.modal('hide');
      }
    }
  };

  return {
    open: open,
    register: register,
    close: close
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;