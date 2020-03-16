const util = require('util');

var prettyPrintResponse = (response) => {
  console.log(util.inspect(response, { colors: true, depth: 4 }));
};

module.exports = prettyPrintResponse;