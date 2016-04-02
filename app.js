'use strict';

var express = require('express');
var config = require('./config');

var app = express();

app.use('/public/js', express.static('./public/js'));
app.use('/public/css', express.static('./public/css'));
app.use('/public/img', express.static('./public/img'));
app.use('/public/fonts', express.static('./public/fonts'));
app.use('/public/html', express.static('./public/html'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/html/index.html');
});

for(var i = 0; i < config.express.listen.length; ++i) {
  var x = config.express.listen[i];
  app.listen(x.port, x.host);
}
