'use strict';

var Firebase = require('firebase');

var service = function(config, $q, CourseService, UserService) {
  var ref = new Firebase(config.firebase.url);

  var getGames = function() {
    var defer = $q.defer();
    ref.child('game').once('value').then(function(snapshot) {
      defer.resolve(snapshot.val());
    });
    return defer.promise;
  };

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

  return {
    list: getGames,
    get: function(id) {
      var defer = $q.defer();
      getGame(id).then(function(game) {
        populateGame(game).then(function(game) {
          defer.resolve(game);
        });
      });
      return defer.promise;
    }
  };
};
service.$inject = ['Config', '$q', 'CourseService', 'UserService'];
module.exports = service;