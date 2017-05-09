templeton [![NPM Version](http://img.shields.io/npm/v/templeton.svg?style=flat)](https://www.npmjs.org/package/templeton) [![Bower Version](http://img.shields.io/bower/v/templeton.svg?style=flat)](http://bower.io/search/?q=templeton) [![Build Status](http://img.shields.io/travis/developit/templeton.svg?branch=master&style=flat)](https://travis-ci.org/developit/templeton)
=========

[![Greenkeeper badge](https://badges.greenkeeper.io/developit/templeton.svg)](https://greenkeeper.io/)

It's like the other ones but not at all like the other ones.  

![Templeton Peck](http://img4.wikia.nocookie.net/__cb20100115042531/a-team/images/7/79/Templeton_Peck.jpg)

---

Example
-------

```JavaScript
var output = templeton.template('Hello, {{user}}!', {
	user : 'World'
});
console.log(output);  // "Hello, World!"
```
