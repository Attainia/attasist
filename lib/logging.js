/* eslint import/prefer-default-export: "off" */
import {__, always, compose, contains, toLower, trim, unless} from 'ramda'

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
