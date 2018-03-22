import {
    compose,
    concat,
    curry,
    keys,
    prop,
    uniqBy
} from 'ramda'

/**
 * Filters two collections of objects to a new unique collection (based on their "id")
 *
 * @func
 * @sig [{k: v}] -> [{k: v}] -> [{k: v}]
 * @param {Object[]} aCollection The first collection of objects
 * @param {Object[]} bCollection The second collection of objects
 * @returns {Object[]} A collection of the original objects mapped into a unique list
 */
export const uniqify = compose(uniqBy(prop('id')), concat)

/**
 * Filters a collection of objects (which contain "id" props) down to only those
 * which are also in a provided hashmap of ids.
 *
 * @func
 * @sig [{k: v}] -> {k: v} -> [{k: v}]
 * @param {Object[]} collection A collection of objects to filter
 * @param {Object} state A hashmap of ids/names
 * @returns {Object[]} A collection of objects whose ids exist in the provided hashmap
 */
export const filterEm = curry(
    (collection, filteredIds) => {
        const ids = keys(filteredIds)
        return collection.filter(c => ids.includes(c.id))
    }
)
