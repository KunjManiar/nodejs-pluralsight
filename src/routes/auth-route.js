const express = require('express');
const {
    MongoClient
} = require('mongodb');
const debug = require('debug')('app:auth-route');
const authRoute = express.Router();
const passport = require('passport');

function route(nav) {
    debug('req.body')

    authRoute.route('/signUp').post((req, res) => {
        debug('req.body', req.body)
        const {
            username,
            password
        } = req.body;

        addUser({
            username,
            password
        }).then(s => {
            req.logIn(s, () => {
                res.redirect('/auth/profile')
            })
        }).catch(err => debug('error', err))

    })
    authRoute.route('/signin')
        .get((req, res) => {
            res.render('signin', {
                nav,
                title: 'Sign In'
            });
        })
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));
    authRoute.route('/profile')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            res.json(req.user);
        });
    return authRoute;
}

async function addUser(user) {
    const url = 'mongodb://127.0.0.1:27017';
    const dbName = 'LibraryAppDB'
    let client;
    try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);
        debug(' connected to the mongodb')
        const response = await db.collection('users').insertOne(user);
        debug(' inserted response', response.ops[0])

        return response.ops[0];

    } catch (error) {
        debug('error', error)
    }
    client.close();

}
module.exports = route;