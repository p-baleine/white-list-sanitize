
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
 * Expost `Sanitizer`.
 */

exports.Sanitizer = Sanitizer;

/**
 * jQuery
 */

var jquery = '../vendor/jquery.js';

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
 *   - allowedElements: Allowed element's names.
 *   - allowedAttributes: Allowed attribute's names.
 * @api public
 */

function Sanitizer(input, opts) {
  if (!(this instanceof Sanitizer)) { return new Sanitizer.apply(this, arguments); }
  this.input = input;
  this.initializeOpts(opts);
}

/**
 * Initialize `opts`.
 * 
 * @param {Object} opts
 * @api private
 */

Sanitizer.prototype.initializeOpts = function(opts) {
  opts = opts || {};
  this.allowedElements = {};
  this.allowedAttributes = {};
  opts.allowedElements.forEach(function(elt) {
    this.allowedElements[elt] = true;
  }.bind(this));
  opts.allowedAttributes.forEach(function(attr) {
    this.allowedAttributes[attr] = true;
  }.bind(this));
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
    if (!this.allowedElements[$elt.get(0).tagName.toLowerCase()]) { $elt.remove(); }
    cb(null);
  }.bind(this), function(err, result) {
    cb(err, window.$('body').html());
  });
};
