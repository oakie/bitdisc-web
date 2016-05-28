'use strict';

var service = function(config, $q, AuthService) {
  var ref = firebase.database().ref();

  var getUserTag = function(user) {
    if(user.name.indexOf(' ') === -1) {
      return user.name.toUpperCase();
    }
    var firstTriplet = user.name.substring(0, Math.min(3, user.name.indexOf(' ')));
    var x = user.name.lastIndexOf(' ') + 1;
    var lastTriplet = user.name.substring(x, Math.min(x+3, user.name.length));
    return (firstTriplet + lastTriplet).toUpperCase();
  };

  var list = function() {
    var defer = $q.defer();
    AuthService.authenticate().then(function(auth) {
      ref.child('user').once('value').then(function(snapshot) {
        var users = snapshot.val();
        for(var i = 0; i < users.length; ++i) {
          users[i].tag = getUserTag(users[i]);
        }
        defer.resolve(users);
      });
    });
    return defer.promise;
  };

  var get = function(id) {
    var defer = $q.defer();
    AuthService.authenticate().then(function(auth) {
      ref.child('user').child(id).once('value').then(function (snapshot) {
        var user = snapshot.val();
        user.tag = getUserTag(user);
        defer.resolve(user);
      });
    });
    return defer.promise;
  };

  var update = function(auth) {
    if(!auth) { return; }
    var data = auth.providerData[0];
    ref.child('user').orderByChild('email').equalTo(data.email).once('value', function(snap) {
      if(!snap.val()) {
        var newUser = ref.child('user').push();
        newUser.set({
          id: newUser.key,
          email: data.email,
          name: data.displayName,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    }, function(error) {
      console.log('error', error);
    });
  };

  var me = function() {
    var defer = $q.defer();
    ref.child('user').orderByChild('email').equalTo(data.email).once('value', function(snap) {
      defer.resolve(snap.val());
    });
    return defer.promise;
  };

  AuthService.onAuth('user-service', function(auth) {
    console.log('user service onauth', auth);
    update(auth);
  });

  return {
    list: list,
    get: get,
    update: update,
    me: me
  };
};
service.$inject = ['Config', '$q', 'AuthService'];
module.exports = service;
