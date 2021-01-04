const express = require('express');
const {
    MongoClient
} = require('mongodb');
const adminRouter = express.Router();
const debug = require('debug')('app:admin-route')

function route(nav) {
    const books = [{
            title: 'War and Peace',
            genre: 'Historical Fiction',
            author: 'Lev Nikolayevich Tolstoy',
            bookId: 656,
            read: false
        },
        {
            title: 'Les Misérables',
            genre: 'Historical Fiction',
            author: 'Victor Hugo',
            bookId: 24280,
            read: false
        },
        {
            title: 'The Time Machine',
            genre: 'Science Fiction',
            author: 'H. G. Wells',
            read: false
        },
        {
            title: 'A Journey into the Center of the Earth',
            genre: 'Science Fiction',
            author: 'Jules Verne',
            read: false
        },
        {
            title: 'The Dark World',
            genre: 'Fantasy',
            author: 'Henry Kuttner',
            read: false
        },
        {
            title: 'The Wind in the Willows',
            genre: 'Fantasy',
            author: 'Kenneth Grahame',
            read: false
        },
        {
            title: 'Life On The Mississippi',
            genre: 'History',
            author: 'Mark Twain',
            read: false
        },
        {
            title: 'Childhood',
            genre: 'Biography',
            author: 'Lev Nikolayevich Tolstoy',
            read: false
        }
    ];


    adminRouter.route('/').get((req, res) => {
        mongoInsert(books).then(s => {
            res.json(s.ops);

        })
    })

    return adminRouter;
}

async function mongoInsert(coll) {
    const url = 'mongodb://127.0.0.1:27017';
    const dbName = 'LibraryAppDB'
    let client;
    try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);
        debug(' connected to the mongodb', db)
        const response = await db.collection('books').insertMany(coll);
        debug(' inserted response', response)

        return response;

    } catch (error) {
        debug('error', error)
    }
    client.close();

}

module.exports = route;