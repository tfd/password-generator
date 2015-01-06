(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint -W097 */
"use strict";

/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .addMethod (ctx, name, method)
 *
 * Adds a method to the prototype of an object.
 *
 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Then can be used as any other method.
 *
 *     expect(fooStr).to.be.foo('bar');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for name
 * @name addMethod
 * @api public
 */
var flag = require('./flag');

module.exports = function (ctx, name, method) {
  ctx[name] = function () {
    var result = method.apply(this, arguments);
    return result === undefined ? this : result;
  };
};
},{"./flag":4}],2:[function(require,module,exports){
/* jshint -W097 */
"use strict";

/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### addProperty (ctx, name, getter)
 *
 * Adds a property to the prototype of an object.
 *
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.instanceof(Foo);
 *     });
 *
 * Then can be used as any other property.
 *
 *     expect(myFoo).to.be.foo;
 *
 * @param {Object} ctx object to which the property is added
 * @param {String} name of property to add
 * @param {Function} getter function to be used for name
 * @name addProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  Object.defineProperty(ctx, name, {
    get: function () {
      var result = getter.call(this);
      return result === undefined ? this : result;
    },
    configurable: true
  });
};
},{}],3:[function(require,module,exports){
/* jshint -W097 */
"use strict";

/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Main exports
 */

var extendObject = {};

/*!
 * Flag utility
 */

extendObject.flag = require('./flag');

/*!
 * Function name
 */

extendObject.getName = require('./getName');

/*!
 * add Property
 */

extendObject.addProperty = require('./addProperty');

/*!
 * add Method
 */

extendObject.addMethod = require('./addMethod');

module.exports = extendObject;

},{"./addMethod":1,"./addProperty":2,"./flag":4,"./getName":5}],4:[function(require,module,exports){
/* jshint -W097 */
"use strict";

/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### flag(object ,key, [value])
 *
 * Get or set a flag value on an object. If a
 * value is provided it will be set, else it will
 * return the currently set value or `undefined` if
 * the value is not set.
 *
 *     utils.flag(this, 'foo', 'bar'); // setter
 *     utils.flag(this, 'foo'); // getter, returns `bar`
 *
 * @param {Object} object (constructed Assertion
 * @param {String} key
 * @param {Mixed} value (optional)
 * @name flag
 * @api private
 */

module.exports = function (obj, key, value) {
  var flags = obj.__flags || (obj.__flags = Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
};
},{}],5:[function(require,module,exports){
/* jshint -W097 */
"use strict";

/*!
 * Chai - getName utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getName(func)
 *
 * Gets the name of a function, in a cross-browser way.
 *
 * @param {Function} a function (usually a constructor)
 */

module.exports = function (func) {
  if (func.name) { return func.name; }

  var match = /^\s?function ([^(]*)\(/.exec(func);
  return match && match[1] ? match[1] : "";
};
},{}],6:[function(require,module,exports){
/* jshint -W097 */
"use strict";

/* jshint -W030 */
var extendObject = require('./chai/extendObject');

var PasswordGenerator = function () {
  extendObject.flag(this, 'atLeast', 1);
  extendObject.flag(this, 'atMost', 1);
  extendObject.flag(this, 'minLength', 8);
  extendObject.flag(this, 'maxLength', 16);
  extendObject.flag(this, 'fill', false);

  this.password = '';
};

var charTypes = {
  punctuation: '!:?;,.',
  brackets   : '()[]{}',
  apostrophes: '\'"`',
  math       : '+-*/<>=%',
  others     : '@#$^&_\\|~',
  lowercase  : 'abcdefghijklmnopqrstuvwxyz',
  uppercase  : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers    : '0123456789'
};
charTypes.number = charTypes.numbers;
charTypes.bracket = charTypes.brackets;
charTypes.apostrophe = charTypes.apostrophes;
charTypes.other = charTypes.others;
charTypes.special = charTypes.specials =
charTypes.punctuation + charTypes.brackets + charTypes.apostrophes + charTypes.math + charTypes.other;
charTypes.letter = charTypes.letters = charTypes.lowercase + charTypes.uppercase;
charTypes.all = charTypes.specials + charTypes.letters + charTypes.numbers;

function pick(str, min, max) {
  var n, chars = '', i;

  if (max === undefined) {
    n = min;
  }
  else {
    n = min + Math.floor(Math.random() * (max - min));
  }

  for (i = 0; i < n; i++) {
    chars += str.charAt(Math.floor(Math.random() * str.length));
  }

  return chars;
}

// Credit to @Christoph: http://stackoverflow.com/a/962890/464744
function shuffle(str) {
  var array = str.split(''),
      tmp, current, top = array.length;

  if (top) {
    while (--top) {
      current = Math.floor(Math.random() * top);
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
  }

  return array.join('');
}

/**
 * ### Language Chains
 *
 * The following are provided as chainable getters to
 * improve the readability of your assertions. They
 * do not provide testing capabilities unless they
 * have been overwritten by a plugin.
 *
 * **Chains**
 *
 * - to
 * - be
 * - been
 * - is
 * - that
 * - and
 * - has
 * - have
 * - with
 * - at
 * - same
 *
 * @name language chains
 * @api public
 */
['to', 'be', 'been', 'is', 'and', 'has', 'have', 'with', 'that', 'at', 'same'].forEach(function (chain) {
  extendObject.addProperty(PasswordGenerator.prototype, chain, function () {});
});

extendObject.addMethod(PasswordGenerator.prototype, 'get', function (minimum, maximum, charSet) {
  var min = parseInt(minimum, 10);
  var max = parseInt(maximum, 10);
  var type = (charSet === undefined ? 'all' : charSet);

  if (!isNaN(min) || !isNaN(max)) {
    if (!isNaN(min)) { this.withMinLength(min); }
    if (!isNaN(max)) { this.withMaxLength(max); }

    if (this[type]) {
      this[type];
    }
    else {
      this.of(charSet);
    }
  }

  return this.password;
});

extendObject.addMethod(PasswordGenerator.prototype, 'least', function (value) {
  var val = parseInt(value, 10);
  var max = extendObject.flag(this, 'atLeast');

  if (isNaN(val) || val <= 0) { return; }

  extendObject.flag(this, 'atLeast', val);
  if (max < val) { extendObject.flag(this, 'atMost', val); }
  extendObject.flag(this, 'fill', false);
});

extendObject.addMethod(PasswordGenerator.prototype, 'most', function (value) {
  var val = parseInt(value, 10);
  var min = extendObject.flag(this, 'atLeast');

  if (isNaN(val) || val <= 0) { return; }

  extendObject.flag(this, 'atMost', val);
  if (min > val) { extendObject.flag(this, 'atLeast', val); }
  extendObject.flag(this, 'fill', false);
});

extendObject.addMethod(PasswordGenerator.prototype, 'exactly', function (value) {
  var val = parseInt(value, 10);

  if (isNaN(val) || val <= 0) { return; }

  extendObject.flag(this, 'atLeast', val);
  extendObject.flag(this, 'atMost', val);
  extendObject.flag(this, 'fill', false);
});

extendObject.addMethod(PasswordGenerator.prototype, 'between', function (minimum, maximum) {
  var min = parseInt(minimum, 10);
  var max = parseInt(maximum, 10);

  if (isNaN(min) || min <= 0 || isNaN(max) || max <= 0) { return; }

  if (min > max) {
    if (max <= 0) {
      max = min;
    }
    else {
      min = max;
    }
  }

  extendObject.flag(this, 'atLeast', min);
  extendObject.flag(this, 'atMost', max);
  extendObject.flag(this, 'fill', false);
});

function withMinLength(value) {
  /* jshint validthis:true */
  var val = parseInt(value, 10);
  var max = extendObject.flag(this, 'maxLength');

  if (isNaN(val) || val <= 0) { return; }

  extendObject.flag(this, 'minLength', val);
  if (max < val) { extendObject.flag(this, 'maxLength', val); }
  extendObject.flag(this, 'fill', true);
}

extendObject.addMethod(PasswordGenerator.prototype, 'withMinLength', withMinLength);
extendObject.addMethod(PasswordGenerator.prototype, 'withMinLen', withMinLength);
extendObject.addMethod(PasswordGenerator.prototype, 'minLength', withMinLength);
extendObject.addMethod(PasswordGenerator.prototype, 'minLen', withMinLength);
extendObject.addMethod(PasswordGenerator.prototype, 'min', withMinLength);

function withMaxLength(value) {
  /* jshint validthis:true */
  var val = parseInt(value, 10);
  var min = extendObject.flag(this, 'minLength');

  if (isNaN(val) || val <= 0) { return; }

  extendObject.flag(this, 'maxLength', val);
  if (min > val) { extendObject.flag(this, 'minLength', val); }
  extendObject.flag(this, 'fill', true);
}

extendObject.addMethod(PasswordGenerator.prototype, 'withMaxLength', withMaxLength);
extendObject.addMethod(PasswordGenerator.prototype, 'withMaxLen', withMaxLength);
extendObject.addMethod(PasswordGenerator.prototype, 'maxLength', withMaxLength);
extendObject.addMethod(PasswordGenerator.prototype, 'maxLen', withMaxLength);
extendObject.addMethod(PasswordGenerator.prototype, 'max', withMaxLength);

function withLength(minimum, maximum) {
  /* jshint validthis:true */
  var min = parseInt(minimum, 10);
  var max = parseInt(maximum, 10);

  if (isNaN(min) || min <= 0) { return; }

  if (isNaN(max) || max <= 0) { max = min; }

  extendObject.flag(this, 'minLength', min);
  extendObject.flag(this, 'maxLength', max);
  extendObject.flag(this, 'fill', true);
}

extendObject.addMethod(PasswordGenerator.prototype, 'withLength', withLength);
extendObject.addMethod(PasswordGenerator.prototype, 'withLen', withLength);
extendObject.addMethod(PasswordGenerator.prototype, 'length', withLength);
extendObject.addMethod(PasswordGenerator.prototype, 'len', withLength);

extendObject.addProperty(PasswordGenerator.prototype, 'shuffle', function () {
  if (this.password.length < extendObject.flag(this, 'minLength')) {
    this.all;
  }
  this.password = shuffle(this.password);
});

function createPropertyForCharacterType(type) {
  return function () {
    var min = extendObject.flag(this, 'atLeast');
    var max = extendObject.flag(this, 'atMost');
    var len = this.password.length;

    if (extendObject.flag(this, 'fill')) {
      max = extendObject.flag(this, 'maxLength') - len;
      min = extendObject.flag(this, 'minLength') - len;
      if (max < 0 || min < 0) { return; }
    }

    this.password += pick(charTypes[type], min, max);
    extendObject.flag(this, 'atLeast', 1);
    extendObject.flag(this, 'atMost', 1);
    extendObject.flag(this, 'fill', false);
  };
}

var type;
for (type in charTypes) {
  if (charTypes.hasOwnProperty(type)) {
    extendObject.addProperty(PasswordGenerator.prototype, type, createPropertyForCharacterType(type));
  }
}

extendObject.addMethod(PasswordGenerator.prototype, 'of', function (str) {
  var min = extendObject.flag(this, 'atLeast');
  var max = extendObject.flag(this, 'atMost');
  var len = this.password.length;

  if (extendObject.flag(this, 'fill')) {
    max = extendObject.flag(this, 'maxLength') - len;
    min = extendObject.flag(this, 'minLength') - len;
    if (max < 0 || min < 0) { return; }
  }

  this.password += pick(str, min, max);
  extendObject.flag(this, 'atLeast', 1);
  extendObject.flag(this, 'atMost', 1);
  extendObject.flag(this, 'fill', false);
});

/**
 * ### PasswordGenerator
 *
 * Object that can be used to generate a password.
 *
 * The following methods and properties are defined:
 *
 * <dl>
 * <dt>atLeast(num)</dt>
 * <dd>Generate a substring of at least num characters</dd>
 * <dt>atMost(num)</dt>
 * <dd>Generate a substring of at most num characters</dd>
 * <dt>between(min, max)</dt>
 * <dd>Generate a substring of at least min and at most max characters</dd>
 * <dt>exactly(num)</dt>
 * <dd>Generate a substring of exactly num characters</dd>
 * <dt>withMinLength(num)</dt>
 * <dd>Generate a substring so that the resulting password has at least num characters</dd>
 * <dt>withMaxLength(num)</dt>
 * <dd>Generate a substring so that the resulting password has at most num characters</dd>
 * <dt>withLength(num)</dt>
 * <dd>Generate a substring so that the resulting password has exactly num characters</dd>
 * <dt>lowercase</dt>
 * <dd>Generate a substring of lowercase alphabetic characters</dd>
 * <dt>uppercase</dt>
 * <dd>Generate a substring of uppercase alphabetic characters</dd>
 * <dt>numbers</dt>
 * <dd>Generate a substring of numeric characters</dd>
 * <dt>specials</dt>
 * <dd>Generate a substring of special characters</dd>
 * <dt>of(str)</dt>
 * <dd>Generate a substring of characters taken randomly from str</dd>
 * <dt>get()</dt>
 * <dd>Get the generated password</dd>
 * </dl>
 *
 * Usage:
 *
 * <code>
 *    var pwd = new PasswordGenerator().atLeast(2).numbers
 *                                     .atMost(5).uppercase
 *                                     .withMinLength(8).withMaxLength(10).lowercase
 *                                     .shuffle.get();
 * </code>
 *
 * @name PasswordGenerator
 * @api public
 */

module.exports = PasswordGenerator;

},{"./chai/extendObject":3}]},{},[6]);
