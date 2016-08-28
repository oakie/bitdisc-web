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
    return (firstTriplet + '\u200B' + lastTriplet).toUpperCase();
  };

  var dList = null;
  var list = function() {
    if(dList) {
      return dList.promise;
    }
    dList = $q.defer();
    var promises = [];

    AuthService.authenticate().then(function(auth) {
      ref.child('user').once('value').then(function(snapshot) {
        snapshot.forEach(function(user) {
          promises.push(populateUser(user.val()));
        });
        $q.all(promises).then(function(users) {
          dList.resolve(users);
        });
      });
    });
    return dList.promise;
  };

  var dFriends = null;
  var getFriends = function() {
    if(dFriends) {
      return dFriends.promise;
    }
    dFriends = $q.defer();
    var promises = [];

    me().then(function(me) {
      ref.child('friend_map').child(me.id).once('value').then(function(snapshot) {
        snapshot.forEach(function(child) {
          promises.push(get(child.key));
        });
        $q.all(promises).then(function(friends) {
          dFriends.resolve(friends);
        });
      });
    });
    return dFriends.promise;
  };

  var isFriend = function(user) {
    var defer = $q.defer();
    me().then(function(me) {
      ref.child('friend_map').child(me.id).child(user.id).once('value').then(function(snapshot) {
        defer.resolve(snapshot.val());
      });
    });
    return defer.promise;
  };

  var addFriend = function(friend) {
    var defer = $q.defer();
    me().then(function(me) {
      ref.child('friend_map').child(me.id).child(friend.id).set(true, function() {
        defer.resolve();
      });
    });
    return defer.promise;
  };

  var removeFriend = function(friend) {
    var defer = $q.defer();
    me().then(function(me) {
      ref.child('friend_map').child(me.id).child(friend.id).remove(function() {
        defer.resolve();
      });
    });
    return defer.promise;
  };

  var populateUser = function(user) {
    var defer = $q.defer();
    user.tag = getUserTag(user);
    // isFriend(user).then(function(x) {
    //   user.isFriend = x;
    //   console.log(user);
      defer.resolve(user);
    // });
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
    ref.child('user').orderByChild('email').equalTo(data.email).once('value').then(function(snap) {
      var user = null;
      snap.forEach(function(child) {
        user = child.val();
      });

      if(!user) {
        var newUser = ref.child('user').push();
        ref.child('auth_map').child(auth.uid).set(newUser.key);
        newUser.set({
          id: newUser.key,
          email: data.email,
          name: data.displayName,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      } else {
        ref.child('auth_map').child(auth.uid).set(user.id);
        ref.child('user').child(user.id).update({
          guest_of: null,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    }, function(error) {
      console.log('error', error);
    });
  };

  var dMe = null;
  var me = function() {
    if(dMe) {
      return dMe.promise;
    }
    dMe = $q.defer();

    AuthService.authenticate().then(function(auth) {
      ref.child('auth_map').child(auth.uid).once('value').then(function(snap) {
        var id = snap.val();
        if(id) {
          get(id).then(function(user) {
            dMe.resolve(user);
          });
        } else {
          console.log('unknown auth user', auth.uid);
          dMe.reject();
        }
      });
    });
    return dMe.promise;
  };

  var createGuest = function(guest) {
    var defer = $q.defer();
    me().then(function(me) {
      var user = ref.child('user').push();
      user.set({
        id: user.key,
        email: guest.email,
        name: guest.name,
        guest_of: me.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(function() {
        get(user.key).then(function(user) {
          defer.resolve(user);
        });
      });
    });
    return defer.promise;
  };

  var reset = function() {
    dMe = null;
    dList = null;
    dFriends = null;
  };

  AuthService.onAuth('user-service', function(auth) {
    //reset();
    update(auth);
  });

  return {
    list: list,
    get: get,
    update: update,
    me: me,
    getFriends: getFriends,
    isFriend: isFriend,
    addFriend: addFriend,
    removeFriend: removeFriend,
    createGuest: createGuest
  };
};
service.$inject = ['Config', '$q', 'UtilService', 'AuthService'];
module.exports = service;
