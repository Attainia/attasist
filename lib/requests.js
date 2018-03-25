import {
    always,
    any,
    both,
    compose,
    concat,
    cond,
    defaultTo,
    equals,
    find,
    ifElse,
    is,
    last,
    objOf,
    path,
    pipe,
    prop,
    split,
    T,
    test,
    trim,
    unless,
    when,
    zipObj
} from 'ramda'
import {isStringieThingie} from './validations'

/**
 * Removes any "SomeTypeOfError: " prefix from an error message. This is
 * particularity useful for formatting GraphQL errors processed through Apollo
 * Errors, but doesn't hurt anything when the label doesn't exist either. 
 *
 * @func
 * @sig String -> String
 * @param {String} message An error message which might have a label
 * @returns {String} The original error message, but with any label removed
 */
export const removeErrorLabel = compose(
    trim,
    find(isStringieThingie),
    split(/(?:\S*\s*)?error:/i),
    unless(is(String), toString)
)

/**
 * Retrieves the error message from one of several potential properties nested
 * inside a (somewhat) non-standardized error object.
 * Could be a string message or an object with a "message", "detail", "error" or
 * "statusText" property at the top-level of the object or nested inside of a
 * "response", "data" or "response.data" object (many JS client libraries tuck
 * their payloads inside of a "data" object).
 *
 * @func
 * @sig ({k: v}|String) -> String
 * @param {Object} error An error object
 * @returns {String} An appropriate error message parsed from the error object
 */
export const parseError = pipe(
    when(is(String), objOf('detail')),
    cond([
        [both(is(Array), any(is(String))), find(is(String))],
        [prop('detail'), prop('detail')],
        [path(['data', 'detail']), path(['data', 'detail'])],
        [path(['response', 'detail']), path(['response', 'detail'])],
        [path(['response', 'data', 'detail']), path(['response', 'data', 'detail'])],
        [prop('message'), prop('message')],
        [path(['data', 'message']), path(['data', 'message'])],
        [path(['response', 'message']), path(['response', 'message'])],
        [path(['response', 'data', 'message']), path(['response', 'data', 'message'])],
        [path(['data', 'error']), path(['data', 'error'])],
        [path(['response', 'data', 'error']), path(['response', 'data', 'error'])],
        [path(['response', 'error']), path(['response', 'error'])],
        [prop('error'), prop('error')],
        [prop('statusText'), prop('statusText')],
        [path(['data', 'statusText']), path(['data', 'statusText'])],
        [path(['response', 'statusText']), path(['response', 'statusText'])],
        [path(['response', 'data', 'statusText']), path(['response', 'data', 'statusText'])],
        [T, always('An unknown error occurred')]
    ])
)

/**
 * Retrieves the error status code (numeric) from an HTTP response object. It
 * inspects the top level, as well as a nesting pattern of "response", "data",
 * or "response.data".
 *
 * @func
 * @sig {k: v} -> Number
 * @param {Object} response An HTTP response object (or any type of object that
 * may contain a "status" field nested somewhere)
 * @returns {Number} The Http status code (defaults to 500)
 */
export const parseStatus = pipe(
    cond([
        [prop('status'), prop('status')],
        [path(['response', 'status']), path(['response', 'status'])],
        [path(['data', 'status']), path(['data', 'status'])],
        [path(['response', 'data', 'status']), path(['response', 'data', 'status'])],
        [T, always(500)]
    ]),
    Number,
    when(equals(NaN), always(500))
)

/**
 * Retrieves the error statusText from an HTTP response object. It
 * inspects the top level, as well as a nesting pattern of "response", "data",
 * or "response.data".
 *
 * @func
 * @sig {k: v} -> String
 * @param {Object} response An HTTP response object (or any type of object that
 * may contain a "statusText" field nested somewhere)
 * @returns {Number} The Http status text
 */
export const parseStatusText = cond([
    [prop('statusText'), prop('statusText')],
    [path(['response', 'statusText']), path(['response', 'statusText'])],
    [path(['data', 'statusText']), path(['data', 'statusText'])],
    [path(['response', 'data', 'statusText']), path(['response', 'data', 'statusText'])],
    [T, always(500)]
])

/**
 * Creates an Http request headers object with an Authorization header formatted
 * as a Bearer token. Validation is performed as per the JWT spec, that we have
 * alphanumeric characters separated by the period character(s), and no
 * whitespace or line-breaks.
 *
 * @func
 * @sig String -> {k: v}
 * @param {String} token A string value representing a stringified JWT
 * @returns {Object} A headers Object, with an Authorization header
 */
export const createAuthHeader = ifElse(
    test(/^[A-Z0-9-_]+\.[A-Z0-9-_]+\.[A-Z0-9-_]+$/i),
    compose(objOf('Authorization'), concat('Bearer ')),
    always({})
)
    
/**
 * Parses the Authorization header from an HTTP request object. It is formatted
 * into an object containing key/value pairs representing the token type and
 * value.
 *
 * @func
 * @sig {k: v} -> {k: v}
 * @param {Object} req An Http request object, containing an Authorization header
 * @returns {Object} An object containing the "authType" and "credentials"
 */
export const parseCredentials = compose(
    zipObj(['authType', 'credentials']),
    split(' '),
    trim,
    defaultTo(''),
    path(['headers', 'authorization'])
)

/**
 * Parses the Authorization header from an HTTP request object and returns the Bearer token.
 *
 * @func
 * @sig {k: v} -> String
 * @param {Object} req An Http request object, containing an Authorization header
 * @returns {String} An bearer token
 */
export const getAccessToken = compose(
    last,
    split(' '),
    trim,
    defaultTo(''),
    path(['headers', 'authorization'])
)
