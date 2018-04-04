import test from 'tape'
import {
    __,
    toString,
    trim,
    when,
    toUpper,
    is,
    concat,
    compose,
    evolve,
    map,
    pick,
    join,
    toPairs,
    filter,
    pipe,
    prop,
    values,
    test as regTest
} from 'ramda'
import {hashEm, dateMe, toUSD, fuzzySpec, mergeSpec} from '../lib/transforms'

const specResult = {
    morrison: 'jim',
    hendrix: 'jimmi',
    carter: 'jimmy'
}

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

test('"mergeSpec" blends an object with a copy of itself transformed according to a spec', (t) => {
    t.deepEqual(
        mergeSpec({
            morrison: prop('morrison'),
            hendrix: pipe(prop('hendrix'), concat(__, 'mi')),
            carter: pipe(prop('carter'), concat(__, 'my'))
        }, {
            morrison: 'jim',
            hendrix: 'jim',
            carter: 'jim'
        }),
        specResult
    )
    t.end()
})

test('"mergeSpec" merges new props onto the original object', (t) => {
    t.deepEqual(mergeSpec({
      fullName: compose(join(' '), values, pick(['firstName', 'lastName'])),
      address: pipe(prop('address'), evolve({
        street: trim,
        city: compose(str => str.replace(/(?:^|\s)\S/g, toUpper), trim),
        state: toUpper,
        zip: compose(trim, when(is(Number), toString))
      }))
    }, {
      firstName: 'Montgomery',
      lastName: 'Burns',
      address: {
        street: '1000 Mammon Lane, ',
        city: 'springfield',
        state: 'or',
        zip: 97403
      }
    }), {
      firstName: 'Montgomery',
      lastName: 'Burns',
      address: {
        street: '1000 Mammon Lane,',
        city: 'Springfield',
        state: 'OR',
        zip: '97403'
      },
      fullName: 'Montgomery Burns'
    })
    t.end()
})

test('"fuzzySpec" blends an object with a copy of itself transformed according to a spec', (t) => {
    t.deepEqual(
        fuzzySpec({
            hendrix: concat(__, 'mi'),
            carter: concat(__, 'my'),
            dean: 'james',
            jims: compose(map(join(', ')), toPairs, filter(regTest(/^jim/)))
        }, {
            morrison: 'jim',
            hendrix: 'jim',
            carter: 'jim'
        }), {
            ...specResult,
            dean: 'james',
            jims: ['morrison, jim', 'hendrix, jimmi', 'carter, jimmy']
        }
    )
    t.end()
})
