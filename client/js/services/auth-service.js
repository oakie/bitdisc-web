'use strict';

var service = function(config, $q) {
  var providers = {
    google: new firebase.auth.GoogleAuthProvider(),
    facebook: new firebase.auth.FacebookAuthProvider()
  };
  providers.google.addScope('email');
  providers.facebook.addScope('email');

  var auth = firebase.auth();
  var token = null;
  var authStateListeners = {};
  var queue = [];

  auth.onAuthStateChanged(function(user) {
    console.log('auth service state changed', user);
    token = user;

    for(var key in authStateListeners) {
      if(authStateListeners.hasOwnProperty(key)) {
        authStateListeners[key](token);
      }
    }
    if(token) {
      for(var i = 0; i < queue.length; ++i) {
        queue[i].resolve(token);
      }
      queue = [];
    }
  });

  var authenticate = function() {
    var d = $q.defer();
    if(token) {
      d.resolve(token);
    } else {
      queue.push(d);
    }
    return d.promise;
  };

  var signin = function(provider) {
    auth.signInWithPopup(providers[provider]).then(null, function(error) {
      if(error && error.code === 'TRANSPORT_UNAVAILABLE') {
        auth.signInWithRedirect(providers[provider]).then(null, function(error) {
          console.log('error: ' + error);
        });
      }
    });
  };

  var signout = function() {
    auth.signOut();
  };

  var onAuth = function(id, callback) {
    authStateListeners[id] = callback;
    callback(token);
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