'use strict';

var service = function(config, $q, UtilService, AuthService) {
  var ref = firebase.database().ref();

  var getUserTag = function(user) {
    if(user.name.indexOf(' ') === -1) {
      return user.name.toUpperCase();
    }
    var firstTriplet = user.name.substring(0, Math.min(3, user.name.indexOf(' ')));
    var x = user.name.lastIndexOf(' ') + 1;
    var lastTriplet = user.name.substring(x, Math.min(x + 3, user.name.length));
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

  var getFriends = function(user) {
    var defer = $q.defer();
    var promises = [];

    if(user.friends) {
      user.friends = UtilService.listify(user.friends);
      for(var i = 0; i < user.friends.length; ++i) {
        promises.push(get(user.friends[i]));
      }
    }

    $q.all(promises).then(function(items) {
      defer.resolve(items);
    });

    return defer.promise;
  };

  var populateUser = function(user) {
    var defer = $q.defer();
    user.tag = getUserTag(user);
    defer.resolve(user);
    return defer.promise;
  };

  var get = function(id) {
    var defer = $q.defer();
    AuthService.authenticate().then(function(auth) {
      ref.child('user').child(id).once('value').then(function(snapshot) {
        populateUser(snapshot.val()).then(function(user) {
          defer.resolve(user);
        });
      });
    });
    return defer.promise;
  };

  var update = function(auth) {
    if(!auth) {
      return;
    }
    var data = auth.providerData[0];
    ref.child('user').orderByChild('email').equalTo(data.email).once('value', function(snap) {
      var user = null;
      snap.forEach(function(child) {
        user = child.val();
      });

      if(!user) {
        var newUser = ref.child('user').push();
        newUser.set({
          id: newUser.key,
          email: data.email,
          name: data.displayName,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        ref.child('auth_map').child(auth.uid).set(newUser.key);
      } else {
        ref.child('auth_map').child(auth.uid).set(user.id);
      }
    }, function(error) {
      console.log('error', error);
    });
  };

  var me = function() {
    var defer = $q.defer();
    AuthService.authenticate().then(function(auth) {
      ref.child('auth_map').child(auth.uid).once('value', function(snap) {
        var id = snap.val();
        if(id) {
          get(id).then(function(user) {
            defer.resolve(user);
          });
        } else {
          console.log('unknown auth user', auth.uid);
          defer.reject();
        }
      });
    });
    return defer.promise;
  };

  var createGuest = function(me, guest) {
    var defer = $q.defer();
    var user = ref.child('user').push();
    user.set({
      id: user.key,
      email: guest.email,
      name: guest.name,
      guest_of: me.id,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }, function() {
      get(user.key).then(function(user) {
        defer.resolve(user);
      });
    });
    return defer.promise;
  };

  AuthService.onAuth('user-service', function(auth) {
    update(auth);
  });

  return {
    list: list,
    get: get,
    update: update,
    me: me,
    getFriends: getFriends,
    createGuest: createGuest
  };
};
service.$inject = ['Config', '$q', 'UtilService', 'AuthService'];
module.exports = service;
