/**
 * @module password-generator
 * @exports PasswordGenerator
 */

/* jshint -W097 */
"use strict";

/* jshint -W030 */
var extendObject = require('./chai/extendObject');

/**
 * @class PasswordGenerator
 *
 * Generate a password with given restrictions.
 *
 * @constructor
 */
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

/**
 * Returns the generated password.
 *
 * If you pass the parameters the password will be filled up with characters from the charSet to get a password with a
 * length between min and max.
 *
 * @method PasswordGenerator#get
 * @param {number} [min] - minimum length of password
 * @param {number} [max] - maximum length of password
 * @param {string} [charSet] - string with characters to choose from
 * @returns {string}
 */
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

/**
 * Generate a string with at least the given length.
 *
 * You must use one of the character set selection properties afterwards to
 * actually generate the string.
 *
 * @method PasswordGenerator#least
 * @param {number} length
 * @returns {PasswordGenerator}
 */
extendObject.addMethod(PasswordGenerator.prototype, 'least', function (value) {
  var val = parseInt(value, 10);
  var max = extendObject.flag(this, 'atLeast');

  if (isNaN(val) || val <= 0) { return; }

  extendObject.flag(this, 'atLeast', val);
  if (max < val) { extendObject.flag(this, 'atMost', val); }
  extendObject.flag(this, 'fill', false);
});

/**
 * Generate a string with at most the given length.
 *
 * You must use one of the character set selection properties afterwards to
 * actually generate the string.
 *
 * @method PasswordGenerator#most
 * @param {number} length
 * @returns {PasswordGenerator}
 */
extendObject.addMethod(PasswordGenerator.prototype, 'most', function (value) {
  var val = parseInt(value, 10);
  var min = extendObject.flag(this, 'atLeast');

  if (isNaN(val) || val <= 0) { return; }

  extendObject.flag(this, 'atMost', val);
  if (min > val) { extendObject.flag(this, 'atLeast', val); }
  extendObject.flag(this, 'fill', false);
});


/**
 * Generate a string with an exact length.
 *
 * You must use one of the character set selection properties afterwards to
 * actually generate the string.
 *
 * @method PasswordGenerator#exactly
 * @param {number} length
 * @returns {PasswordGenerator}
 */
extendObject.addMethod(PasswordGenerator.prototype, 'exactly', function (value) {
  var val = parseInt(value, 10);

  if (isNaN(val) || val <= 0) { return; }

  extendObject.flag(this, 'atLeast', val);
  extendObject.flag(this, 'atMost', val);
  extendObject.flag(this, 'fill', false);
});

/**
 * Generate a string with a length between min and max.
 *
 * You must use one of the character set selection properties afterwards to
 * actually generate the string.
 *
 * @method PasswordGenerator#between
 * @param {number} min - minimum length
 * @param {number} max - maximum length
 * @returns {PasswordGenerator}
 */
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

/**
 * Generate a password with the given min length.
 *
 * You must use one of the character set selection properties afterwards to
 * actually generate the password.
 *
 * @method PasswordGenerator#minLength
 * @param {number} length - minimum length of password
 * @returns {PasswordGenerator}
 */
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

/**
 * Generate a password with the given max length.
 *
 * You must use one of the character set selection properties afterwards to
 * actually generate the password.
 *
 * @method PasswordGenerator#maxLength
 * @param {number} length - maximum length of password
 * @returns {PasswordGenerator}
 */
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

/**
 * Generate a password with the given min and max length. Will generate a
 * password of exactly min length if max is omitted.
 *
 * You must use one of the character set selection properties afterwards to
 * actually generate the password.
 *
 * @method PasswordGenerator#length
 * @param {number} min - minimum length of password
 * @param {number} [max=min] - maximum length of password
 * @returns {PasswordGenerator}
 */
extendObject.addMethod(PasswordGenerator.prototype, 'withLength', withLength);
extendObject.addMethod(PasswordGenerator.prototype, 'withLen', withLength);
extendObject.addMethod(PasswordGenerator.prototype, 'length', withLength);
extendObject.addMethod(PasswordGenerator.prototype, 'len', withLength);

/**
 * Shuffle the characters in the current password.
 *
 * @property PasswordGenerator#shuffle
 * @returns {PasswordGenerator}
 */
extendObject.addProperty(PasswordGenerator.prototype, 'shuffle', function () {
  if (this.password.length < extendObject.flag(this, 'minLength')) {
    this.all;
  }
  this.password = shuffle(this.password);
});

/**
 * Generate a random password with uppercase alphabetic characters.
 *
 * @property PasswordGenerator#uppercase
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with lowercase alphabetic characters.
 *
 * @property PasswordGenerator#lowercase
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with alphabetic characters.
 *
 * @property PasswordGenerator#letters
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with numbers.
 *
 * @property PasswordGenerator#numbers
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with punctuation characters: <strong>!:?;,.</strong>.
 *
 * @property PasswordGenerator#punctuation
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with brackets characters: <strong>()[]{}</strong>.
 *
 * @property PasswordGenerator#brackets
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with apostrophes characters: <strong>'"`</strong>.
 *
 * @property PasswordGenerator#apostrophes
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with math characters: <strong>+-*&lt;&gt;=%/</strong>.
 *
 * @property PasswordGenerator#math
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with others characters: <strong>@#$^&amp;_\|~</strong>.
 *
 * @property PasswordGenerator#others
 * @returns {PasswordGenerator}
 */

/**
 * Generate a random password with special characters: <strong>!:?;,.()[]{}+-*&lt;&gt;=%/@#$^&amp;_\|~</strong>.
 *
 * @property PasswordGenerator#specials
 * @returns {PasswordGenerator}
 */

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

/**
 * Generate a random password with characters chosen from tge given charSet,
 *
 * @method PasswordGenerator#of
 * @param {string} charSet
 * @returns {PasswordGenerator}
 */
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

module.exports = PasswordGenerator;
