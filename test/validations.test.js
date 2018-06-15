import test from 'tape'
import {isImageUrl, isPromise, isBlankString, isValidEmail, isPlainObj, isStringieThingie} from '../lib/validations'

test('Image URL strings', (t) => {
    t.equal(isImageUrl(' lorem.jpg'), false, 'no whitespace at the beginning')
    t.equal(isImageUrl('lorem.jpg '), false, 'no whitespace')
    t.equal(isImageUrl('lorem . jpg'), false, 'no whitespace in the middle')
    t.equal(isImageUrl('loremjpg'), false, 'must have a dot before the extension')
    t.equal(isImageUrl('/static/lorem.jpg'), true)
    t.equal(isImageUrl('lorem.JPG'), true, 'case-insensitive')
    t.equal(isImageUrl('lorem.png'), true, 'allows png')
    t.equal(isImageUrl('lorem.jpeg'), true, 'allows jpeg')
    t.equal(isImageUrl('lorem.svg'), true, 'allows svg')
    t.equal(isImageUrl('lorem.tiff'), true, 'allows tiff')
    t.equal(isImageUrl('lorem.gif'), true, 'allows gif (pronounced with a hard G, because otherwise sounds stupid)')
    t.equal(isImageUrl('data:image/png;base64,iVBORw0KGg'), true, 'allows base64 encoded strings')
    t.end()
})

test('Spaces in an email string are caught', (t) => {
    t.equal(isValidEmail('lorem ipsum @ dolor.sit.amet'), false)
    t.end()
})

test('Missing an @ symbol in an email fails', (t) => {
    t.equal(isValidEmail('loremipsumATgmail.com'), false)
    t.end()
})

test('Basic email format passes', (t) => {
    t.equal(isValidEmail('loremipsum@gmail.com'), true)
    t.end()
})

test('Emails are case-insensitive', (t) => {
    t.equal(isValidEmail('LOREMIPSUM@GMAIL.COM'), true)
    t.end()
})

test('Non-objects fail object validation', (t) => {
    t.equal(isPlainObj('I am an object'), false, 'a string')
    t.equal(isPlainObj(123), false, 'a number')
    t.equal(isPlainObj(true), false, 'a boolean')
    t.end()
})

test('Other object types fail validation', (t) => {
    t.equal(isPlainObj(null), false, 'a null value')
    t.equal(isPlainObj(new Date()), false, 'a new Date instance')
    t.equal(isPlainObj(new RegExp(/\S/)), false, 'a new regular expression instance')
    t.equal(isPlainObj([{a: 'I'}, {b: 'am'}, {c: 'object'}]), false, 'an array of objects')
    t.end()
})

test('What we really mean by "object" passes validation', (t) => {
    t.equal(isPlainObj({}), true, 'an empty object')
    t.equal(isPlainObj({a: 'I am an object'}), true, 'a non-empty object')
    t.end()
})

test('Non-promises fail promise validation', (t) => {
    t.equal(isPromise('I am a promise'), false, 'a string')
    t.equal(isPromise(123), false, 'a number')
    t.equal(isPromise(true), false, 'a boolean')
    t.equal(isPromise(null), false, 'a null value')
    t.equal(isPromise(new Date()), false, 'a new Date instance')
    t.equal(isPromise(new RegExp(/\S/)), false, 'a new regular expression instance')
    t.equal(isPromise([{a: 'I'}, {b: 'am'}, {c: 'promise'}]), false, 'an array of objects')
    t.end()
})

test('Promises pass validation', (t) => {
    t.equal(isPromise(new Promise((resolve) => resolve())), true, 'from newing up a Promise')
    t.equal(isPromise(Promise.resolve({a: 'I am a promise'})), true, 'from a simple Promise.resolve')
    t.end()
})

test('Whitespace is considered a blank string', (t) => {
    t.equal(isBlankString('  '), true)
    t.end()
})

test('Strings with NO characters are considered blank', (t) => {
    t.equal(isBlankString(''), true)
    t.end()
})

test('Strings with non-whitespace characters are NOT considered blank', (t) => {
    t.equal(isBlankString(' lorem ipsum dolor sit amet '), false)
    t.end()
})

test('Other kinds of "empties" are not lumped into the same boat with "blanks"', (t) => {
    t.equal(isBlankString({}), false, 'empty object')
    t.equal(isBlankString(0), false, 'a value of zero')
    t.equal(isBlankString(null), false, 'a null value')
    t.equal(isBlankString(), false, 'an undefined value')
    t.equal(isBlankString([]), false, 'an empty array')
    t.end()
})

test('When it\'s a thingie, but not a stringie', (t) => {
    t.equal(isStringieThingie({a: 'b'}), false, 'an object')
    t.equal(isStringieThingie(true), false, 'a boolean')
    t.equal(isStringieThingie([1, 2, 3]), false, 'an array')
    t.end()
})

test('When it\'s an empty thingie, it\'s not a stringie', (t) => {
    t.equal(isStringieThingie({}), false, 'an object')
    t.equal(isStringieThingie([]), false, 'an array')
    t.equal(isStringieThingie(''), false, 'a string with no chars')
    t.equal(isStringieThingie(' '), false, 'a string with only whitespace')
    t.equal(isStringieThingie(null), false, 'a null value')
    t.equal(isStringieThingie(), false, 'an undefined value')
    t.end()
})

test('Numbers are a thingie that count as stringies', (t) => {
    t.equal(isStringieThingie(123), true)
    t.equal(isStringieThingie(0), true)
    t.end()
})

test('Non-blank strings are stringies', (t) => {
    t.equal(isStringieThingie('I am string'), true)
    t.end()
})
