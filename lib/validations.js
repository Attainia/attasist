import {
    __,
    allPass,
    always,
    anyPass,
    complement,
    compose,
    contains,
    curry,
    defaultTo,
    either,
    equals,
    ifElse,
    is,
    isEmpty,
    isNil,
    path,
    test,
    toUpper,
    trim
} from 'ramda'

/**
 * Checks to see if a prop name is an alphanumeric string (plus some symbols
 * allowed, like underscores, dashes and dots)
 *
 * @func
 * @sig a -> Boolean
 * @param {String} prop A prop name to check for formatting
 * @returns {Boolean} whether or not the prop name passed validation
 */
export const isValidPropName = test(/^(?:[A-Z])([A-Z0-9_\-.]+)([A-Z0-9])$/i)

/**
 * Checks to see if a given value is a JavaScript Promise
 *
 * @func
 * @sig * -> Boolean
 * @param {*} val A value to check to see if is a Promise
 * @returns {Boolean} whether or not the val is a Promise
 */
export const isPromise = compose(
    equals('Promise'),
    path(['constructor', 'name']),
    defaultTo('')
)
/**
 * Checks to see if a given value is an Object
 *
 * @func
 * @sig * -> Boolean
 * @param {*} val A value to check for objectishness
 * @returns {Boolean} whether or not the val is a plain old JS object
 */
export const isPlainObj = compose(
    equals('Object'),
    path(['constructor', 'name']),
    defaultTo('')
)

/**
 * Checks to make sure a given value isn't null or undefined
 *
 * @func
 * @sig * -> Boolean
 * @param {*} val A value which may or may not be null / undefined
 * @returns {Boolean} whether or not the value was non-nil
 */
export const isNotNil = complement(isNil)

/**
 * Checks to make sure a given value isn't empty
 *
 * @func
 * @sig * -> Boolean
 * @param {*} val A value which may or may not be empty
 * @returns {Boolean} whether or not the value was non-empty
 */
export const isNotEmpty = complement(isEmpty)

/**
 * Checks to see whether or not a given String is blank
 *
 * @func
 * @sig String -> Boolean
 * @param {String} val A String which may or may not be blank
 * @returns {Boolean} whether or not a given String is blank
 */
export const isBlankString = compose(
    ifElse(is(String), test(/^\s*$/), always(false)),
    defaultTo(null)
)

export const isNotBlankString = complement(isBlankString)

/**
 * Checks to see whether or not a given value is a non-blank String (one or more chars)
 *
 * @func
 * @sig * -> Boolean
 * @param {*} val A value which may or may not be a non-blank String
 * @returns {Boolean} whether or not a given value is a non-blank String
 */
export const isStringieThingie = compose(
    allPass([
        isNotBlankString,
        either(is(Number), is(String))
    ]),
    defaultTo(null)
)

/**
 * Checks to see whether or not a given value is either: Boolean, Number, String, Data, or RegExp
 *
 * @func
 * @sig * -> Boolean
 * @param {*} val A value which may or may not be "primitive-ish"
 * @returns {Boolean} whether or not a given value is "primitive-ish"
 */
export const isPrimitiveish = anyPass([is(Boolean), is(Number), is(String), is(RegExp), is(Date)])

/**
 * Checks to see if a provided object has a given prop (path)
 *
 * @func
 * @sig [String] -> {k: v} -> Boolean
 * @param {String[]} propPath An array of string values representing the nested path to a prop
 * @param {Object} obj An object on which a given prop may exist
 * @returns {Boolean} whether or not the provided prop path exists on the provided object
 */
export const hasNestedProp = curry((propPath, obj) => compose(isNotNil, path(propPath))(obj))

/**
 * Checks to see whether or not a given value matches an email regex.
 * Note: this is not a comprehensive email regex (as if such a thing is possible),
 * but close enough for (American) rock-n-roll.
 *
 * @func
 * @sig * -> Boolean
 * @param {*} val A value which may or may not be an email address
 * @returns {Boolean} whether or not a given value is an acceptable email address
 */
export const isValidEmail = test(/^[^.\s@:][^\s@:]*(?!\.)@[^.\s@]+(?:\.[^.\s@]+)*$/)

/**
 * Checks to see whether or not a given value matches a basic password regext (6
 * to 50 alhpanumeric case-insensitive characters, with some basic symbols allowed)
 *
 * @func
 * @sig * -> Boolean
 * @param {*} val A value which may or may not be a password
 * @returns {Boolean} whether or not a given value is a password
 */
export const isValidPassword = test(/^([A-Z]|[a-z])([a-z]|[0-9]|[!@#$%^&*()[\];:,.<>?*^+=_-]){6,50}$/)

/**
 * Validates a log level string value by trimming of whitespace and lowercasing a provided
 * string value. That value must be among the accepted list of either
 * 'debug', 'trace', 'info', 'warn', 'error' or 'fatal'.
 *
 * @func
 * @sig String -> Boolean
 * @param {String} level A string value representing the log level
 * @returns {Boolean} whether or not the log level string matches one of the standard log levels
 */
export const isValidLogLevel = compose(
    contains(__, ['INFO', 'DEBUG', 'TRACE', 'WARN', 'ERROR', 'FATAL']),
    toUpper,
    trim
)
