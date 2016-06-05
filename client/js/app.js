'use strict';

window.$ = window.jQuery = require('jquery');
require('bootstrap');
var config = require('../../config.js');
var angular = require('angular');
require('angular-route');

require('firebase');
firebase.initializeApp(config.firebase);

var app = angular.module('app', ['ngRoute', 'templates-bitdisc', 'filters']);
var filters = angular.module('filters', []);

/* Configuration */
app.constant('VERSION', require('../../package.json').version);
app.constant('Config', config);

/* Routes */
app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeCtrl'
  })
  .when('/games', {
    templateUrl: 'games.html',
    controller: 'GamesCtrl'
  })
  .when('/game/:id', {
    templateUrl: 'game.html',
    controller: 'GameCtrl'
  })
  .when('/courses', {
    templateUrl: 'courses.html',
    controller: 'CoursesCtrl'
  })
  .when('/course/:id', {
    templateUrl: 'course.html',
    controller: 'CourseCtrl'
  })
  .when('/users', {
    templateUrl: 'users.html',
    controller: 'UsersCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});

/* Services */
app.factory('AuthService', require('./services/auth-service'));
app.factory('UtilService', require('./services/util-service'));
app.factory('UserService', require('./services/user-service'));
app.factory('CourseService', require('./services/course-service'));
app.factory('GameService', require('./services/game-service'));
app.factory('ModalService', require('./services/modal-service'));

/* Directives */
app.directive('user', require('./directives/user-directive'));
app.directive('course', require('./directives/course-directive'));
app.directive('game', require('./directives/game-directive'));
app.directive('hole', require('./directives/hole-directive'));
app.directive('scorecard', require('./directives/scorecard-directive'));
app.directive('scoreinput', require('./directives/score-input-directive'));
app.directive('gamesetup', require('./directives/game-setup-directive'));
app.directive('guestsetup', require('./directives/guest-setup-directive'));
app.directive('gameoptions', require('./directives/game-options-directive'));
app.directive('panel', require('./directives/panel-directive'));
app.directive('linechart', require('./directives/linechart-directive'));
app.directive('glyph', require('./directives/glyphicon-directive'));

/* Controllers */
app.controller('NavCtrl', require('./controllers/nav-ctrl'));
app.controller('HomeCtrl', require('./controllers/home-ctrl'));
app.controller('GamesCtrl', require('./controllers/games-ctrl'));
app.controller('GameCtrl', require('./controllers/game-ctrl'));
app.controller('CoursesCtrl', require('./controllers/courses-ctrl'));
app.controller('CourseCtrl', require('./controllers/course-ctrl'));
app.controller('UsersCtrl', require('./controllers/users-ctrl'));

/* Filters */
filters.filter('getat', require('./filters/getat-filter'));
