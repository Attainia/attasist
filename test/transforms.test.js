import test from 'tape'
import {always, equals, test as regTest} from 'ramda'
import {
    hashEm,
    dateMe,
    etc,
    undefineMe,
    filterByKeys,
    mergeObjectList,
    transformValuesByKeys,
    transformMatchingValues,
    transformByKeyValPredicates,
    toUSD,
    toHashmap
} from '../lib/transforms'

const developers = [
    {id: 1, name: 'Stephen Mercier', email: 'stephen.mercier@attainia.com'},
    {id: 2, name: 'Jonathan Mercier', email: 'jono.mercier@attainia.com'},
    {id: 3, name: 'Chuey Anima', email: 'chuey.anima@attainia.com'},
    {id: 4, name: 'Jason Rego', email: 'jason.rego@attainia.com'},
    {id: 5, name: 'Lori Ordonez', email: 'stephen.mercier@attainia.com'},
    {id: 6, name: 'Glenn Siegman', email: 'glenn.siegman@attainia.com'},
    {id: 7, name: 'Ana Tomboulian', email: 'ana.tomboulian@attainia.com'},
    {id: 8, name: 'Marcos Gonzales', email: 'marcos.gonzales@attainia.com'},
    {id: 9, name: 'Michael Tomcal', email: 'michael.tomcal@attainia.com'},
    {id: 10, name: 'Sean McHugh', email: 'sean.mchugh@attainia.com'},
    {id: 11, name: 'Tim Graf', email: 'tim.graf@attainia.com'},
    {id: 12, name: 'Lawrence Grant', email: 'lawrence.grant@attainia.com'},
    {id: 13, name: 'Usha Kundapur', email: 'usha.kundapur@attainia.com'}
]

const notDevelopers = [
    {id: 1, name: 'Mike Rosenfeld', email: 'mike.rosenfel@attainia.com'},
    {id: 2, name: 'Eric Rosenfeld', email: 'eric.rosenfel@attainia.com'},
    {id: 3, name: 'Kishan Shaw', email: 'kishan.shaw@attainia.com'},
    {id: 4, name: 'David Newton', email: 'david.newton@attainia.com'},
    {id: 5, name: 'Naomi Cash', email: 'naomi.cash@attainia.com'},
    {id: 6, name: 'Alex Maskovyak', email: 'alex.maskovyak@attainia.com'}
]

test('"mergeList" combines two lists and applies unique filtering AND removes blanks', (t) => {
    t.deepEqual(
        mergeObjectList('name', 'id')(developers, notDevelopers).length,
        13,
        'uniq by the id'
    )
    t.deepEqual(
        mergeObjectList('name', 'name')(developers, notDevelopers).length,
        19,
        'uniq by the name'
    )
    t.deepEqual(
        mergeObjectList('name', 'id')(developers, {id: 14, name: 'Some Random Dude'}).length,
        14,
        'uniq by the name'
    )
    t.deepEqual(
        mergeObjectList()(developers, notDevelopers).length,
        19,
        'no uniq prop or display prop specified'
    )
    t.deepEqual(
        mergeObjectList('name', 'id')(developers, null).length,
        13,
        'null values are ignored'
    )
    t.deepEqual(
        mergeObjectList('name', 'id')(developers, 'others').length,
        13,
        'string values are ignored'
    )
    t.end()
})
    
test('"undefineMe" changes null values to undefined', (t) => {
    t.equal(undefineMe(null), undefined, 'changes null to undefined')
    t.equal(undefineMe('Lorem'), 'Lorem', 'strings are left alone')
    t.equal(undefineMe(''), '', 'even empty strings')
    t.equal(undefineMe(101), 101, 'numbers are left alone')
    t.equal(undefineMe(0), 0, 'even falsy numbers are left alone')
    t.equal(undefineMe(true), true, 'booleans are left alone')
    t.equal(undefineMe(false), false, 'even falsy booleans')
    t.deepEqual(undefineMe({}), {}, 'objects are left alone')
    t.deepEqual(undefineMe([]), [], 'arrays are left alone')
    t.end()
})

test('pretty formatting of date includes time and shaves off unnecessary zero-padding', (t) => {
    t.equal(dateMe('01/01/2018'), '1/1/2018, 12:00:00 AM')
    t.end()
})

test('transform to U.S. dollars rounds properly at two decimal places', (t) => {
    t.equal(toUSD(20.18344), '$20.18', 'rounds down when less than five')
    t.equal(toUSD(20.18544), '$20.19', 'rounds up when greater (or equal) to five')
    t.equal(toUSD(20), '$20.00', 'zero are always included')
    t.end()
})

test('transform to U.S. dollars is always prefixed with the dollar-sign character', (t) => {
    t.equal(toUSD(0), '$0.00', 'no money')
    t.equal(toUSD(15333), '$15,333.00', 'includes comma-separation')
    t.equal(toUSD(20.18), '$20.18', 'includes values to the right of decimal')
    t.end()
})

test('A collection of objects is hash-mapped with a key of "id" and a value of index', (t) => {
    t.deepEqual(
        hashEm([{id: 'lorem'}, {id: 'ipsum'}, {id: 'dolor'}, {id: 'sit'}]),
        {lorem: 0, ipsum: 1, dolor: 2, sit: 3}
    )
    t.end()
})

test('A collection of objects is NOT hash-mapped if there is no "id" prop in the collection', (t) => {
    t.deepEqual(
        hashEm([{name: 'tacitus'}, {name: 'seneca'}, {name: 'virgil'}, {name: 'aurelius'}]),
        {},
        'when no ids are present, the hashmap will be empty'
    )
    t.deepEqual(
        hashEm([{id: 'lorem'}, {name: 'seneca'}, {id: 'dolor'}, {id: 'sit'}]),
        {lorem: 0, dolor: 2, sit: 3},
        'when some objects are missing an id, they are excluded from the hashmap'
    )
    t.end()
})

test('"toHashmap" A collection of objects is hash-mapped with a key of "id" and a value of the object', (t) => {
    t.deepEqual(
        toHashmap([{id: 'lorem'}, {id: 'ipsum'}, {id: 'dolor'}, {id: 'sit'}]),
        {lorem: {id: 'lorem'}, ipsum: {id: 'ipsum'}, dolor: {id: 'dolor'}, sit: {id: 'sit'}}
    )
    t.end()
})

test('"transformMatchingValues" transforms an object\'s values which match a predicate', (t) => {
    t.deepEqual(
        transformMatchingValues(equals(null), always({}))({lorem: null, ipsum: null, dolor: 'sit', amet: undefined}),
        {lorem: {}, ipsum: {}, dolor: 'sit', amet: undefined}
    )
    t.end()
})

test('"transformValuesByKeys" transforms an object\'s values whose keys match a predicate', (t) => {
    t.deepEqual(
        transformValuesByKeys(regTest(/m$/), always({}))({lorem: null, ipsum: null, dolor: 'sit', amet: undefined}),
        {lorem: {}, ipsum: {}, dolor: 'sit', amet: undefined}
    )
    t.end()
})

// eslint-disable-next-line max-len
test('"transformByKeyValPredicates" Applies a transform to an object whose keys passed a predicate and then the values pass another predicate', (t) => {
    t.deepEqual(
        transformByKeyValPredicates(
            regTest(/m$/),
            equals(null),
            always({})
        )({lorem: null, ipsum: 42, dolor: 'sit', amet: undefined}),
        {lorem: {}, ipsum: 42, dolor: 'sit', amet: undefined}
    )
    t.end()
})

test('"filterByKeys" filters out the key/value pairs from an object whose keys fail a given predicate', (t) => {
    t.deepEqual(
        filterByKeys(regTest(/m$/))({lorem: null, ipsum: 42, dolor: 'sit', amet: undefined}),
        {lorem: null, ipsum: 42}
    )
    t.end()
})

test('"etc" truncatest a long string of text at a specified index and appends ...', (t) => {
    t.equal(
        etc(26, 'Lorem ipsum dolor sit amet, consectetur elipsing elit'),
        'Lorem ipsum dolor sit amet...'
    )
    t.equal(
        etc(400)('Lorem ipsum dolor sit amet, consectetur elipsing elit'),
        'Lorem ipsum dolor sit amet, consectetur elipsing elit'
    )
    t.end()
})
