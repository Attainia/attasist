/* eslint "no-console": "off" */
import chalk from 'chalk'
import {__, always, compose, contains, converge, curry, identity, or, tap, toLower, trim, unless} from 'ramda'
import util from 'util'

/**
 * Parses a log level by trimming of whitespace and lowercasing a provided
 * string value. That value must be among the accepted list of either
 * 'debug', 'trace', 'info', 'warn', 'error' or 'fatal'.
 *
 * @func
 * @sig String -> String
 * @param {String} level A string value representing the log level
 * @returns {String} one of the acceptable log levels, which has parsed from
 * input (if an accepted value) or defaulted to a value of 'info'
 */
export const parseLogLevel = compose(
    unless(
        contains(__, ['info', 'debug', 'trace', 'warn', 'error', 'fatal']),
        always('info')
    ),
    toLower,
    trim
)

/**
 * A stylized logger that creates a colorized message with a caption, each on separate lines.
 *
 * @example
 *     This is a caption:
 *     some error message!!!!
 *
 * @func
 * @sig String -> a -> String
 * @param {String} caption A caption for the logged message
 * @param {*} message A value (of any type) which will be stringified and displayed by the logger
 * @returns {Function} A function which takes a caption and a value/message and
 * logs them (in stylized fashion) to the console
 */
export const log = curry((caption, message) => console.error(chalk`
{bold.white ${Array(caption.length + 4).fill('-').join('')}}
  {bold.yellow ${caption}}
  {bold.red ${util.format('%o', message)}}
{bold.white ${Array(caption.length + 4).fill('-').join('')}}
`))

/**
 * Combines logging and the tap() function to allow insertion of this function into any composition chain.
 * It optionally takes a predicate function to apply to the value being passed through the tap() function.
 * The reason for this helper is to allow applying a predicate _prior_ to logging the value,
 * but still return the value through the tap() function (unaltered) without any interference
 * by the predicate function.
 * Essentially this is an [identity](http://ramdajs.com/docs/#identity) function
 * that produces a side-effect of logging something of interest about about the value.
 *
 * @func
 * @sig a -> a
 * @param {*} a Any value of any type, which will be returned as-is
 * @returns {*} The original value, unaltered
 */
export const taplog = (message, predicate = identity) =>
    converge(or, [
        identity,
        compose(tap(log(message)), predicate)
    ])
