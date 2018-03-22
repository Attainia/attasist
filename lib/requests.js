import {
    always,
    compose,
    concat,
    defaultTo,
    either,
    ifElse,
    is,
    isNil,
    last,
    objOf,
    path,
    prop,
    split,
    test,
    trim,
    when,
    zipObj
} from 'ramda'
import {isBlankString} from './validations'

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
export const parseError = compose(
    when(either(isNil, isBlankString), always('An unknown error occurred')),
    either(
        prop('detail'),
        path(['data', 'detail']),
        path(['response', 'detail']),
        path(['response', 'data', 'detail']),
        prop('message'),
        path(['data', 'message']),
        path(['response', 'message']),
        path(['response', 'data', 'message']),
        path(['data', 'error']),
        path(['response', 'data', 'error']),
        path(['response', 'error']),
        prop('error'),
        prop('statusText'),
        path(['data', 'statusText']),
        path(['response', 'statusText']),
        path(['response', 'data', 'statusText']),
    ),
    when(is(String), objOf('detail'))
)

/**
 * Retrieves the error status code (numeric) 
 *
 * @func
 * @sig {k: v} -> Number
 * @param {Object} error An error object
 * @returns {Number} The Http status code (defaults to 500)
 */
export const parseStatus = compose(
    defaultTo(500),
    either(path(['response', 'status']), prop('status'))
)

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
