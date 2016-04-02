'use strict';

var Firebase = require('firebase');

var service = function(config, $q) {
  var ref = new Firebase(config.firebase.url);
  var token = null;

  return {
    get: function() {
      return token;
    },
    signin: function() {
      var defer = $q.defer();
      ref.authWithOAuthPopup('google', function(error, auth) {
        if(error) {
          console.log('Sign in failed: ', error);
          defer.reject();
        } else {
          defer.resolve(auth);
        }
      }, { scope: 'email' });
      return defer.promise;
    }
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;