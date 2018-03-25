import {compose, either, path, prop} from 'ramda'
import {parseError, parseStatus, parseStatusText, removeErrorLabel} from './requests'

export class BaseError extends Error {
    constructor(statusText, status, data = {}) {
        super()
        this.stack = this.stack || (new Error()).stack
        this.response = {status, statusText}
        this.message = compose(removeErrorLabel, parseError)(data)
        this.data = data
    }
}

export class ResponseError extends BaseError {
    constructor(res = {}) {
        const status = parseStatus(res)
        const statusText = parseStatusText(res)
        super(statusText, status, either(prop('data'), path(['response', 'data']))(res))
    }
}

export class UnauthorizedError extends BaseError {
    constructor(data = {}) {
        super('Unauthorized', 401, data)
    }
}

export class ForbiddenError extends BaseError {
    constructor(data = {}) {
        super('Forbidden', 403, data)
    }
}

export class NotFoundError extends BaseError {
    constructor(data = {}) {
        super('Not Found', 404, data)
    }
}
