import {parseError} from './requests'

export class BaseError extends Error {
    constructor(statusText, status, data = {}) {
        super()
        this.stack = this.stack || (new Error()).stack
        this.response = {status, statusText}
        this.message = parseError(data)
        this.data = data
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
