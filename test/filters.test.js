import test from 'tape'
import {filterEm} from '../lib/filters'

const filteredIds = {
    '6bc54010-7563-4c73-a97b-9c8f3f734aa4': 0,
    '6663978f-fe9f-4545-a385-1218cc56c80f': 1,
    'd6b47cae-5f55-4d58-85e9-3d666732cb7b': 4,
    'efbb00a3-5d67-41fd-84bd-3803a86f0dce': 5
}

const collection = [
    {id: '6bc54010-7563-4c73-a97b-9c8f3f734aa4', name: 'lorem'},
    {id: '6663978f-fe9f-4545-a385-1218cc56c80f', name: 'ipsum'},
    {id: 'f0a5a9eb-9cb0-4d0d-9902-3b013fa39017', name: 'dolor'},
    {id: '176bb63e-c03b-4094-9df8-0fa5f8f9357b', name: 'sit'},
    {id: 'd6b47cae-5f55-4d58-85e9-3d666732cb7b', name: 'amet'},
    {id: 'efbb00a3-5d67-41fd-84bd-3803a86f0dce', name: 'consectetur'}
]

const filteredCollection = collection.filter((v, i) => [0, 1, 4, 5].includes(i))

test('"filterEm" will filter a collection based on a hashmap of ids', (t) => {
    t.deepEqual(filterEm(collection, filteredIds), filteredCollection)
    t.end()
})
