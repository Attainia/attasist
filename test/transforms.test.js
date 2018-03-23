import test from 'tape'
import {hashEm, dateMe, toUSD} from '../lib/transforms'

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
