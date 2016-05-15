'use strict';

var Firebase = require('firebase');

var service = function(config, $q, AuthService, CourseService, UserService) {
  var ref = new Firebase(config.firebase.url);

  var getGame = function(id) {
    var defer = $q.defer();
    ref.child('game').child(id).once('value').then(function (snapshot) {
      defer.resolve(snapshot.val());
    });
    return defer.promise;
  };

  var getSubgame = function(id) {
    var defer = $q.defer();
    ref.child('subgame').child(id).once('value').then(function (snapshot) {
      var subgame = snapshot.val();
      UserService.get(subgame.user).then(function (user) {
        subgame.user = user;
        defer.resolve(subgame);
      });
    });
    return defer.promise;
  };

  var getSubgames = function(ids) {
    var defer = $q.defer();
    var promises = [];
    for(var i = 0; i < ids.length; ++i) {
      promises.push(getSubgame(ids[i]));
    }

    $q.all(promises).then(function(items) {
      defer.resolve(items);
    });
    return defer.promise;
  };

  var populateGame = function(game) {
    var defer = $q.defer();
    var coursePromise = CourseService.get(game.course);
    var subgamePromise = getSubgames(game.subgames);

    $q.all([coursePromise, subgamePromise]).then(function(args) {
      game.course = args[0];
      game.subgames = args[1];
      defer.resolve(game);
    });
    return defer.promise;
  };

  var createSubgame = function(user, course) {
    var defer = $q.defer();
    AuthService.get().then(function(auth) {
      var subgame = ref.child('subgame').push();
      subgame.set({
        id: subgame.key(),
        user: user.id,
        splits: new Array(course.holes.length + 1).join('0').split('').map(parseFloat),
        timestamp: Firebase.ServerValue.TIMESTAMP
      });
      subgame.on('value', function(snapshot) {
        defer.resolve(snapshot.val());
      });
    });
    return defer.promise;
  };

  var list = function() {
    var defer = $q.defer();
    AuthService.get().then(function(auth) {
      ref.child('game').once('value').then(function(snapshot) {
        defer.resolve(snapshot.val());
      });
    });
    return defer.promise;
  };

  var get = function(id) {
    var defer = $q.defer();
    AuthService.get().then(function(auth) {
      getGame(id).then(function(game) {
        populateGame(game).then(function(game) {
          defer.resolve(game);
        });
      });
    });
    return defer.promise;
  };

  var create = function(setup) {
    console.log('create game: ', setup);
    var defer = $q.defer();
    AuthService.get().then(function(auth) {
      var promises = [];
      for(var i = 0; i < setup.players.length; ++i) {
        promises.push(createSubgame(setup.players[i], setup.course));
      }
      $q.all(promises).then(function(subgames) {
        var game = ref.child('game').push();

        var subs = [];
        for(var i = 0; i < subgames.length; ++i) {
          subs.push(subgames[i].id);
        }

        game.set({
          id: game.key(),
          course: setup.course.id,
          subgames: subs,
          start: Firebase.ServerValue.TIMESTAMP,
          timestamp: Firebase.ServerValue.TIMESTAMP
        });

        game.on('value', function(snapshot) {
          defer.resolve(snapshot.val());
        });
      });
    });
    return defer.promise;
  };

  return {
    list: list,
    get: get,
    create: create
  };
};
service.$inject = ['Config', '$q', 'AuthService', 'CourseService', 'UserService'];
module.exports = service;