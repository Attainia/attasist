import {compose, head, last, pathOr, split} from 'ramda'

/**
 * Retrieves a unique identifier by parsing the `event.target.id`
 * from the DOM event. This requires the Html Element to have an "id" attribute.
 * You can format your identifier to be colon delimited, and this function will
 * retrieve the LAST delimited value. It is common to re-use guids from a
 * database record and make that your identifier, however this could lead to
 * duplication on the page, so you can use that guid on multiple elements, like
 * this:
 *
 * sort_column:31f97023-8c59-48fa-bbc1-a5406b9f5c4f
 * cancel_button:31f97023-8c59-48fa-bbc1-a5406b9f5c4f
 *
 * This function will then parse the guid from the id value you built (colon
 * delimited).
 *
 * @func
 * @sig {k: v} -> String
 * @param {Event} event A DOM event (ie, a click event)
 * @returns {String} The unique identifier associated with the DOM event
 */
export const getId = compose(
    last,
    split(':'),
    pathOr('', ['target', 'id'])
)

/**
 * Retrieves the target type by parsing the `event.target.id`
 * from the DOM event. This requires the Html Element to have an "id" attribute.
 * You can format your identifier to be colon delimited, and this function will
 * retrieve the FIRST delimited value. It is common to re-use guids from a
 * database record and make that your identifier, however this could lead to
 * duplication on the page, so you can use that guid on multiple elements, like
 * this:
 *
 * subcategories:31f97023-8c59-48fa-bbc1-a5406b9f5c4f
 * categories:31f97023-8c59-48fa-bbc1-a5406b9f5c4f
 *
 * This function will then parse the entity type from the id value you built (colon
 * delimited).
 *
 * @func
 * @sig {k: v} -> String
 * @param {Event} event A DOM event (ie, a click event)
 * @returns {String} The target type associated with the DOM event
 */
export const getTargetType = compose(
    head,
    split(':'),
    pathOr('', ['target', 'id'])
)
