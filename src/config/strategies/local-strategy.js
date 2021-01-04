const passport = require('passport');
const {
    Strategy
} = require('passport-local');

const debug = require('debug')('app:local-strategy');



module.exports = function localStrategy() {
    debug('localStrategy');

    passport.use(new Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        let user = {
            username,
            passport,
        };
        getUser(username).then(user => {
            if (user.password === password) {
                debug(user, 'localStrategy');

                done(null, user);
            } else {
                done(null, false);
            }
        }).catch(err => {
            debug(err)
        })

    }))
}

async function getUser(username) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    let client;

    try {
        client = await MongoClient.connect(url);

        debug('Connected correctly to server');

        const db = client.db(dbName);
        const col = db.collection('users');

        const user = await col.findOne({
            username
        });
        return user;


    } catch (err) {
        console.log(err.stack);
    }
    // Close connection
    client.close();
}