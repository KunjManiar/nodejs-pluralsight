const debug = require('debug')('app:book.controller')

const {
    MongoClient,
    ObjectID
} = require('mongodb');


function bookController(bookService, nav) {
    function getIndex(req, res) {

        getAllBooks().then(books => {
            res.render(
                'books', {
                    nav,
                    title: 'Library',
                    books
                }
            );
        }).catch((err) => {
            debug(err.stack);

        })


    }

    function getById(req, res) {
        const {
            id
        } = req.params;
        getBookById(id).then(book => {

            res.render(
                'book', {
                    nav,
                    title: 'Library',
                    book
                }
            );
        }).catch(err => debug(err))


    }

    function middleware(req, res, next) {
        //if (req.user) {
        next();
        //} else {
        // res.redirect('/');
        // }
    }
    return {
        getIndex,
        getById,
        middleware
    };

    async function getAllBooks() {
        const url = 'mongodb://127.0.0.1:27017';
        const dbName = 'LibraryAppDB'
        let client;
        try {
            client = await MongoClient.connect(url, {
                useNewUrlParser: true
            });
            const db = client.db(dbName);
            // debug(' connected to the mongodb', db)
            const coll = await db.collection('books');
            const result = await coll.find().toArray();
            // debug(' inserted response', result)

            return result;

        } catch (error) {
            debug('error', error)
        }
        client.close();

    }
    async function getBookById(id) {
        const url = 'mongodb://127.0.0.1:27017';
        const dbName = 'LibraryAppDB'
        let client;
        try {
            client = await MongoClient.connect(url, {
                useNewUrlParser: true
            });
            const db = client.db(dbName);
            // debug(' connected to the mongodb', db)
            const coll = await db.collection('books');
            const result = await coll.findOne({
                _id: new ObjectID(id)
            })
            debug(' findOne response', result)
            result.details = await bookService.getBookById(result.bookId);

            return result;

        } catch (error) {
            debug('error', error)
        }
        client.close();

    }
}
module.exports = bookController;