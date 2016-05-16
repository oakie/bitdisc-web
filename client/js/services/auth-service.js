'use strict';

var Firebase = require('firebase');

var service = function(config, $q) {
  var ref = new Firebase(config.firebase.url);
  var defer = $q.defer(); // will never resolve or reject, only notify on state change
  var auth = null;

  ref.onAuth(function(token) {
    console.log('auth service onauth', token);
    auth = token;
    defer.notify(auth);
  });

  var authenticate = function() {
    var d = $q.defer();
    onAuth(function(a) {
      if(a) { d.resolve(a); }
    });
    return d.promise;
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

  var onAuth = function(callback) {
    defer.promise.then(null, null, callback);
    defer.notify(auth);
  };

  return {
    authenticate: authenticate,
    signin: signin,
    signout: signout,
    onAuth: onAuth
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;