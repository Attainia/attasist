import {
    fromPairs,
    addIndex,
    unapply,
    head,
    pluck,
    reject,
    __,
    always,
    applySpec,
    compose,
    concat,
    converge,
    defaultTo,
    either,
    equals,
    find,
    identity,
    ifElse,
    is,
    isEmpty,
    isNil,
    invoker,
    join,
    map,
    merge,
    path,
    pipe,
    propEq,
    replace,
    toUpper,
    trim,
    unless,
    when,
    whereEq
} from 'ramda'
import qs from 'qs'
import {isStringieThingie} from './validations'

/**
 * Stringifies an object of parms into a querystring, else returns an empty string.
 *
 * @func
 * @sig {k: v} -> String
 * @param {Object} params An object of params to stringify
 * @returns {String} Either a querystring or a blank string, prepended with a "?" character
 */
export const safeQs = pipe(
    unless(isEmpty, qs.stringify),
    when(isStringieThingie, concat('?')),
    when(equals({}), always(''))
)

/**
 * Converts Number to String and leaves values that are already String alone (rather than wrapping them in quotes). Other types are ignored and a blank String returned instead.
 *
 * @func
 * @sig (String|Number) -> String
 * @param {*} val A value to be converted to String
 * @returns {String} Either the original string or the stringified version of a numeric value (other data types are ignored)
 */
export const ensureString = ifElse(
    isStringieThingie,
    when(is(Number), toString),
    always('')
)

/**
 * Similar to [Ramda's applySpec()](http://ramdajs.com/docs/#applySpec), however
 * the spec will be applied and then merged into the original input.
 * Ramda's applySpec() will omit the original input, returning an object containing _only_
 * the props named in your spec, but this function here will apply the spec
 * and then merge back it into the original input.
 *
 * @func
 * @sig {k: v} -> ({k: v} -> {k: v})
 * @param {Object} spec An object whose values are functions which
 * expect the entire object to be fed in as input.
 * This is identical to the input you'd pass into applySpec()
 * @returns {Function} A function that is ready to receive an input object and
 * merge into it the result of applying the provied spec
 */
export const mergeSpec = spec => converge(merge, [identity, applySpec(spec)])

/**
 * Converts a Date into a human-readable form.
 *
 * @func
 * @sig (String|Date) -> String
 * @param {String|Date} str A Date or a stringified Date
 * @returns {String} A human readable date
 */
export const dateMe = str => (new Date(str)).toLocaleString('en-US')

/**
 * Creates a function that will append a provided value to a future value you
 * pass into the function.
 *
 * @func
 * @sig String -> ((String|Number) -> String)
 * @param {String} suffix A string to append to a future value
 * @returns {String} A function that will append the provided suffix to any
 * value passed in
 */
export const addSuffix = suffix => compose(concat(__, suffix), String)

/**
 * Creates a function that will append a provided value to a future value you
 * pass into the function.
 *
 * @func
 * @sig String -> ((String|Number) -> String)
 * @param {String} prefix A string to append to a future value
 * @returns {String} A function that will append the provided prefix to any
 * value passed in
 */
export const addPrefix = prefix => compose(concat(prefix), String)

/**
 * Converts a number to a currency value (string), formatted in U.S. Dollars
 *
 * @func
 * @sig Number -> String
 * @param {Number} amount A numeric value to be converted to USD
 * @returns {String} The original number, converted to a string formatted as
 * U.S. currency
 */
export const toUSD = unless(
    isNil,
    pipe(
        when(is(String), Number),
        invoker(2, 'toLocaleString')(
            'en-US', {
                style: 'currency',
                currency: 'USD'
            }
        )
    )
)

/**
 * Converts a number to a decimal string, with commas every three digits to the
 * left of the decimal.
 *
 * @func
 * @sig Number -> String
 * @param {Number} amount A numeric value to be converted to decimal string
 * @returns {String} The original number, converted to a string formatted as
 * a decimal string
 */
export const toDecimalString = unless(
    isNil,
    invoker(2, 'toLocaleString')(
        'en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )
)
/**
 * Converts a number to a string with commas every three digits to the
 * left of the (optional) decimal. Numbers ending in ".00" are truncated to be
 * an integer string (use toDecimalString() to avoid this behavior).
 *
 * @func
 * @sig Number -> String
 * @param {Number} amount A numeric value to be converted to numeric string
 * @returns {String} The original number, converted to a string formatted as
 * numeric wth commas
 */
export const toNumericString = compose(replace(/\.00$/, ''), toDecimalString)

/**
 * Converts a number (or numeric string) to a string with commas every three digits
 * and decimal endings of ".00" are shaved off.
 * It appends " in." to the end of the string.
 *
 * @func
 * @sig Number -> String
 * @param {Number} amount A numeric value to be converted to numeric string
 * @returns {String} The original number, converted to a string formatted as
 * numeric wth commas, ending in " in."
 */
export const inchMe = ifElse(
    isStringieThingie,
    pipe(Number, toNumericString, concat(__, 'in.')),
    defaultTo('')
)

/**
 * Converts a number (or numeric string) to a string with commas every three digits
 * and decimal endings of ".00" are shaved off.
 * It appends " lbs." to the end of the string.
 *
 * @func
 * @sig Number -> String
 * @param {Number} amount A numeric value to be converted to numeric string
 * @returns {String} The original number, converted to a string formatted as
 * numeric wth commas, ending in " lbs."
 */
export const poundMe = ifElse(
    isStringieThingie,
    pipe(Number, toNumericString, concat(__, 'lbs.')),
    defaultTo('')
)

/**
 * Capitalizes the first letter of any word in a given string.
 *
 * @func
 * @sig String -> String
 * @returns {String} The orignial string, but with each word capitalized on the
 * first letter
 */
export const capitalize = (str = '') => str.replace(/(?:^|\s)\S/g, toUpper)

/**
 * Converts a Boolean to a string value of "Yes" or "No"
 *
 * @func
 * @sig Number -> String
 * @param {Boolean} value A boolean value to be converted to a string of Yes or No
 * @returns {String} A string of Yes or No that corresponds to the Boolean value passed in
 */
export const yesOrNo = ifElse(equals(true), always('Yes'), always('No'))

/**
 * Converts an Array of type String or Number into a single String of capitalized words, separated by commas.
 *
 * @func
 * @sig [Number|String] -> String
 * @param {String[]|Number[]} values An array of String and/or Number values
 * @returns {String} A single string comma-separated (capitalized) values
 */
export const prettyJoin = compose(join(', '), map(capitalize))

/**
 * Removes underscores and capitalizes the words in a given string.
 *
 * @func
 * @sig String -> String
 * @returns {String} The orignial string, but with each word capitalized on the
 * first letter and removed of underscores
 */
export const unPythonMe = compose(capitalize, trim, replace(/_/g, ' '), defaultTo(''))

/**
 * Extracts the "id" prop and index from each object in a collection,
 * mapping those as key/value pairs into a single object (hashmap).
 * In the hashmap, "id" becomes the key and "name" becomes the corresponding value.
 * This object structure is much more efficient for quick lookup and filtering,
 * rather than always having to traverse an entire array of objects.
 *
 * @func
 * @sig [{k: v}] -> {k: v}
 * @param {Object[]} collection A collection of objects containing "id" and "name" props
 * @returns {Object} A hashmap where the keys are the unique ids and the values
 * are their corresponding indexes in the collection
 */
export const hashEm = compose(
    fromPairs,
    reject(compose(isNil, head)),
    addIndex(map)(unapply(identity)),
    pluck('id')
)

/**
 * Parses a generically named "id" route parameter.
 * Design for React Router, but could work in other routing solutions too,
 * as it's just a path parsing of 'match.params.id'
 *
 * @func
 * @sig {k: v} -> String|Number
 * @param {Object} props A React compoent's props object
 * @returns {String|Number} A unique id parsed from the routing parameters 
 */
export const getRoutedId = path(['match', 'params', 'id'])

/**
 * Parses a generically named "detail" object from a component's props
 *
 * @func
 * @sig {k: v} -> String|Number
 * @param {Object} props A React compoent's props object
 * @returns {String|Number} A unique id parsed from the prop's "detail" object
 */
export const getDetailId = either(getRoutedId, path(['detail', 'id']))

/**
 * Takes a dispatched Redux action (with an 'id' prop)
 * and retrieves the corresponding match from a collection of objects.
 *
 * @func
 * @sig {k: v} -> [{k: v}] -> {k: v}
 * @param {Object} action A dispatched Redux action that contains an 'id' prop
 * @param {Object[]} items A collection of objects which each have (at least) an 'id' prop
 * @returns {Object} A detail object that contains the id. If a match was found
 * in the collection, the rest of the props from that entry are included as well
 */
export const getDetail = ({id}) =>
    compose(
        defaultTo({id, isEmpty: true}),
        find(whereEq({id}))
    )

/**
 * Inspects a "details" object to see if it is empty, or if it contains a
 * `true` value for a boolean prop called "isEmpty".
 *
 * @func
 * @sig {k: v:} -> Boolean
 * @param {Object} details A details object
 * @returns {Boolean} whether or not the details object is empty
 * (or a flag of isEmpty, set to `true`)
 */
export const isEmptyDetails = either(isEmpty, propEq('isEmpty', true))
