'use strict';

var Firebase = require('firebase');

var service = function(config, $q) {
  var ref = new Firebase(config.firebase.url);

  var getCourses = function() {
    var defer = $q.defer();
    ref.child('course').once('value').then(function(snapshot) {
      defer.resolve(snapshot.val());
    });
    return defer.promise;
  };

  var getCourse = function(id) {
    var defer = $q.defer();
    ref.child('course').child(id).once('value').then(function (snapshot) {
      defer.resolve(snapshot.val());
    });
    return defer.promise;
  };

  var getHole = function(id) {
    var defer = $q.defer();
    ref.child('hole').child(id).once('value').then(function (snapshot) {
      defer.resolve(snapshot.val());
    });
    return defer.promise;
  };

  var getHoles = function(ids) {
    var defer = $q.defer();
    var promises = [];
    for(var i = 0; i < ids.length; ++i) {
      promises.push(getHole(ids[i]));
    }
    $q.all(promises).then(function(items) {
      defer.resolve(items);
    });
    return defer.promise;
  };

  var populateCourse = function(course) {
    var defer = $q.defer();
    var holePromise = getHoles(course.holes);

    $q.all([holePromise]).then(function(args) {
      course.holes = args[0];
      defer.resolve(course);
    });
    return defer.promise;
  };

  return {
    list: getCourses,
    get: function(id) {
      var defer = $q.defer();
      getCourse(id).then(function(course) {
        populateCourse(course).then(function(course) {
          defer.resolve(course);
        })
      });
      return defer.promise;
    }
  };
};
service.$inject = ['Config', '$q'];
module.exports = service;