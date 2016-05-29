'use strict';

var service = function() {
  var listify = function(items) {
    var list = [];
    $.each(items, function(key, value) {
      list.push(value);
    });
    return list;
  };

  return {
    listify: listify
  };
};
service.$inject = [];
module.exports = service;
