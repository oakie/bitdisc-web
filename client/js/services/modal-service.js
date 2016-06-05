'use strict';

var service = function(config, $q) {
  var modals = {};
  var chain = [];
  var backdrop = null;

  var open = function(context) {
    if(!modals[context.id]) {
      console.log('unregistered modal scope: ' + context.id);
      return null;
    }

    if(chain.length > 0) {
      modals[chain[chain.length - 1]].elem.modal('hide');
    } else {
      backdrop = $('<div class="modal-backdrop fade in"></div>').appendTo(document.body);
    }

    var defer = $q.defer();
    context.defer = defer;

    chain.push(context.id);
    modals[context.id].scope.context = context;
    defer.promise.then(function() {
      modals[context.id].scope.context = null;
      chain.pop();
      if(chain.length > 0) {
        show(chain[chain.length - 1]);
      } else if(backdrop) {
        backdrop.remove();
      }
    });
    show(context.id);

    return defer.promise;
  };

  var register = function (id, scope) {
    var elem = $('#' + id + '-modal .modal');
    elem.click(function(event) {
      event.stopPropagation();
      close();
    });
    elem.find('.modal-dialog').click(function(event) {
      event.stopPropagation();
    });
    modals[id] = {scope: scope, elem: elem};
  };

  var close = function(result) {
    hide();
    modals[chain[chain.length - 1]].scope.context.defer.resolve(result);
  };

  var show = function(id) {
    modals[id].elem.modal({backdrop: false, keyboard: false});
  };

  var hide = function() {
    modals[chain[chain.length - 1]].elem.modal('hide');
  };

  return {
    open: open,
    register: register,
    close: close
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;