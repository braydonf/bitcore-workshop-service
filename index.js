'use strict';

var bitcore = require('bitcore-lib');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

function Workshop(options) {
  EventEmitter.call(this);

  this.node = options.node;
  this.receivingAddress = options.receivingAddress;
}

Workshop.dependencies = ['bitcoind', 'web'];

Workshop.prototype.getServiceURL = function() {
  var url = this.node.https ? 'https://' : 'http://';
  url += 'localhost';
  url += (this.node.port === 80) ? '' : ':' + this.node.port + '/';
  url += this.getRoutePrefix() ? this.getRoutePrefix() + '/' : '';
  return url;
};

Workshop.prototype.start = function(callback) {
  if (!this.receivingAddress) {
    return callback(new Error('receivingAddress has not been defined'));
  }
  this.node.log.info('Workshop Service started at:', this.getServiceURL());
  setImmediate(callback);
};

Workshop.prototype.stop = function(callback) {
  setImmediate(callback);
};

Workshop.prototype.setupRoutes = function(app, express) {
  var self = this;
  app.set('views', path.resolve(__dirname, './views'));
  app.engine('ejs', require('ejs').__express);
  app.use('/static', express.static(path.resolve(__dirname, './static')));
  app.get('/', function(req, res) {
    res.render('index.ejs', { 
      receivingAddress: self.receivingAddress,
      baseUrl: self.getServiceURL()
    });
  });
};

Workshop.prototype.getRoutePrefix = function() {
  return 'workshop';
};

Workshop.prototype.getAPIMethods = function() {
  return [];
};

Workshop.prototype.getPublishEvents = function() {
  return [];
};

module.exports = Workshop;
