'use strict';

var filter = function() {
  return function(input, index) {
    return input[index];
  };
};
filter.$inject = [];
module.exports = filter;