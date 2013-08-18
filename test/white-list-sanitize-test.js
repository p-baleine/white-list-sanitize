
/**
 * Module dependencies.
 */

var expect = require('expect.js'),
    sanitize = require('../');

describe('white-list-sanitize', function() {

  it('should strip specified tags', function(done) {
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
