
/**
 * Module dependencies.
 */

var expect = require('expect.js'),
    sanitize = require('../');

describe('white-list-sanitize', function() {

  describe('when opts specified via array', function() {

    it('should strip tags not specified in opts', function(done) {
      var input = '<a href="//hoge.com">Hoge</a><h1>Hoge</h1><script></script>',
          opts = {
            allowedElements: ['a', 'h1'],
            allowedAttributes: ['href']
          };
      sanitize(input, opts, function(err, res) {
        expect(err).to.be(null);
        expect(res).to.equal('<a href="//hoge.com">Hoge</a><h1>Hoge</h1>');
        done();
      });
    });

  });

  describe('when opts specified via object', function() {

    it('should stript tags which cannot pass specified `only` test', function(done) {
      var input = [
        '<div>',
        '  <iframe src="http://hoge/com"></iframe>',
        '  <iframe src="//www.youtube.com/embed/N9qV3OvYuJY" frameborder="0"></iframe>',
        '</div>'
      ].join('');
      var opts = {
        allowedElements: {
          'div': true,
          'iframe': {
            'only': function($elt) {
              return /^\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9]+$/.test($elt.attr('src'));
            }
          }
        },
        allowedAttributes: ['src']
      };

      sanitize(input, opts, function(err, res) {
        expect(err).to.be(null);
        expect(res).to.match(/<div>\s*<iframe src="\/\/www.youtube.com\/embed\/N9qV3OvYuJY"><\/iframe><\/div>/);
        done();
      });
    });

  });

});
