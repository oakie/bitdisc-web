'use strict';

var Firebase = require('firebase');

var service = function(config, $q) {
  var ref = new Firebase(config.firebase.url);

  return {
    list: function() {
      var defer = $q.defer();
      ref.child('user').once('value').then(function(snapshot) {
        defer.resolve(snapshot.val());
      });
      return defer.promise;
    },
    get: function(id) {
      var defer = $q.defer();
      ref.child('user').child(id).once('value').then(function(snapshot) {
        defer.resolve(snapshot.val());
      });
      return defer.promise;
    }
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;