'use strict';

var express = require('express');
var config = require('./config');

var app = express();

app.use('/public/img', express.static('./public/img'));
app.use('/public/fonts', express.static('./public/fonts'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/html/index.html');
});
app.get('/public/js/bundle.js', function(req, res) {
  res.sendFile(__dirname + '/public/js/bundle' + (config.profile === 'dev' ? '' : '.min') + '.js');
});
app.get('/public/css/bundle.css', function(req, res) {
  res.sendFile(__dirname + '/public/css/bundle' + (config.profile === 'dev' ? '' : '.min') + '.css');
});

for(var i = 0; i < config.express.listen.length; ++i) {
  var x = config.express.listen[i];
  app.listen(x.port, x.host);
}
