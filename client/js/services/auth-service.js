'use strict';

var Firebase = require('firebase');

var service = function(config, $q) {
  var ref = new Firebase(config.firebase.url);
  var listeners = [];
  var defer;

  ref.onAuth(function(auth) {
    console.log('auth service onauth', auth);
    if(defer && auth) {
      defer.resolve(auth);
    }
    for(var i = 0; i < listeners.length; ++i) {
      if(listeners[i]) {
        listeners[i](auth);
      }
    }
  });

  var get = function() {
    if(defer) {
      return defer.promise;
    }
    defer = $q.defer();
    var auth = ref.getAuth();
    if(auth) {
      defer.resolve(auth);
    }
    return defer.promise;
  };

  var signin = function () {
    ref.authWithOAuthPopup("google", function(error, auth) {
      if(error && error.code === 'TRANSPORT_UNAVAILABLE') {
        ref.authWithOAuthRedirect("google", function(error, auth) {
          console.log('error: ' + error);
          console.log('auth: ' + auth);
        }, { scope: 'email' });
      }
    }, { scope: 'email' });

  };

  var signout = function() {
    ref.unauth();
  };

  var onauth = function(callback) {
    listeners.push(callback);
  };

  return {
    get: get,
    signin: signin,
    signout: signout,
    onauth: onauth
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;