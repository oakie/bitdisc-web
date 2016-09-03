'use strict';

var service = function() {
  var listify = function(items) {
    var list = [];
    $.each(items, function(key, value) {
      list.push(value);
    });
    return list;
  };

  var keys = function(dict) {
    var keys = [];
    for(var key in dict) {
      if(dict.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  var values = function(dict) {
    var values = [];
    for(var key in dict) {
      if(dict.hasOwnProperty(key)) {
        values.push(dict[key]);
      }
    }
    return values;
  };

  return {
    listify: listify,
    keys: keys,
    values: values
  };
};
service.$inject = [];
module.exports = service;
