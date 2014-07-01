templeton [![NPM Version](http://img.shields.io/npm/v/templeton.svg?style=flat)](https://www.npmjs.org/package/templeton) - [![Build Status](http://img.shields.io/travis/developit/templeton.svg?branch=master&style=flat)](https://travis-ci.org/developit/templeton)
=========

It's like the other ones but not at all like the other ones.  

---

Example
-------

```JavaScript
var output = templeton.template('Hello, {{user}}!', {
	user : 'World'
});
console.log(output);  // "Hello, World!"
```
