
/**
 * Module dependencies.
 */

var _ = require('underscore'),
    jsdom = require('jsdom'),
    async = require('async');

/**
 * Expose `sanitize`.
 */

exports = module.exports = sanitize;

/**
 * Expose `Sanitizer`.
 */

exports.Sanitizer = Sanitizer;

/**
 * jQuery
 */

var jquery = '../vendor/jquery.js';

/**
 * Sanitize `input` and return result via `cb`.
 *
 * @param {String} input
 * @param {Object} opts
 *   - allowedElements: Allowed element's names.
 *   - allowedAttributes: Allowed attribute's names.
 * @param {Function} cb
 * @api public
 */

function sanitize(input, opts, cb) {
  switch (arguments.length) {
    case 3:
    return new Sanitizer(input, opts).sanitize(cb);
    case 2:
    return new Sanitizer(input).sanitize(cb);
    default:
    throw new Error('wrong singature');
  }
}

/**
 * Initialize a new `Sanitizer`.
 * 
 * @param {String} input html string.
 * @param {Object} opts options
 * @api public
 */

function Sanitizer(input, opts) {
  if (!(this instanceof Sanitizer)) { return new Sanitizer.apply(this, arguments); }
  this.input = input;
  this.parseOpts(opts);
}

/**
 * Initialize `opts`.
 * 
 * @param {Object} opts
 * @api private
 */

Sanitizer.prototype.parseOpts = function(opts) {
  opts = opts || {};
  this.allowedElements = {};
  this.allowedAttributes = {};
  if (opts.allowedElements) { this.initializeOpt(opts, 'allowedElements'); }
  if (opts.allowedAttributes) { this.initializeOpt(opts, 'allowedAttributes'); }
};

/**
 * Initialize options.
 * 
 * @param {Object} opts
 * @param {String} optName
 * @api private
 */

Sanitizer.prototype.initializeOpt = function(opts, optName) {
  if (_.isArray(opts[optName])) {
    opts[optName].forEach(function(elt) { this[optName][elt] = true; }.bind(this));
  } else if (_.isObject(opts[optName])) {
    this[optName] = opts[optName];
  }
};

/**
 * Sanitize and return result via `cb`.
 *
 * @param {Function} cb
 * @api public
 */

Sanitizer.prototype.sanitize = function(cb) {
  this.parse(this.input, function(errors, window) {
    if (errors) { throw errors; }
    this.sanitizeHtml(window, cb);
  }.bind(this));
};

/**
 * Parse `input` and return result via `cb`.
 *
 * @param {String} input
 * @param {Function} cb
 * @api private
 */

Sanitizer.prototype.parse = function(input, cb) {
  jsdom.env(input, [jquery], cb);
};

/**
 * Sanitize html in `window`.
 * 
 * @param {jQuery.Object} window
 * @param {Function} cb
 * @api private
 */

Sanitizer.prototype.sanitizeHtml = function(window, cb) {
  async.each(window.$('body').find('*'), function(elt, cb) {
    var $elt = window.$(elt);
    if (!this.isAllowedElement($elt)) {
      $elt.remove();
      cb(null);
    } else {
      async.each($elt.get(0).attributes, function(attr, cb) {
        var attrName = attr.nodeName;
        if (!this.isAllowedAttribute(attrName)) { $elt.removeAttr(attrName); }
        cb(null);
      }.bind(this), cb);
    }
  }.bind(this), function(err, result) {
    cb(err, window.$('body').html());
  });
};

/**
 * Test `$elt` based on config.
 * 
 * @param {jQuery.Object} $elt
 * @api private
 */

Sanitizer.prototype.isAllowedElement = function($elt) {
  var config = this.allowedElements[$elt.get(0).tagName.toLowerCase()];
  if (!config) { return false; }
  if (config.only) { return config.only($elt); }
  return true;
};

/**
 * Test `attrName` based on config.
 * 
 * @param {String} attrName
 * @api private
 */

Sanitizer.prototype.isAllowedAttribute = function(attrName) {
  var config = this.allowedAttributes[attrName.toLowerCase()];
  if (!config) { return false; }
  if (config.only) { return config.only(attr); }
  return true;
};
