password-generator
==================

Simple utility to generate a password

## Install

```sh
npm install git+ssh://git@github.com/tfd/password-generator.git
```

## Build

```sh
npm install
grunt
```

## Methods
The following methods and properties are defined:

### least(num)
Generate a substring of at least num characters

### most(num)
Generate a substring of at most num characters

### between(min, max)
Generate a substring of at least min and at most max characters

### exactly(num)
Generate a substring of exactly num characters

### minLength(num)
Generate a substring so that the resulting password has at least num characters

### maxLength(num)
Generate a substring so that the resulting password has at most num characters

### length(num)
Generate a substring so that the resulting password has exactly num characters

### lowercase
Generate a substring of lowercase alphabetic characters

### uppercase
Generate a substring of uppercase alphabetic characters

### letters
Generate a substring of alphabetic characters (both uppercase and lowercase)

### numbers
Generate a substring of numeric characters

### punctuation
Generate a substring of characters from the set **!:?;,.**

### brackets
Generate a substring of characters from the set **()[]{}**

### apostrophes
Generate a substring of characters from the set **'"`**

### math
Generate a substring of characters from the set **+-*/<>=%**

### others
Generate a substring of characters from the set **@#$^&_\|~**

### specials
Generate a substring of special characters (punctuation, brackets, apostrophes, and others)

### of(str)
Generate a substring of characters taken randomly from str

### get()
Get the generated password

### DSL
The following properties are defined to write a sentence like code:

to, be, been, is, and, has, have, with, that, at, same

## Example

```javascript
var PasswordGenerator = require('password-generator');
var pwd = new PasswordGenerator().with.at.least(2).numbers
                                 .and.at.most(5).uppercase
                                 .and.with.minLength(8)
                                 .and.with.maxLength(10).lowercase
                                 .shuffle.and.get();
```
