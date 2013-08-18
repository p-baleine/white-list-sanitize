# white-list-sanitize [![Build Status](https://travis-ci.org/p-baleine/white-list-sanitize.png?branch=master)](https://travis-ci.org/p-baleine/white-list-sanitize)

Sanitizer based on white list approach.

This library based on darobin's [html-sanitiser](https://github.com/darobin/html-sanitiser) and also provide more controlled sanitize.

## API

Allowed elemtns and attributes can be specified via array.

```js
var sanitize = require('sanitize');

var opts = {
  allowedElements: ['a', 'h1'],
  allowedAttributes: ['href']
};

sanitize('<a href="//hoge.com">Hoge</a><script></script>', opts, function(err, result) {
  console.log(result); // => <a href="//hoge.com">Hoge</a>
});
```

Also these are specified via object for more controlled sanitize.

```js
var sanitize = require('sanitize');

var input = [
  '<div>',
  '  <iframe src="http://hoge/com"></iframe>',
  '  <iframe src="//www.youtube.com/embed/N9qV3OvYuJY" frameborder="0" allowfullscreen></iframe>',
  '</div>'
].join('');

var opts = {
  allowedElements: {
    'div': true,
    'iframe': {
      'only': function($elt) {
        return $elt.attr('src').test(/^¥/¥/www¥.youtube¥.com¥/embed¥/[a-zA-Z0-9]+$/)
      }
    }
  },
  allowedAttributes: ['src']
};

sanitize(input, opts, function(err, result) {
  console.log(result); // => <div><iframe src="//www.youtube.com/embed/N9qV3OvYuJY"></iframe></div>
});
```
