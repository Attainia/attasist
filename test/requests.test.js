/* eslint max-len: "off" */
import test from 'tape'
import {makeApiUrl, parseError, parseStatus, parseStatusText} from '../lib/requests'

const detail = 'don\'t bother me with the'
const error = 'does not compute'
const error_description = 'invalid stuffy stuff'
const message = 'sending out an S.O.S.'
const statusText = 'Invalid something'
const status = 403


test('"makeApiUrl" joins a base url with an endpoint', (t) => {
    t.equal(makeApiUrl('http://localhost:5000'), 'http://localhost:5000', 'returns base if no endpoint')
    t.equal(makeApiUrl('http://localhost:5000', null, {}), 'http://localhost:5000', 'returns base if no endpoint')
    t.end()
})

test('"makeApiUrl" serializes query string params', (t) => {
    t.equal(makeApiUrl('http://localhost:5000', 'endpoint', {}), 'http://localhost:5000/endpoint')
    t.equal(makeApiUrl('http://localhost:5000', null, {}), 'http://localhost:5000')
    t.equal(
        makeApiUrl('http://localhost:5000', 'endpoint', {lorem: 'ipsum', dolor: 'sit'}),
        'http://localhost:5000/endpoint?lorem=ipsum&dolor=sit'
    )
    t.equal(
        makeApiUrl('http://localhost:5000', 'endpoint/', {lorem: 'ipsum', dolor: 'sit'}),
        'http://localhost:5000/endpoint/?lorem=ipsum&dolor=sit'
    )
    t.end()
})

test('"parseError" favors a "detail" prop at the top of an object, over everything else', (t) => {
    t.equal(parseError({message, detail, error, error_description, statusText}), detail)
    t.end()
})

test('"parseError" favors a "message" prop at the top of an object, over everything except detail', (t) => {
    t.equal(parseError({message, error, error_description, statusText}), message)
    t.end()
})

test('"parseError" favors an "error_description" prop at the top of an object, over everything except detail and message', (t) => {
    t.equal(parseError({error_description, statusText}), error_description)
    t.end()
})

test('"parseError" favors an "error" prop at the top of an object, over everything except detail, error_description, and message', (t) => {
    t.equal(parseError({error, statusText}), error)
    t.end()
})

test('"parseError" uses the request statusText when all else fails', (t) => {
    t.equal(parseError({statusText}), statusText)
    t.end()
})

test('"parseError" defaults to a generic message when nothing else is available', (t) => {
    t.equal(parseError({lorem: 'ipsum', dolor: 'sit'}), 'An unknown error occurred')
    t.end()
})

test('"parseError" can even deal with an array of strings, if there\'s some reason for it', (t) => {
    t.equal(parseError([1, 3, 4, 'An error message']), 'An error message')
    t.end()
})

test('"parseError" handles a string error message rather than a only message nested inside of an object', (t) => {
    t.equal(parseError(message), message)
    t.end()
})

test('"parseError" applies the same rules of precedence to a nested object named "data"', (t) => {
    t.equal(parseError({data: {detail, message, error, error_description, statusText}}), detail, 'detail')
    t.equal(parseError({data: {message, error, error_description, statusText}}), message, 'message')
    t.equal(parseError({data: {error, error_description, statusText}}), error_description, 'error_description')
    t.equal(parseError({data: {error, statusText}}), error, 'error')
    t.equal(parseError({data: {statusText}}), statusText, 'statusText')
    t.end()
})

test('"parseError" applies the same rules of precedence to a nested object named "response"', (t) => {
    t.equal(parseError({response: {detail, message, error, statusText}}), detail, 'detail')
    t.equal(parseError({response: {message, error, statusText}}), message, 'message')
    t.equal(parseError({response: {error, error_description, statusText}}), error_description, 'error_description')
    t.equal(parseError({response: {error, statusText}}), error, 'error')
    t.equal(parseError({response: {statusText}}), statusText, 'statusText')
    t.end()
})

test('"parseError" applies the same rules of precedence to a nested object named "data", nested in a "response" object', (t) => {
    t.equal(parseError({response: {data: {detail, message, error, statusText}}}), detail, 'detail')
    t.equal(parseError({response: {data: {message, error, statusText}}}), message, 'message')
    t.equal(parseError({response: {data: {error, error_description, statusText}}}), error_description, 'error_description')
    t.equal(parseError({response: {data: {error, statusText}}}), error, 'error')
    t.equal(parseError({response: {data: {statusText}}}), statusText, 'statusText')
    t.end()
})

test('"parseStatusText" finds a "statusText" prop from inside a given object', (t) => {
    t.equal(parseStatusText({statusText}), statusText, 'at the top level')
    t.equal(parseStatusText({response: {statusText}}), statusText, 'nested inside "response"')
    t.equal(parseStatusText({data: {statusText}}), statusText, 'nested inside "data"')
    t.equal(parseStatusText({response: {data: {statusText}}}), statusText, 'or nested inside "response.data"')
    t.end()
})

test('"parseStatus" finds a "status" prop from inside a given object', (t) => {
    t.equal(parseStatus({status}), status, 'at the top level')
    t.equal(parseStatus({response: {status}}), status, 'nested inside "response"')
    t.equal(parseStatus({data: {status}}), status, 'nested inside "data"')
    t.equal(parseStatus({response: {data: {status}}}), status, 'or nested inside "response.data"')
    t.equal(parseStatus({response: {data: {statusText}}}), 500, 'and defaults to 500 when all else fails')
    t.end()
})
