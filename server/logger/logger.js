const Logger = function() {};

Logger.prototype.info = function(logText) {
  console.log(new Date().toISOString()+' [info]:::::'+logText);
};

Logger.prototype.debug = function(logText) {
  console.log(new Date().toISOString()+' [debug]:::::'+logText);
};

Logger.prototype.error = function(logText) {
  console.log(new Date().toISOString()+' [error]:::::'+logText);
};

module.exports = new Logger();
