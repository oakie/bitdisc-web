'use strict';

var service = function(config, $q) {
  var provider = new firebase.auth.GoogleAuthProvider();
  var auth = firebase.auth();
  var defer = $q.defer(); // will never resolve or reject, only notify on state change
  var token = null;

  auth.onAuthStateChanged(function(user) {
    console.log('auth service state changed', user);
    token = user;
    defer.notify(token);
  });

  var authenticate = function() {
    var d = $q.defer();
    onAuth(function(a) {
      if(a) { d.resolve(a); }
    });
    return d.promise;
  };

  var signin = function() {
    auth.signInWithPopup(provider).then(null, function(error) {
      if(error && error.code === 'TRANSPORT_UNAVAILABLE') {
        auth.signInWithRedirect(provider).then(null, function(error) {
          console.log('error: ' + error);
        });
      }
    });
  };

  var signout = function() {
    auth.signOut();
  };

  var onAuth = function(callback) {
    defer.promise.then(null, null, callback);
    defer.notify(token);
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