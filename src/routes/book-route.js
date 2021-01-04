const express = require('express');
const bookRouter = express.Router();
const bookService = require('../services/goodreads.service');
const bookController = require('../controllers/book.controller')

function router(nav) {
    const {
        getIndex,
        getById,
        middleware
    } = bookController(bookService, nav);
    bookRouter.use(middleware);
    bookRouter.route('/')
        .get(getIndex);

    bookRouter.route('/:id')
        .get(getById);
    return bookRouter;
}


module.exports = router;